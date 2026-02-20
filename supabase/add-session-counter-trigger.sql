-- Trigger para incrementar automáticamente el contador de sesiones
-- Ejecutar esto en Supabase SQL Editor

-- Función que incrementa el contador cuando se inserta una sesión con user_id
CREATE OR REPLACE FUNCTION public.increment_session_counter()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo incrementar si la sesión tiene user_id (usuario autenticado)
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET total_sessions = total_sessions + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función después de cada INSERT en usage_sessions
DROP TRIGGER IF EXISTS on_session_inserted ON public.usage_sessions;

CREATE TRIGGER on_session_inserted
  AFTER INSERT ON public.usage_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_session_counter();
