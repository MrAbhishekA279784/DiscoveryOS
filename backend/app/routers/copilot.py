import hashlib
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
from app.models.schemas import ChatMessageRequest, ChatMessageResponse
from app.utils.gemini import compile_copilot_prompt, generate_gemini_stream
import structlog
from datetime import datetime
import json
from typing import List

logger = structlog.get_logger()
router = APIRouter()

def get_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

@router.post("/workspaces/{workspace_id}/copilot/chat")
async def copilot_chat_stream(
    workspace_id: str,
    payload: ChatMessageRequest,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    query = payload.text
    logger.info("Encountered copilot query", workspace_id=workspace_id, query=query)
    
    # Retrieve relevant file chunks matching the query
    rows = await db.fetch(
        """
        SELECT fc.content, f.name as filename
        FROM file_chunks fc
        JOIN files f ON fc.file_id = f.id
        WHERE f.workspace_id = $1 AND fc.content ILIKE $2
        ORDER BY fc.created_at DESC
        LIMIT 5
        """,
        workspace_id, f"%{query}%"
    )
    
    context_chunks = [
        {"content": row["content"], "filename": row["filename"]}
        for row in rows
    ]
    
    prompt = compile_copilot_prompt(query, context_chunks)
    prompt_hash = get_hash(prompt)
    
    # Check cache table
    cached = await db.fetchrow(
        "SELECT response FROM ai_cache WHERE prompt_hash = $1",
        prompt_hash
    )
    
    if cached:
        logger.info("Serving response from cache database")
        async def cached_streamer():
            yield cached["response"]
        return StreamingResponse(cached_streamer(), media_type="text/event-stream")
        
    async def sse_event_streamer():
        full_text = []
        try:
            async for chunk in generate_gemini_stream(prompt):
                full_text.append(chunk)
                yield chunk
                
            # Write generated response to database cache
            full_response = "".join(full_text)
            if full_response:
                # Direct SQL pool acquisition for independent cache write transaction
                from app.database import db_manager
                if db_manager.pool:
                    async with db_manager.pool.acquire() as conn:
                        await conn.execute(
                            """
                            INSERT INTO ai_cache (prompt_hash, response)
                            VALUES ($1, $2)
                            ON CONFLICT (prompt_hash) DO NOTHING
                            """,
                            prompt_hash, full_response
                        )
        except Exception as e:
            logger.error("Error yielding streaming response chunks", error=str(e))
            yield "\n[Stream Interrupted]"

    return StreamingResponse(sse_event_streamer(), media_type="text/event-stream")


@router.get("/workspaces/{workspace_id}/copilot/chat/stream")
async def stream_copilot_messages(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # Retrieve most recent message from this session
    latest_message = await db.fetchrow(
        """
        SELECT text FROM chat_messages
        WHERE session_id IN (
            SELECT id FROM chat_sessions
            WHERE workspace_id = $1 AND user_id = $2
        )
        ORDER BY created_at DESC LIMIT 1
        """,
        workspace_id, current_user['sub']
    )
    
    if not latest_message:
        async def empty_stream():
            yield "data: {\"error\": \"No messages to stream\"}\n\n"
        return StreamingResponse(empty_stream(), media_type="text/event-stream")
    
    async def event_stream():
        query = latest_message["text"]
        
        # Get context relevant to the query
        context_rows = await db.fetch(
            """
            SELECT fc.content, f.name
            FROM file_chunks fc
            JOIN files f ON fc.file_id = f.id
            WHERE f.workspace_id = $1 AND fc.content ILIKE $2
            LIMIT 5
            """,
            workspace_id, f"%{query}%"
        )
        
        context = [{"content": r["content"], "filename": r["name"]} for r in context_rows]
        prompt = compile_copilot_prompt(query, context)
        
        # Stream from Gemini
        try:
            full_response = []
            async for chunk in generate_gemini_stream(prompt):
                full_response.append(chunk)
                yield f"data: {json.dumps({'text': chunk})}\n\n"
            
            # Cache response
            full_text = "".join(full_response)
            prompt_hash = get_hash(prompt)
            from app.database import db_manager
            if db_manager.pool:
                async with db_manager.pool.acquire() as conn:
                    await conn.execute(
                        "INSERT INTO ai_cache (prompt_hash, response) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                        prompt_hash, full_text
                    )
        except Exception as e:
            logger.error("Stream error", error=str(e))
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/workspaces/{workspace_id}/copilot/history", response_model=List[ChatMessageResponse])
async def get_copilot_history(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    rows = await db.fetch(
        """
        SELECT cm.id, cm.sender, cm.text, cm.created_at, cm.confidence_score
        FROM chat_messages cm
        JOIN chat_sessions cs ON cm.session_id = cs.id
        WHERE cs.workspace_id = $1 AND cs.user_id = $2
        ORDER BY cm.created_at DESC
        LIMIT 50
        """,
        workspace_id, current_user['sub']
    )
    
    return [
        ChatMessageResponse(
            id=str(row["id"]),
            sender=row["sender"],
            text=row["text"],
            timestamp=row["created_at"].isoformat(),
            confidenceScore=float(row["confidence_score"]) if row["confidence_score"] else None
        )
        for row in rows
    ]

