-- Migration number: 0004 	 2025-10-29T11:25:49.380Z

ALTER TABLE users RENAME COLUMN last_login TO last_login_at;
ALTER TABLE projects RENAME COLUMN last_updated TO updated_at;
ALTER TABLE projects RENAME COLUMN miniature_created_at TO miniature_updated_at;