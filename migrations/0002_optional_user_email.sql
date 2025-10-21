-- Migration number: 0002 	 2025-10-21T12:08:28.753Z

-- https://www.sqlite.org/lang_altertable.html
-- 7. Making Other Kinds Of Table Schema Changes

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
  device_type TEXT,
  device_model TEXT,
  browser_engine TEXT,
  os TEXT,
  is_bot INT NOT NULL,
  login_method TEXT NOT NULL,
  oidc_google_id TEXT UNIQUE,
  last_login TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
) STRICT;

INSERT INTO new_users SELECT * FROM users;

DROP TABLE users;

ALTER TABLE new_users RENAME TO users;

PRAGMA defer_foreign_keys = off;
