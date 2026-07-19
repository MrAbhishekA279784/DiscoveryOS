#!/usr/bin/env python
try:
    from app.main import app
    print("SUCCESS: Backend app imports successfully")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
