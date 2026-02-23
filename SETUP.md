# Confident - Guía de Configuración Completa

Guía paso a paso para configurar Confident en tu entorno local.

## Requisitos previos

- Node.js 18+ instalado
- Cuenta de Supabase (gratuita)
- Cuenta de Deepgram (gratuita, $200 crédito)
- Cuenta de Google Cloud Console (gratuita)
- Cuenta de Resend (gratuita, 3K emails/mes)

---

## 1. Configuración de Supabase

### 1.1 Crear proyecto

1. Ve a https://supabase.com/dashboard
2. Clic "New Project"
3. Nombre: `confident`
4. Database Password: genera una segura
5. Region: **Frankfurt (EU)** (RGPD compliance)
6. Clic "Create new project"
7. Espera 2-3 minutos

### 1.2 Ejecutar schema SQL

1. En tu proyecto → SQL Editor
2. Copia todo el contenido de `supabase/schema.sql`
3. Pégalo en el editor
4. Clic "Run"
5. ✅ Verifica que aparezcan las tablas:
   - `profiles`
   - `sessions`
   - `transcriptions`
   - `suggestions`

### 1.3 Configurar Google OAuth

1. **Authentication → Providers**
2. Buscar **"Google"**
3. Activar toggle **"Enable Sign in with Google"**
4. Dejar abierto (necesitarás pegar Client ID y Secret después)

### 1.4 Obtener variables de entorno

1. **Settings → API**
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (clic "Reveal") → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ NUNCA compartir

---

## 2. Configuración de Google Cloud Console

### 2.1 Crear proyecto

1. Ve a https://console.cloud.google.com/
2. Clic en selector de proyecto (arriba izquierda)
3. "New Project"
4. Nombre: `Confident`
5. Clic "Create"

### 2.2 Habilitar Google+ API

1. Menú hamburguesa → "APIs & Services" → "Library"
2. Buscar: `Google+ API`
3. Clic "Enable"

### 2.3 Configurar OAuth Consent Screen

1. "APIs & Services" → "OAuth consent screen"
2. Seleccionar: **External**
3. Clic "Create"
4. Completar:
   - App name: `Confident`
   - User support email: tu email
   - Developer contact: tu email
5. "Save and Continue"
6. Scopes: dejar vacío → "Save and Continue"
7. **Test users:** Agregar tu email → "Add Users" → "Save and Continue"
8. "Back to Dashboard"

### 2.4 Crear OAuth Client ID

1. "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Confident Web Client`
5. **Authorized redirect URIs:** Agregar:
   ```
   https://[TU-PROJECT-ID].supabase.co/auth/v1/callback
   ```
   Ejemplo: `https://pkjhfiagitkuxaxsiixx.supabase.co/auth/v1/callback`
6. Clic "Create"
7. **Copiar Client ID y Client Secret**

### 2.5 Completar configuración en Supabase

1. Volver a Supabase → Authentication → Providers → Google
2. Pegar **Client ID**
3. Pegar **Client Secret**
4. Clic "Save"
5. Esperar 1-2 minutos

---

## 3. Configuración de Deepgram

1. Ve a https://console.deepgram.com/signup
2. Regístrate gratis ($200 de crédito)
3. Crear proyecto: `Confident`
4. "API Keys" → "Create a New API Key"
5. Copiar la API key (empieza con un hash largo)
6. Guardar en: `DEEPGRAM_API_KEY`

---

## 4. Configuración de Resend

1. Ve a https://resend.com/signup
2. Regístrate gratis (3,000 emails/mes)
3. Verificar email
4. "API Keys" → "Create API Key"
5. Nombre: `Confident`
6. Copiar la key (empieza con `re_`)
7. Guardar en: `RESEND_API_KEY`

**Para desarrollo:**
- `RESEND_FROM_EMAIL=onboarding@resend.dev`

**Para producción:**
- Verificar dominio propio en Resend
- `RESEND_FROM_EMAIL=hola@tudominio.com`

