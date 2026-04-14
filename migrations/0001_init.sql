-- Migration number: 0001 	 2026-04-11T17:22:21.672Z

CREATE TABLE users (
  id TEXT PRIMARY KEY,                            
  name TEXT,
  photo TEXT,
  email TEXT UNIQUE NOT NULL,
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

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  assets TEXT DEFAULT '[]' NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  owner_id TEXT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
) STRICT;

CREATE TABLE storage (
  id TEXT PRIMARY KEY,
  storage_id TEXT NOT NULL,
  preview_id TEXT NOT NULL,
  size INTEGER NOT NULL,
  hash TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT,
  public INT NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  owner_id TEXT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
) STRICT;


INSERT INTO users (id, email, name, login_method, oidc_google_id)
VALUES
  ('us_6c4f425b-63a0-47ea-bba2-bc561713c81c', 'test@test.com', 'Test User', 'google', '1234567890');

