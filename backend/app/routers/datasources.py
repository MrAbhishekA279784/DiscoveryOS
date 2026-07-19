from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
import structlog
import uuid
from datetime import datetime

logger = structlog.get_logger()
router = APIRouter()


class DataSourceResponse(BaseModel):
    id: str
    name: str
    category: str
    status: str
    volume: str
    health: str
    lastSync: str
    description: str


class DataSourceConnect(BaseModel):
    source_key: str  # "drive", "notion", "jira", etc.
    credentials: Dict[str, Any] = {}


@router.get("/workspaces/{workspace_id}/datasources/{datasource_id}", response_model=DataSourceResponse)
async def get_datasource(
    workspace_id: str,
    datasource_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    row = await db.fetchrow(
        "SELECT source_key, name, category, status, volume, health, last_sync, description FROM data_sources WHERE id = $1 AND workspace_id = $2",
        datasource_id, workspace_id
    )
    
    if not row:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    return DataSourceResponse(
        id=datasource_id,
        name=row["name"],
        category=row["category"],
        status=row["status"],
        volume=row["volume"],
        health=row["health"],
        lastSync=row["last_sync"],
        description=row["description"]
    )


@router.post("/workspaces/{workspace_id}/datasources/{datasource_id}/sync")
async def sync_datasource(
    workspace_id: str,
    datasource_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # Get datasource
    source = await db.fetchrow(
        "SELECT source_key FROM data_sources WHERE id = $1 AND workspace_id = $2",
        datasource_id, workspace_id
    )
    
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    # In production, call connector for source_key (Google Drive, Notion, etc.)
    # For MVP, just update last_sync timestamp
    await db.execute(
        "UPDATE data_sources SET last_sync = $1 WHERE id = $2",
        datetime.utcnow().isoformat(), datasource_id
    )
    
    logger.info("Datasource synced", datasource_id=datasource_id)
    
    return {"status": "syncing", "source": source["source_key"]}


@router.post("/workspaces/{workspace_id}/datasources/connect")
async def connect_datasource(
    workspace_id: str,
    payload: DataSourceConnect,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # Validate source_key
    valid_sources = ["drive", "notion", "jira", "slack", "linear", "api"]
    if payload.source_key not in valid_sources:
        raise HTTPException(status_code=400, detail="Invalid data source type")
    
    # In production, perform OAuth or credential validation
    # For MVP, create record
    source_id = str(uuid.uuid4())
    
    try:
        await db.execute(
            """
            INSERT INTO data_sources (id, workspace_id, source_key, name, category, status, volume, health, last_sync, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            """,
            source_id, workspace_id, payload.source_key, payload.source_key.title(), "Integration", "Connected", "0 B", "100%", "Just now", f"Connected via {payload.source_key}"
        )
        
        logger.info("Datasource connected", source_key=payload.source_key)
        
        return {"status": "connected", "id": source_id, "source": payload.source_key}
    except Exception as e:
        logger.error("Failed to connect datasource", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to connect datasource")
