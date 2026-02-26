-- Añadir campo summary (JSONB) a la tabla sessions
-- Este campo almacenará el resumen generado por IA al finalizar la sesión

alter table public.sessions
  add column summary jsonb;

-- El summary tendrá esta estructura:
-- {
--   "executive_summary": "Resumen ejecutivo en 2-3 párrafos...",
--   "key_points": ["Punto 1", "Punto 2", ...],
--   "recommendations": ["Recomendación 1", "Recomendación 2", ...],
--   "learnings": "Aprendizajes y insights..."
-- }
