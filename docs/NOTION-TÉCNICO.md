# Confident — Documentación Técnica

> **Arquitectura completa del sistema de asistencia en tiempo real**

---

## 📋 Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Chrome Extension (MV3)](#chrome-extension-mv3)
4. [Backend (Next.js API Routes)](#backend-nextjs-api-routes)
5. [Base de Datos (Supabase)](#base-de-datos-supabase)
6. [Integraciones Externas](#integraciones-externas)
7. [Flujo de Datos](#flujo-de-datos)
8. [Seguridad](#seguridad)
9. [Despliegue](#despliegue)
10. [Monitoreo y Analytics](#monitoreo-y-analytics)
11. [Performance](#performance)
12. [Testing](#testing)
13. [Deuda Técnica](#deuda-técnica)

---

## 🛠️ Stack Tecnológico

### Frontend

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework Web | Next.js App Router | 15.3.9 | SSR, API Routes, mismo repo |
| UI Framework | React | 19.2.4 | Ecosistema, rendimiento |
| Estilos | Tailwind CSS | 3.x | Desarrollo rápido, bundle pequeño |
| Componentes | shadcn/ui | Latest | Accesibles, customizables |
| Extensión | Vanilla JS | ES2022 | Sin build, máxima compatibilidad |

### Backend

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Runtime | Node.js | 20.x | Soporte Vercel |
| Hosting | Vercel Serverless | - | Deploy git, edge functions |
| Database | PostgreSQL (Supabase) | 15.x | ACID, RLS, triggers |
| Auth | Supabase Auth | - | OAuth, JWT, sesiones |
| ORM | Supabase Client | 2.x | Type-safe, RLS automático |

### APIs Externas

| Servicio | Propósito | Tier | Límite |
|----------|-----------|------|--------|
| Anthropic Claude | Análisis IA | Sonnet 4.6 | Pay-as-you-go |
| Deepgram Nova-2 | Transcripción | Free | $200 crédito |
| Posthog | Analytics | EU Cloud | 1M eventos/mes |
| Resend | Emails | Free | 3K emails/mes |
| Stripe | Pagos (prep) | Test | N/A MVP |

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    GOOGLE CHROME                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           CONFIDENT EXTENSION (MV3)              │  │
│  │                                                  │  │
│  │  ┌─────────────┐  ┌──────────────┐             │  │
│  │  │   POPUP     │  │  SIDE PANEL  │             │  │
│  │  │  (UI/UX)    │  │  (Sugest.)   │             │  │
│  │  └──────┬──────┘  └──────▲───────┘             │  │
│  │         │                 │                     │  │
│  │         ▼                 │                     │  │
│  │  ┌──────────────────────────────┐              │  │
│  │  │   BACKGROUND.JS              │              │  │
│  │  │   (Service Worker)           │              │  │
│  │  │   • chrome.tabCapture        │              │  │
│  │  │   • getUserMedia             │              │  │
│  │  │   • AudioContext Mixer       │◄─────────┐   │  │
│  │  │   • Session Management       │          │   │  │
│  │  └──────────┬───────────────────┘          │   │  │
│  │             │                               │   │  │
│  │             ▼                               │   │  │
│  │  ┌──────────────────────────────┐          │   │  │
│  │  │   OFFSCREEN.JS               │          │   │  │
│  │  │   (Audio Pipeline)           │          │   │  │
│  │  │   • WebSocket ──────────┐    │          │   │  │
│  │  │   • AudioWorklet        │    │          │   │  │
│  │  └─────────────────────────┼────┘          │   │  │
│  └────────────────────────────┼───────────────┘   │  │
└───────────────────────────────┼───────────────────┘  │
                                 │                      │
                    ┌────────────▼──────────┐           │
                    │   DEEPGRAM API        │           │
                    │   (WebSocket)         │           │
                    │   • nova-2 model      │           │
                    │   • streaming STT     │           │
                    └────────────┬──────────┘           │
                                 │ transcription        │
                                 ▼                      │
                    ┌─────────────────────────┐         │
                    │   BACKGROUND.JS         │◄────────┘
                    │   (recibe transcript)   │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP POST
                                 ▼
┌──────────────────────────────────────────────────────────┐
│                   VERCEL (Next.js)                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              API ROUTES                            │ │
│  │                                                    │ │
│  │  POST /api/analyze                                 │ │
│  │    ├─ Valida JWT                                   │ │
│  │    ├─ Llama Claude API                             │ │
│  │    └─ Retorna JSON estructurado                    │ │
│  │                                                    │ │
│  │  POST /api/session                                 │ │
│  │    └─ Crea registro en Supabase                    │ │
│  │                                                    │ │
│  │  GET /api/usage                                    │ │
│  │    ├─ Consulta contador sesiones                   │ │
│  │    └─ Migra anónimo → autenticado                  │ │
│  │                                                    │ │
│  │  POST /api/send-transcript                         │ │
│  │    └─ Envía email via Resend                       │ │
│  └─────────────────┬──────────────────────────────────┘ │
│                    │                                    │
│                    ▼                                    │
│         ┌──────────────────────┐                        │
│         │  ANTHROPIC API       │                        │
│         │  claude-sonnet-4.6   │                        │
│         │  Structured Outputs  │                        │
│         └──────────┬───────────┘                        │
│                    │ JSON response                      │
│                    ▼                                    │
│              (retorna a extension)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │   SUPABASE (Frankfurt)  │
        │                         │
        │  • auth.users           │
        │  • profiles             │
        │  • sessions             │
        │  • transcriptions       │
        │  • suggestions          │
        │                         │
        │  RLS Policies activas   │
        └─────────────────────────┘
```

---

## 🧩 Chrome Extension (MV3)

### Manifest V3

```json
{
  "manifest_version": 3,
  "name": "Confident",
  "version": "0.1.0",
  "description": "Tu confidente silencioso en conversaciones importantes",

  "permissions": [
    "tabCapture",      // Captura audio de la pestaña
    "activeTab",       // Interacción con pestaña activa
    "storage",         // chrome.storage.local y .sync
    "sidePanel",       // Panel lateral
    "scripting"        // Inyección content scripts
  ],

  "host_permissions": [
    "https://meet.google.com/*",
    "https://*.vercel.app/*",
    "https://tryconfident.com/*"
  ],

  "background": {
    "service_worker": "background.js",
    "type": "module"
  },

  "content_scripts": [{
    "matches": ["https://meet.google.com/*"],
    "js": ["content-script.js"],
    "run_at": "document_idle"
  }],

  "side_panel": {
    "default_path": "side-panel/panel.html"
  },

  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### Arquitectura de Componentes

#### 1. background.js (Service Worker)

**Responsabilidades:**
- Orquestar captura de audio (tab + micrófono)
- Crear offscreen document para pipeline Deepgram
- Recibir transcripciones y llamar `/api/analyze`
- Reenviar sugerencias al side panel
- Gestionar estado de sesión en `chrome.storage.session`

**Mensajes que escucha:**
```javascript
START_SESSION    // Desde popup
STOP_SESSION     // Desde popup/panel
TRANSCRIPT       // Desde offscreen.js
VAD_ENDED        // Desde offscreen.js (fin de frase)
NEW_SUGGESTION   // Propio, reenvía a panel
```

**Mensajes que envía:**
```javascript
SESSION_STARTED  // A panel (estado "Escuchando")
SESSION_STOPPED  // A panel (limpiar UI)
START_AUDIO      // A offscreen.js (iniciar Deepgram)
STOP_AUDIO       // A offscreen.js (cerrar WebSocket)
NEW_SUGGESTION   // A panel (renderizar sugerencia)
PANEL_STATUS     // A panel (estados intermedios)
PANEL_ERROR      // A panel (errores de API)
```

**Estado persistente:**
```javascript
// chrome.storage.session (dura mientras extensión activa)
{
  isSessionActive: boolean,
  currentProfile: 'candidato' | 'vendedor' | 'defensor',
  sessionId: string (UUID),
  accumulatedTranscript: string,
  lastSuggestion: SuggestionData | null
}

// chrome.storage.local (persiste siempre)
{
  anonymous_id: string (device fingerprint),
  deepgramApiKey: string (encriptado),
  selectedProfile: string,
  sessionHistory: Session[]
}
```

**Crítico:**
- ❌ NUNCA variables globales (Service Worker puede terminar)
- ✅ SIEMPRE usar `chrome.storage` para estado
- ✅ Timeouts máximo 8s para llamadas API

---

#### 2. offscreen.js (Audio Pipeline)

**Propósito:** Ejecutar Web Audio API en contexto DOM (Service Workers no tienen acceso).

**Flujo de audio:**
```javascript
// 1. Recibe streams del background
tabStream = await navigator.mediaDevices.getUserMedia({
  audio: { mandatory: { chromeMediaSource: 'tab' }}
});
micStream = await navigator.mediaDevices.getUserMedia({
  audio: true
});

// 2. Mezcla con AudioContext
const audioContext = new AudioContext({ sampleRate: 16000 });
const tabSource = audioContext.createMediaStreamSource(tabStream);
const micSource = audioContext.createMediaStreamSource(micStream);
const destination = audioContext.createMediaStreamDestination();

tabSource.connect(destination);
micSource.connect(destination);

// 3. Procesa con ScriptProcessor (TODO: migrar a AudioWorklet)
const processor = audioContext.createScriptProcessor(4096, 1, 1);
processor.onaudioprocess = (e) => {
  const float32Array = e.inputBuffer.getChannelData(0);
  const int16Array = convertToInt16(float32Array);

  // Envía a Deepgram via WebSocket
  if (deepgramSocket.readyState === WebSocket.OPEN) {
    deepgramSocket.send(int16Array);
  }
};
```

**WebSocket Deepgram:**
```javascript
const wsUrl = `wss://api.deepgram.com/v1/listen?` +
  `model=nova-2&` +
  `language=es&` +
  `punctuate=true&` +
  `interim_results=true&` +
  `vad_events=true`;

const socket = new WebSocket(wsUrl, ['token', DEEPGRAM_API_KEY]);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'Results') {
    const transcript = data.channel.alternatives[0].transcript;
    const isFinal = data.is_final;

    chrome.runtime.sendMessage({
      type: 'TRANSCRIPT',
      transcript,
      isFinal
    });
  }

  if (data.type === 'SpeechStarted') {
    // VAD detectó inicio de habla
  }
};
```

**Optimizaciones:**
- Buffer size: 4096 samples (256ms @ 16kHz)
- Formato: PCM 16-bit mono 16kHz
- Envío continuo (no batch)

**Errores comunes:**
- `1006` WebSocket close → API key inválida
- `400 Bad Request` → Modelo no disponible en cuenta
- `401 Unauthorized` → API key expirada

---

#### 3. popup/popup.js (UI Control)

**Responsabilidades:**
- Renderizar selector de perfil
- Validar y guardar API key de Deepgram
- Llamar `checkSessionGate()` antes de iniciar
- Enviar `START_SESSION` a background
- Mostrar contador de sesiones

**Lógica de control de acceso:**
```javascript
async function checkSessionGate() {
  // 1. Generar/recuperar device fingerprint
  const anonymousId = await getDeviceFingerprint();

  // 2. Consultar backend
  const response = await fetch(
    `${API_URL}/api/usage?anonymous_id=${anonymousId}`,
    {
      headers: {
        'Authorization': `Bearer ${jwtToken || ''}`
      }
    }
  );

  const data = await response.json();
  // {
  //   user_type: 'anonymous' | 'authenticated',
  //   session_count: 3,
  //   limit: 5,
  //   remaining: 2
  // }

  // 3. Evaluar límites
  if (data.remaining === 0) {
    if (data.user_type === 'anonymous') {
      // Paywall suave → /auth?reason=limit_soft
      chrome.tabs.create({ url: `${APP_URL}/auth?reason=limit_soft` });
      return false;
    } else {
      // Paywall duro → /auth?reason=limit_hard
      chrome.tabs.create({ url: `${APP_URL}/auth?reason=limit_hard` });
      return false;
    }
  }

  // 4. Permitir inicio
  return true;
}
```

**Validación API key:**
```javascript
function validateDeepgramKey(key) {
  // Mínimo 40 caracteres
  if (key.length < 40) {
    return { valid: false, error: 'API key muy corta' };
  }

  // Guardado encriptado (SubtleCrypto)
  return { valid: true };
}
```

---

#### 4. side-panel/panel.js (UI Suggestions)

**Responsabilidades:**
- Escuchar mensajes `NEW_SUGGESTION` del background
- Renderizar sugerencias con formato
- Permitir feedback (👍/👎)
- Mostrar historial de sesión
- Actualizar transcripción en tiempo real

**Renderizado de sugerencia:**
```javascript
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'NEW_SUGGESTION') {
    const suggestion = message.data;
    // {
    //   signal_detected: true,
    //   signal_type: 'behavioral',
    //   urgency: 3,
    //   what_is_being_asked: 'Ejemplo de liderazgo...',
    //   suggestion: 'Usa STAR: Situación...',
    //   keywords: ['liderazgo', 'STAR'],
    //   speaker_detected: 'other'
    // }

    renderSuggestion(suggestion);
    addToHistory(suggestion);

    // Posthog analytics
    posthog.capture('suggestion_shown', {
      profile: currentProfile,
      signal_type: suggestion.signal_type,
      urgency: suggestion.urgency
    });
  }
});

function renderSuggestion(data) {
  const urgencyDots = getUrgencyDots(data.urgency);
  const card = `
    <div class="suggestion-card urgency-${data.urgency}">
      <div class="urgency-indicator">${urgencyDots}</div>
      <div class="signal-type">${data.signal_type.toUpperCase()} — URGENCIA ${data.urgency}</div>

      <div class="context">
        <strong>QUÉ SE PIDE:</strong>
        <p>${data.what_is_being_asked}</p>
      </div>

      <div class="suggestion-text">
        <strong>SUGERENCIA:</strong>
        <p>${data.suggestion}</p>
      </div>

      <div class="keywords">
        ${data.keywords.map(kw => `<span class="keyword-chip">${kw}</span>`).join('')}
      </div>

      <div class="feedback">
        <button onclick="sendFeedback(true)">👍</button>
        <button onclick="sendFeedback(false)">👎</button>
      </div>
    </div>
  `;

  document.getElementById('suggestion-container').innerHTML = card;
}
```

**Persistencia de feedback:**
```javascript
function sendFeedback(helpful) {
  // Guardar local
  chrome.storage.local.get(['sessionHistory'], (data) => {
    const history = data.sessionHistory || [];
    const lastSession = history[history.length - 1];
    lastSession.feedback.push({ helpful, timestamp: Date.now() });
    chrome.storage.local.set({ sessionHistory: history });
  });

  // Enviar a analytics
  posthog.capture('suggestion_rated', {
    helpful,
    signal_type: currentSuggestion.signal_type
  });
}
```

---

#### 5. device-fingerprint.js (Anti-Piracy)

**Propósito:** Generar ID único persistente basado en características del dispositivo.

**Técnicas de fingerprinting:**
```javascript
async function getDeviceFingerprint() {
  const components = [];

  // 1. User Agent
  components.push(navigator.userAgent);

  // 2. Idioma y timezone
  components.push(navigator.language);
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // 3. Resolución de pantalla
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // 4. Canvas fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Confident', 2, 15);
  components.push(canvas.toDataURL());

  // 5. WebGL fingerprint
  const gl = canvas.getContext('webgl');
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
  components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));

  // 6. Audio context fingerprint
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const analyser = audioCtx.createAnalyser();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;
  oscillator.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start(0);
  const freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqData);
  oscillator.stop();
  components.push(freqData.join(''));

  // Hash SHA-256
  const data = components.join('|||');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

**Resistencia:**
- ✅ Desinstalar/reinstalar extensión → Mismo ID
- ✅ Borrar cookies/storage → Mismo ID
- ❌ Modo incógnito → Nuevo ID (limitación aceptable)
- ✅ Navegador diferente → Nuevo ID (legítimo)

---

## 🖥️ Backend (Next.js API Routes)

### Estructura de Carpetas

```
app/
├── api/
│   ├── analyze/
│   │   └── route.ts          // POST - Análisis Claude
│   ├── session/
│   │   └── route.ts          // POST - Crear sesión
│   ├── usage/
│   │   └── route.ts          // GET - Contador + migración
│   ├── migrate-sessions/
│   │   └── route.ts          // POST - Migración manual
│   └── send-transcript/
│       └── route.ts          // POST - Email transcripción
│
├── auth/
│   ├── page.tsx              // Login con Google
│   ├── callback/
│   │   └── route.ts          // OAuth callback
│   └── close/
│       └── page.tsx          // Auto-close post-auth
│
├── dashboard/
│   └── page.tsx              // Dashboard usuario (Sesión 6+)
│
├── pricing/
│   └── page.tsx              // Planes (Sesión 7)
│
├── layout.tsx                // Root layout + Posthog
└── page.tsx                  // Landing page

lib/
├── claude.ts                 // Prompts + getSystemPrompt()
├── supabase.ts               // Cliente browser
├── supabase-server.ts        // Cliente server con cookies
├── analytics.ts              // Posthog wrapper (Sesión 5)
└── constants.ts              // LIMITS freemium
```

---

### API Endpoints

#### POST /api/analyze

**Propósito:** Recibir texto transcrito y retornar sugerencia estructurada de Claude.

**Request:**
```typescript
interface AnalyzeRequest {
  text: string;              // Transcripción acumulada
  profile: 'candidato' | 'vendedor' | 'defensor';
  context?: string;          // Contexto adicional (ej. keywords previas)
  session_type?: string;     // Tipo de reunión (opcional)
}
```

**Response:**
```typescript
interface AnalyzeResponse {
  signal_detected: boolean;
  signal_type: string | null;      // 'behavioral', 'objection_price', etc.
  urgency: 1 | 2 | 3;
  what_is_being_asked: string | null;
  suggestion: string | null;
  keywords: string[];
  speaker_detected: 'user' | 'other' | 'unknown';
}
```

**Implementación:**
```typescript
// app/api/analyze/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt, SUGGESTION_SCHEMA } from '@/lib/claude';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    // 1. Validar JWT (si existe)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Parse body
    const body = await req.json();
    const { text, profile, context } = body;

    if (!text || !profile) {
      return Response.json({ error: 'Missing text or profile' }, { status: 400 });
    }

    // 3. Construir prompt
    const systemPrompt = getSystemPrompt(profile);
    const userMessage = context
      ? `Contexto previo: ${context}\n\nNueva transcripción: ${text}`
      : text;

    // 4. Llamar Claude con Structured Outputs
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userMessage
      }],
      output_config: {
        json_schema: {
          name: 'suggestion_response',
          strict: true,
          schema: SUGGESTION_SCHEMA
        }
      }
    });

    // 5. Parsear respuesta (garantizado JSON válido)
    const suggestion = JSON.parse(message.content[0].text);

    // 6. Guardar en Supabase (opcional, para analytics)
    if (user && suggestion.signal_detected) {
      await supabase.from('suggestions').insert({
        session_id: body.session_id,
        question_type: suggestion.signal_type,
        suggestion_text: suggestion.suggestion,
        context_text: suggestion.what_is_being_asked,
        keywords: suggestion.keywords,
        urgency_level: suggestion.urgency
      });
    }

    // 7. Retornar
    return Response.json(suggestion);

  } catch (error) {
    console.error('Error in /api/analyze:', error);

    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Timeouts:**
- Max 10s (límite Vercel free)
- Claude típicamente responde en 2-4s

---

#### POST /api/session

**Propósito:** Registrar nueva sesión en Supabase.

**Request:**
```typescript
interface SessionRequest {
  anonymous_id?: string;     // Si no autenticado
  profile: 'candidato' | 'vendedor' | 'defensor';
  session_type?: string;
  consent_confirmed: boolean; // Debe ser true
}
```

**Response:**
```typescript
interface SessionResponse {
  session_id: string;        // UUID
  user_id: string | null;
  started_at: string;        // ISO timestamp
}
```

**Implementación:**
```typescript
// app/api/session/route.ts
export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const body = await req.json();

  if (!body.consent_confirmed) {
    return Response.json({ error: 'Consent required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user?.id || null,
      anonymous_id: body.anonymous_id || null,
      profile: body.profile,
      session_type: body.session_type,
      consent_confirmed: true,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Trigger incrementa profiles.total_sessions automáticamente

  return Response.json({
    session_id: data.id,
    user_id: data.user_id,
    started_at: data.started_at
  });
}
```

---

#### GET /api/usage

**Propósito:** Retornar contador de sesiones y detectar migración anónimo → autenticado.

**Query Params:**
```
?anonymous_id=abc123...
```

**Response:**
```typescript
interface UsageResponse {
  user_type: 'anonymous' | 'authenticated';
  session_count: number;
  limit: number;
  remaining: number;
  needs_migration?: boolean;  // Si detecta sesiones anónimas + usuario logueado
}
```

**Implementación:**
```typescript
// app/api/usage/route.ts
import { LIMITS } from '@/lib/constants';

export async function GET(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { searchParams } = new URL(req.url);
  const anonymousId = searchParams.get('anonymous_id');

  // Caso 1: Usuario autenticado
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_sessions, plan')
      .eq('id', user.id)
      .single();

    const limit = profile?.plan === 'pro'
      ? LIMITS.PRO_SESSIONS
      : LIMITS.FREE_SESSIONS;

    const count = profile?.total_sessions || 0;

    // Detectar migración pendiente
    const { count: anonymousSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('anonymous_id', anonymousId)
      .is('user_id', null);

    if (anonymousSessions > 0) {
      // Auto-migrar
      await supabase
        .from('sessions')
        .update({ user_id: user.id, anonymous_id: null })
        .eq('anonymous_id', anonymousId)
        .is('user_id', null);
    }

    return Response.json({
      user_type: 'authenticated',
      session_count: count,
      limit,
      remaining: Math.max(0, limit - count)
    });
  }

  // Caso 2: Usuario anónimo
  if (!anonymousId) {
    return Response.json({ error: 'Missing anonymous_id' }, { status: 400 });
  }

  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('anonymous_id', anonymousId);

  return Response.json({
    user_type: 'anonymous',
    session_count: count || 0,
    limit: LIMITS.ANONYMOUS_SESSIONS,
    remaining: Math.max(0, LIMITS.ANONYMOUS_SESSIONS - (count || 0))
  });
}
```

---

#### POST /api/send-transcript

**Propósito:** Enviar email con transcripción completa al finalizar sesión.

**Request:**
```typescript
interface SendTranscriptRequest {
  session_id: string;
  recipients: string[];  // Emails participantes
}
```

**Implementación:**
```typescript
// app/api/send-transcript/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  // 1. Obtener transcripción completa
  const { data: transcriptions } = await supabase
    .from('transcriptions')
    .select('*')
    .eq('session_id', body.session_id)
    .order('created_at', { ascending: true });

  // 2. Formatear texto
  const fullTranscript = transcriptions
    .map(t => `[${t.speaker.toUpperCase()}] ${t.text}`)
    .join('\n');

  // 3. Enviar email
  const { data, error } = await resend.emails.send({
    from: 'Confident <hola@tryconfident.com>',
    to: body.recipients,
    subject: 'Transcripción de tu sesión Confident',
    html: `
      <p>Hola,</p>
      <p>Aquí está la transcripción completa de tu sesión:</p>
      <pre>${fullTranscript}</pre>
      <br/>
      <p>Puedes eliminar tus datos en cualquier momento desde tu dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Ver dashboard</a></p>
      <br/>
      <small>Confident • RGPD compliant</small>
    `
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

---

## 🗄️ Base de Datos (Supabase)

### Schema Completo

```sql
-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLA: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  anonymous_id TEXT UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  profile TEXT CHECK (profile IN ('candidato', 'vendedor', 'defensor')) NOT NULL,
  session_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  consent_confirmed BOOLEAN DEFAULT FALSE,
  participants_emails TEXT[],
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  suggestions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: transcriptions
CREATE TABLE transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  speaker TEXT CHECK (speaker IN ('user', 'other', 'unknown')),
  text TEXT NOT NULL,
  timestamp_ms INTEGER,
  language CHAR(2) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: suggestions
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  transcription_id UUID REFERENCES transcriptions(id),
  question_type TEXT,
  suggestion_text TEXT NOT NULL,
  context_text TEXT,
  keywords TEXT[],
  urgency_level INTEGER CHECK (urgency_level BETWEEN 1 AND 3),
  was_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_anonymous_id ON sessions(anonymous_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_transcriptions_session_id ON transcriptions(session_id);
CREATE INDEX idx_suggestions_session_id ON suggestions(session_id);

-- ROW LEVEL SECURITY (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies: sessions
CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  USING (
    auth.uid() = user_id
    OR (user_id IS NULL AND anonymous_id IS NOT NULL)
  );

CREATE POLICY "Anyone can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies: transcriptions
CREATE POLICY "Users can read own transcriptions"
  ON transcriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = transcriptions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Policies: suggestions
CREATE POLICY "Users can read own suggestions"
  ON suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = suggestions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- TRIGGERS

-- Auto-incrementar profiles.total_sessions
CREATE OR REPLACE FUNCTION increment_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE profiles
    SET total_sessions = total_sessions + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_session_created
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION increment_session_count();

-- Auto-crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

### Migraciones

**Archivo:** `supabase/migrations/001_initial_schema.sql`

```sql
-- Ejecutar en Supabase Dashboard > SQL Editor
-- O via Supabase CLI: supabase db push
```

---

## 🔌 Integraciones Externas

### 1. Anthropic Claude API

**Modelo:** `claude-sonnet-4-20250514`

**Features usadas:**
- Structured Outputs (JSON Schema)
- System prompts diferenciados por perfil
- Temperature 0.7 (balance creatividad/consistencia)

**Rate Limits:**
- Pay-as-you-go: Sin límite (pagar por token)
- Timeout recomendado: 10s

**Costos (estimados):**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens
- Sesión típica 30 min = ~10K tokens = $0.15

---

### 2. Deepgram Nova-2

**Endpoint:** `wss://api.deepgram.com/v1/listen`

**Parámetros:**
```
model=nova-2
language=es
punctuate=true
interim_results=true
vad_events=true
encoding=linear16
sample_rate=16000
```

**Eventos WebSocket:**
- `Results` → Transcripción (interim + final)
- `SpeechStarted` → VAD detectó voz
- `UtteranceEnd` → VAD detectó silencio

**Rate Limits:**
- Free tier: $200 crédito
- ~10 horas de audio

**Costos (estimados):**
- $0.0043/min streaming
- Sesión 30 min = $0.13

---

### 3. Posthog Analytics

**Endpoint:** `https://eu.posthog.com`

**Eventos instrumentados:**
```javascript
// Extensión
'extension_installed'
'session_started' → { profile, session_number, is_anonymous }
'suggestion_shown' → { profile, signal_type, urgency }
'suggestion_rated' → { helpful }

// Landing
'page_view'
'cta_clicked' → { location: 'hero' | 'pricing' }
'plan_selected' → { plan: 'free' | 'pro' }

// Funnel clave
'paywall_soft_shown'
'paywall_soft_converted'
'paywall_hard_shown'
'payment_cta_clicked' → { plan_selected } ← MÉTRICA MVP
```

**Identificación:**
```javascript
posthog.identify(user.id, {
  email: user.email,
  plan: user.plan,
  total_sessions: user.total_sessions
});
```

---

### 4. Resend (Email)

**Dominio:** `tryconfident.com`

**Templates:**
- Transcripción post-sesión
- Bienvenida (futuro)
- Límite alcanzado (futuro)

**Rate Limits:**
- 3K emails/mes free
- 100 emails/día

---

### 5. Stripe (Preparado, no activo MVP)

**Productos:**
```javascript
const PRODUCTS = {
  pro_monthly: {
    price_id: 'price_xxx',
    amount: 1900, // €19.00
    interval: 'month'
  }
};
```

**Webhook events (futuro):**
- `checkout.session.completed` → Activar plan Pro
- `customer.subscription.deleted` → Downgrade a Free

---

## 🔄 Flujo de Datos Completo

### Diagrama de Secuencia

```
Usuario          Extension         Background         Offscreen         Deepgram         Backend         Claude
  │                 │                   │                  │                 │                │              │
  │ Clic "Iniciar"  │                   │                  │                 │                │              │
  ├────────────────►│                   │                  │                 │                │              │
  │                 │ START_SESSION     │                  │                 │                │              │
  │                 ├──────────────────►│                  │                 │                │              │
  │                 │                   │ getTabStreamId() │                 │                │              │
  │                 │                   ├─────────────────►│                 │                │              │
  │                 │                   │                  │ WebSocket open  │                │              │
  │                 │                   │                  ├────────────────►│                │              │
  │                 │                   │                  │ Connected       │                │              │
  │                 │◄ SESSION_STARTED  │◄─────────────────┤                 │                │              │
  │                 │                   │                  │                 │                │              │
 [Usuario habla]    │                   │                  │ Audio chunks    │                │              │
  │                 │                   │                  ├────────────────►│                │              │
  │                 │                   │                  │ interim_result  │                │              │
  │                 │                   │◄ TRANSCRIPT ─────┤                 │                │              │
  │                 │                   │ (acumula)        │                 │                │              │
  │                 │                   │                  │ is_final=true   │                │              │
  │                 │                   │◄ TRANSCRIPT ─────┤                 │                │              │
  │                 │                   │◄ VAD_ENDED ──────┤                 │                │              │
  │                 │                   │                  │                 │                │              │
  │                 │                   │ POST /api/analyze                  │                │              │
  │                 │                   ├───────────────────────────────────►│                │              │
  │                 │                   │                  │                 │ messages.create│              │
  │                 │                   │                  │                 ├───────────────►│              │
  │                 │                   │                  │                 │ JSON response  │              │
  │                 │                   │                  │                 │◄───────────────┤              │
  │                 │                   │◄─────────────────────────────────  │                │              │
  │                 │◄ NEW_SUGGESTION   │                  │                 │                │              │
  │◄ render() ──────┤                   │                  │                 │                │              │
  │                 │                   │                  │                 │                │              │
```

---

## 🔒 Seguridad

### 1. Gestión de Secretos

**Nunca en cliente:**
- ❌ `ANTHROPIC_API_KEY`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `RESEND_API_KEY`

**Variables de entorno:**
```bash
# .env.local (NUNCA subir a Git)
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Solo server
RESEND_API_KEY=re_...

# .env.example (SÍ subir a Git)
ANTHROPIC_API_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

### 2. Autenticación

**JWT Supabase:**
- Generado en login con Google
- Almacenado en `chrome.storage.sync` (encriptado por Chrome)
- Enviado en header `Authorization: Bearer <token>`
- Validado en cada endpoint con `createClient()`

**RLS (Row Level Security):**
- Políticas a nivel de base de datos
- Usuario solo accede a sus propios datos
- Service role bypasea RLS (solo en backend)

---

### 3. Validación de Input

**Sanitización:**
```typescript
// NUNCA confiar en input del cliente
function sanitizeText(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .substring(0, 10000); // Max 10K caracteres
}
```

**Validación de tipos:**
```typescript
import { z } from 'zod';

const analyzeSchema = z.object({
  text: z.string().min(1).max(10000),
  profile: z.enum(['candidato', 'vendedor', 'defensor']),
  context: z.string().optional(),
  session_id: z.string().uuid().optional()
});

// En endpoint:
const body = analyzeSchema.parse(await req.json());
```

---

### 4. Rate Limiting

**Vercel Edge Middleware (futuro):**
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m') // 10 req/min
});

export async function middleware(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
}
```

---

### 5. CORS

**Configuración:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'chrome-extension://*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  }
};
```

---

## 🚀 Despliegue

### Vercel (Backend)

**Configuración:**
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

**Variables de entorno:**
- Dashboard → Settings → Environment Variables
- Separar: Development, Preview, Production

**Dominios:**
- Production: `tryconfident.com`
- Preview: `confident-git-main-victor.vercel.app`

---

### Chrome Web Store (Extensión)

**Pasos:**
1. Comprimir carpeta `extension/` en `confident-v0.1.0.zip`
2. Subir a Chrome Developer Dashboard
3. Rellenar metadata:
   - Nombre: Confident
   - Descripción corta: Tu confidente en conversaciones importantes
   - Categoría: Productividad
   - Idiomas: Español, Inglés
4. Screenshots (1280x800):
   - Panel lateral con sugerencia
   - Popup con selector de perfil
   - Landing page hero
5. Justificar permisos:
   - `tabCapture`: Captura audio de Google Meet
   - `storage`: Guardar preferencias usuario
   - `sidePanel`: Mostrar sugerencias
6. Política de privacidad: `tryconfident.com/privacy`
7. Submit for review (7-14 días)

---

### Supabase (Base de Datos)

**Región:** Europe West (Frankfurt) — RGPD compliance

**Backups:**
- Automáticos diarios (retención 7 días)
- PITR (Point-in-Time Recovery) habilitado

**Escalado:**
- Free tier: 500 MB DB, 2 GB bandwidth
- Pro tier ($25/mes): 8 GB DB, 250 GB bandwidth

---

## 📊 Monitoreo y Analytics

### Posthog (Product Analytics)

**Dashboards:**
1. **Acquisition:** Instalaciones, registros, conversiones
2. **Engagement:** Sesiones/usuario, feedback positivo
3. **Retention:** D1, D7, D30 retention
4. **Funnel:** Anónimo → Paywall suave → Registro → Paywall duro → Pago

**Alertas:**
- Error rate > 5% → Slack notification
- Paywall soft conversion < 20% → Email

---

### Vercel Analytics

**Métricas Web Vitals:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

---

### Sentry (Error Tracking, futuro)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});
```

---

## ⚡ Performance

### Frontend

**Optimizaciones:**
- Next.js App Router con RSC (React Server Components)
- Static Generation para landing (`generateStaticParams`)
- Image optimization con `next/image`
- Font optimization con `next/font`

**Bundle size:**
- Target: < 200 KB gzipped
- Code splitting automático por route

---

### Extension

**Optimizaciones:**
- Lazy load de offscreen document
- Debounce de llamadas `/api/analyze` (500ms)
- Limitación de historial (máx 50 sugerencias en storage)

**Memory leaks:**
- ✅ Cerrar WebSocket al detener sesión
- ✅ Limpiar listeners de `chrome.runtime.onMessage`
- ✅ Cerrar AudioContext

---

### Backend

**Optimizaciones:**
- Edge Functions para `/api/usage` (latencia < 50ms)
- Database indexes en columnas filtradas
- Connection pooling de Supabase

**Timeouts:**
- Claude API: 10s max
- Supabase queries: 5s max
- Endpoints totales: 10s max (límite Vercel)

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Instalar
npm install --save-dev jest @testing-library/react

# Ejecutar
npm test
```

**Cobertura objetivo:**
- `lib/claude.ts`: 100% (prompts críticos)
- API routes: 80% (happy path + errores)

---

### Integration Tests (Playwright)

```typescript
// tests/e2e/session-flow.spec.ts
test('Complete session flow', async ({ page, context }) => {
  // 1. Install extension
  await context.addExtension('./extension');

  // 2. Open Google Meet
  await page.goto('https://meet.google.com/test');

  // 3. Open popup
  await page.click('[aria-label="Confident"]');

  // 4. Select profile
  await page.click('input[value="candidato"]');

  // 5. Start session
  await page.click('button:has-text("Iniciar sesión")');

  // 6. Verify side panel opens
  const panel = await context.waitForPage({ url: /side-panel/ });
  await expect(panel.locator('text=Escuchando')).toBeVisible();
});
```

---

### Manual QA Checklist

```
□ Instalación extensión en perfil limpio
□ Login con Google funciona
□ Selector de perfil persiste
□ Paywall suave bloquea sesión 6
□ Paywall duro bloquea sesión 16
□ Sugerencias aparecen <5s
□ Feedback 👍/👎 se guarda
□ Transcripción se muestra en panel
□ Email transcripción llega
□ Landing page responsive
```

---

## 🏗️ Deuda Técnica

### Prioridad Alta
1. **Migrar `ScriptProcessor` → `AudioWorklet`**
   - Razón: ScriptProcessor deprecated
   - Impacto: Chrome puede removerlo
   - Estimación: 4 horas

2. **Agregar rate limiting a `/api/analyze`**
   - Razón: Prevenir abuso
   - Impacto: Costos Claude sin control
   - Estimación: 2 horas

### Prioridad Media
3. **Offscreen document no se cierra al detener sesión**
   - Razón: Memory leak potencial
   - Impacto: Chrome puede matar extensión
   - Estimación: 1 hora

4. **Validación de schema con Zod en todos los endpoints**
   - Razón: Type safety en runtime
   - Impacto: Errores 500 evitables
   - Estimación: 3 horas

### Prioridad Baja
5. **Iconos son placeholders**
   - Razón: Branding
   - Impacto: Profesionalismo
   - Estimación: 2 horas (diseño externo)

6. **Error handling genérico en extensión**
   - Razón: UX en casos de fallo
   - Impacto: Usuario no sabe qué hacer
   - Estimación: 4 horas

---

## 📚 Referencias

### Documentación Oficial
- [Chrome Extension MV3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Deepgram Streaming API](https://developers.deepgram.com/docs/streaming)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)

### Herramientas de Debug
- `chrome://extensions` → Inspect service worker
- `chrome://inspect/#devices` → Offscreen document
- Vercel Logs → Errores backend
- Supabase Dashboard → Query logs

---

**Última actualización:** Febrero 2026
**Versión:** 1.0
**Próxima revisión:** Post-Sesión 7 (Deploy Vercel)
