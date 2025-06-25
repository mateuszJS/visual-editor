create table users (
  id bigint generated always as identity primary key,
  name text,
  avatar text,
  projects bigint array default '{}', -- would be a foregin key if array field supports foregin keys
  email text unique not null,
  created_at timestamp default now(),
  language text,
  country text,
  browser text,
  device_type text,
  device_model text,
  browser_engine text,
  os text,
  is_bot boolean not null,
  login_method text not null,
  oidc_google_id text unique,
  last_login timestamp default now()
);

-- Create a partial index on oidc_google_id to make searches more efficient, excluding nulls
create index idx_users_oidc_google_id on users (oidc_google_id)
where oidc_google_id is not null;

create table projects (
  id bigint generated always as identity primary key,
  name text,
  owner_id bigint references users not null,
  created_at timestamp default now(),
  assets jsonb array default '{}' not null,
  last_updated timestamp default now() not null,
  width int not null,
  height int not null
);


create table project_assets (
  id bigint generated always as identity primary key,
  owner_id bigint references users not null
);

insert into storage.buckets
  (id, name, public)
values
  ('project-assets', 'project-assets', true);

create policy "public-storage-objects"
on storage.objects
for insert with check (
  true
);