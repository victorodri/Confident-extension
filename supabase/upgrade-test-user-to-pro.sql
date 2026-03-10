-- Script para actualizar usuario test a plan PRO
-- Backend Architect: Gestión de planes y límites

-- Usuario: vm.rodriguez.gutierrez@gmail.com
-- ID: c34c6f0f-6d2b-40d4-804e-bb2cc7901f05

-- 1. Actualizar plan a 'pro' y resetear contador para testing
UPDATE profiles
SET
  plan = 'pro',
  total_sessions = 5,  -- Resetear para testing
  updated_at = NOW()
WHERE id = 'c34c6f0f-6d2b-40d4-804e-bb2cc7901f05';

-- 2. Verificar cambio
SELECT
  id,
  email,
  plan,
  total_sessions,
  created_at,
  updated_at
FROM profiles
WHERE id = 'c34c6f0f-6d2b-40d4-804e-bb2cc7901f05';

-- Resultado esperado:
-- plan: 'pro'
-- total_sessions: 5

-- NOTA: Plan 'pro' = sesiones ilimitadas
-- Para revertir a 'free': UPDATE profiles SET plan = 'free' WHERE id = '...';
