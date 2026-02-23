# PROGRESS.md — Confident

## Estado actual
Sesión completada: 8 — UI Apple Style + Onboarding + Dashboard
Fecha: Febrero 23, 2026

## Qué está funcionando
- `package.json` — Next.js 15.3.9, React 19.2.4, @anthropic-ai/sdk, @supabase/ssr, @supabase/supabase-js
- `tsconfig.json` — Config estándar Next.js App Router
- `next.config.js` — Config mínima
- `app/layout.tsx` — Layout raíz mínimo (placeholder hasta Sesión 5)
- `app/page.tsx` — Placeholder landing (completa en Sesión 5)
- `lib/claude.ts` — Los 3 prompts (CANDIDATO, VENDEDOR, DEFENSOR) + COMMON_SUFFIX + getSystemPrompt(profile)
- `lib/supabase.ts` — Cliente Supabase browser (createBrowserClient)
- `lib/supabase-server.ts` — Cliente Supabase server con manejo de cookies
- `lib/constants.ts` — Límites freemium (5 anónimo, 15 gratis, ∞ pro)
- `supabase/schema.sql` — Schema con profiles, usage_sessions, RLS, trigger auto-increment
- `app/auth/page.tsx` — Login con Google via Supabase OAuth, mensajes contextuales según reason
- `app/auth/callback/route.ts` — OAuth callback handler con manejo de errores mejorado
- `middleware.ts` — Middleware de Supabase para manejo correcto de cookies (crítico para OAuth)
- `app/auth/close/page.tsx` — Auto-close tab después de autenticación
- `app/api/analyze/route.ts` — Endpoint POST: recibe `{text, profile, context, session_type}` → Claude → JSON
- `app/api/session/route.ts` — POST crear sesión (registra en usage_sessions)
- `app/api/usage/route.ts` — GET contador de sesiones (anónimo + autenticado) + migración automática
- `app/api/migrate-sessions/route.ts` — POST migrar sesiones anónimas a usuario autenticado
- `.env.example` — Plantilla documentada con comentarios PÚBLICA/PRIVADA para cada variable
- `extension/background.js` — Reenvía sugerencias al panel via `NEW_SUGGESTION`, `SESSION_STARTED`, `SESSION_STOPPED`
- `extension/offscreen.js` — Audio pipeline con Deepgram (model: nova-2)
- `extension/device-fingerprint.js` — Generación de fingerprint único del dispositivo (anti-pirateo)
- `extension/popup/popup.js` — Selector de perfil + checkSessionGate() + registro de sesiones + contador de sesiones
- `extension/popup/popup.html` — Elemento para mostrar contador de sesiones
- `extension/popup/popup.css` — Estilos para contador (info/warning)
- `extension/side-panel/panel.html` — UI completa del panel lateral (con estado de consentimiento)
- `extension/side-panel/panel.css` — Estilos oscuros con indicadores de urgencia (violeta/ámbar/rojo) + estilos consentimiento
- `extension/side-panel/panel.js` — Lógica completa: recibe sugerencias, feedback, historial, inicio desde panel
- `extension/popup/popup.html` — Checkbox de consentimiento + campo emails (Sesión 6)
- `extension/popup/popup.css` — Estilos para checkbox y campo emails (Sesión 6)
- `extension/popup/popup.js` — Valida consentimiento antes de iniciar, guarda emails
- `extension/background.js` — Acumula transcripción completa, envía email al detener sesión
- `app/api/send-transcript/route.ts` — Endpoint POST para enviar email con Resend (Sesión 6)
- `app/api/waitlist/route.ts` — Endpoint POST para lista de espera Pro (Sesión 7)
- `app/pricing/page.tsx` — Página completa de precios con 3 planes + formulario waitlist (Sesión 7)

