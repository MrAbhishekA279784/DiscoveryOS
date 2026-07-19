-- DiscoveryOS Migration 003: Constraints
-- Adds unique and check constraints for data integrity

ALTER TABLE projects ADD CONSTRAINT unique_project_name_per_workspace UNIQUE(workspace_id, name);
ALTER TABLE data_sources ADD CONSTRAINT unique_datasource_per_workspace UNIQUE(workspace_id, source_key);

-- Add check constraints for status enums
ALTER TABLE files ADD CONSTRAINT files_status_check CHECK(status IN ('uploaded', 'parsed', 'index_failed', 'completed'));
ALTER TABLE chat_sessions ADD CONSTRAINT chat_status_check CHECK(status IN ('active', 'archived'));
