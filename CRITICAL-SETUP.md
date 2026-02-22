# 🔴 SETUP CRÍTICO — Acción requerida antes de continuar

**IMPORTANTE:** Estos pasos deben completarse AHORA antes de continuar con las mejoras de UX y diseño.

---

## 1️⃣ Arreglar contador de sesiones (5 minutos)

### Problema
El contador siempre muestra "Quedan 5 sesiones" sin importar cuántas hayas usado.

### Solución
Ejecutar el trigger faltante en Supabase.

### Pasos
1. Ir a https://supabase.com/dashboard → tu proyecto
2. **SQL Editor** (menú izquierdo)
3. Copiar y pegar este SQL:

```sql
-- Trigger para incrementar contador de sesiones
CREATE OR REPLACE FUNCTION public.increment_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET total_sessions = total_sessions + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_created ON public.usage_sessions;

CREATE TRIGGER on_session_created
  AFTER INSERT ON public.usage_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.increment_session_count();
```

4. Clic **Run**
5. ✅ Verificar que no haya errores

**Ver detalles completos:** `SETUP-SUPABASE.md`

---

## 2️⃣ Configurar Resend para emails (10 minutos)

### Problema
Los emails de transcripción no se envían.

### Solución
Crear cuenta en Resend y agregar API key.

### Pasos

#### A. Crear cuenta
1. https://resend.com → Sign Up (gratis, 3K emails/mes)
2. Verificar email

#### B. Obtener API key
1. Dashboard → API Keys → Create API Key
2. Nombre: `Confident MVP`
3. Permiso: `Full Access`
4. **Copiar** la clave (empieza con `re_...`)

#### C. Verificar tu email (para desarrollo)
1. Dashboard → Domains → `onboarding@resend.dev` → Recipients
2. Agregar TU email personal
3. Verificar con el link que te envían

#### D. Agregar a .env.local
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### E. Reiniciar servidor
```bash
# Ctrl+C en la terminal del servidor
npm run dev
```

#### F. Testear
```bash
curl -X POST http://localhost:3000/api/send-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["TUEMAIL@example.com"],
    "profile": "candidato",
    "transcriptText": "Test",
    "suggestionsCount": 1,
    "duration": 1
  }'
```

**Respuesta esperada:**
```json
{"success":true,"emailId":"re_...","recipients":1}
```

**Ver detalles completos:** `SETUP-RESEND.md`

---

## 3️⃣ Configurar Google OAuth (5-7 minutos)

### Problema resuelto
- Magic link tenía rate limit (3-4 emails/hora)
- Ahora hay botón "Continuar con Google" (sin límites, instantáneo)

### Setup requerido
**Seguir instrucciones completas:** `SETUP-GOOGLE-OAUTH.md`

**Resumen rápido:**
1. Google Cloud Console → Crear proyecto "Confident"
2. Habilitar Google+ API
3. Crear OAuth Client ID
4. Copiar Client ID + Client Secret
5. Supabase → Authentication → Providers → Google
6. Pegar credenciales → Save

### Verificación
1. Ir a http://localhost:3000/auth?reason=limit_soft
2. Deberías ver botón **"Continuar con Google"**
3. Clic → ventana popup Google → autorizar
4. ✅ Redirige a `/auth/success` con "10 sesiones añadidas"

**Ver detalles completos:** `SETUP-GOOGLE-OAUTH.md`

---

## ✅ Checklist de verificación

Marca cuando completes cada paso:

- [x] Trigger de Supabase ejecutado sin errores ✅
- [ ] Cuenta de Resend creada y API key copiada
- [ ] Tu email personal verificado en Resend
- [ ] Variables `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en `.env.local`
- [ ] Servidor Next.js reiniciado (`npm run dev`)
- [ ] Test de email exitoso (curl devuelve `{"success":true}`)
- [ ] Credenciales Google OAuth creadas en Google Cloud
- [ ] Google OAuth configurado en Supabase
- [ ] Login con Google funciona → se ve página de éxito

---

## 🎯 Después de completar esto

Una vez hayas verificado que:
1. ✅ El contador funciona correctamente
2. ✅ Los emails se envían
3. ✅ El login muestra la página de éxito

**ENTONCES** podemos continuar con:
- Hacer el contador más discreto
- Pedir email en primera instalación
- Rediseñar UI estilo Apple
- Crear dashboard

---

## 🐛 Si algo no funciona

1. **Contador sigue sin funcionar**
   - Verificar que el trigger se ejecutó sin errores en Supabase
   - Ver `SETUP-SUPABASE.md` sección "Debug adicional"

2. **Email no se envía**
   - Verificar logs del servidor (`npm run dev`)
   - Tu email debe estar verificado en Resend Recipients
   - Ver `SETUP-RESEND.md` sección "Verificación"

3. **Login no redirige a success**
   - Verificar que `app/auth/callback/route.ts` apunta a `/auth/success`
   - Verificar que el servidor está corriendo

4. **Google OAuth no funciona**
   - Verificar que agregaste TU email como test user en Google Cloud
   - Verificar que la redirect URI sea exacta (con `/auth/v1/callback`)
   - Ver `SETUP-GOOGLE-OAUTH.md` sección "Troubleshooting"

---

**⏱️ Tiempo total estimado: 20-25 minutos**