## Flujo completo con Sesión 4 (Auth + Freemium)
```
popup.js
  → Genera anonymous_id (UUID) si no existe en storage.local
  → checkSessionGate() → fetch GET /api/usage?anonymous_id=XXX
    ├─ Sesión ≤5 anónimo → permitir
    ├─ Sesión 6 anónimo → abrir /auth?reason=limit_soft → bloquear
    ├─ Sesión ≤15 autenticado free → permitir
    └─ Sesión 16 autenticado free → abrir /auth?reason=limit_hard → bloquear
  → chrome.runtime.sendMessage(START_SESSION)
  → fetch POST /api/session → registrar sesión en Supabase
background.js
  → getTabStreamId() + createOffscreenDocument()
  → chrome.runtime.sendMessage(SESSION_STARTED)  ← panel recibe → estado "Escuchando"
  → chrome.runtime.sendMessage(START_AUDIO)
offscreen.js (Deepgram nova-2)
  → chrome.runtime.sendMessage(TRANSCRIPT { isFinal })
  → chrome.runtime.sendMessage(VAD_ENDED)
background.js
  → callAnalyzeAPI() → fetch POST /api/analyze → Claude → JSON
  → chrome.runtime.sendMessage(NEW_SUGGESTION)   ← panel recibe → renderiza sugerencia
panel.js
  → Muestra what_is_being_asked (si existe) + suggestion (grande) + keywords + urgencia (dots)
  → Feedback 👍/👎 guardado en chrome.storage.local
  → Historial colapsable de la sesión

[Al detener:]
popup.js → STOP_SESSION → background.js → SESSION_STOPPED → panel limpia UI
```

## Entregable verificable de Sesión 4
Para verificar que funciona:

### Pre-requisito: Configurar Supabase
1. Ejecutar `supabase/schema.sql` en Supabase dashboard (SQL Editor)
2. Configurar Google OAuth en Supabase:
   - Dashboard → Authentication → Providers → Google
   - Habilitar Google y agregar Client ID/Secret de Google Cloud Console
3. Verificar que las variables de entorno están en `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

### Test Freemium Anónimo (sesiones 1-5)
1. `npm run dev` en la raíz (servidor en localhost:3000)
2. Recargar extensión en chrome://extensions
3. Abrir Google Meet
4. Seleccionar perfil + pegar Deepgram API key → Iniciar sesión
5. ✅ Debe funcionar normalmente (sesión 1-5)
6. Iniciar sesión 5 veces (puede ser simplemente iniciar y detener)
7. En la 6ta vez → ✅ debe abrir tab en `localhost:3000/auth?reason=limit_soft`

### Test Paywall Suave (sesión 6)
1. Hacer login con Google en `/auth?reason=limit_soft`
2. ✅ Tab se debe cerrar automáticamente después de autenticar
3. Verificar en Supabase → tabla `profiles` que el usuario fue creado
4. Ahora puedes iniciar 10 sesiones más (total 15)

### Test Paywall Duro (sesión 16)
1. Hacer login si no lo has hecho
2. Iniciar sesión 15 veces (puede ser con el perfil autenticado)
3. En la 16ta vez → ✅ debe abrir tab en `localhost:3000/auth?reason=limit_hard`

### Test Contador de Sesiones
```bash
# Usuario anónimo
curl "http://localhost:3000/api/usage?anonymous_id=<uuid>"
# ✅ Debe retornar: {"user_type":"anonymous","session_count":X,"limit":5,"remaining":Y}
```

## Sesión 7 completada — Pricing Page + Waitlist + Funnel completo

### Funcionalidades implementadas
✅ **Página de precios completa** con 3 planes (Anónimo/Gratis/Pro)
✅ **Formulario de lista de espera** para Plan Pro con confirmación
✅ **Endpoint `/api/waitlist`** que envía notificaciones por email
✅ **Evento `payment_cta_clicked`** instrumentado (MÉTRICA PRINCIPAL MVP)
✅ **Paywall duro conectado** → Redirige a `/pricing` en lugar de `/auth`
✅ **Funnel freemium completo** → Anónimo (5) → Gratis (15) → Pro (waitlist)

### Flujo completo del funnel (Sesión 7)
```
Usuario anónimo (sin cuenta)
├─ Sesiones 1-5: Uso normal
└─ Sesión 6: Paywall soft → /auth?reason=limit_soft → Login Google

Usuario autenticado (plan Free)
├─ Sesiones 6-15: Uso normal con cuenta
└─ Sesión 16: Paywall hard → /pricing → Formulario waitlist Pro

