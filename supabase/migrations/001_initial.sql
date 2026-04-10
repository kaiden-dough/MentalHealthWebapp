-- HokieHealth initial schema (applied to hosted project via Supabase MCP migration `hokiehealth_initial_schema`)

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  mood text not null,
  stress smallint not null check (stress >= 1 and stress <= 10),
  stressors text[] not null default '{}',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists mood_entries_user_created_idx on public.mood_entries (user_id, created_at desc);

alter table public.mood_entries enable row level security;

create policy "mood_entries_all" on public.mood_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
