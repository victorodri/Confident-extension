-- Confident — Supabase Schema Completo
-- Tables: profiles, sessions, transcriptions, suggestions, usage_sessions (legacy)
-- RLS policies included

-- ==========================================
-- TABLA: PROFILES
-- ==========================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro')),
  anonymous_id text unique,
  total_sessions integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- TABLA: SESSIONS
-- ==========================================
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  anonymous_id text,
  profile text check (profile in ('candidato', 'vendedor', 'defensor')) not null,
  session_type text,
  status text default 'active' check (status in ('active', 'completed', 'abandoned')),
  consent_confirmed boolean default false,
  participants_emails text[],
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_seconds integer,
  suggestions_count integer default 0,
  created_at timestamptz default now()
);

-- ==========================================
-- TABLA: TRANSCRIPTIONS
-- ==========================================
create table public.transcriptions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade,
  speaker text check (speaker in ('user', 'other', 'unknown')),
  text text not null,
  timestamp_ms integer,
  language char(2) default 'es',
  created_at timestamptz default now()
);

-- ==========================================
-- TABLA: SUGGESTIONS
-- ==========================================
create table public.suggestions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade,
  transcription_id uuid references public.transcriptions(id),
  question_type text,
  suggestion_text text not null,
  context_text text,
  keywords text[],
  urgency_level integer check (urgency_level between 1 and 3),
  was_helpful boolean,
  created_at timestamptz default now()
);

-- ==========================================
-- TABLA: USAGE_SESSIONS (legacy - mantener para compatibilidad)
-- ==========================================
create table public.usage_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  anonymous_id text,
  profile_type text check (profile_type in ('candidato', 'vendedor', 'defensor')),
  started_at timestamptz default now(),
  session_number integer not null
);

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.transcriptions enable row level security;
alter table public.suggestions enable row level security;
alter table public.usage_sessions enable row level security;

-- Policies: PROFILES
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Policies: SESSIONS
create policy "Users can read own sessions"
  on public.sessions for select
  using (auth.uid() = user_id or anonymous_id is not null);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own sessions"
  on public.sessions for update
  using (auth.uid() = user_id or anonymous_id is not null);

-- Policies: TRANSCRIPTIONS
create policy "Users can read own transcriptions"
  on public.transcriptions for select
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = transcriptions.session_id
      and (sessions.user_id = auth.uid() or sessions.anonymous_id is not null)
    )
  );

create policy "Users can insert transcriptions"
  on public.transcriptions for insert
  with check (
    exists (
      select 1 from public.sessions
      where sessions.id = transcriptions.session_id
      and (sessions.user_id = auth.uid() or sessions.user_id is null)
    )
  );

-- Policies: SUGGESTIONS
create policy "Users can read own suggestions"
  on public.suggestions for select
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = suggestions.session_id
      and (sessions.user_id = auth.uid() or sessions.anonymous_id is not null)
    )
  );

create policy "Users can insert suggestions"
  on public.suggestions for insert
  with check (
    exists (
      select 1 from public.sessions
      where sessions.id = suggestions.session_id
      and (sessions.user_id = auth.uid() or sessions.user_id is null)
    )
  );

create policy "Users can update own suggestions"
  on public.suggestions for update
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = suggestions.session_id
      and sessions.user_id = auth.uid()
    )
  );

-- Policies: USAGE_SESSIONS (legacy)
create policy "Users can read own usage sessions"
  on public.usage_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage sessions"
  on public.usage_sessions for insert
  with check (auth.uid() = user_id or user_id is null);

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger para crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger para incrementar contador de sesiones (tabla sessions)
create or replace function public.increment_session_count()
returns trigger as $$
begin
  -- Solo incrementar si la sesión tiene user_id (usuario autenticado)
  if new.user_id is not null then
    update public.profiles
    set total_sessions = total_sessions + 1,
        updated_at = now()
    where id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger en tabla sessions (nueva)
create trigger on_session_created
  after insert on public.sessions
  for each row execute procedure public.increment_session_count();

-- Trigger en tabla usage_sessions (legacy - mantener para compatibilidad)
create trigger on_usage_session_created
  after insert on public.usage_sessions
  for each row execute procedure public.increment_session_count();

-- ==========================================
-- ÍNDICES para optimización de queries
-- ==========================================
create index idx_sessions_user_id on public.sessions(user_id);
create index idx_sessions_anonymous_id on public.sessions(anonymous_id);
create index idx_sessions_created_at on public.sessions(created_at desc);
create index idx_transcriptions_session_id on public.transcriptions(session_id);
create index idx_suggestions_session_id on public.suggestions(session_id);