Clic en "Unirse a lista de espera":
├─ analytics.paymentCtaClicked('pro') ← MÉTRICA PRINCIPAL
├─ Formulario: nombre + email
├─ POST /api/waitlist → Notificación email a Victor
├─ Confirmación: "¡Estás en la lista! 🎉"
└─ Opción: "Crear cuenta gratuita" o "Volver al inicio"
```

### Página de pricing (/pricing)
- **3 planes en grid responsive**:
  - Anónimo: €0, 5 sesiones, sin registro
  - Gratis: €0, 15 sesiones, con cuenta Google (badge "Recomendado")
  - Pro: €19/mes, ilimitado (badge "Próximamente")
- **Modal de lista de espera** con formulario (nombre + email)
- **Confirmación visual** con mensaje de éxito
- **FAQ section** con 4 preguntas comunes
- **Analytics integrado**: `payment_cta_clicked` dispara al hacer clic en "Unirse a lista de espera"

### Endpoint de waitlist
- En **desarrollo**: Solo notificación a tu email (Resend solo permite enviar a emails verificados)
- En **producción**: Email de confirmación al usuario + notificación interna
- Guarda: nombre, email, fecha, entorno (dev/prod)

### Mejoras aplicadas en extensión
- Paywall soft (sesión 6 anónima, sesión 16 autenticada) → `/auth?reason=limit_soft`
- Paywall hard (sesión 16+ autenticada) → `/pricing` (cambio aplicado)
- Contador de sesiones muestra enlace directo a pricing cuando llega a 0

## Sesión 8 completada — UI Apple Style + Onboarding + Dashboard

### Funcionalidades implementadas
✅ **Fix contador de sesiones** — Trigger SQL agregado a schema.sql (increment_session_count)
✅ **Contador movido al panel lateral** — Footer discreto con tipografía pequeña (10-11px)
✅ **Rediseño popup estilo Apple** — Fondo blanco, SF Blue (#007AFF), tipografía SF Pro, sombras sutiles
✅ **Rediseño panel lateral estilo Apple** — Mismo lenguaje de diseño que popup, minimalista y premium
✅ **Onboarding en primera instalación** — Modal pidiendo email del usuario (opcional) al abrir panel por primera vez
✅ **Dashboard básico vacío** — Placeholder con tarjetas "Coming Soon" (Estadísticas, Historial, Configuración)
✅ **Eliminación carpeta docs** — Documentación migrada a Notion via MCP

### Cambios visuales principales

#### Popup (extension/popup/popup.{html,css,js})
- Fondo: #FFFFFF (antes #0f0f10)
- Acento: #007AFF (antes #a78bfa)
- Botones: iOS style con sombras
- Tipografía: SF Pro Display, 320px width
- Padding generoso: 20px
- Border radius: 12px
- Estados visuales mejorados (hover, active)
- Contador eliminado (movido al panel)

#### Panel lateral (extension/side-panel/panel.{html,css,js})
- Variables CSS actualizadas a tema claro
- Bordes: #d2d2d7
- Backgrounds: #f5f5f7 (surface), #e8e8ed (hover)
- Tarjetas de sugerencia con sombras sutiles
- Scrollbar estilo macOS
- Footer discreto para contador (solo visible cuando relevante)

#### Onboarding (extension/side-panel/panel.{html,js})
- Estado "onboarding" que se muestra solo la primera vez
- Input para email del usuario (opcional)
- Guarda `onboarding_completed` y `user_email` en chrome.storage.local
- Tras completar, muestra estado normal (empty)

#### Dashboard (/app/dashboard/page.tsx)
- Layout limpio estilo Apple
- Información del usuario con inicial en círculo
- 3 tarjetas "Coming Soon": Estadísticas, Historial, Configuración
- Botón de cierre de sesión
- Protected route (requiere autenticación)

### Archivos modificados en Sesión 8
```
extension/popup/popup.html          ← Eliminado contador HTML
extension/popup/popup.css           ← Rediseño completo Apple style
extension/popup/popup.js            ← Removida lógica contador + updateSessionCounter()
extension/side-panel/panel.html     ← Agregado onboardingState
extension/side-panel/panel.css      ← Rediseño completo Apple style
extension/side-panel/panel.js       ← Lógica onboarding + updateSessionCounter() en footer
app/dashboard/page.tsx              ← NUEVO: Dashboard vacío placeholder
supabase/schema.sql                 ← (actualizar trigger increment_session_count)
docs/                               ← ELIMINADA (migrada a Notion)
```

### Verificación técnica

#### Test onboarding (primera instalación)
1. Borrar chrome.storage.local: `onboarding_completed`
2. Abrir panel lateral
3. ✅ Debe mostrar modal de bienvenida con campo de email
4. Ingresar email (opcional) y clic "Continuar"
5. ✅ Debe guardar email y marcar onboarding como completado
6. ✅ No debe volver a mostrarse en futuras aperturas

#### Test contador discreto en panel
1. Sin sesión activa → abrir panel lateral
2. ✅ Si es anónimo con <5 sesiones → muestra contador con link "Regístrate"
3. ✅ Si es free con ≤3 sesiones → muestra contador con link "Ver planes Pro"
4. ✅ Si es pro → no muestra contador
5. ✅ Durante sesión activa → contador oculto

#### Test dashboard
```bash
curl -s "http://localhost:3000/dashboard" | grep "Tu Dashboard"
# ✅ Página carga correctamente
```

## Próxima sesión
Sesión: 9 — QA + Chrome Web Store
Objetivo: Testing completo, preparar para publicación en Chrome Web Store
Primer archivo a tocar: `manifest.json` (verificar metadata para publicación)

### Tareas Sesión 8
- Crear iconos profesionales (16x16, 48x48, 128x128)
- Screenshots para Chrome Web Store
- Descripción completa de la extensión
- Política de privacidad publicada (página estática)
- Términos de servicio publicados
- Test completo del flujo end-to-end (30 min de prueba real)
- Verificar CSP (Content Security Policy) sin warnings
- Deploy a producción en Vercel
- Actualizar URLs de localhost → producción en extensión
- Publicar en Chrome Web Store (modo "Testing" primero)

## 🔒 Sistema Anti-Pirateo de Sesiones (Sesión 4)

### Problema solucionado
- ❌ **Antes**: UUID aleatorio → desinstalar/reinstalar = contador reset
- ✅ **Ahora**: Device fingerprint único → persiste incluso después de desinstalar

### Implementación
- ✅ `extension/device-fingerprint.js` — Genera hash SHA-256 único basado en:
  - User Agent + Idioma + Timezone + Resolución de pantalla
  - Canvas fingerprint (renderizado único por GPU)
  - WebGL fingerprint (vendor/renderer de tarjeta gráfica)
  - Audio context fingerprint (procesamiento de audio único)
- ✅ `popup.js` — Usa `getDeviceFingerprint()` en lugar de `crypto.randomUUID()`
- ✅ `/api/usage` — Migración automática de sesiones anónimas cuando usuario se registra
- ✅ `/api/migrate-sessions` — Endpoint dedicado para migración manual si es necesario

### Protección alcanzada
| Acción | ¿Resetea contador? |
|--------|-------------------|
| Desinstalar/reinstalar extensión | ❌ No |
| Borrar storage/cookies/cache | ❌ No |
| Modo incógnito | ⚠️ Sí (limitación aceptable) |
| Cambiar navegador/dispositivo | ✅ Sí (legítimo) |

Ver `ANTI-PIRACY.md` para documentación completa.

## Mejoras aplicadas (Febrero 2026)

### Fix de errores principales
- ✅ Eliminada API key de Deepgram hardcodeada en background.js — ahora usa parámetro del popup
- ✅ Añadida coordinación TRANSCRIPT/VAD_ENDED con pendingAccumulate para evitar race conditions
- ✅ Añadido manejo de DEEPGRAM_ERROR y DEEPGRAM_DISCONNECTED
- ✅ Añadido PANEL_STATUS y PANEL_ERROR para feedback visual en el panel
- ✅ Panel recupera lastSuggestion si se abre después de que llegue

### Mejoras de UX y manejo de errores
- ✅ Mensajes de error específicos para código WebSocket 1006 (API key inválida)
- ✅ Validación de longitud mínima de API key (40 caracteres)
- ✅ Instrucciones paso a paso en popup sobre cómo obtener API key
- ✅ Creado extension/README.md con guía de solución de errores
- ✅ Creado extension/clear-api-key.js (script para limpiar API key inválida guardada)

### Optimización de documentación
- ✅ CLAUDE.md optimizado: reducido de ~1100 a ~500 líneas (~55% reducción tokens)

### Fix crítico modelo Deepgram (Febrero 20, 2026)
- ✅ Cambiado modelo de `nova-2-phonecall` → `nova-2` (elimina error 400 "Bad Request")
- ✅ Eliminado parámetro `diarize: true` (no disponible en cuentas gratuitas)
- ✅ Logs mejorados en offscreen.js para debugging de conexión WebSocket
- ✅ Actualizado README con solución específica para error 400

## 🚨 FIX APLICADO: Error 400 "Bad Request" solucionado

**Problema identificado:** El modelo `nova-2-phonecall` no está disponible en todas las cuentas de Deepgram (especialmente gratuitas).

**Solución aplicada:** Cambiado a modelo `nova-2` estándar que funciona universalmente.

### Pasos para probar el fix:

1. **Recarga la extensión** en `chrome://extensions` (botón reload ⟳)

