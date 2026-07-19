import time
from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
from app.database import get_db
from app.models.schemas import HealthResponse
from app.config import settings
import structlog

logger = structlog.get_logger()
router = APIRouter()
START_TIME = time.time()

@router.get("/health", response_model=HealthResponse)
async def health_check(db: asyncpg.Connection = Depends(get_db)):
    db_status = "unhealthy"
    try:
        val = await db.fetchval("SELECT 1")
        if val == 1:
            db_status = "healthy"
    except Exception as e:
        logger.error("Health check failed database ping", error=str(e))
        db_status = f"error: {str(e)}"

    return HealthResponse(
        status="healthy" if db_status == "healthy" else "degraded",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        database=db_status,
        uptime=time.time() - START_TIME
    )

@router.get("/health/ready")
async def readiness_check(db: asyncpg.Connection = Depends(get_db)):
    try:
        val = await db.fetchval("SELECT 1")
        if val != 1:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database ping response not valid"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection offline: {str(e)}"
        )
    return {"ready": True}
