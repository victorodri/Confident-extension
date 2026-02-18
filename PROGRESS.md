# PROGRESS.md — Confident

## Estado actual
Sesión completada: 2 — Pipeline de Análisis con Claude
Fecha: Febrero 2026

## Qué está funcionando
- `package.json` — Next.js 14.2.35, @anthropic-ai/sdk, TypeScript
- `tsconfig.json` — Config estándar Next.js App Router
- `next.config.js` — Config mínima
- `app/layout.tsx` — Layout raíz mínimo (placeholder hasta Sesión 5)
- `app/page.tsx` — Placeholder landing (completa en Sesión 5)
- `lib/claude.ts` — Los 3 prompts (CANDIDATO, VENDEDOR, DEFENSOR) + COMMON_SUFFIX + getSystemPrompt(profile)
- `app/api/analyze/route.ts` — Endpoint POST: recibe `{text, profile, context, session_type}` → Claude → JSON
- `.env.example` — Plantilla documentada de todas las variables
- `.env.local` — Creado localmente con ANTHROPIC_API_KEY real (en .gitignore, no se sube)
- `extension/background.js` — Añadidas funciones:
  - `accumulateFinalTranscript()` — acumula frases finales en chrome.storage.session
  - `callAnalyzeAPI()` — POST a /api/analyze con texto acumulado + contexto → loguea JSON
  - Al iniciar sesión se resetean `pendingText` y `contextBuffer`
- `extension/manifest.json` — Añadido `http://localhost:3000/*` a host_permissions

## Flujo de mensajes actual
```
popup.js
  → chrome.runtime.sendMessage(START_SESSION)
background.js
  → chrome.tabCapture.getMediaStreamId()  → streamId
  → chrome.offscreen.createDocument()
  → chrome.runtime.sendMessage(START_AUDIO + streamId)
offscreen.js
  → getUserMedia(streamId)
  → AudioContext + ScriptProcessor → PCM16
  → WebSocket Deepgram
  → chrome.runtime.sendMessage(TRANSCRIPT { isFinal })
background.js
  → si isFinal: accumulateFinalTranscript() → chrome.storage.session.pendingText
  → si VAD_ENDED: callAnalyzeAPI()
    → fetch POST localhost:3000/api/analyze
    → Claude (claude-sonnet-4-5-20250929) → JSON
    → console.log('[Confident] Sugerencia de Claude:', ...)
```

## Entregable verificable de Sesión 2
Para verificar que funciona:
1. `npm run dev` en la raíz del proyecto (servidor en localhost:3000)
2. Recargar extensión en chrome://extensions
3. Abrir Google Meet, iniciar sesión con un perfil
4. Hablar — en consola del Service Worker aparece:
```json
{
  "signal_detected": true,
  "signal_type": "behavioral",
  "urgency": 2,
  "what_is_being_asked": "...",
  "suggestion": "...",
  "keywords": [...],
  "speaker_detected": "other"
}
```

## Próxima sesión
Sesión: 3 — Panel Lateral Funcional
Objetivo: Mostrar las sugerencias de Claude en la UI real del panel lateral de Chrome
Primer archivo a tocar: `extension/side-panel/panel.html`

### Archivos a crear en Sesión 3
- `extension/side-panel/panel.html` — UI del panel lateral
- `extension/side-panel/panel.js` — Recibe mensajes del background y actualiza la UI
- `extension/side-panel/panel.css` — Estilos del panel

### Archivos a modificar en Sesión 3
- `extension/background.js` — Reenviar el JSON de Claude al side panel via `chrome.runtime.sendMessage`

### Diseño del panel (de CLAUDE.md §15)
```
┌─────────────────────────┐
│ 🔴 Sesión activa  [■]   │
├─────────────────────────┤
│ SUGERENCIA              │
│ [texto grande aquí]     │
├─────────────────────────┤
│ Contexto: [texto small] │
│ Keywords: tag1 tag2     │
├─────────────────────────┤
│ [👍] [👎]               │
├─────────────────────────┤
│ ▸ Historial (colapsado) │
└─────────────────────────┘
```

### Contexto importante para Sesión 3
- background.js ya tiene el JSON de Claude en `callAnalyzeAPI()` — solo hay que reenviarlo al panel
- El panel se comunica con background via `chrome.runtime.onMessage`
- El side panel ya está configurado en manifest.json (`side_panel.default_path`)
- El panel también debe mostrar el campo `what_is_being_asked` (nuevo en Sesión 2)
- La urgencia (1/2/3) debe reflejarse visualmente (color del borde o indicador)

## Deuda técnica conocida
- `ScriptProcessor` está deprecated → migrar a `AudioWorklet` antes de publicar en Chrome Web Store
- Los iconos son placeholders — reemplazar antes de publicar
- No hay autenticación ni freemium (Sesión 4)
- Next.js 14.2.35 tiene 2 vulnerabilidades DoS (no críticas para MVP local; para producción en Vercel revisar con `npm audit`)
- El offscreen document nunca se cierra explícitamente con `chrome.offscreen.closeDocument()` al hacer STOP_SESSION — añadir en iteración futura
- `ANALYZE_API_URL` hardcodeado a localhost — en Sesión 7 (deploy Vercel) cambiar a la URL de producción
