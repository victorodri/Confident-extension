# PROGRESS.md — Confident

## Estado actual
Sesión completada: 6 — Email de transcripción al finalizar sesión
Fecha: Febrero 2026

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
- `app/auth/callback/route.ts` — OAuth callback handler
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

## Próxima sesión
Sesión: 7 — Paywall Duro + Pricing Page + Stripe
Objetivo: Completar funnel freemium con página de precios y preparación de Stripe
Primer archivo a tocar: `app/pricing/page.tsx` (verificar estado actual)

### Archivos a crear/modificar en Sesión 7
- `app/pricing/page.tsx` — Página de precios completa con planes Free/Pro
- Integración Stripe test mode (arquitectura lista, botones sin activar)
- Instrumentar evento clave: `payment_cta_clicked` (métrica principal MVP)
- Verificar que paywall hard redirige correctamente a /pricing
- Formulario lista de espera para plan Pro (mientras no hay Stripe activo)

### Contexto importante para Sesión 7
- Página /pricing debe mostrar claramente los 3 niveles: Anónimo (5) / Free (15) / Pro (∞)
- Botón "Empezar Pro" → formulario lista espera (email + nombre)
- Evento `payment_cta_clicked` = MÉTRICA PRINCIPAL para validar willingness to pay
- No activar Stripe real todavía — solo arquitectura y UI
- Después de Sesión 7, solo quedará Sesión 8 (QA + Chrome Web Store)

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

## Deuda técnica conocida
- `ScriptProcessor` está deprecated → migrar a `AudioWorklet` antes de publicar en Chrome Web Store
- Los iconos son placeholders — reemplazar antes de publicar
- `ANALYZE_API_URL` hardcodeado a localhost — en Sesión 7 (deploy Vercel) cambiar a URL de producción
- El offscreen document nunca se cierra explícitamente al hacer STOP_SESSION
- `background.js` y `offscreen.js` ligeramente sobre umbral de 200 líneas —
  decisión tomada: no dividir (son documentos MV3 con estructura inherentemente monolítica)
- Paywalls apuntan a /auth — falta página /pricing con Stripe (Sesión 7)
- Panel lateral tiene estado "consent" que ya no se usa (se movió al popup por user gesture)
