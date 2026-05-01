-- Migration number: 0002 	 2026-04-29T14:15:42.626Z

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  preview_shape TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  assets TEXT DEFAULT '[]' NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL
) STRICT;