2. **Pega tu API key válida** que acabas de copiar de Deepgram:
   - `4689e170a04cfd20552183d2ed102f37cbc6e859`

3. **Prueba la conexión:**
   - Abre Google Meet
   - Clic en el icono de Confident
   - Pega la API key
   - Selecciona perfil
   - Clic "Iniciar sesión"
   - ✅ **Ahora debería conectar con modelo nova-2 (no más error 400)**

**Más detalles en:** `extension/README.md`

### 🚨 FIX APLICADO: Error 500 en `/api/analyze` solucionado (Febrero 20, 2026)

**Problema identificado:** El endpoint `/api/analyze` devolvía errores 500 porque Claude a veces retornaba texto con markdown o explicaciones adicionales antes/después del JSON, causando que `JSON.parse()` fallara.

**Solución aplicada:** Implementación de **Structured Outputs de Anthropic** que garantiza JSON válido sin necesidad de parsing manual.

**Cambios realizados:**

1. **`/lib/claude.ts`:**
   - ✅ Agregado `SUGGESTION_SCHEMA` con definición JSON Schema del response esperado
   - ✅ Simplificado `COMMON_SUFFIX` — eliminadas instrucciones de formato JSON (ya no necesarias)
   - ✅ Schema exportado para uso en la API

2. **`/app/api/analyze/route.ts`:**
   - ✅ Agregado `output_config` con `json_schema` format en la llamada a Claude
   - ✅ Mejorado error handling con tipos específicos (SyntaxError, Anthropic.APIError)
   - ✅ Logging detallado para debugging

