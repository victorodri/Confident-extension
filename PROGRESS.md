# PROGRESS.md — Confident

## Estado actual
Sesión completada: 3 — Panel Lateral Funcional
Fecha: Febrero 2026

## Qué está funcionando
- `package.json` — Next.js 15.3.9, React 19.2.4, @anthropic-ai/sdk
- `tsconfig.json` — Config estándar Next.js App Router
- `next.config.js` — Config mínima
- `app/layout.tsx` — Layout raíz mínimo (placeholder hasta Sesión 5)
- `app/page.tsx` — Placeholder landing (completa en Sesión 5)
- `lib/claude.ts` — Los 3 prompts (CANDIDATO, VENDEDOR, DEFENSOR) + COMMON_SUFFIX + getSystemPrompt(profile)
- `app/api/analyze/route.ts` — Endpoint POST: recibe `{text, profile, context, session_type}` → Claude → JSON
- `.env.example` — Plantilla documentada con comentarios PÚBLICA/PRIVADA para cada variable
- `extension/background.js` — Reenvía sugerencias al panel via `NEW_SUGGESTION`, `SESSION_STARTED`, `SESSION_STOPPED`
- `extension/offscreen.js` — Audio pipeline con Deepgram (model: nova-2-phonecall)
- `extension/side-panel/panel.html` — UI completa del panel lateral
- `extension/side-panel/panel.css` — Estilos oscuros con indicadores de urgencia (violeta/ámbar/rojo)
- `extension/side-panel/panel.js` — Lógica completa: recibe sugerencias, feedback, historial

## Flujo completo de Sesión 3
```
popup.js
  → chrome.runtime.sendMessage(START_SESSION)
background.js
  → getTabStreamId() + createOffscreenDocument()
  → chrome.runtime.sendMessage(SESSION_STARTED)  ← panel recibe → estado "Escuchando"
  → chrome.runtime.sendMessage(START_AUDIO)
offscreen.js (Deepgram nova-2-phonecall)
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

## Entregable verificable de Sesión 3
Para verificar que funciona:
1. `npm run dev` en la raíz (servidor en localhost:3000)
2. Recargar extensión en chrome://extensions
3. Abrir Google Meet
4. Clic en el icono de la extensión → abrir Side Panel (desde el botón de Chrome o el popup)
5. Seleccionar perfil + pegar Deepgram API key → Iniciar sesión
6. El panel debe mostrar "Escuchando..." con animación de puntos
7. Hablar — en el panel aparece la sugerencia con:
   - Banner "LO QUE TE PREGUNTAN" (si hay contexto)
   - Sugerencia grande en "QUÉ HACER AHORA"
   - Keywords como chips violetas
   - Indicador de urgencia (1-3 puntos: violeta/ámbar/rojo)
   - Botones 👍/👎
8. Las sugerencias se acumulan en el historial colapsable

## Próxima sesión
Sesión: 4 — Autenticación y Lógica Freemium
Objetivo: Login con Google + contador de sesiones + paywalls
Primer archivo a tocar: `supabase/schema.sql` (ejecutar en Supabase dashboard)

### Archivos a crear en Sesión 4
- `supabase/schema.sql` — Schema completo con RLS (copiar de CLAUDE.md §7)
- `lib/supabase.ts` — Cliente Supabase (browser)
- `lib/supabase-server.ts` — Cliente Supabase (server, service role)
- `app/login/page.tsx` — Login con Google (1 clic via Supabase Auth)
- `app/api/session/route.ts` — POST crear sesión / PATCH cerrar sesión
- `app/api/usage/route.ts` — GET contador de sesiones

### Archivos a modificar en Sesión 4
- `extension/background.js` — Gestionar JWT de Supabase y contador de sesiones
- `extension/side-panel/panel.js` — Mostrar paywalls (sesión 6 sin cuenta, sesión 16 con cuenta)
- `extension/popup/popup.js` — Mostrar estado de cuenta / sesiones restantes

### Contexto importante para Sesión 4
- El funnel freemium: sesiones 1-5 anónimas → sesión 6 paywall suave → sesiones 6-15 gratis → sesión 16 paywall duro
- anonymous_id se genera en chrome.storage.local al instalar (UUID)
- Al hacer login, migrar anonymous_id al perfil autenticado en Supabase
- JWT de Supabase se guarda en chrome.storage.sync
- El endpoint /api/analyze debe validar JWT + verificar límite antes de llamar a Claude

## Deuda técnica conocida
- `ScriptProcessor` está deprecated → migrar a `AudioWorklet` antes de publicar en Chrome Web Store
- Los iconos son placeholders — reemplazar antes de publicar
- No hay autenticación ni freemium (Sesión 4)
- `ANALYZE_API_URL` hardcodeado a localhost — en Sesión 7 (deploy Vercel) cambiar a URL de producción
- El offscreen document nunca se cierra explícitamente al hacer STOP_SESSION
- `background.js` (222 líneas) y `offscreen.js` (219 líneas) ligeramente sobre umbral de 200 líneas —
  decisión tomada: no dividir (son documentos MV3 con estructura inherentemente monolítica)
