from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
import asyncpg
import uuid
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/workspaces/{workspace_id}/projects")
async def get_workspace_projects(
    workspace_id: str, 
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    rows = await db.fetch(
        "SELECT id, name, status, progress, deadline, risk, description FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC",
        workspace_id
    )
    if not rows:
        return [
            { "id": "1", "name": "StadiumIQ Local Database Sync", "status": "Active", "progress": 82, "deadline": "Aug 15, 2026", "risk": "Low", "desc": "Implementing local SQLite replica sync engine." },
            { "id": "2", "name": "DiscoveryOS Theme Engine Refactor", "status": "Active", "progress": 45, "deadline": "Sep 02, 2026", "risk": "Low", "desc": "Supporting dynamic dark mode system layouts." }
        ]
    return [
        {
            "id": str(row["id"]),
            "name": row["name"],
            "status": row["status"],
            "progress": row["progress"],
            "deadline": row["deadline"],
            "risk": row["risk"],
            "desc": row["description"]
        }
        for row in rows
    ]

@router.get("/workspaces/{workspace_id}/roadmap")
async def get_workspace_roadmap(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    rows = await db.fetch(
        "SELECT id, phase, quarter, title, priority, effort, impact, dependencies, description, owner, risk FROM roadmap_items WHERE workspace_id = $1 ORDER BY created_at DESC",
        workspace_id
    )
    if not rows:
        return [
            {
                "phase": "Now",
                "quarter": "Q3 2026",
                "items": [
                    { "title": "Local SQLite Delta Database & Sync Engine", "priority": "Critical", "effort": "Medium", "impact": "Extreme", "dependencies": "None", "desc": "Offline storage client.", "owner": "Core Tech Team", "risk": "Low" }
                ]
            }
        ]
        
    # Group items by phase
    phases: Dict[str, List[Dict[str, Any]]] = {}
    for row in rows:
        ph = row["phase"]
        if ph not in phases:
            phases[ph] = []
        phases[ph].append({
            "title": row["title"],
            "priority": row["priority"],
            "effort": row["effort"],
            "impact": row["impact"],
            "dependencies": row["dependencies"],
            "desc": row["description"],
            "owner": row["owner"],
            "risk": row["risk"]
        })
        
    return [
        {
            "phase": key,
            "items": val
        }
        for key, val in phases.items()
    ]

@router.get("/workspaces/{workspace_id}/data-sources")
async def get_workspace_data_sources(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    rows = await db.fetch(
        "SELECT id, source_key, name, category, status, volume, health, last_sync, description FROM data_sources WHERE workspace_id = $1 ORDER BY created_at DESC",
        workspace_id
    )
    if not rows:
        return [
            { "id": "drive", "name": "Google Drive", "category": "Document Cloud", "status": "Connected", "volume": "14.2 MB", "health": "99.8%", "lastSync": "10 mins ago", "desc": "Syncs team folders." }
        ]
    return [
        {
            "id": row["source_key"],
            "name": row["name"],
            "category": row["category"],
            "status": row["status"],
            "volume": row["volume"],
            "health": row["health"],
            "lastSync": row["last_sync"],
            "desc": row["description"]
        }
        for row in rows
    ]


class WorkspaceCreate(BaseModel):
    name: str
    slug: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    slug: str
    created_at: str

class SettingsResponse(BaseModel):
    key: str
    value: str

class SettingsUpdate(BaseModel):
    settings: Dict[str, str]

@router.get("/workspaces", response_model=List[WorkspaceResponse])
async def list_workspaces(
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    rows = await db.fetch(
        """
        SELECT DISTINCT w.id, w.name, w.slug, w.created_at
        FROM workspaces w
        JOIN users u ON u.workspace_id = w.id
        WHERE u.id = $1
        ORDER BY w.created_at DESC
        """,
        current_user['sub']
    )
    
    return [
        WorkspaceResponse(
            id=str(row["id"]),
            name=row["name"],
            slug=row["slug"],
            created_at=row["created_at"].isoformat()
        )
        for row in rows
    ]

@router.get("/workspaces/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    row = await db.fetchrow(
        "SELECT id, name, slug, created_at FROM workspaces WHERE id = $1",
        workspace_id
    )
    
    if not row:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    return WorkspaceResponse(
        id=str(row["id"]),
        name=row["name"],
        slug=row["slug"],
        created_at=row["created_at"].isoformat()
    )

@router.post("/workspaces", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    payload: WorkspaceCreate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    workspace_id = str(uuid.uuid4())
    slug = payload.slug or payload.name.lower().replace(" ", "-")
    
    try:
        row = await db.fetchrow(
            "INSERT INTO workspaces (id, name, slug, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, slug, created_at",
            workspace_id, payload.name, slug
        )
        
        # Associate user with workspace
        await db.execute(
            "INSERT INTO users (id, email, role, workspace_id, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING",
            current_user['sub'], current_user.get('email', 'user@example.com'), 'admin', workspace_id
        )
        
        return WorkspaceResponse(
            id=str(row["id"]),
            name=row["name"],
            slug=row["slug"],
            created_at=row["created_at"].isoformat()
        )
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Workspace slug already exists")

@router.get("/workspaces/{workspace_id}/settings", response_model=List[SettingsResponse])
async def get_workspace_settings(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    rows = await db.fetch(
        "SELECT key, value FROM settings WHERE workspace_id = $1",
        workspace_id
    )
    
    return [
        SettingsResponse(key=row["key"], value=row["value"])
        for row in rows
    ]

@router.put("/workspaces/{workspace_id}/settings")
async def update_workspace_settings(
    workspace_id: str,
    payload: SettingsUpdate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    for key, value in payload.settings.items():
        await db.execute(
            "INSERT INTO settings (workspace_id, key, value) VALUES ($1, $2, $3) ON CONFLICT (workspace_id, key) DO UPDATE SET value = $3",
            workspace_id, key, value
        )
    
    return {"status": "updated", "workspace_id": workspace_id}

