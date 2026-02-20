-- Confident — Supabase Schema for Session 4
-- Tables: profiles, usage_sessions
-- RLS policies included

-- Extender tabla de usuarios de Supabase Auth
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  created_at timestamptz default now(),
  plan text default 'free' check (plan in ('free', 'pro')),
  total_sessions integer default 0
);

-- Tabla de sesiones de uso
create table public.usage_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  anonymous_id text,
  profile_type text check (profile_type in ('candidato', 'vendedor', 'defensor')),
  started_at timestamptz default now(),
  session_number integer not null
);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.usage_sessions enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can read own sessions"
  on public.usage_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.usage_sessions for insert
  with check (auth.uid() = user_id or user_id is null);

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
