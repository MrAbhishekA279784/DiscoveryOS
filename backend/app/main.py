from contextlib import asynccontextmanager
from collections import defaultdict, deque
import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from app.config import settings
from app.logging_config import setup_logging
from app.database import db_manager
from app.routers import health, uploads, analytics, search, copilot, workspaces, projects, reports, datasources, auth, metadata

setup_logging()
logger = structlog.get_logger()

# Global S3 client
s3_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB Pool
    global s3_client
    try:
        await db_manager.connect()
        logger.info("Application setup successfully initiated")
        
        # Initialize S3 client if AWS credentials are available
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY and settings.AWS_S3_BUCKET:
            try:
                import boto3
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_REGION
                )
                # Store bucket name for reference
                s3_client._bucket_name = settings.AWS_S3_BUCKET
                logger.info("S3 client initialized", bucket=settings.AWS_S3_BUCKET)
            except Exception as e:
                logger.warning("Failed to initialize S3 client", error=str(e))
                s3_client = None
        else:
            logger.info("S3 credentials not configured; file storage will use local storage")
        
        # Validate Gemini API key
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set; copilot features disabled")
        else:
            logger.info("Gemini API initialized", model=settings.GEMINI_MODEL)
    
    except Exception as e:
        logger.critical("Failed to connect database at startup", error=str(e))
    
    yield
    
    # Shutdown: Close DB Pool
    await db_manager.disconnect()
    logger.info("Application cleanly terminated")

app = FastAPI(
    title="DiscoveryOS Backend API",
    description="Product Intelligence Platform Core Service API Layer",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "X-Workspace-ID"],
)

# In-memory rate limiter
rate_limit_buckets: dict[str, deque] = defaultdict(deque)
RATE_LIMITS: dict[str, int] = {
    "auth": 10,
    "copilot": 20,
    "default": 30,
}

def _rate_limit_key(path: str) -> str:
    if path.startswith("/api/auth/"):
        return "auth"
    if path.startswith("/api/copilot/"):
        return "copilot"
    return "default"

@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    bucket = _rate_limit_key(request.url.path)
    limit = RATE_LIMITS[bucket]
    now = time.time()
    key = f"{request.client.host}:{bucket}" if request.client else bucket
    timestamps = rate_limit_buckets[key]
    while timestamps and now - timestamps[0] > 60:
        timestamps.popleft()
    if len(timestamps) >= limit:
        logger.warning("rate_limit_exceeded", path=request.url.path, client=request.client.host if request.client else "unknown")
        return JSONResponse(status_code=429, content={"detail": "Too many requests. Please try again later."})
    timestamps.append(now)
    return await call_next(request)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

# Request logger middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", f"req_{int(time.time() * 1000)}")
    structlog.contextvars.bind_contextvars(request_id=request_id)
    
    start_time = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start_time
    
    logger.info(
        "request_processed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration=f"{duration:.4f}s"
    )
    return response

# Custom exception handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal service error has occurred."}
    )

app.include_router(health.router, prefix="/api", tags=["System System Health"])
app.include_router(uploads.router, prefix="/api", tags=["Ingest uploads"])
app.include_router(analytics.router, prefix="/api", tags=["System KPIs"])
app.include_router(search.router, prefix="/api", tags=["System Search"])
app.include_router(copilot.router, prefix="/api", tags=["AI Copilot"])
app.include_router(workspaces.router, prefix="/api", tags=["Workspace Management"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(datasources.router, prefix="/api", tags=["Data Sources"])
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(metadata.router, prefix="/api", tags=["Metadata"])
