-- Fix: Funciones con search_path mutable
-- Fix: Políticas RLS con re-evaluaciones innecesarias

-- ==========================================
-- 1. FIX: FUNCIONES CON SEARCH_PATH SEGURO
-- ==========================================

-- Recrear handle_new_user con search_path fijo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Recrear increment_session_count con search_path fijo
CREATE OR REPLACE FUNCTION public.increment_session_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo incrementar si la sesión tiene user_id (usuario autenticado)
  IF new.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET total_sessions = total_sessions + 1,
        updated_at = now()
    WHERE id = new.user_id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- ==========================================
-- 2. FIX: OPTIMIZAR POLÍTICAS RLS
-- ==========================================

-- Crear función helper que cachea el user_id actual
-- Esto evita re-evaluaciones en cada fila
-- NOTA: Creada en schema public porque no tenemos permisos en schema auth
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claim.sub', true))
  )::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES: Optimizar políticas
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (public.current_user_id() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (public.current_user_id() = id);

-- SESSIONS: Optimizar políticas
DROP POLICY IF EXISTS "Users can read own sessions" ON public.sessions;
CREATE POLICY "Users can read own sessions"
  ON public.sessions FOR SELECT
  USING (public.current_user_id() = user_id OR anonymous_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (public.current_user_id() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;
CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE
  USING (public.current_user_id() = user_id OR anonymous_id IS NOT NULL);

-- TRANSCRIPTIONS: Optimizar políticas
DROP POLICY IF EXISTS "Users can read own transcriptions" ON public.transcriptions;
CREATE POLICY "Users can read own transcriptions"
  ON public.transcriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = transcriptions.session_id
      AND (sessions.user_id = public.current_user_id() OR sessions.anonymous_id IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Users can insert transcriptions" ON public.transcriptions;
CREATE POLICY "Users can insert transcriptions"
  ON public.transcriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = transcriptions.session_id
      AND (sessions.user_id = public.current_user_id() OR sessions.user_id IS NULL)
    )
  );

-- SUGGESTIONS: Optimizar políticas
DROP POLICY IF EXISTS "Users can read own suggestions" ON public.suggestions;
CREATE POLICY "Users can read own suggestions"
  ON public.suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = suggestions.session_id
      AND (sessions.user_id = public.current_user_id() OR sessions.anonymous_id IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Users can insert suggestions" ON public.suggestions;
CREATE POLICY "Users can insert suggestions"
  ON public.suggestions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = suggestions.session_id
      AND (sessions.user_id = public.current_user_id() OR sessions.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can update own suggestions" ON public.suggestions;
CREATE POLICY "Users can update own suggestions"
  ON public.suggestions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = suggestions.session_id
      AND sessions.user_id = public.current_user_id()
    )
  );

-- USAGE_SESSIONS (legacy): Optimizar políticas
DROP POLICY IF EXISTS "Users can read own usage sessions" ON public.usage_sessions;
CREATE POLICY "Users can read own usage sessions"
  ON public.usage_sessions FOR SELECT
  USING (public.current_user_id() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage sessions" ON public.usage_sessions;
CREATE POLICY "Users can insert own usage sessions"
  ON public.usage_sessions FOR INSERT
  WITH CHECK (public.current_user_id() = user_id OR user_id IS NULL);

-- ==========================================
-- COMENTARIOS
-- ==========================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function para crear perfil al registrarse. SET search_path = public para seguridad.';
COMMENT ON FUNCTION public.increment_session_count() IS 'Trigger function para incrementar contador de sesiones. SET search_path = public para seguridad.';
COMMENT ON FUNCTION public.current_user_id() IS 'Helper function que cachea el UUID del usuario actual. Evita re-evaluaciones en políticas RLS.';
