from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import asyncpg
from app.config import settings
from app.database import DegradedConnection
import structlog

logger = structlog.get_logger()
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    
    # Accept demo tokens for demo mode
    if token.startswith("demo-"):
        logger.info("Demo mode token accepted")
        return {
            "sub": "demo-user-" + token.split("-")[2] if len(token.split("-")) > 2 else "demo-user",
            "email": token,
            "aud": "authenticated",
            "role": "authenticated"
        }
    
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Expired JWT signature encountered")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        logger.warning("Invalid JWT encountered", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )



async def check_workspace_access(user_id: str, workspace_id: str, db: asyncpg.Connection | DegradedConnection) -> None:
    """Verify that user belongs to the workspace. Raise 403 if not.
    Skips check when running in degraded mode (no PostgreSQL)."""
    if isinstance(db, DegradedConnection):
        return
    user_record = await db.fetchrow(
        "SELECT workspace_id FROM users WHERE id = $1",
        user_id
    )
    
    if not user_record:
        logger.warning("User not found", user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if str(user_record["workspace_id"]) != workspace_id:
        logger.warning("Access denied", user_id=user_id, workspace_id=workspace_id)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this workspace"
        )
