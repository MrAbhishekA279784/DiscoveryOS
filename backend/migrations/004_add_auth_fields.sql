-- Auth Schema: Add Firebase UID, name, avatar columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT NOT NULL DEFAULT '';

-- Allow auto-generated UUIDs for users created via Firebase auth
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Index for Firebase UID lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
