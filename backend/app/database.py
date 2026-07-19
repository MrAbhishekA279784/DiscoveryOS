from typing import AsyncGenerator, Any, Optional
import asyncpg
from app.config import settings
import structlog

logger = structlog.get_logger()


class DegradedConnection:
    """Minimal asyncpg.Connection stand-in that returns empty results.
    Allows endpoints to fall through to their mock/fallback data paths
    when PostgreSQL is unavailable.
    """
    async def fetch(self, query: str, *args: Any, **kwargs: Any) -> list:
        return []
    async def fetchrow(self, query: str, *args: Any, **kwargs: Any) -> Optional[dict]:
        return None
    async def fetchval(self, query: str, *args: Any, **kwargs: Any) -> Any:
        return None
    async def execute(self, query: str, *args: Any, **kwargs: Any) -> str:
        return ""


class DatabaseManager:
    def __init__(self):
        self.pool: asyncpg.Pool | None = None
        self.degraded: bool = False

    async def connect(self):
        if self.pool:
            return
        logger.info("Initializing asyncpg database pool")
        try:
            self.pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=2,
                max_size=10,
                max_inactive_connection_lifetime=300.0,
            )
        except Exception as e:
            logger.warning("Database unavailable, running in degraded mode", error=str(e))
            self.degraded = True

    async def disconnect(self):
        if self.pool:
            logger.info("Closing asyncpg database pool")
            await self.pool.close()
            self.pool = None

    async def get_connection(self) -> asyncpg.Connection | DegradedConnection:
        if self.degraded or not self.pool:
            return DegradedConnection()
        return await self.pool.acquire()

    async def release(self, conn: asyncpg.Connection | DegradedConnection) -> None:
        if self.pool and not isinstance(conn, DegradedConnection):
            await self.pool.release(conn)

db_manager = DatabaseManager()


async def get_db() -> AsyncGenerator[asyncpg.Connection | DegradedConnection, None]:
    if db_manager.degraded or not db_manager.pool:
        yield DegradedConnection()
        return
    async with db_manager.pool.acquire() as connection:
        yield connection
