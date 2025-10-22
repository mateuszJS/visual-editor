-- Migration number: 0003 	 2025-10-22T16:03:27.448Z

PRAGMA defer_foreign_keys = on;

CREATE TABLE new_users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  photo TEXT,
  email TEXT UNIQUE, -- changed to optional
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  language TEXT,
  country TEXT,
  browser TEXT,
  -- is_bot INT NOT NULL, -- removed
  login_method TEXT NOT NULL,
  oidc_google_id TEXT UNIQUE,
  last_login TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  -- new fields
  region TEXT,
  device_model TEXT,
  device_type TEXT,
  device_vendor TEXT,
  os TEXT,
  os_version TEXT
) STRICT;

INSERT INTO new_users (id, name, photo, email, created_at, language, country, browser, login_method, oidc_google_id, last_login)
SELECT                 id, name, photo, email, created_at, language, country, browser, login_method, oidc_google_id, last_login FROM users;

DROP TABLE users;

ALTER TABLE new_users RENAME TO users;

PRAGMA defer_foreign_keys = off;
