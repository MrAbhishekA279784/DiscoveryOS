#!/usr/bin/env python3
"""Database migration runner for DiscoveryOS backend."""
import asyncio
import asyncpg
import sys
from pathlib import Path
import structlog

logger = structlog.get_logger()


async def run_migrations(database_url: str, migrations_dir: str = "backend/migrations"):
    """Run all SQL migrations in order."""
    conn = await asyncpg.connect(database_url)
    try:
        migrations_path = Path(migrations_dir)
        migration_files = sorted(migrations_path.glob("*.sql"))
        
        if not migration_files:
            logger.info("No migration files found")
            return
        
        for migration_file in migration_files:
            logger.info("Running migration", file=migration_file.name)
            sql = migration_file.read_text()
            await conn.execute(sql)
            logger.info("Migration complete", file=migration_file.name)
        
        logger.info("All migrations completed successfully")
    finally:
        await conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_migrations.py <DATABASE_URL>")
        sys.exit(1)
    
    db_url = sys.argv[1]
    asyncio.run(run_migrations(db_url))
