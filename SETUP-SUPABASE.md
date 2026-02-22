# Setup Supabase — Confident

## 🔴 ACCIÓN REQUERIDA — Ejecutar trigger faltante

El contador de sesiones **NO funciona** porque falta un trigger en Supabase.

### Pasos para arreglar:

1. **Ir a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Seleccionar tu proyecto Confident

2. **Ir a SQL Editor** (menú izquierdo)

3. **Copiar y pegar el siguiente SQL:**

```sql
-- Trigger para incrementar contador de sesiones
CREATE OR REPLACE FUNCTION public.increment_session_count()
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

-- Crear el trigger (eliminar si ya existe)
DROP TRIGGER IF EXISTS on_session_created ON public.usage_sessions;

CREATE TRIGGER on_session_created
  AFTER INSERT ON public.usage_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.increment_session_count();
```

4. **Clic en "Run" (ejecutar)**

5. **Verificar que no haya errores**

---

## ✅ Verificación

Después de ejecutar el trigger:

1. Abre la extensión en Google Meet
2. Inicia una sesión
3. Detén la sesión
4. Verifica el contador → debe bajar en 1

---

## 📊 Estado actual de las tablas

Para verificar manualmente, ejecuta en SQL Editor:

```sql
-- Ver perfil del usuario autenticado
SELECT * FROM public.profiles WHERE email = 'tu@email.com';

-- Ver sesiones registradas
SELECT * FROM public.usage_sessions ORDER BY started_at DESC LIMIT 10;

-- Contar sesiones por usuario
SELECT user_id, COUNT(*) as total
FROM public.usage_sessions
WHERE user_id IS NOT NULL
GROUP BY user_id;

-- Contar sesiones anónimas por fingerprint
SELECT anonymous_id, COUNT(*) as total
FROM public.usage_sessions
WHERE anonymous_id IS NOT NULL
GROUP BY anonymous_id;
```

---

## 🐛 Debug adicional

Si el contador sigue sin funcionar después del trigger:

1. **Verifica que las sesiones se están guardando:**
   ```sql
   SELECT * FROM public.usage_sessions ORDER BY started_at DESC LIMIT 5;
   ```

2. **Verifica el `anonymous_id` (device fingerprint):**
   - Abre la consola de la extensión
   - Ve a `chrome://extensions`
   - Clic en "Inspect service worker" en Confident
   - En consola ejecuta: `chrome.storage.local.get('anonymous_id', console.log)`
   - Debe mostrar un UUID consistente

3. **Verifica que el backend esté corriendo:**
   - `npm run dev` debe estar activo
   - http://localhost:3000 debe responder

4. **Verifica logs del backend:**
   - Terminal donde corre `npm run dev`
   - Buscar `[/api/session] ✅ Sesión registrada`
