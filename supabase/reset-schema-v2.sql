-- ==========================================
-- RESET COMPLETO DE SCHEMA (solo desarrollo)
-- ⚠️ ADVERTENCIA: Esto ELIMINARÁ todos los datos
-- Versión 2: Sin errores si las tablas no existen
-- ==========================================

-- Eliminar tablas con CASCADE (esto elimina automáticamente los triggers)
drop table if exists public.suggestions cascade;
drop table if exists public.transcriptions cascade;
drop table if exists public.sessions cascade;
drop table if exists public.usage_sessions cascade;
drop table if exists public.profiles cascade;

-- Eliminar funciones (se pueden eliminar aunque no existan tablas)
drop function if exists public.handle_new_user() cascade;
drop function if exists public.increment_session_count() cascade;

-- Mensaje de confirmación
select 'Reset completado. Ahora ejecuta schema.sql' as status;
