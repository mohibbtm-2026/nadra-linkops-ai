# Recommended Backend Upgrade for Proper Authorization

This app currently includes a **demo multi-user management system** stored in browser localStorage so it can be tested without external services.

For a proper production-style backend with secure authentication and shared database access, the recommended next step is:

- **Supabase Auth** for secure login
- **Supabase Postgres** for complaints, users, roles, and AD support records
- **Row Level Security (RLS)** for role-based access control

## Why this is recommended
- browser localStorage is only for demo/testing
- real user accounts should not be stored in frontend storage
- admin/engineer permissions should be enforced server-side
- multiple users should access the same centralized records

## Suggested architecture
- Frontend: current web app UI
- Auth: Supabase email/password login
- Database tables:
  - profiles
  - complaints
  - ad_requests
  - site_directory
  - audit_logs

## Deployment approach
1. Create a Supabase project.
2. Apply the SQL schema from `db/supabase_schema.sql`.
3. Enable email/password auth.
4. Create admin account.
5. Replace localStorage login logic with Supabase auth calls.
6. Replace local complaint storage with database CRUD.
7. Deploy frontend on Vercel with Supabase environment variables.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only if needed)

## Academic note
For final project submission, the current demo version is still valid as a working app. This file is provided as a stronger refinement path if you want to convert it into a more production-like system.
