from typing import List, Dict, Any
from fastapi import APIRouter, Depends
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
from app.models.schemas import SearchQuery, SearchResult
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.post("/workspaces/{workspace_id}/search", response_model=List[SearchResult])
async def search_workspace_content(
    workspace_id: str,
    payload: SearchQuery,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    """Search for content across workspace files using POST with query body."""
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    logger.info(
        "Executing search query",
        workspace_id=workspace_id,
        query=payload.query,
        limit=payload.limit,
        offset=payload.offset
    )
    
    # Keyword search with ILIKE
    rows = await db.fetch(
        """
        SELECT fc.id, fc.content, fc.metadata, f.name as filename
        FROM file_chunks fc
        JOIN files f ON fc.file_id = f.id
        WHERE f.workspace_id = $1 AND fc.content ILIKE $2
        ORDER BY fc.created_at DESC
        LIMIT $3 OFFSET $4
        """,
        workspace_id, f"%{payload.query}%", payload.limit, payload.offset
    )
    
    return [
        SearchResult(
            id=str(row["id"]),
            content=row["content"][:500],  # Truncate for summary
            metadata=row["metadata"],
            filename=row["filename"]
        )
        for row in rows
    ]


@router.post("/workspaces/{workspace_id}/search/documents", response_model=List[SearchResult])
async def search_documents_advanced(
    workspace_id: str,
    payload: SearchQuery,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    """Advanced document search with filters and sorting."""
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    logger.info("Executing advanced document search", workspace_id=workspace_id, query=payload.query)
    
    # Build dynamic query with filters
    where_clauses = ["f.workspace_id = $1", "fc.content ILIKE $2"]
    params = [workspace_id, f"%{payload.query}%"]
    
    if payload.filters:
        if "file_type" in payload.filters:
            where_clauses.append(f"f.type = ${len(params) + 1}")
            params.append(payload.filters["file_type"])
        
        if "created_after" in payload.filters:
            where_clauses.append(f"f.created_at >= ${len(params) + 1}")
            params.append(payload.filters["created_after"])
    
    where_sql = " AND ".join(where_clauses)
    sort_col = (payload.sort_by or "fc.created_at DESC").strip().lower()
    allowed_sorts = {
        "fc.created_at desc", "fc.created_at asc",
        "f.name desc", "f.name asc",
        "f.type desc", "f.type asc",
    }
    sort_by = sort_col if sort_col in allowed_sorts else "fc.created_at DESC"
    
    rows = await db.fetch(
        f"""
        SELECT fc.id, fc.content, fc.metadata, f.name as filename, f.type
        FROM file_chunks fc
        JOIN files f ON fc.file_id = f.id
        WHERE {where_sql}
        ORDER BY {sort_by}
        LIMIT ${len(params) + 1} OFFSET ${len(params) + 2}
        """,
        *params, payload.limit, payload.offset
    )
    
    return [
        SearchResult(
            id=str(row["id"]),
            content=row["content"][:500],
            metadata=row["metadata"],
            filename=row["filename"]
        )
        for row in rows
    ]