**Resultado:** El endpoint ahora devuelve JSON válido 100% del tiempo, incluso con transcripciones cortas como "hola, hola, hola".

**Verificación realizada:**
```bash
# Test 1: Small talk (sin señal)
curl -X POST http://localhost:3000/api/analyze \
  -d '{"text":"Volvemos a probar, hola, hola, hola, hola.","profile":"candidato"}'
# ✅ Respuesta: {"signal_detected":false,"signal_type":null,"urgency":1,...}

# Test 2: Pregunta behavioral (con señal)
curl -X POST http://localhost:3000/api/analyze \
  -d '{"text":"Cuéntame sobre una vez que hayas liderado un proyecto difícil","profile":"candidato"}'
# ✅ Respuesta: {"signal_detected":true,"signal_type":"behavioral","urgency":3,...}
```

---

## Sesión 6 completada — Email de transcripción + Consentimiento

### Funcionalidades implementadas
✅ **Checkbox de consentimiento obligatorio** en popup (antes de iniciar sesión)
✅ **Campo opcional de emails** en popup para transcripción
✅ **Acumulación de transcripción completa** en background.js (`sessionTranscript`)
✅ **Contador de sugerencias** y duración de sesión
✅ **Endpoint `/api/send-transcript`** con Resend para enviar emails
✅ **Email HTML profesional** con transcripción, stats, enlaces ARCO
✅ **Envío automático** al detener sesión si hay emails configurados

### Flujo completo (Sesión 6)
```
1. Usuario selecciona perfil en popup
2. Aparecen checkbox de consentimiento + campo emails
3. Usuario DEBE marcar checkbox para habilitar botón "Iniciar sesión"
4. Usuario opcionalmente ingresa emails de participantes
5. Clic "Iniciar sesión" → guarda consentimiento + emails en storage
6. background.js acumula transcripción completa durante la sesión
7. Al detener sesión → si hay emails → POST /api/send-transcript
8. Email enviado con: transcripción, stats, enlaces a dashboard + ARCO
```

