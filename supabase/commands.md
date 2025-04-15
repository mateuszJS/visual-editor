supabase login
supabase gen types typescript --local > src/utils/supabaseClient/database.types.ts

supabase db diff -f create_employees_table --project-id dstjhnkpqxtxnnbfbwxw

`supabase start`
`supabase migration up`

if you are just creating initial version(migration) and keep modifying it, use:
`supabase db reset`

# Deploy schema:

1. supabase login
2. supabase db push

# Rolling back a schema change

`supabase db reset --version 20241005112233` with id of the migration which you want roll back to.

# to create a new everythin

drop schema public cascade;
create schema public;

# To apply the new migration to your local database:

`supabase migration up`

# To reset your local database completely(resets db to the current migration and populate with seed data):

`supabase db reset`
