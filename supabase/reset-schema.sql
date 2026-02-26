-- ==========================================
-- RESET COMPLETO DE SCHEMA (solo desarrollo)
-- ⚠️ ADVERTENCIA: Esto ELIMINARÁ todos los datos
-- ==========================================

-- Eliminar triggers primero
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_session_created on public.sessions;
drop trigger if exists on_usage_session_created on public.usage_sessions;

-- Eliminar funciones
drop function if exists public.handle_new_user();
drop function if exists public.increment_session_count();

-- Eliminar tablas (cascade elimina dependencias)
drop table if exists public.suggestions cascade;
drop table if exists public.transcriptions cascade;
drop table if exists public.sessions cascade;
drop table if exists public.usage_sessions cascade;
drop table if exists public.profiles cascade;

-- ==========================================
-- Ahora ejecutar schema.sql completo
-- ==========================================
-- IMPORTANTE: Después de ejecutar este script,
-- ejecuta el contenido completo de schema.sql
