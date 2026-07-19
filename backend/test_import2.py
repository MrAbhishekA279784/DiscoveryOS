#!/usr/bin/env python
import os
os.environ['SUPABASE_URL'] = 'http://localhost:54321'
os.environ['SUPABASE_ANON_KEY'] = 'test'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'test'
os.environ['SUPABASE_JWT_SECRET'] = 'your-super-secret-jwt-token-with-at-least-32-characters-long'
os.environ['DATABASE_URL'] = 'postgresql://user:password@localhost:5432/discoveryos'
os.environ['GEMINI_API_KEY'] = 'test-key'

try:
    from app.main import app
    print("SUCCESS: Backend app imports successfully")
    print(f"Backend routes registered: {len(app.routes)}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
