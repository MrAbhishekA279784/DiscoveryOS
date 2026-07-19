from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
import asyncpg
from app.database import get_db
from app.auth import get_current_user, check_workspace_access
from app.utils.report_generator import ReportGenerator
import structlog
import uuid
from datetime import datetime
import os

logger = structlog.get_logger()
router = APIRouter()


class ReportCreate(BaseModel):
    title: str
    format: str  # "pdf", "pptx", "csv"


class ReportResponse(BaseModel):
    id: str
    title: str
    author: str
    format: str
    size: str
    created_at: str


@router.post("/workspaces/{workspace_id}/reports/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    workspace_id: str,
    payload: ReportCreate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    if payload.format not in ["pdf", "pptx", "csv"]:
        raise HTTPException(status_code=400, detail="Invalid format. Must be pdf, pptx, or csv")
    
    report_id = str(uuid.uuid4())
    
    # Fetch KPIs and pain points for report
    kpis = await db.fetch(
        """
        SELECT DISTINCT ON (type) type, value, change, is_positive, sparkline_data
        FROM kpi_snapshots
        WHERE workspace_id = $1
        ORDER BY type, recorded_at DESC
        """,
        workspace_id
    )
    
    pain_points = await db.fetch(
        "SELECT id, name, count, percentage FROM pain_points WHERE workspace_id = $1 ORDER BY count DESC LIMIT 10",
        workspace_id
    )
    
    recommendations = await db.fetch(
        "SELECT id, title, freq_impact, confidence, icon_name FROM recommendations WHERE workspace_id = $1 ORDER BY confidence DESC",
        workspace_id
    )
    
    # Generate PDF if format is pdf
    size_kb = 0
    if payload.format == "pdf":
        try:
            generator = ReportGenerator()
            
            # Convert DB rows to dicts for report generator
            kpi_dicts = [dict(row) for row in kpis]
            pain_point_dicts = [dict(row) for row in pain_points]
            recommendation_dicts = [dict(row) for row in recommendations]
            
            pdf_buffer = generator.generate_pdf(
                title=payload.title,
                kpis=kpi_dicts,
                pain_points=pain_point_dicts,
                recommendations=recommendation_dicts,
                metadata={"workspace_id": workspace_id}
            )
            
            size_kb = len(pdf_buffer.getvalue()) // 1024
            logger.info("PDF generated", size_kb=size_kb)
        except Exception as e:
            logger.error("PDF generation failed", error=str(e))
            size_kb = 0
    
    # Create report record in database
    row = await db.fetchrow(
        """
        INSERT INTO reports (id, workspace_id, title, author, format, size, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, title, author, format, size, created_at
        """,
        report_id, workspace_id, payload.title, current_user.get('email', 'DiscoveryOS AI'), payload.format, f"{size_kb} KB"
    )
    
    logger.info("Report generated", report_id=report_id, format=payload.format)
    
    return ReportResponse(
        id=str(row["id"]),
        title=row["title"],
        author=row["author"],
        format=row["format"],
        size=row["size"],
        created_at=row["created_at"].isoformat()
    )


@router.get("/workspaces/{workspace_id}/reports", response_model=List[ReportResponse])
async def list_reports(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    rows = await db.fetch(
        "SELECT id, title, author, format, size, created_at FROM reports WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 50",
        workspace_id
    )
    
    return [
        ReportResponse(
            id=str(row["id"]),
            title=row["title"],
            author=row["author"],
            format=row["format"],
            size=row["size"],
            created_at=row["created_at"].isoformat()
        )
        for row in rows
    ]


@router.get("/workspaces/{workspace_id}/reports/{report_id}/download")
async def download_report(
    workspace_id: str,
    report_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    report = await db.fetchrow(
        "SELECT id, title, format FROM reports WHERE id = $1 AND workspace_id = $2",
        report_id, workspace_id
    )
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # In production, retrieve from S3 and stream
    # For MVP, return placeholder
    logger.info("Report download", report_id=report_id)
    return {"message": "Report ready for download", "title": report["title"], "format": report["format"]}
