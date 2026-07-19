import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import structlog
import jwt
import json
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx

from app.config import settings
from app.auth import get_current_user
from app.database import DegradedConnection

logger = structlog.get_logger()
router = APIRouter()

FIREBASE_JWKS_CACHE = None
FIREBASE_JWKS_CACHE_TIME = None

FIREBASE_PROJECT_ID = settings.FIREBASE_PROJECT_ID
FIREBASE_JWKS_URL = f"https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"

class AuthLoginRequest(BaseModel):
    id_token: str
    email: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None

class AuthRegisterRequest(BaseModel):
    id_token: str
    email: Optional[str] = None
    name: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: dict
    workspace_id: str

async def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded payload."""
    global FIREBASE_JWKS_CACHE, FIREBASE_JWKS_CACHE_TIME

    # Fetch JWKS if not cached or expired
    now = datetime.now(timezone.utc)
    if not FIREBASE_JWKS_CACHE or not FIREBASE_JWKS_CACHE_TIME or (now - FIREBASE_JWKS_CACHE_TIME).seconds > 3600:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(FIREBASE_JWKS_URL)
                resp.raise_for_status()
                FIREBASE_JWKS_CACHE = resp.json()
                FIREBASE_JWKS_CACHE_TIME = now
        except Exception as e:
            logger.error("Failed to fetch Firebase JWKS", error=str(e))
            raise HTTPException(status_code=500, detail="Authentication service unavailable")

    # Get key ID from token header
    try:
        header = jwt.get_unverified_header(id_token)
        kid = header.get("kid")
    except Exception as e:
        logger.warning("Invalid token header", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token")

    # Find matching key
    key_data = None
    for key in FIREBASE_JWKS_CACHE.get("keys", []):
        if key.get("kid") == kid:
            key_data = key
            break

    if not key_data:
        logger.warning("No matching Firebase JWK found", kid=kid)
        raise HTTPException(status_code=401, detail="Invalid token")

    # Build public key
    try:
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key_data))
    except Exception as e:
        logger.error("Failed to build RSA key from JWK", error=str(e))
        raise HTTPException(status_code=500, detail="Authentication error")

    # Verify token
    try:
        payload = jwt.decode(
            id_token,
            public_key,
            algorithms=["RS256"],
            audience=FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}",
            options={"verify_exp": True},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidAudienceError:
        raise HTTPException(status_code=401, detail="Invalid audience")
    except jwt.InvalidIssuerError:
        raise HTTPException(status_code=401, detail="Invalid issuer")
    except Exception as e:
        logger.warning("Token verification failed", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token")


def create_supabase_jwt(user_id: str, email: str) -> str:
    """Create a Supabase-compatible JWT for the user."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "aud": "authenticated",
        "role": "authenticated",
        "iat": now,
        "exp": now + timedelta(hours=24),
    }
    return jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")


@router.post("/auth/login", response_model=AuthResponse)
async def auth_login(request: AuthLoginRequest):
    """Exchange Firebase ID token for a backend JWT."""
    firebase_payload = await verify_firebase_token(request.id_token)
    firebase_uid = firebase_payload.get("sub", "")
    email = request.email or firebase_payload.get("email", "")
    name = request.name or firebase_payload.get("name", "")

    from app.database import db_manager
    conn = await db_manager.get_connection()

    if isinstance(conn, DegradedConnection):
        await db_manager.release(conn)
        mock_user_id = str(uuid.uuid4())
        mock_workspace_id = str(uuid.uuid4())
        logger.info("Auth in degraded mode (no PostgreSQL)", user_id=mock_user_id)
        backend_token = create_supabase_jwt(mock_user_id, email)
        return AuthResponse(
            token=backend_token,
            user={
                "id": mock_user_id,
                "email": email,
                "name": name or email.split("@")[0],
                "avatar": request.avatar or "",
            },
            workspace_id=mock_workspace_id,
        )

    try:
        user_record = await conn.fetchrow(
            "SELECT id, email, name, avatar, workspace_id FROM users WHERE firebase_uid = $1",
            firebase_uid
        )

        if not user_record:
            ws = await conn.fetchrow(
                "INSERT INTO workspaces (name, slug) VALUES ($1, $2) RETURNING id",
                f"{name or email}'s Workspace",
                f"ws-{firebase_uid[:8]}"
            )
            workspace_id = ws["id"]

            user_record = await conn.fetchrow(
                """INSERT INTO users (firebase_uid, email, name, avatar, workspace_id)
                   VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, avatar, workspace_id""",
                firebase_uid, email, name or email.split("@")[0], request.avatar or "", workspace_id
            )
        else:
            await conn.execute(
                "UPDATE users SET updated_at = NOW() WHERE id = $1",
                user_record["id"]
            )
    finally:
        await db_manager.release(conn)

    user_id = str(user_record["id"])
    workspace_id = str(user_record["workspace_id"])
    backend_token = create_supabase_jwt(user_id, email)

    return AuthResponse(
        token=backend_token,
        user={
            "id": user_id,
            "email": user_record["email"],
            "name": user_record["name"],
            "avatar": user_record.get("avatar") or "",
        },
        workspace_id=workspace_id,
    )


@router.post("/auth/register", response_model=AuthResponse)
async def auth_register(request: AuthRegisterRequest):
    """Register a new user with Firebase ID token."""
    return await auth_login(AuthLoginRequest(
        id_token=request.id_token,
        email=request.email,
        name=request.name,
    ))


@router.get("/auth/me")
async def auth_me(current_user: dict = Depends(get_current_user)):
    """Return current authenticated user status."""
    return {"status": "authenticated", "user_id": current_user.get("sub"), "email": current_user.get("email")}


@router.post("/auth/logout")
async def auth_logout():
    """Placeholder for server-side logout (token revocation if needed)."""
    return {"status": "logged_out"}
