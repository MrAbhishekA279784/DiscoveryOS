from app.config import settings
print("JWT_SECRET_LENGTH:", len(settings.SUPABASE_JWT_SECRET))
print("FIRST_32_CHARS:", settings.SUPABASE_JWT_SECRET[:32] if len(settings.SUPABASE_JWT_SECRET) >= 32 else "TOO_SHORT")
