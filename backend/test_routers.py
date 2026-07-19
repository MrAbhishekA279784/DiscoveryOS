#!/usr/bin/env python
import os
os.environ['SUPABASE_URL'] = 'http://localhost:54321'
os.environ['SUPABASE_ANON_KEY'] = 'test'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'test'
os.environ['SUPABASE_JWT_SECRET'] = 'your-super-secret-jwt-token-with-at-least-32-characters-long'
os.environ['DATABASE_URL'] = 'postgresql://user:password@localhost:5432/discoveryos'
os.environ['GEMINI_API_KEY'] = 'test-key'

try:
    # Test each router individually
    print("Testing router imports...")
    from app.routers import health
    print("✓ health router imports")
    from app.routers import uploads
    print("✓ uploads router imports")
    from app.routers import analytics
    print("✓ analytics router imports")
    from app.routers import search
    print("✓ search router imports")
    from app.routers import copilot
    print("✓ copilot router imports")
    from app.routers import workspaces
    print("✓ workspaces router imports")
    from app.routers import projects
    print("✓ projects router imports")
    print("Testing reports router (will fail)...")
    from app.routers import reports
    print("✓ reports router imports")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
