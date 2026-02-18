# PROGRESS.md — Confident

## Estado actual
Sesión completada: 1 — Proof of Concept de Audio (incluyendo fix MV3)
Fecha: Febrero 2026

## Qué está funcionando
- `extension/manifest.json` — Chrome MV3, permisos correctos (`tabCapture`, `offscreen`), apunta a background.js + popup + side-panel
- `extension/background.js` — Reescrito para MV3: usa `getMediaStreamId` + Offscreen Document. NO usa `tabCapture.capture()` (eliminado en MV3 para Service Workers)
- `extension/offscreen.html` + `extension/offscreen.js` — Nuevo. Offscreen Document con DOM completo que:
  - Llama a `getUserMedia` con `chromeMediaSource: 'tab'` usando el `streamId`
  - Crea AudioContext + ScriptProcessor → convierte Float32 a PCM16
  - Abre WebSocket con Deepgram (nova-2, español, diarización)
  - Reenvía transcripciones al background via `chrome.runtime.sendMessage`
- `extension/popup/popup.html` + `popup.js` — Selector de 3 perfiles + campo API key + botón Iniciar
- `extension/content-script.js` — Mínimo, notifica al background que Meet está activo
- `extension/icons/` — Iconos placeholder funcionales

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
  → chrome.runtime.sendMessage(TRANSCRIPT)
background.js
  → console.log("[Confident] [FINAL] [perfil:candidato] [hablante:0] ...")
```

## Verificado en producción
- Conexión Deepgram establecida en llamada de Google Meet real
- Transcripciones en tiempo real visibles en consola del Service Worker
- Formato de log: `[Confident] [FINAL] [perfil:candidato] [hablante:0] "texto"`

## Próxima sesión
Sesión: 2 — Pipeline de Análisis con Claude
Objetivo: Conectar las transcripciones con Claude y obtener JSON de sugerencia en consola

### Archivos a crear
- `app/api/analyze/route.ts` — Endpoint Next.js: recibe texto + perfil → llama a Claude → devuelve JSON
- `lib/claude.ts` — Wrapper Anthropic SDK con los 3 prompts por perfil (definidos en CLAUDE.md §8)

### Archivos a modificar
- `extension/background.js` — Añadir lógica que:
  1. Acumula frases finales (is_final) hasta detectar fin de enunciado (UtteranceEnd)
  2. Hace POST a `/api/analyze` con `{ text, profile, context (últimas 3 frases) }`
  3. Loguea el JSON de sugerencia en consola

### Contexto importante para la Sesión 2
- El offscreen document ya reenvía al background: `{ action: 'TRANSCRIPT', transcript, isFinal, speaker, profile }`
- El campo `is_final: true` + evento `UtteranceEnd` marca fin de frase → ese es el momento de llamar a Claude
- Los prompts completos (CANDIDATO, VENDEDOR, DEFENSOR) están en CLAUDE.md §8, listos para copiar a `lib/claude.ts`
- El modelo a usar: `claude-sonnet-4-6` (definido en CLAUDE.md §2)
- El JSON de respuesta de Claude debe tener: `signal_detected`, `signal_type`, `urgency`, `what_is_being_asked`, `suggestion`, `keywords`, `speaker_detected`
- La API de Analyze estará en Vercel — en desarrollo local usa `http://localhost:3000/api/analyze`
- La Deepgram API key viaja en `chrome.storage.local` (ya implementado en popup.js)
- La Anthropic API key va en `.env.local` del proyecto Next.js (NUNCA en la extensión)
- No hay autenticación en Sesión 2 — se añade en Sesión 4

### Entregable verificable de Sesión 2
En consola del Service Worker, tras hablar en Meet, aparece:
```json
{
  "signal_detected": true,
  "signal_type": "behavioral",
  "urgency": 2,
  "what_is_being_asked": "Te piden que describas una situación pasada con estructura.",
  "suggestion": "Usa STAR: empieza con el contexto, la tarea que tenías, la acción que tomaste y el resultado.",
  "keywords": ["STAR", "logro", "impacto"],
  "speaker_detected": "other"
}
```

## Deuda técnica conocida
- `ScriptProcessor` está deprecated → migrar a `AudioWorklet` antes de publicar en Chrome Web Store
- Los iconos son placeholders — reemplazar antes de publicar
- No hay side-panel todavía (se construye en Sesión 3)
- No hay autenticación ni freemium (Sesión 4)
- El offscreen document nunca se cierra explícitamente con `chrome.offscreen.closeDocument()` al hacer STOP_SESSION — añadir en iteración futura
