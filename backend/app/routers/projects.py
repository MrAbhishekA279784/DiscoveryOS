from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
import structlog
import uuid

logger = structlog.get_logger()
router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    status: str = "Active"
    progress: int = 0
    deadline: str = ""
    risk: str = "Low"
    description: str = ""


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    deadline: Optional[str] = None
    risk: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    status: str
    progress: int
    deadline: str
    risk: str
    description: str


@router.get("/workspaces/{workspace_id}/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    workspace_id: str,
    project_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    row = await db.fetchrow(
        "SELECT id, name, status, progress, deadline, risk, description FROM projects WHERE id = $1 AND workspace_id = $2",
        project_id, workspace_id
    )
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=str(row["id"]),
        name=row["name"],
        status=row["status"],
        progress=row["progress"],
        deadline=row["deadline"],
        risk=row["risk"],
        description=row["description"]
    )


@router.post("/workspaces/{workspace_id}/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    workspace_id: str,
    payload: ProjectCreate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    project_id = str(uuid.uuid4())
    
    try:
        row = await db.fetchrow(
            """
            INSERT INTO projects (id, workspace_id, name, status, progress, deadline, risk, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING id, name, status, progress, deadline, risk, description
            """,
            project_id, workspace_id, payload.name, payload.status, payload.progress, payload.deadline, payload.risk, payload.description
        )
        
        return ProjectResponse(
            id=str(row["id"]),
            name=row["name"],
            status=row["status"],
            progress=row["progress"],
            deadline=row["deadline"],
            risk=row["risk"],
            description=row["description"]
        )
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Project with this name already exists in workspace")


@router.put("/workspaces/{workspace_id}/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    workspace_id: str,
    project_id: str,
    payload: ProjectUpdate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # Check project exists
    existing = await db.fetchrow(
        "SELECT id FROM projects WHERE id = $1 AND workspace_id = $2",
        project_id, workspace_id
    )
    
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Build update query dynamically
    updates = []
    params = []
    param_index = 1
    
    if payload.name is not None:
        updates.append(f"name = ${param_index}")
        params.append(payload.name)
        param_index += 1
    
    if payload.status is not None:
        updates.append(f"status = ${param_index}")
        params.append(payload.status)
        param_index += 1
    
    if payload.progress is not None:
        updates.append(f"progress = ${param_index}")
        params.append(payload.progress)
        param_index += 1
    
    if payload.deadline is not None:
        updates.append(f"deadline = ${param_index}")
        params.append(payload.deadline)
        param_index += 1
    
    if payload.risk is not None:
        updates.append(f"risk = ${param_index}")
        params.append(payload.risk)
        param_index += 1
    
    if payload.description is not None:
        updates.append(f"description = ${param_index}")
        params.append(payload.description)
        param_index += 1
    
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates.append(f"updated_at = NOW()")
    params.extend([project_id, workspace_id])
    
    update_sql = ", ".join(updates)
    
    row = await db.fetchrow(
        f"""
        UPDATE projects
        SET {update_sql}
        WHERE id = ${param_index} AND workspace_id = ${param_index + 1}
        RETURNING id, name, status, progress, deadline, risk, description
        """,
        *params
    )
    
    return ProjectResponse(
        id=str(row["id"]),
        name=row["name"],
        status=row["status"],
        progress=row["progress"],
        deadline=row["deadline"],
        risk=row["risk"],
        description=row["description"]
    )
