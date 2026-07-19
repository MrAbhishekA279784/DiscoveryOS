#!/usr/bin/env python3
"""Database seeding script for DiscoveryOS backend."""
import asyncio
import asyncpg
import uuid
from datetime import datetime, timedelta
import json
import sys
import structlog

logger = structlog.get_logger()


async def seed_database(database_url: str):
    """Populate database with bootstrap data."""
    conn = await asyncpg.connect(database_url)
    try:
        # Create workspace
        workspace_id = "550e8400-e29b-41d4-a716-446655440000"
        await conn.execute(
            """INSERT INTO workspaces (id, name, slug, created_at) 
               VALUES ($1, $2, $3, $4) 
               ON CONFLICT (id) DO NOTHING""",
            workspace_id, "Default Workspace", "workspace-default", datetime.utcnow()
        )
        logger.info("Created workspace", workspace_id=workspace_id)
        
        # Create user
        user_id = str(uuid.uuid4())
        await conn.execute(
            """INSERT INTO users (id, email, role, workspace_id, created_at) 
               VALUES ($1, $2, $3, $4, $5) 
               ON CONFLICT (id) DO NOTHING""",
            user_id, "admin@discoveryos.dev", "admin", workspace_id, datetime.utcnow()
        )
        logger.info("Created user", user_id=user_id)
        
        # Create sample files
        file_ids = []
        for i in range(3):
            file_id = str(uuid.uuid4())
            await conn.execute(
                """INSERT INTO files (id, workspace_id, name, size, type, raw_size, storage_path, status, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                   ON CONFLICT (id) DO NOTHING""",
                file_id, workspace_id, f"sample_document_{i}.pdf", "2.5 MB", "pdf", 2500000, 
                f"workspace/{workspace_id}/sample_{i}.pdf", "completed", datetime.utcnow()
            )
            file_ids.append(file_id)
        logger.info("Created sample files", count=len(file_ids))
        
        # Create file chunks
        for file_id in file_ids:
            for j in range(3):
                await conn.execute(
                    """INSERT INTO file_chunks (file_id, content, metadata, created_at) 
                       VALUES ($1, $2, $3, $4)""",
                    file_id, f"Sample content chunk {j} from file", 
                    json.dumps({"sequence": j, "length": 500}), datetime.utcnow()
                )
        logger.info("Created file chunks")
        
        # Create KPI snapshots (12 months)
        for month in range(12):
            date = datetime.utcnow() - timedelta(days=30 * (11 - month))
            for kpi_type, value, change in [
                ("feedback", "1,284", "12.5%"),
                ("painpoints", "32", "8.3%"),
                ("accuracy", "96%", "4.2%"),
                ("responsetime", "1.2s", "-0.3s")
            ]:
                await conn.execute(
                    """INSERT INTO kpi_snapshots (workspace_id, type, value, change, is_positive, sparkline_data, recorded_at) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7)""",
                    workspace_id, kpi_type, value, change, True, 
                    [float(30 + i * 5) for i in range(12)], date
                )
        logger.info("Created KPI snapshots")
        
        # Create pain points
        pain_points = [
            ("Offline Mode", 432, 33.6),
            ("Dark Mode", 310, 24.1),
            ("Navigation Issues", 220, 17.1),
            ("Seat Search", 158, 12.3)
        ]
        for name, count, percentage in pain_points:
            await conn.execute(
                """INSERT INTO pain_points (workspace_id, name, count, percentage, created_at) 
                   VALUES ($1, $2, $3, $4, $5)""",
                workspace_id, name, count, percentage, datetime.utcnow()
            )
        logger.info("Created pain points")
        
        # Create recommendations
        recommendations = [
            ("Prioritize Offline Mode", "High frequency + High impact", 94),
            ("Improve Navigation Flow", "Medium frequency + High impact", 78)
        ]
        for title, freq_impact, confidence in recommendations:
            await conn.execute(
                """INSERT INTO recommendations (workspace_id, title, freq_impact, confidence, icon_name, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6)""",
                workspace_id, title, freq_impact, confidence, "Sparkles", datetime.utcnow()
            )
        logger.info("Created recommendations")
        
        # Create projects
        projects = [
            ("StadiumIQ Local Database Sync", "Active", 82, "Aug 15, 2026", "Low", "Implementing local SQLite replica sync engine."),
            ("DiscoveryOS Theme Engine Refactor", "Active", 45, "Sep 02, 2026", "Low", "Supporting dynamic dark mode system layouts.")
        ]
        for name, status, progress, deadline, risk, description in projects:
            await conn.execute(
                """INSERT INTO projects (workspace_id, name, status, progress, deadline, risk, description, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)""",
                workspace_id, name, status, progress, deadline, risk, description, datetime.utcnow()
            )
        logger.info("Created projects")
        
        # Create data sources
        data_sources = [
            ("drive", "Google Drive", "Document Cloud", "Connected", "14.2 MB", "99.8%", "10 mins ago", "Syncs team folders."),
        ]
        for source_key, name, category, status, volume, health, last_sync, description in data_sources:
            await conn.execute(
                """INSERT INTO data_sources (workspace_id, source_key, name, category, status, volume, health, last_sync, description, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)""",
                workspace_id, source_key, name, category, status, volume, health, last_sync, description, datetime.utcnow()
            )
        logger.info("Created data sources")
        
        # Create roadmap items
        roadmap_item_data = [
            ("Now", "Q3 2026", "Local SQLite Delta Database & Sync Engine", "Critical", "Medium", "Extreme", "None", "Offline storage client.", "Core Tech Team", "Low")
        ]
        for phase, quarter, title, priority, effort, impact, dependencies, description, owner, risk in roadmap_item_data:
            await conn.execute(
                """INSERT INTO roadmap_items (workspace_id, phase, quarter, title, priority, effort, impact, dependencies, description, owner, risk, created_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)""",
                workspace_id, phase, quarter, title, priority, effort, impact, dependencies, description, owner, risk, datetime.utcnow()
            )
        logger.info("Created roadmap items")
        
        logger.info("Database seeding completed successfully")
        
    finally:
        await conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python seed_database.py <DATABASE_URL>")
        sys.exit(1)
    
    db_url = sys.argv[1]
    asyncio.run(seed_database(db_url))
