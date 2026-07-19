from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
from app.models.schemas import FileItemResponse
from app.utils.parser import extract_file_content, chunk_text
from app.utils.s3_storage import upload_file_to_s3
import structlog

logger = structlog.get_logger()
router = APIRouter()

# Max file sizes in bytes
MAX_MEDIA_SIZE = 100 * 1024 * 1024
MAX_DOC_SIZE = 15 * 1024 * 1024
MAX_SHEET_SIZE = 10 * 1024 * 1024

async def process_file_parsing(file_id: str, content: bytes, filename: str, db_pool: asyncpg.Pool):
    try:
        parsed_text = extract_file_content(content, filename)
        chunks = chunk_text(parsed_text)
        
        async with db_pool.acquire() as conn:
            async with conn.transaction():
                # Write file chunks to db
                for i, chunk in enumerate(chunks):
                    await conn.execute(
                        """
                        INSERT INTO file_chunks (file_id, content, metadata)
                        VALUES ($1, $2, $3)
                        """,
                        file_id, chunk, {"sequence": i, "filename": filename}
                    )
                # Update status
                await conn.execute(
                    "UPDATE files SET status = 'completed' WHERE id = $1",
                    file_id
                )
        logger.info("Successfully parsed and chunked file", file_id=file_id, chunks_count=len(chunks))
    except Exception as e:
        logger.error("Failed to parse document background task", file_id=file_id, error=str(e))
        try:
            async with db_pool.acquire() as conn:
                await conn.execute(
                    "UPDATE files SET status = 'index_failed' WHERE id = $1",
                    file_id
                )
        except Exception:
            pass

@router.post("/workspaces/{workspace_id}/files/upload", response_model=FileItemResponse)
async def upload_file(
    workspace_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    filename = file.filename or "unnamed_file"
    ext = filename.split(".")[-1].lower()
    
    # Read file content safely
    content = await file.read()
    file_size = len(content)
    
    # Validation constraints
    if ext in ["mp3", "mp4"] and file_size > MAX_MEDIA_SIZE:
        raise HTTPException(status_code=400, detail="Media file exceeds maximum size allowed (100MB)")
    elif ext in ["pdf", "docx", "txt"] and file_size > MAX_DOC_SIZE:
        raise HTTPException(status_code=400, detail="Text document exceeds maximum size allowed (15MB)")
    elif ext in ["csv", "xlsx", "xls"] and file_size > MAX_SHEET_SIZE:
        raise HTTPException(status_code=400, detail="Structured data spreadsheet exceeds size limit (10MB)")
        
    # Standard format size label
    size_str = (
        f"{file_size / (1024 * 1024):.1f} MB" if file_size >= 1024 * 1024
        else f"{file_size / 1024:.0f} KB"
    )

    try:
        # Determine storage path: S3 or local
        from app.main import s3_client
        if s3_client:
            try:
                storage_path = await upload_file_to_s3(content, workspace_id, filename, s3_client)
                logger.info("File stored in S3", workspace_id=workspace_id, filename=filename)
            except Exception as e:
                logger.warning("S3 upload failed, falling back to local storage", error=str(e))
                storage_path = f"workspace/{workspace_id}/{filename}"
        else:
            storage_path = f"workspace/{workspace_id}/{filename}"
        
        # DB Record Ingestion
        row = await db.fetchrow(
            """
            INSERT INTO files (workspace_id, name, size, type, raw_size, storage_path, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, size, type, status, created_at
            """,
            workspace_id, filename, size_str, ext, file_size, storage_path, "uploaded"
        )
        
        # Pull DB Pool dependency for background context executor
        from app.database import db_manager
        if db_manager.pool:
            background_tasks.add_task(
                process_file_parsing,
                str(row["id"]), content, filename, db_manager.pool
            )
            
        return FileItemResponse(
            id=str(row["id"]),
            name=row["name"],
            size=row["size"],
            type=row["type"],
            timestamp="Just now",
            rawSize=file_size
        )
    except Exception as e:
        logger.error("Error creating files record entry", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register uploaded file catalog metadata"
        )

@router.get("/workspaces/{workspace_id}/files", response_model=List[FileItemResponse])
async def list_files(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    rows = await db.fetch(
        "SELECT id, name, size, type, status, created_at, raw_size FROM files WHERE workspace_id = $1 ORDER BY created_at DESC",
        workspace_id
    )
    return [
        FileItemResponse(
            id=str(row["id"]),
            name=row["name"],
            size=row["size"],
            type=row["type"],
            timestamp="Just now",
            rawSize=row["raw_size"]
        )
        for row in rows
    ]


@router.get("/workspaces/{workspace_id}/files/{file_id}", response_model=FileItemResponse)
async def get_file_by_id(
    workspace_id: str,
    file_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    row = await db.fetchrow(
        "SELECT id, name, size, type, status, created_at, raw_size FROM files WHERE id = $1 AND workspace_id = $2",
        file_id, workspace_id
    )
    
    if not row:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileItemResponse(
        id=str(row["id"]),
        name=row["name"],
        size=row["size"],
        type=row["type"],
        timestamp=row["created_at"].isoformat() if row["created_at"] else "Unknown",
        rawSize=row["raw_size"]
    )


@router.delete("/workspaces/{workspace_id}/files/{file_id}")
async def delete_file(
    workspace_id: str,
    file_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # Get file record
    file_record = await db.fetchrow(
        "SELECT storage_path FROM files WHERE id = $1 AND workspace_id = $2",
        file_id, workspace_id
    )
    
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete from S3 if path exists
    if file_record["storage_path"]:
        try:
            from app.utils.s3_storage import delete_file_from_s3
            from app.config import settings
            import boto3
            if settings.AWS_S3_BUCKET:
                s3 = boto3.client('s3')
                await delete_file_from_s3(file_record["storage_path"], s3)
        except Exception as e:
            logger.warning("Failed to delete file from S3", error=str(e))
    
    # Delete file chunks
    await db.execute("DELETE FROM file_chunks WHERE file_id = $1", file_id)
    
    # Delete file record
    await db.execute("DELETE FROM files WHERE id = $1", file_id)
    
    logger.info("File deleted", file_id=file_id)
    return {"status": "deleted", "id": file_id}

