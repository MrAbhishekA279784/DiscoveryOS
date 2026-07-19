-- DiscoveryOS Migration 002: Performance Indexes
-- Adds indexes to improve query performance

CREATE INDEX IF NOT EXISTS idx_files_workspace_created ON files(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_file_chunks_file ON file_chunks(file_id);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_workspace_time ON kpi_snapshots(workspace_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_pain_points_workspace ON pain_points(workspace_id, count DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_workspace_time ON feedback_items(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_time ON chat_messages(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_workspace ON recommendations(workspace_id, confidence DESC);
CREATE INDEX IF NOT EXISTS idx_roadmap_workspace ON roadmap_items(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_sources_workspace ON data_sources(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_workspace_created ON reports(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON activity_logs(workspace_id, created_at DESC);
