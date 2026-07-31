-- Shahmaran: topics, steps, translations, progress
-- Run this in Supabase SQL Editor (or via CLI) after creating your project.

-- Topics (e.g. "Iranian protests placards", "History 101")
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- One row per language per topic (at least two languages per topic)
create table if not exists public.topic_translations (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  locale text not null,
  title text not null,
  description text,
  unique(topic_id, locale)
);

-- Steps = bits of content within a topic (learn one by one, click next)
create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- One row per language per step
create table if not exists public.step_translations (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.steps(id) on delete cascade,
  locale text not null,
  title text,
  body text not null,
  unique(step_id, locale)
);

-- User progress (when logged in): last completed step index per topic
create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  last_completed_step_index int not null default -1,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

-- RLS: allow read for anon and authenticated; allow write only for authenticated (progress) and for service role (admin)
alter table public.topics enable row level security;
alter table public.topic_translations enable row level security;
alter table public.steps enable row level security;
alter table public.step_translations enable row level security;
alter table public.user_progress enable row level security;

-- Drop policies if they exist (so this script can be re-run without "already exists" errors)
drop policy if exists "Topics are readable by everyone" on public.topics;
drop policy if exists "Topic translations are readable by everyone" on public.topic_translations;
drop policy if exists "Steps are readable by everyone" on public.steps;
drop policy if exists "Step translations are readable by everyone" on public.step_translations;
drop policy if exists "Users can read own progress" on public.user_progress;
drop policy if exists "Users can insert own progress" on public.user_progress;
drop policy if exists "Users can update own progress" on public.user_progress;

-- Everyone can read topics and steps (public Shahmaran content)
create policy "Topics are readable by everyone"
  on public.topics for select using (true);
create policy "Topic translations are readable by everyone"
  on public.topic_translations for select using (true);
create policy "Steps are readable by everyone"
  on public.steps for select using (true);
create policy "Step translations are readable by everyone"
  on public.step_translations for select using (true);

-- Only authenticated users can read/write their own progress
create policy "Users can read own progress"
  on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- Admin: use Supabase dashboard or service role key to insert/update topics and steps.
-- For the admin app we will use the service role key (server-side only) or add policies later for an admin role.
-- For now, you can manage data via Supabase Dashboard → Table Editor until the admin UI is ready.