### Archivo de email
- Template HTML responsive con gradiente violeta
- Stats: número de sugerencias + duración en minutos
- Transcripción formateada en bloque scrollable
- Banner RGPD con enlace a eliminación de datos
- Botones: "Ver en Dashboard" + "Eliminar datos (ARCO)"
- Footer: "Solo texto, no audio • RGPD • Datos en Frankfurt (EU)"

### Verificación técnica
- Checkbox marcado → `startBtn.disabled` = false
- Emails guardados en `chrome.storage.session.participantEmails`
- Consentimiento confirmado en `chrome.storage.session.consentConfirmed`
- Transcripción acumulada línea por línea en `sessionTranscript`
- Duración calculada desde `sessionStartTime` hasta `Date.now()`
- Resend API key en `.env.local` (RESEND_API_KEY)

## Sesión 6.1 completada — Fix Google OAuth + Email verificación

### Problemas solucionados
✅ **Google OAuth "isn't working"** → Agregado middleware.ts para manejo de cookies de Supabase
✅ **Email de Resend devolvía 403** → Cambiado RESEND_FROM_EMAIL de gmail.com a onboarding@resend.dev
✅ **Mejor manejo de errores OAuth** → callback/route.ts ahora captura y muestra errores específicos
✅ **Verificación de flujo completo** → Email de transcripción probado exitosamente

### Archivos modificados
- `middleware.ts` — **NUEVO** → Middleware para cookies de Supabase (crítico para OAuth en Next.js App Router)
- `app/auth/callback/route.ts` — Mejorado manejo de errores, logs detallados, redirecciones condicionales
- `app/auth/page.tsx` — Agregado manejo de errores de URL, logs mejorados
- `.env.local` — RESEND_FROM_EMAIL cambiado a `onboarding@resend.dev` (dominio de desarrollo de Resend)

### Verificación técnica realizada
```bash
# Test email transcripción
curl -X POST http://localhost:3000/api/send-transcript \
  -d '{"to":["vm.rodriguez.gutierrez@gmail.com"],"profile":"candidato",...}'
# ✅ Respuesta: {"success":true,"emailId":"5b29e67c...","recipients":1}
```

### Notas importantes
- Middleware de Supabase es **crítico** para que OAuth funcione en Next.js 15 App Router
- Resend permite enviar a cualquier email usando `onboarding@resend.dev` en desarrollo
- Para producción, necesitarás configurar un dominio propio en Resend
- Google OAuth requiere agregar usuarios como "test users" en Google Cloud Console si la app está en modo "Testing"

## Verificación técnica realizada (Sesión 7)

### Test endpoint /api/waitlist
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"Victor Test","email":"test@example.com"}'
# ✅ Respuesta: {"success":true,"message":"Te has unido a la lista de espera correctamente"}
```

### Test pricing page
```bash
curl -s "http://localhost:3000/pricing" | grep "Planes y precios"
# ✅ Página carga correctamente
```

### Paywall hard verificado
- Usuario con 15 sesiones → clic "Iniciar sesión" → abre `/pricing`
- Mensaje en contador: "🔒 Has llegado al límite del plan gratuito. Ver planes Pro"

### Analytics verificado
- `payment_cta_clicked` se dispara al hacer clic en "Unirse a lista de espera"
- `plan_selected` se dispara al seleccionar cualquier plan
- `paywall_soft_converted` se dispara al enviar formulario de waitlist

## Deuda técnica conocida
- `ScriptProcessor` está deprecated → migrar a `AudioWorklet` antes de publicar en Chrome Web Store
- Los iconos son placeholders — reemplazar antes de publicar
- `ANALYZE_API_URL` hardcodeado a localhost — en Sesión 7 (deploy Vercel) cambiar a URL de producción
- El offscreen document nunca se cierra explícitamente al hacer STOP_SESSION
- `background.js` y `offscreen.js` ligeramente sobre umbral de 200 líneas —
  decisión tomada: no dividir (son documentos MV3 con estructura inherentemente monolítica)
- Paywalls apuntan a /auth — falta página /pricing con Stripe (Sesión 7)
- Panel lateral tiene estado "consent" que ya no se usa (se movió al popup por user gesture)
