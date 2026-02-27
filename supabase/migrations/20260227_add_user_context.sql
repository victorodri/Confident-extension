-- Migración: Añadir columna user_context a profiles
-- Fecha: 2026-02-27
-- Sesión: 14 (Onboarding Personalizado)

-- Añadir columna user_context si no existe
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_context JSONB;

-- Crear índice para búsquedas en user_context
CREATE INDEX IF NOT EXISTS idx_profiles_user_context
ON profiles USING GIN (user_context);

-- Comentario para documentación
COMMENT ON COLUMN profiles.user_context IS 'Contexto personalizado del usuario recopilado en onboarding: descripción, preocupaciones, objetivos';
