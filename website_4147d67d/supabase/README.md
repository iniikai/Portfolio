# Supabase – backend source of truth for Shahmaran

**Service:** [Supabase](https://supabase.com) (PostgreSQL + Auth + REST API).  
**New tool:** You’ll use the Supabase dashboard and/or CLI. No new language here; we use **SQL** in migrations.

## One-time setup

1. Create an account at [supabase.com](https://supabase.com) and create a new project.
2. Either:
   - **Option A:** Install [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase init` in this folder (if you want to run migrations via CLI), or  
   - **Option B:** In the Supabase dashboard → SQL Editor, run the SQL in `migrations/00001_shahmaran.sql` to create the Shahmaran tables.
3. In the dashboard, go to **Settings → API** and copy:
   - **Project URL**
   - **anon (public) key**  
   Put these in `.env` files (see below) and never commit them.

## Environment variables (for web and admin)

Create a `.env` or `.env.local` in the repo root (and in `admin/` if the admin app reads its own env). Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Use the same names in the Flutter app via a config file or environment (e.g. `--dart-define` or `.env` loaded by a package). Never commit real keys; `.env` is in `.gitignore`.

## What lives here

- **`migrations/`** – SQL that defines tables (topics, steps, translations, progress). Run once per environment.
- **`config.toml`** – Optional; created by `supabase init` if you use the CLI locally.
