-- Verificar usuarios en auth.users y profiles
SELECT
  'Total usuarios en auth.users' as descripcion,
  COUNT(*) as cantidad
FROM auth.users
UNION ALL
SELECT
  'Total perfiles en public.profiles' as descripcion,
  COUNT(*) as cantidad
FROM public.profiles
UNION ALL
SELECT
  'Usuarios SIN perfil' as descripcion,
  COUNT(*) as cantidad
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Ver todos los perfiles existentes
SELECT
  p.email,
  p.plan,
  p.total_sessions,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
