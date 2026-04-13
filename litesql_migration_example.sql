
ALTER TABLE users RENAME COLUMN last_login TO last_login_at;

INSERT INTO users (email, name, is_bot, login_method, oidc_google_id)
VALUES
  ('test@test.com', 'Test User', false, 'google', '1234567890');



-- https://www.sqlite.org/lang_altertable.html
-- 7. Making Other Kinds Of Table Schema Changes

PRAGMA defer_foreign_keys = on;

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

-- A common naming format for indexes is idx_TABLE_NAME_COLUMN_NAMES
-- CREATE INDEX IF NOT EXISTS idx_users_oidc_google_id ON users(oidc_google_id)
-- https://developers.cloudflare.com/d1/best-practices/use-indexes/