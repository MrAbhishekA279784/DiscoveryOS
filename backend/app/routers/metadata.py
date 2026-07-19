from fastapi import APIRouter, Depends
from typing import List, Optional
from datetime import datetime, timezone
import structlog

from app.auth import get_current_user

logger = structlog.get_logger()
router = APIRouter()

@router.get("/workspaces/{workspace_id}/notifications")
async def get_notifications(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, type, title, description, timestamp, is_read FROM notifications WHERE workspace_id = $1 ORDER BY timestamp DESC LIMIT 10",
            workspace_id
        )
        return [
            {
                "id": str(r["id"]),
                "type": r["type"],
                "title": r["title"],
                "description": r["description"],
                "timestamp": r["timestamp"].isoformat() if r["timestamp"] else "",
                "isRead": r["is_read"],
            }
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)


@router.get("/workspaces/{workspace_id}/activity")
async def get_activity(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, user_email, action, project_name, created_at FROM activity_logs WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 10",
            workspace_id
        )
        return [
            {
                "id": str(r["id"]),
                "user": r["user_email"],
                "action": r["action"],
                "project": r["project_name"],
                "timestamp": r["created_at"].isoformat() if r["created_at"] else "",
            }
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)


@router.get("/workspaces/{workspace_id}/context-memories")
async def get_context_memories(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, key, value FROM context_memories WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 20",
            workspace_id
        )
        return [
            {"id": str(r["id"]), "key": r["key"], "value": r["value"]}
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)


@router.get("/workspaces/{workspace_id}/prompt-templates")
async def get_prompt_templates(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, title, prompt, category, icon FROM prompt_templates WHERE workspace_id = $1 ORDER BY sort_order ASC",
            workspace_id
        )
        return [
            {
                "id": str(r["id"]),
                "title": r["title"],
                "prompt": r["prompt"],
                "category": r["category"],
                "icon": r["icon"],
            }
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)


@router.get("/workspaces/{workspace_id}/file-connectors")
async def get_file_connectors(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, name, type, volume, count, status FROM file_connectors WHERE workspace_id = $1 ORDER BY created_at DESC",
            workspace_id
        )
        return [
            {
                "id": str(r["id"]),
                "name": r["name"],
                "type": r["type"],
                "volume": r["volume"],
                "count": r["count"],
                "status": r["status"],
            }
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)


@router.get("/workspaces/{workspace_id}/metadata/export-cards")
async def get_export_cards(workspace_id: str, user: dict = Depends(get_current_user)):
    from app.database import db_manager
    conn = await db_manager.get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, title, description, format, size, icon FROM export_cards WHERE workspace_id = $1 ORDER BY sort_order ASC",
            workspace_id
        )
        return [
            {
                "id": str(r["id"]),
                "title": r["title"],
                "description": r["description"],
                "format": r["format"],
                "size": r["size"],
                "icon": r["icon"],
            }
            for r in rows
        ] if rows else []
    finally:
        await db_manager.release(conn)
