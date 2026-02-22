# Setup Google OAuth — Confident

## ✅ Confirmación: Es 100% GRATIS

- Google Cloud OAuth es gratis para siempre
- Supabase maneja la integración gratis
- No necesitas tarjeta de crédito en Google Cloud
- Solo pagas si usas otros servicios de Google Cloud (que NO necesitas)

**Tiempo:** 5-7 minutos

---

## Paso 1: Crear credenciales OAuth en Google Cloud Console

### 1.1 Ir a Google Cloud Console
https://console.cloud.google.com

### 1.2 Crear proyecto (si no tienes uno)
1. Clic en el selector de proyectos (arriba izquierda)
2. "New Project"
3. Nombre: `Confident`
4. Clic "Create"

### 1.3 Habilitar Google+ API
1. Menú ☰ → "APIs & Services" → "Library"
2. Buscar: `Google+ API`
3. Clic en "Google+ API"
4. Clic "Enable"

### 1.4 Configurar OAuth Consent Screen
1. Menú ☰ → "APIs & Services" → "OAuth consent screen"
2. User Type: **External** (seleccionar y continuar)
3. Rellenar:
   - App name: `Confident`
   - User support email: tu email
   - Developer contact: tu email
4. Clic "Save and Continue"
5. **Scopes:** Clic "Save and Continue" (dejar vacío)
6. **Test users:** Agregar TU email como test user
7. Clic "Save and Continue"

### 1.5 Crear credenciales OAuth
1. Menú ☰ → "APIs & Services" → "Credentials"
2. Clic "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Confident Web Client`
5. **Authorized redirect URIs:** (⚠️ IMPORTANTE)
   - Clic "+ Add URI"
   - Pegar la URL de callback de tu proyecto Supabase:

   ```
   https://TU_PROJECT_ID.supabase.co/auth/v1/callback
   ```

   **¿Cómo obtener tu Project ID?**
   - Ve a tu dashboard de Supabase
   - Settings → API → Project URL
   - Ejemplo: `https://abcdefghijk.supabase.co`
   - Usa: `https://abcdefghijk.supabase.co/auth/v1/callback`

6. Clic "Create"
7. **COPIAR:**
   - Client ID (empieza con `...apps.googleusercontent.com`)
   - Client Secret (string largo)

---

## Paso 2: Configurar en Supabase

### 2.1 Ir a tu proyecto Supabase
https://supabase.com/dashboard → tu proyecto Confident

### 2.2 Habilitar Google Provider
1. Authentication → Providers (menú izquierdo)
2. Buscar "Google"
3. Toggle para **habilitar**
4. Pegar:
   - **Client ID** (de Google Cloud)
   - **Client Secret** (de Google Cloud)
5. Clic "Save"

---

## Paso 3: Reiniciar servidor y probar

### 3.1 Reiniciar Next.js
```bash
# Ctrl+C en terminal
npm run dev
```

### 3.2 Probar login
1. Ve a http://localhost:3000/auth?reason=limit_soft
2. Deberías ver botón **"Continuar con Google"** (nuevo)
3. Clic en el botón
4. Selecciona tu cuenta Google
5. Autorizar Confident
6. ✅ Deberías ver la página de éxito con "10 sesiones añadidas"

---

## ✅ Verificación

Si funciona correctamente:
- ✅ Clic en Google → ventana popup de Google
- ✅ Seleccionar cuenta → redirige a `/auth/success`
- ✅ Muestra "Cuenta creada con éxito"
- ✅ Muestra sesiones disponibles

---

## 🐛 Troubleshooting

### Error: "Access blocked: Confident has not completed the Google verification process"

**Solución:**
1. Google Cloud Console → OAuth consent screen
2. Agregar TU email en **Test users**
3. Mientras la app esté en modo "Testing", solo los test users pueden usarla

### Error: "redirect_uri_mismatch"

**Solución:**
1. Verificar que la URI de callback sea EXACTAMENTE:
   ```
   https://TU_PROJECT_ID.supabase.co/auth/v1/callback
   ```
2. Sin espacios, sin `/` al final
3. Debe estar en "Authorized redirect URIs" en Google Cloud

### El botón no aparece

**Solución:**
1. Verificar que reiniciaste el servidor (`npm run dev`)
2. Refrescar la página con Cmd+Shift+R (hard refresh)
3. Verificar consola del navegador por errores

---

## 📝 Notas importantes

### Magic Link vs Google OAuth

| Feature | Magic Link | Google OAuth |
|---------|-----------|--------------|
| Velocidad | ~30s (email) | ~5s (instant) |
| Rate limit | ❌ 3-4/hora | ✅ Sin límite |
| UX | Email extra step | ✅ 1 clic |
| Costo | Gratis | ✅ Gratis |

**Recomendación:** Usa Google OAuth como método principal.

### ¿Necesito publicar la app en Google?

**No.** Mientras esté en modo "Testing":
- Solo test users pueden acceder
- Perfecto para desarrollo y MVP
- Gratis para siempre
- Hasta 100 test users

**Para producción:**
- Necesitarás verificar la app (proceso de Google)
- O mantener en "Testing" si < 100 usuarios

---

## 🎯 Estado después de este setup

- ✅ Trigger Supabase funcionando (contador)
- ✅ Resend configurado (emails)
- ✅ Google OAuth funcionando (login)
- ✅ Página de éxito implementada

**Siguiente:** Mejoras UX y rediseño UI Apple.
