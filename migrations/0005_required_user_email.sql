-- Migration number: 0005 	 2026-03-24T22:20:34.689Z

PRAGMA defer_foreign_keys = on;

CREATE TABLE new_users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  photo TEXT,
  email TEXT UNIQUE NOT NULL, -- added NOT NULL
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  language TEXT,
  country TEXT,
  browser TEXT,
  login_method TEXT NOT NULL,
  oidc_google_id TEXT UNIQUE,
  last_login TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  region TEXT,
  device_model TEXT,
  device_type TEXT,
  device_vendor TEXT,
  os TEXT,
  os_version TEXT
) STRICT;

INSERT INTO new_users SELECT * FROM users;

DROP TABLE users;

ALTER TABLE new_users RENAME TO users;





CREATE TABLE new_projects (
  id INTEGER PRIMARY KEY,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  assets TEXT DEFAULT '[]' NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  -- miniature_updated_at TEXT, -- removed column
  owner_id INTEGER NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
) STRICT;

INSERT INTO new_projects (id, name, created_at, assets, updated_at, width, height, owner_id)
SELECT                    id, name, created_at, assets, updated_at, width, height, owner_id FROM projects;

DROP TABLE projects;

ALTER TABLE new_projects RENAME TO projects;


PRAGMA defer_foreign_keys = off;