---

## 5. Configurar variables de entorno

### 5.1 Crear archivo .env.local

```bash
cd /Users/victormanuelrodriguezgutierrez/Desktop/Confident
cp .env.example .env.local
```

### 5.2 Editar .env.local

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Deepgram
DEEPGRAM_API_KEY=tu_deepgram_api_key_aqui
NEXT_PUBLIC_DEEPGRAM_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pkjhfiagitkuxaxsiixx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Posthog (opcional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (preparado para futuro)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 6. Instalar dependencias y ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Servidor corriendo en: http://localhost:3000

---

## 7. Cargar extensión en Chrome

1. Abrir Chrome
2. Ve a `chrome://extensions`
3. Activar "Developer mode" (arriba derecha)
4. Clic "Load unpacked"
5. Seleccionar carpeta: `/Users/victormanuelrodriguezgutierrez/Desktop/Confident/extension`
6. ✅ Extensión cargada

---

## 8. Verificar instalación

### Test 1: Backend funcionando

```bash
curl http://localhost:3000/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Cuéntame sobre tu experiencia","profile":"candidato"}'
```

Debe retornar JSON con `signal_detected`, `suggestion`, etc.

### Test 2: Google OAuth funcionando

1. Ve a http://localhost:3000/auth
2. Clic "Continuar con Google"
3. ✅ Debe abrir popup de Google (sin error 400)
4. Autorizar
5. ✅ Tab se debe cerrar automáticamente
6. Verificar en Supabase → Authentication → Users → tu email aparece

### Test 3: Extensión funcionando

1. Abrir Google Meet (cualquier reunión)
2. Clic en icono de Confident
3. Seleccionar perfil (ej: Candidato)
4. Marcar checkbox de consentimiento
5. Clic "Iniciar sesión"
6. ✅ Panel lateral se abre automáticamente
7. ✅ Estado: "Escuchando..."
8. Hablar algo (o que alguien hable)
9. ✅ Debe aparecer tarjeta con sugerencia

---

## Troubleshooting

### Error: "missing OAuth secret"

**Causa:** Google OAuth no configurado en Supabase

**Solución:** Revisa paso 2 completo (Google Cloud Console + Supabase)

### Error: Deepgram 400 "Bad Request"

**Causa:** API key inválida o modelo incorrecto

**Solución:**
1. Verificar que la key sea correcta en `.env.local`
2. Recargar extensión en `chrome://extensions`

### Error: No llegan sugerencias al panel

**Causa:** Posiblemente en estado de onboarding

**Solución:**
1. Abrir panel lateral
2. F12 → Console
3. Ejecutar: `chrome.storage.local.set({onboarding_completed: true}, () => location.reload())`

### Error: CORS en /api/analyze

**Causa:** Servidor no está corriendo

**Solución:**
```bash
npm run dev
```

---

## Checklist final

- [ ] Supabase proyecto creado
- [ ] Schema SQL ejecutado
- [ ] Google OAuth configurado (Client ID + Secret)
- [ ] Deepgram API key obtenida
- [ ] Resend API key obtenida
- [ ] Archivo `.env.local` creado con todas las variables
- [ ] `npm install` ejecutado
- [ ] `npm run dev` corriendo
- [ ] Extensión cargada en Chrome
- [ ] Test de backend exitoso (curl)
- [ ] Test de Google OAuth exitoso
- [ ] Test de extensión exitoso (sugerencias aparecen)

---

## Próximos pasos

1. **Agregar más usuarios de prueba:**
   - Google Cloud Console → OAuth consent screen → Test users

2. **Configurar dominio para emails:**
   - Resend → Domains → Add domain

3. **Deploy a producción:**
   - Ver `DEPLOYMENT.md` (próximamente)

---

## Soporte

- Issues: https://github.com/anthropics/confident/issues
- Email: hola@tryconfident.com
- Documentación completa: Ver `CLAUDE.md` para detalles técnicos

---

**Última actualización:** Febrero 23, 2026
