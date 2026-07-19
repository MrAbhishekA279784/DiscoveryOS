#!/usr/bin/env python
import os
import sys
os.environ['SUPABASE_URL'] = 'http://localhost:54321'
os.environ['SUPABASE_ANON_KEY'] = 'test'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'test'
os.environ['SUPABASE_JWT_SECRET'] = 'your-super-secret-jwt-token-with-at-least-32-characters-long'
os.environ['DATABASE_URL'] = 'postgresql://user:password@localhost:5432/discoveryos'
os.environ['GEMINI_API_KEY'] = 'test-key'

try:
    print("Testing router imports...")
    from app.routers import health
    print("OK: health router imports")
    from app.routers import uploads
    print("OK: uploads router imports")
    from app.routers import analytics
    print("OK: analytics router imports")
    from app.routers import search
    print("OK: search router imports")
    from app.routers import copilot
    print("OK: copilot router imports")
    from app.routers import workspaces
    print("OK: workspaces router imports")
    from app.routers import projects
    print("OK: projects router imports")
    from app.routers import datasources
    print("OK: datasources router imports")
    print("Testing reports router (will fail)...")
    from app.routers import reports
    print("OK: reports router imports")
except Exception as e:
    print(f"IMPORT ERROR: {type(e).__name__}")
    print(f"Message: {str(e)}")
