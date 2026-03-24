# SECURITY AUDIT — Confident
> Auditoría de seguridad completa pre-deployment
> Fecha: 2026-03-20
> Auditor: Security Engineer Agent
> Estado del proyecto: MVP pre-lanzamiento Chrome Web Store

---

## EXECUTIVE SUMMARY

### Estado General de Seguridad: **MEDIO-ALTO** ⚠️

**Resumen ejecutivo:**
- **Vulnerabilidades Críticas**: 2 encontradas
- **Vulnerabilidades Altas**: 4 encontradas
- **Vulnerabilidades Medias**: 6 encontradas
- **Vulnerabilidades Bajas**: 3 encontradas
- **Mejores prácticas recomendadas**: 8

**Bloqueadores para deployment:**
1. ❌ CRITICAL: Service Role Key expuesta en endpoints públicos (bypassea RLS)
2. ❌ CRITICAL: Falta validación de input en múltiples endpoints API
3. ❌ HIGH: Console.log con datos sensibles en código producción
4. ❌ HIGH: XSS vulnerability vía innerHTML en panel.js

**Acción inmediata requerida:** NO DEPLOYAR hasta resolver vulnerabilidades CRITICAL y HIGH.

---

## 1. THREAT MODEL

### 1.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CHROME EXTENSION                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Content      │  │ Background   │  │ Side Panel   │  │
│  │ Script       │  │ Service      │  │ (UI)         │  │
│  │              │  │ Worker       │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   VERCEL BACKEND (Next.js)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/analyze │  │ /api/sessions│  │ /api/stripe  │  │
│  │ (Claude)     │  │              │  │ /webhook     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Supabase     │  │ Anthropic    │  │ Stripe       │  │
│  │ (PostgreSQL) │  │ (Claude API) │  │ (Payments)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Trust Boundaries

| Boundary | Description | Security Level |
|----------|-------------|----------------|
| **User → Extension** | Usuario interactúa con extension via UI | LOW TRUST - Validar todo input |
| **Extension → Backend** | Extension envía datos al backend | MEDIUM TRUST - Validar origin + JWT |
| **Backend → Supabase** | Backend accede a DB con RLS | HIGH TRUST - RLS policies activas |
| **Backend → External APIs** | Backend llama Claude/Stripe/Deepgram | HIGH TRUST - API keys server-side |
| **Public → Stripe Webhook** | Stripe envía webhooks a backend | MEDIUM TRUST - Verificar firma |

### 1.3 Data Classification

| Data Type | Sensitivity | Location | Encryption Required |
|-----------|-------------|----------|---------------------|
| **Transcripciones** | HIGH (PII potencial) | Supabase | ✅ At rest + in transit |
| **User credentials** | CRITICAL | Supabase Auth | ✅ Managed by Supabase |
| **API Keys** | CRITICAL | .env.local (server) | ✅ Never exposed to client |
| **Session metadata** | MEDIUM | Supabase + chrome.storage | ✅ In transit only |
| **Stripe customer data** | CRITICAL | Stripe (external) | ✅ PCI-DSS compliant |
| **Audio streams** | HIGH | In-memory only | ❌ Never stored |

### 1.4 STRIDE Analysis

| Threat | Component | Risk | Current Mitigation | Gaps Found |
|--------|-----------|------|-------------------|------------|
| **Spoofing** | Auth endpoints | HIGH | Supabase JWT | ⚠️ Algunos endpoints no validan JWT |
| **Tampering** | API requests | HIGH | HTTPS + CORS | ❌ Falta validación de input |
| **Repudiation** | User actions | MEDIUM | Session logging | ✅ Audit trail en Supabase |
| **Info Disclosure** | Error messages | MEDIUM | Generic errors | ⚠️ Stack traces en dev mode leaking |
| **Denial of Service** | Public APIs | HIGH | Vercel edge network | ❌ Sin rate limiting |
| **Elevation of Privilege** | RLS bypass | CRITICAL | Row Level Security | ❌ Service role key expuesta |

### 1.5 Attack Surface Map

**External Attack Surface:**
- `/api/analyze` - Acepta texto sin límite de tamaño
- `/api/sessions` - Crea sesiones sin autenticación (permite anónimos)
- `/api/transcriptions` - Acepta transcripciones con service role key
- `/api/suggestions` - Acepta sugerencias con service role key
- `/api/stripe/webhook` - Endpoint público (verificación de firma presente)
- Extension manifest host_permissions - Acceso a meet.google.com, teams, zoom

**Internal Attack Surface:**
- chrome.storage - Almacena anonymous_id, JWT tokens
- AudioContext pipeline - Procesa audio en memoria
- Service Worker - Puede ser terminado por Chrome en cualquier momento
- Offscreen Document - Tiene acceso al DOM

---

## 2. VULNERABILITIES FOUND

### 2.1 CRITICAL Severity

#### VULN-001: Service Role Key Bypassing RLS (CRITICAL)

**Archivo:** `app/api/transcriptions/route.ts`, `app/api/suggestions/route.ts`

**Descripción:**
Dos endpoints públicos están usando `SUPABASE_SERVICE_ROLE_KEY` directamente, lo que bypasea completamente Row Level Security (RLS). Cualquier cliente puede enviar datos maliciosos a estos endpoints y escribir/leer datos de cualquier usuario.

**Código vulnerable:**
```typescript
// app/api/transcriptions/route.ts (líneas 8-17)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ❌ CRITICAL: Bypasses RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

**Impacto:**
- Atacante puede insertar transcripciones en sesiones de otros usuarios
- Atacante puede leer transcripciones de cualquier sesión (si existe endpoint GET)
- Bypasea políticas RLS diseñadas para proteger datos de usuarios
- Permite ataques de data poisoning y IDOR (Insecure Direct Object Reference)

**Proof of Concept:**
```bash
# Atacante puede insertar transcripciones en sesión ajena
curl -X POST https://tryconfident.vercel.app/api/transcriptions \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "uuid-de-otra-sesion",
    "speaker": "attacker",
    "text": "Datos maliciosos inyectados",
    "timestamp_ms": 0
  }'
```

**Remediation (ALTA PRIORIDAD):**

1. **Opción A (Recomendada): Autenticación obligatoria**
```typescript
// app/api/transcriptions/route.ts
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verificar autenticación
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { session_id, speaker, text, timestamp_ms, language } = body;

  // Validar que la sesión pertenece al usuario
  const { data: session } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', session_id)
    .eq('user_id', user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: 'Session not found or access denied' }, { status: 403 });
  }

  // Insertar con RLS activo (usa anon key, no service role)
  const { data: transcription, error: insertError } = await supabase
    .from('transcriptions')
    .insert({
      session_id,
      speaker: speaker || 'unknown',
      text,
      timestamp_ms: timestamp_ms || 0,
      language: language || 'es'
    })
    .select()
    .single();

  if (insertError) {
    console.error('[POST /api/transcriptions] Error:', insertError);
    return NextResponse.json({ error: 'Failed to save transcription' }, { status: 500 });
  }

  return NextResponse.json({ success: true, transcription_id: transcription.id });
}
```

2. **Opción B (Si se requiere soporte anónimo): API Key de extensión**
```typescript
// Crear API key específica para la extensión (no service role)
// Validar que la request viene de la extensión usando shared secret
const EXTENSION_API_KEY = process.env.EXTENSION_API_KEY;

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('X-Extension-API-Key');

  if (apiKey !== EXTENSION_API_KEY) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
  }

  // Validar que session_id existe y es válido
  // Usar ANON KEY con RLS, no service role
  const supabase = await createClient();

  // ... resto del código con RLS activo
}
```

3. **Actualizar RLS policies para permitir inserts anónimos SOLO si session es válida:**
```sql
-- Actualizar policy de transcriptions
DROP POLICY IF EXISTS "Users can insert transcriptions" ON public.transcriptions;

CREATE POLICY "Users can insert own transcriptions"
  ON public.transcriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = transcriptions.session_id
      AND (
        -- Usuario autenticado dueño de la sesión
        (sessions.user_id = auth.uid())
        OR
        -- Sesión anónima activa (menos de 1 hora)
        (sessions.user_id IS NULL
         AND sessions.status = 'active'
         AND sessions.started_at > NOW() - INTERVAL '1 hour')
      )
    )
  );
```

**Timeline:** Resolver en < 48 horas antes de deployment.

---

#### VULN-002: Missing Input Validation on Multiple API Endpoints (CRITICAL)

**Archivos:** `app/api/analyze/route.ts`, `app/api/transcriptions/route.ts`, `app/api/sessions/route.ts`

**Descripción:**
Los endpoints no validan tamaño, formato ni contenido de inputs, permitiendo ataques de:
- **Injection attacks** (NoSQL injection via JSON)
- **Resource exhaustion** (textos gigantes a Claude API)
- **Data corruption** (tipos incorrectos en DB)

**Código vulnerable:**
```typescript
// app/api/analyze/route.ts (líneas 5-8)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, profile, context, session_type, anonymous_id, language } = body;

    // ❌ NO HAY VALIDACIÓN DE:
    // - Tamaño de 'text' (puede ser 1MB+)
    // - Formato de 'profile' (solo verifica 3 valores después)
    // - Tipo de datos de cada campo
    // - Caracteres maliciosos o scripts
```

**Impacto:**
- Atacante puede enviar 10MB de texto → timeout en Claude API → costo de $$$
- Atacante puede enviar arrays/objetos donde se esperan strings → crash
- Inyección de código malicioso en transcripciones → XSS posterior
- DoS vía exhaustion de recursos (Vercel function timeout)

**Remediation:**

Instalar librería de validación robusta:
```bash
npm install zod
```

**Implementación segura:**
```typescript
// app/api/analyze/route.ts
import { z } from 'zod';

// Schema de validación
const AnalyzeRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text exceeds maximum length of 5000 characters')
    .regex(/^[\p{L}\p{N}\p{P}\p{Z}]+$/u, 'Text contains invalid characters'),

  profile: z.enum(['candidato', 'vendedor', 'defensor'], {
    errorMap: () => ({ message: 'Invalid profile' })
  }),

  context: z.string().max(2000).optional(),

  session_type: z.string().max(50).optional(),

  anonymous_id: z.string().uuid().optional(),

  language: z.enum(['es', 'en']).default('es')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar input
    const validationResult = AnalyzeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.warn('[/api/analyze] Validation failed:', validationResult.error.flatten());
      return Response.json(
        {
          error: 'Invalid input',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { text, profile, context, session_type, anonymous_id, language } = validationResult.data;

    // Sanitizar texto antes de enviar a Claude
    const sanitizedText = text.trim().replace(/[\x00-\x1F\x7F]/g, '');

    // ... resto del código
  } catch (err) {
    // ...
  }
}
```

**Aplicar validación similar a TODOS los endpoints:**

1. `/api/transcriptions/route.ts`
```typescript
const TranscriptionSchema = z.object({
  session_id: z.string().uuid('Invalid session ID format'),
  speaker: z.enum(['user', 'other', 'unknown']).optional(),
  text: z.string().min(1).max(10000),
  timestamp_ms: z.number().int().min(0).optional(),
  language: z.string().length(2).optional()
});
```

2. `/api/sessions/route.ts`
```typescript
const SessionSchema = z.object({
  anonymous_id: z.string().uuid().optional(),
  profile: z.enum(['candidato', 'vendedor', 'defensor']),
  consent_confirmed: z.boolean().default(false),
  participants_emails: z.array(z.string().email()).max(10).optional()
});
```

3. `/api/suggestions/route.ts`
```typescript
const SuggestionSchema = z.object({
  session_id: z.string().uuid(),
  transcription_id: z.string().uuid().optional(),
  signal_type: z.string().max(100).optional(),
  suggestion_text: z.string().min(1).max(2000),
  context_text: z.string().max(1000).optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  urgency_level: z.number().int().min(1).max(3).optional()
});
```

**Timeline:** Implementar en < 72 horas antes de deployment.

---

### 2.2 HIGH Severity

#### VULN-003: Console.log Leaking Sensitive Data in Production (HIGH)

**Archivos:** Múltiples archivos en `/extension` y `/app/api`

**Descripción:**
61 ocurrencias de `console.log` en código de extensión, muchas loggeando datos sensibles como:
- Session IDs
- User IDs
- Anonymous IDs
- Transcripciones completas
- Stack traces con información del sistema

**Código vulnerable:**
```javascript
// extension/background.js (línea 186)
LOG.log('[Confident] ✅ Transcripción guardada:', data.transcription_id);

// extension/offscreen.js (línea 308)
LOG.log('[Offscreen] Transcripción recibida:', data.transcript);

// app/api/analyze/route.ts (línea 96)
console.error('[/api/analyze] Error completo:', err);
```

**Impacto:**
- Logs de browser accesibles vía DevTools → exposición de datos
- Logs de Vercel accesibles si atacante compromete cuenta → data leak
- Debugging info revela estructura interna → facilita ataques
- Performance degradation (console.log es caro en producción)

**Remediation:**

1. **Crear sistema de logging condicional:**

```typescript
// lib/logger.ts
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEV = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: any[]) => {
    if (IS_DEV) console.log('[DEBUG]', ...args);
  },

  info: (...args: any[]) => {
    if (IS_DEV) console.info('[INFO]', ...args);
  },

  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  error: (message: string, error?: Error) => {
    if (IS_PRODUCTION) {
      // En producción: solo mensaje genérico, sin stack traces
      console.error('[ERROR]', message);
      // TODO: Enviar a servicio de logging (Sentry, LogRocket, etc.)
    } else {
      console.error('[ERROR]', message, error);
    }
  },

  // Para datos sensibles: NUNCA loggear en producción
  sensitive: (label: string, data: any) => {
    if (IS_DEV) {
      console.log(`[SENSITIVE] ${label}:`, data);
    }
  }
};
```

2. **Actualizar código de extensión:**

```javascript
// extension/logger.js (actualizar)
const LOG = {
  log: (...args) => {
    // Solo en desarrollo (versión 0.x.x)
    const manifest = chrome.runtime.getManifest();
    const isDev = manifest.version.startsWith('0.');
    if (isDev) console.log(...args);
  },

  error: (...args) => {
    // Errores siempre se loggean, pero sin datos sensibles
    console.error('[Confident]', ...args.map(arg =>
      typeof arg === 'object' ? '[REDACTED]' : arg
    ));
  },

  warn: (...args) => console.warn(...args)
};
```

3. **Buscar y reemplazar console.log:**
```bash
# Buscar todos los console.log que loggean datos sensibles
grep -r "console.log.*transcription\|console.log.*user_id\|console.log.*session" app extension

# Reemplazar con logger.sensitive() o logger.debug()
```

**Timeline:** Limpiar antes de versión 1.0.0 (producción).

---

#### VULN-004: XSS via innerHTML in Side Panel (HIGH)

**Archivo:** `extension/side-panel/panel.js`, `extension/side-panel/panel-backup.js`

**Descripción:**
Uso de `innerHTML` para renderizar contenido que puede provenir de la API (sugerencias de Claude). Si Claude API es comprometida o devuelve código malicioso, se ejecutaría en el contexto de la extensión.

**Código vulnerable:**
```javascript
// extension/side-panel/panel.js (líneas 139-142)
document.querySelectorAll('[data-i18n-html]').forEach(el => {
  const key = el.getAttribute('data-i18n-html');
  el.innerHTML = i18n(key); // ❌ Potencial XSS
});

// extension/side-panel/panel-backup.js (líneas 300-320)
card.innerHTML = `
  <div class="suggestion-header">
    <h3>${result.what_is_being_asked || i18n('emptyTitle')}</h3> // ❌ Sin sanitizar
  </div>
  <div class="suggestion-body">
    <p class="suggestion-text">${result.suggestion}</p> // ❌ Sin sanitizar
  </div>
`;
```

**Impacto:**
- Si Claude API devuelve `<script>alert('XSS')</script>`, se ejecuta
- Atacante que compromete Claude API puede robar chrome.storage data
- Acceso a tokens JWT, anonymous_id, session data
- Posible exfiltración de transcripciones

**Remediation:**

1. **Crear función de sanitización:**

```javascript
// extension/side-panel/sanitizer.js
/**
 * Sanitiza HTML para prevenir XSS
 * Permite solo texto plano, <b>, <i>, <em>, <strong>
 */
function sanitizeHTML(dirty) {
  const clean = dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return clean;
}

/**
 * Alternativa: usar DOMPurify (librería especializada)
 * npm install dompurify
 */
// import DOMPurify from 'dompurify';
// const sanitized = DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] });
```

2. **Reemplazar innerHTML por textContent donde sea posible:**

```javascript
// extension/side-panel/panel.js
document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  el.textContent = i18n(key); // ✅ Seguro
});

// Para casos donde se necesita HTML, sanitizar primero
document.querySelectorAll('[data-i18n-html]').forEach(el => {
  const key = el.getAttribute('data-i18n-html');
  el.innerHTML = sanitizeHTML(i18n(key)); // ✅ Sanitizado
});
```

3. **Renderizar sugerencias de forma segura:**

```javascript
// extension/side-panel/panel-backup.js
function renderSuggestionCard(result) {
  const card = document.createElement('div');
  card.className = 'suggestion-card';

  // Crear header
  const header = document.createElement('div');
  header.className = 'suggestion-header';

  const title = document.createElement('h3');
  title.textContent = result.what_is_being_asked || i18n('emptyTitle'); // ✅ textContent
  header.appendChild(title);

  // Crear body
  const body = document.createElement('div');
  body.className = 'suggestion-body';

  const text = document.createElement('p');
  text.className = 'suggestion-text';
  text.textContent = result.suggestion; // ✅ textContent
  body.appendChild(text);

  card.appendChild(header);
  card.appendChild(body);

  return card;
}
```

4. **Validar respuestas de Claude en backend:**

```typescript
// app/api/analyze/route.ts
const result = JSON.parse(raw);

// Sanitizar campos de texto antes de enviar al cliente
const sanitizedResult = {
  ...result,
  suggestion: sanitizeForOutput(result.suggestion),
  what_is_being_asked: sanitizeForOutput(result.what_is_being_asked),
  keywords: result.keywords?.map(k => sanitizeForOutput(k)) || []
};

return Response.json(sanitizedResult);

function sanitizeForOutput(text: string | null): string | null {
  if (!text) return null;
  // Remover HTML tags, scripts, y caracteres peligrosos
  return text
    .replace(/<[^>]*>/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript: URLs
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim();
}
```

**Timeline:** Implementar en < 72 horas antes de deployment.

---

#### VULN-005: Missing Rate Limiting on Public APIs (HIGH)

**Archivos:** Todos los endpoints en `/app/api`

**Descripción:**
Ningún endpoint tiene rate limiting implementado. Atacante puede:
- Spamear `/api/analyze` → agotar créditos de Claude API ($$$)
- Crear miles de sesiones → llenar DB
- DoS al backend vía request flooding

**Impacto:**
- **Financiero:** Costos de Claude API pueden dispararse ($15/millón tokens)
- **Disponibilidad:** Backend puede caer por sobrecarga
- **Data quality:** DB llena de basura → degradación de performance

**Remediation:**

Implementar rate limiting usando Vercel Edge Middleware + Upstash Redis:

1. **Instalar dependencias:**
```bash
npm install @upstash/redis @upstash/ratelimit
```

2. **Crear middleware de rate limiting:**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Crear instancia de Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters diferentes por endpoint
const rateLimiters = {
  analyze: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests por minuto
    analytics: true,
  }),

  sessions: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 sesiones por minuto
    analytics: true,
  }),

  default: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests por minuto
    analytics: true,
  }),
};

export async function middleware(request: NextRequest) {
  // Solo rate limit en producción
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Seleccionar rate limiter según endpoint
  let limiter = rateLimiters.default;
  let identifier = getIdentifier(request);

  if (pathname.startsWith('/api/analyze')) {
    limiter = rateLimiters.analyze;
  } else if (pathname.startsWith('/api/sessions')) {
    limiter = rateLimiters.sessions;
  }

  // Aplicar rate limit
  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  // Headers de rate limit (RFC 6585)
  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );

  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

function getIdentifier(request: NextRequest): string {
  // Usar IP + User-Agent como identificador
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Hash simple para no almacenar IPs en claro
  return `${ip}-${userAgent.slice(0, 20)}`;
}

export const config = {
  matcher: '/api/:path*',
};
```

3. **Variables de entorno:**
```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

4. **Rate limits específicos por plan (opcional):**
```typescript
async function getRateLimitForUser(userId: string | null): Promise<number> {
  if (!userId) return 10; // Anónimo: 10/min

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  if (profile?.plan === 'diamond') return 100; // Diamond: 100/min
  if (profile?.plan === 'pro') return 50; // Pro: 50/min
  return 20; // Free: 20/min
}
```

**Timeline:** Implementar antes de deployment (BLOQUEADOR).

---

#### VULN-006: Stripe Webhook Signature Verification Present but Incomplete (HIGH)

**Archivo:** `app/api/stripe/webhook/route.ts`

**Descripción:**
El código actual verifica la firma de Stripe (✅ bueno), pero tiene gaps:
1. No valida el timestamp del evento (puede replayear eventos viejos)
2. No verifica que el evento sea único (puede procesar el mismo evento 2 veces)
3. No tiene idempotency keys

**Código actual:**
```typescript
// app/api/stripe/webhook/route.ts (líneas 36-49)
try {
  event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
} catch (error) {
  console.error('[Stripe Webhook] Signature verification failed:', error);
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
}
```

**Impacto:**
- Atacante puede replayear webhooks antiguos → duplicar suscripciones
- Race conditions pueden procesar el mismo evento múltiples veces
- No hay audit trail de webhooks procesados

**Remediation:**

```typescript
// app/api/stripe/webhook/route.ts
import { createClient } from '@/lib/supabase-server';

// Tabla para tracking de eventos procesados
// CREATE TABLE stripe_webhook_events (
//   id TEXT PRIMARY KEY,
//   type TEXT NOT NULL,
//   processed_at TIMESTAMPTZ DEFAULT NOW(),
//   created_at TIMESTAMPTZ NOT NULL
// );

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verificar firma
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ✅ NUEVO: Verificar timestamp (eventos > 5 min son rechazados)
  const eventTimestamp = event.created;
  const now = Math.floor(Date.now() / 1000);

  if (now - eventTimestamp > 300) { // 5 minutos
    console.warn('[Stripe Webhook] Event too old:', event.id, 'age:', now - eventTimestamp);
    return NextResponse.json({ error: 'Event timestamp too old' }, { status: 400 });
  }

  // ✅ NUEVO: Verificar idempotencia (no procesar el mismo evento 2 veces)
  const supabase = createClient();

  const { data: existingEvent } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single();

  if (existingEvent) {
    console.log('[Stripe Webhook] Event already processed:', event.id);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Registrar evento ANTES de procesarlo (atomic operation)
  const { error: insertError } = await supabase
    .from('stripe_webhook_events')
    .insert({
      id: event.id,
      type: event.type,
      created_at: new Date(event.created * 1000).toISOString()
    });

  if (insertError) {
    // Si falla el insert (por constraint de PK), es un duplicado
    console.log('[Stripe Webhook] Duplicate event detected:', event.id);
    return NextResponse.json({ received: true, duplicate: true });
  }

  console.log('[Stripe Webhook] Processing event:', event.id, event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      // ... resto de handlers
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);

    // ✅ NUEVO: Marcar evento como fallido (para retry manual)
    await supabase
      .from('stripe_webhook_events')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', event.id);

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
```

**Schema de DB:**
```sql
-- Agregar a supabase/schema.sql
CREATE TABLE stripe_webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'processed' CHECK (status IN ('processed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_stripe_webhook_events_created_at ON stripe_webhook_events(created_at DESC);
```

**Timeline:** Implementar antes de activar Stripe en producción.

---

### 2.3 MEDIUM Severity

#### VULN-007: Insufficient CORS Configuration (MEDIUM)

**Descripción:**
No hay configuración explícita de CORS en `next.config.js`. Vercel permite CORS por defecto, pero esto puede ser inseguro.

**Remediation:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'chrome-extension://*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
};
```

---

#### VULN-008: Chrome Extension Permissions Too Broad (MEDIUM)

**Archivo:** `extension/manifest.json`

**Descripción:**
Permisos actuales:
```json
"host_permissions": [
  "https://meet.google.com/*",
  "https://teams.microsoft.com/*",
  "https://*.zoom.us/*",
  "http://localhost:3000/*",
  "https://tryconfident.vercel.app/*"
]
```

Problema: `http://localhost:3000/*` debe estar SOLO en desarrollo.

**Remediation:**

Crear dos manifests:
```json
// manifest.dev.json (desarrollo)
{
  "host_permissions": [
    "https://meet.google.com/*",
    "https://teams.microsoft.com/*",
    "https://*.zoom.us/*",
    "http://localhost:3000/*",
    "https://tryconfident.vercel.app/*"
  ]
}

// manifest.prod.json (producción)
{
  "host_permissions": [
    "https://meet.google.com/*",
    "https://teams.microsoft.com/*",
    "https://*.zoom.us/*",
    "https://tryconfident.com/*"
  ]
}
```

Script de build:
```bash
# package.json
{
  "scripts": {
    "build:dev": "cp manifest.dev.json extension/manifest.json",
    "build:prod": "cp manifest.prod.json extension/manifest.json && zip -r extension.zip extension/"
  }
}
```

---

#### VULN-009: No HTTPS Enforcement on Production URLs (MEDIUM)

**Archivo:** `extension/config.js`

**Código:**
```javascript
const CONFIG = {
  DEV: 'http://localhost:3000',
  PROD: 'https://tryconfident.vercel.app',
```

**Problema:**
- `tryconfident.vercel.app` debe ser el dominio final de producción
- No hay validación de que PROD siempre sea HTTPS

**Remediation:**

```javascript
const CONFIG = {
  DEV: 'http://localhost:3000',
  PROD: 'https://tryconfident.com', // ✅ Dominio final

  get BASE_URL() {
    const manifestData = chrome.runtime.getManifest();
    const version = manifestData.version;
    const majorVersion = parseInt(version.split('.')[0]);
    const isDev = majorVersion === 0;

    const url = isDev ? this.DEV : this.PROD;

    // ✅ Validar que producción siempre es HTTPS
    if (!isDev && !url.startsWith('https://')) {
      throw new Error('Production URL must use HTTPS');
    }

    return url;
  },
  // ...
};
```

---

#### VULN-010: Sensitive Data in Chrome Storage Without Encryption (MEDIUM)

**Descripción:**
`chrome.storage.local` almacena datos sin encriptar:
- JWT tokens
- anonymous_id
- session metadata

Si atacante tiene acceso físico al dispositivo, puede leer estos datos.

**Remediation:**

```javascript
// extension/storage-secure.js
/**
 * Wrapper para chrome.storage con encriptación básica
 * Para datos más sensibles, considerar Web Crypto API
 */

// Generar clave única por instalación
async function getEncryptionKey() {
  let { encryptionKey } = await chrome.storage.local.get('encryptionKey');

  if (!encryptionKey) {
    encryptionKey = crypto.randomUUID();
    await chrome.storage.local.set({ encryptionKey });
  }

  return encryptionKey;
}

// XOR simple (mejor que nada, pero considerar Web Crypto para producción)
function simpleEncrypt(text, key) {
  const keyBytes = new TextEncoder().encode(key);
  const textBytes = new TextEncoder().encode(text);
  const encrypted = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return btoa(String.fromCharCode(...encrypted));
}

function simpleDecrypt(encrypted, key) {
  const keyBytes = new TextEncoder().encode(key);
  const encryptedBytes = new Uint8Array(
    atob(encrypted).split('').map(c => c.charCodeAt(0))
  );
  const decrypted = new Uint8Array(encryptedBytes.length);

  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return new TextDecoder().decode(decrypted);
}

// API pública
export const secureStorage = {
  async set(key, value) {
    const encKey = await getEncryptionKey();
    const encrypted = simpleEncrypt(JSON.stringify(value), encKey);
    await chrome.storage.local.set({ [key]: encrypted });
  },

  async get(key) {
    const encKey = await getEncryptionKey();
    const { [key]: encrypted } = await chrome.storage.local.get(key);

    if (!encrypted) return null;

    try {
      const decrypted = simpleDecrypt(encrypted, encKey);
      return JSON.parse(decrypted);
    } catch (err) {
      console.error('Decryption failed:', err);
      return null;
    }
  }
};
```

Uso:
```javascript
// Guardar JWT
await secureStorage.set('jwt_token', token);

// Leer JWT
const token = await secureStorage.get('jwt_token');
```

---

#### VULN-011: No Content Security Policy in Extension (MEDIUM)

**Archivo:** `extension/manifest.json`

**Actual:**
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
}
```

**Problema:** `'unsafe-inline'` en `style-src` permite inline styles, que pueden ser explotados.

**Remediation:**

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://tryconfident.com https://*.supabase.co; default-src 'self';"
}
```

Mover todos los inline styles a archivos CSS externos.

---

#### VULN-012: Error Messages Exposing Stack Traces (MEDIUM)

**Múltiples archivos API**

**Código vulnerable:**
```typescript
// app/api/analyze/route.ts (línea 96)
console.error('[/api/analyze] Error completo:', err);
```

**Remediation:**

```typescript
// lib/error-handler.ts
export function handleAPIError(error: unknown, context: string) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error(`[${context}] Error completo:`, error);
  } else {
    console.error(`[${context}] Error:`, error instanceof Error ? error.message : 'Unknown error');
  }

  // En producción: retornar mensaje genérico
  return {
    error: isDev
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Internal server error',
    ...(isDev && error instanceof Error && { stack: error.stack })
  };
}

// Uso:
} catch (err) {
  const errorResponse = handleAPIError(err, '/api/analyze');
  return Response.json(errorResponse, { status: 500 });
}
```

---

### 2.4 LOW Severity

#### VULN-013: Missing Security Headers in Next.js (LOW)

**Remediation:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.stripe.com;"
          },
        ],
      },
    ];
  },
};
```

---

#### VULN-014: No Dependency Vulnerability Scanning (LOW)

**Remediation:**

Configurar GitHub Dependabot:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "victormanuelrodriguezgutierrez"
    labels:
      - "dependencies"
      - "security"
```

Agregar script de auditoría:
```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix"
  }
}
```

---

#### VULN-015: No Backup Strategy for Supabase Data (LOW)

**Remediation:**

Configurar backups automáticos en Supabase Dashboard:
1. Settings → Database → Point-in-time recovery (PITR)
2. Habilitar daily backups con retención de 7 días
3. Configurar alertas por email si falla backup

Script de backup manual:
```bash
# scripts/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backups/confident_$DATE.sql
gzip backups/confident_$DATE.sql

# Subir a S3 o almacenamiento seguro
# aws s3 cp backups/confident_$DATE.sql.gz s3://confident-backups/
```

---

## 3. STRIPE INTEGRATION SECURITY GUIDELINES

### 3.1 PCI-DSS Compliance Checklist

Confident NO almacena datos de tarjetas directamente (Stripe Checkout maneja todo), pero debe cumplir SAQ A:

- ✅ NUNCA almacenar CVV, número de tarjeta completo, o fecha de expiración
- ✅ Usar Stripe Checkout (hosted page) en lugar de custom form
- ✅ Toda comunicación con Stripe por HTTPS
- ✅ Verificar firmas de webhooks
- ✅ Logs no deben contener datos de pago

### 3.2 Secure Webhook Implementation (Ya cubierto en VULN-006)

### 3.3 Customer Data Protection

```typescript
// lib/stripe-utils.ts
/**
 * Al crear Customer en Stripe, incluir SOLO datos mínimos
 */
export async function createStripeCustomer(userId: string, email: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
      // ❌ NO incluir: nombre completo, dirección, teléfono
      // Stripe ya pide esto en Checkout
    }
  });

  return customer.id;
}
```

### 3.4 Subscription Security

```typescript
// Prevenir downgrade/upgrade no autorizado
export async function updateSubscription(userId: string, newPlan: 'pro' | 'diamond') {
  const supabase = createClient();

  // Verificar que el usuario autenticado es el dueño
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }

  // Obtener suscripción actual
  const { data: currentSub } = await supabase
    .from('stripe_subscriptions')
    .select('stripe_subscription_id, plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!currentSub) {
    throw new Error('No active subscription found');
  }

  // Actualizar en Stripe
  await stripe.subscriptions.update(currentSub.stripe_subscription_id, {
    items: [{
      id: currentSub.stripe_subscription_id,
      price: PLAN_PRICES[newPlan].priceId
    }],
    proration_behavior: 'create_prorations'
  });
}
```

### 3.5 Refund Security

```typescript
// Solo permitir refunds dentro de 14 días y por el dueño
export async function requestRefund(userId: string, subscriptionId: string) {
  const supabase = createClient();

  // Verificar ownership
  const { data: sub } = await supabase
    .from('stripe_subscriptions')
    .select('stripe_subscription_id, current_period_start')
    .eq('user_id', userId)
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!sub) throw new Error('Subscription not found');

  // Verificar que no han pasado más de 14 días
  const daysSinceStart = (Date.now() - new Date(sub.current_period_start).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceStart > 14) {
    throw new Error('Refund window expired (14 days)');
  }

  // Obtener el último pago
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);

  if (!latestInvoice.charge) throw new Error('No charge found');

  // Crear refund
  const refund = await stripe.refunds.create({
    charge: latestInvoice.charge as string,
    reason: 'requested_by_customer',
    metadata: {
      user_id: userId,
      subscription_id: subscriptionId
    }
  });

  // Cancelar suscripción
  await stripe.subscriptions.cancel(subscriptionId);

  return refund;
}
```

---

## 4. SECURITY TESTING CHECKLIST

### 4.1 Pre-Deployment Testing

```bash
# 1. Dependency audit
npm audit --production
npm audit fix

# 2. Type checking
npm run type-check

# 3. Lint security rules
npm install --save-dev eslint-plugin-security
# Agregar a .eslintrc:
# "plugins": ["security"],
# "extends": ["plugin:security/recommended"]

# 4. Static analysis
npm install --save-dev @typescript-eslint/eslint-plugin
npx eslint . --ext .ts,.tsx

# 5. Secret scanning
git secrets --scan
# O usar: https://github.com/trufflesecurity/trufflehog

# 6. Bundle analysis (verificar que no hay API keys)
npm run build
npx @next/bundle-analyzer

# 7. OWASP Dependency Check
npm install -g dependency-check
dependency-check --project Confident --scan .
```

### 4.2 Manual Security Testing

**Test 1: SQL Injection**
```bash
# Intentar inyección en /api/sessions
curl -X POST https://tryconfident.vercel.app/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "candidato",
    "anonymous_id": "' OR 1=1 --"
  }'

# Esperado: Error 400 (validación de UUID)
```

**Test 2: XSS en sugerencias**
```bash
# Intentar inyectar script en transcripción
curl -X POST https://tryconfident.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "<script>alert(\"XSS\")</script>",
    "profile": "candidato"
  }'

# Esperado: Texto sanitizado en respuesta
```

**Test 3: Rate limiting**
```bash
# Bombardear endpoint
for i in {1..100}; do
  curl https://tryconfident.vercel.app/api/analyze \
    -H "Content-Type: application/json" \
    -d '{"text":"test","profile":"candidato"}' &
done

# Esperado: Después de 10 requests → 429 Too Many Requests
```

**Test 4: CORS bypass**
```bash
curl -X POST https://tryconfident.vercel.app/api/analyze \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"text":"test","profile":"candidato"}'

# Esperado: CORS error o blocked
```

**Test 5: Stripe webhook replay**
```bash
# Intentar enviar webhook viejo de nuevo
# Esperado: 400 "Event timestamp too old" o duplicate detection
```

---

## 5. SECURITY MONITORING & INCIDENT RESPONSE

### 5.1 Logging Strategy

```typescript
// lib/audit-logger.ts
import { createClient } from '@/lib/supabase-server';

export async function logSecurityEvent(event: {
  type: 'auth_failed' | 'ratelimit_hit' | 'suspicious_activity' | 'data_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  details: Record<string, any>;
}) {
  const supabase = createClient();

  await supabase.from('security_audit_log').insert({
    event_type: event.type,
    severity: event.severity,
    user_id: event.user_id || null,
    ip_address: event.ip_address || null,
    details: event.details,
    timestamp: new Date().toISOString()
  });

  // Si es crítico, enviar alerta inmediata
  if (event.severity === 'critical') {
    await sendSecurityAlert(event);
  }
}

async function sendSecurityAlert(event: any) {
  // Integrar con servicio de alertas (email, Slack, PagerDuty)
  await fetch('https://hooks.slack.com/services/YOUR_WEBHOOK', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 CRITICAL SECURITY EVENT: ${event.type}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Type:* ${event.type}\n*Severity:* ${event.severity}\n*Details:* ${JSON.stringify(event.details)}`
          }
        }
      ]
    })
  });
}
```

### 5.2 Monitoring Metrics

Configurar alertas en Vercel + Supabase para:

1. **Rate limit hits** > 100/hora → posible ataque
2. **Failed auth attempts** > 10/min → brute force
3. **Stripe webhook failures** > 5/día → investigar
4. **Error rate** > 5% → posible exploit
5. **Response time** > 5s → posible DoS

### 5.3 Incident Response Plan

**Severidad CRITICAL (data breach, RCE):**
1. **T+0min:** Detectar alerta automática
2. **T+5min:** Deshabilitar endpoints afectados (feature flag)
3. **T+15min:** Invalidar todas las sesiones activas
4. **T+30min:** Análisis de logs + scope del incidente
5. **T+1h:** Notificar a usuarios afectados (si aplica RGPD)
6. **T+24h:** Post-mortem + parches deployed

**Severidad HIGH (XSS, CSRF):**
1. **T+0min:** Detectar
2. **T+1h:** Patch prioritario
3. **T+4h:** Deploy a producción
4. **T+24h:** Post-mortem interno

---

## 6. COMPLIANCE & PRIVACY

### 6.1 GDPR Compliance Checklist

- ✅ Checkbox de consentimiento OBLIGATORIO antes de grabar
- ✅ Derecho al olvido: endpoint para eliminar datos
- ✅ Portabilidad de datos: exportar transcripciones
- ✅ Encriptación en tránsito (HTTPS) y en reposo (Supabase)
- ✅ Política de privacidad publicada
- ⚠️ **PENDIENTE:** Registro de actividades de tratamiento
- ⚠️ **PENDIENTE:** DPO (Data Protection Officer) designado

### 6.2 Data Retention Policy

```sql
-- Función para eliminar datos antiguos (GDPR)
CREATE OR REPLACE FUNCTION delete_old_sessions()
RETURNS void AS $$
BEGIN
  -- Eliminar sesiones anónimas > 90 días
  DELETE FROM sessions
  WHERE user_id IS NULL
    AND ended_at < NOW() - INTERVAL '90 days';

  -- Eliminar transcripciones de sesiones eliminadas
  DELETE FROM transcriptions
  WHERE session_id NOT IN (SELECT id FROM sessions);

  -- Eliminar sugerencias de sesiones eliminadas
  DELETE FROM suggestions
  WHERE session_id NOT IN (SELECT id FROM sessions);
END;
$$ LANGUAGE plpgsql;

-- Ejecutar diariamente vía cron job de Supabase
-- O configurar en pg_cron
```

### 6.3 Right to Erasure Implementation

```typescript
// app/api/gdpr/delete/route.ts
export async function POST(request: Request) {
  const supabase = await createClient();

  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Eliminar todos los datos del usuario
  // Orden importante: primero hijos, luego padres

  // 1. Eliminar sugerencias
  await supabase.from('suggestions').delete().eq('session_id', user.id);

  // 2. Eliminar transcripciones
  await supabase.from('transcriptions').delete().eq('session_id', user.id);

  // 3. Eliminar sesiones
  await supabase.from('sessions').delete().eq('user_id', user.id);

  // 4. Cancelar suscripción de Stripe (si existe)
  const { data: stripeCustomer } = await supabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (stripeCustomer) {
    await stripe.customers.del(stripeCustomer.stripe_customer_id);
  }

  // 5. Eliminar perfil
  await supabase.from('profiles').delete().eq('id', user.id);

  // 6. Eliminar usuario de auth.users (Supabase)
  await supabase.auth.admin.deleteUser(user.id);

  // Log de auditoría
  await logSecurityEvent({
    type: 'data_access',
    severity: 'medium',
    user_id: user.id,
    details: { action: 'account_deletion', gdpr_request: true }
  });

  return Response.json({ success: true, message: 'All data deleted' });
}
```

---

## 7. DEPLOYMENT SECURITY CHECKLIST

### Pre-Deployment (BLOQUEADORES)

- [ ] ❌ VULN-001: Resolver service role key bypass (CRITICAL)
- [ ] ❌ VULN-002: Implementar validación de input (CRITICAL)
- [ ] ❌ VULN-003: Limpiar console.log en producción (HIGH)
- [ ] ❌ VULN-004: Resolver XSS vía innerHTML (HIGH)
- [ ] ❌ VULN-005: Implementar rate limiting (HIGH)
- [ ] ❌ VULN-006: Mejorar verificación Stripe webhooks (HIGH)

### Pre-Deployment (Recomendadas)

- [ ] ⚠️ VULN-007: Configurar CORS (MEDIUM)
- [ ] ⚠️ VULN-008: Limpiar localhost de host_permissions (MEDIUM)
- [ ] ⚠️ VULN-009: Validar HTTPS en producción (MEDIUM)
- [ ] ⚠️ VULN-010: Encriptar chrome.storage (MEDIUM)
- [ ] ⚠️ VULN-011: Mejorar CSP de extensión (MEDIUM)
- [ ] ⚠️ VULN-012: Sanitizar error messages (MEDIUM)

### Post-Deployment (48h)

- [ ] VULN-013: Agregar security headers (LOW)
- [ ] VULN-014: Configurar Dependabot (LOW)
- [ ] VULN-015: Configurar backups (LOW)

### Continuous Security

- [ ] Ejecutar `npm audit` semanalmente
- [ ] Revisar logs de seguridad diariamente
- [ ] Actualizar dependencias mensualmente
- [ ] Penetration testing trimestral (contratar externo)
- [ ] Security awareness training para el equipo

---

## 8. SECURE DEVELOPMENT GUIDELINES

### 8.1 Code Review Checklist

Antes de cada PR, verificar:

```markdown
## Security Review Checklist

- [ ] No hay API keys hardcodeadas
- [ ] Validación de input en TODOS los endpoints
- [ ] Sanitización de output antes de renderizar
- [ ] Autenticación verificada donde corresponde
- [ ] RLS policies respetadas (no bypass con service role)
- [ ] Error messages no exponen stack traces
- [ ] Console.log no loggea datos sensibles
- [ ] HTTPS usado para todas las comunicaciones externas
- [ ] Dependencias actualizadas (npm audit clean)
- [ ] Tests de seguridad pasan
```

### 8.2 Git Commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Buscar secrets antes de commit
git secrets --scan

# Buscar console.log con datos sensibles
if git diff --cached | grep -E "console\.(log|error).*session_id|user_id|transcription"; then
  echo "❌ ERROR: Commit contiene console.log con datos sensibles"
  exit 1
fi

# Ejecutar linter
npm run lint

# Ejecutar tests de seguridad
npm run test:security
```

### 8.3 Environment Variables Security

```bash
# .env.local.example (template para el equipo)
# NUNCA commitear .env.local

# Server-only (NUNCA exponer al cliente)
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Public (OK exponer al cliente)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

### 8.4 Dependency Management

```json
// package.json
{
  "scripts": {
    "postinstall": "npm audit --production",
    "audit:fix": "npm audit fix",
    "audit:check": "npm audit --audit-level=high"
  }
}
```

---

## 9. PENETRATION TESTING GUIDE

### 9.1 Scope

**In-Scope:**
- Chrome Extension (manifest, content scripts, background)
- Next.js Backend (/api routes)
- Supabase integration
- Stripe integration (webhooks)

**Out-of-Scope:**
- Supabase infrastructure (gestionado por Supabase)
- Stripe infrastructure (gestionado por Stripe)
- Anthropic API (gestionado por Anthropic)
- Social engineering
- Physical security

### 9.2 Test Scenarios

**1. Authentication & Authorization**
- [ ] Bypass JWT validation
- [ ] Session hijacking
- [ ] IDOR en endpoints de sesiones
- [ ] Privilege escalation (free → pro)

**2. Input Validation**
- [ ] SQL injection (si aplica)
- [ ] NoSQL injection (JSON)
- [ ] XSS (stored, reflected, DOM-based)
- [ ] Command injection
- [ ] Path traversal

**3. Business Logic**
- [ ] Bypass paywall
- [ ] Crear sesiones ilimitadas
- [ ] Acceder a transcripciones de otros usuarios
- [ ] Manipular suscripciones de Stripe

**4. Data Exposure**
- [ ] Información sensible en error messages
- [ ] Stack traces en producción
- [ ] Transcripciones sin autenticación
- [ ] API keys en código cliente

**5. Cryptography**
- [ ] Weak encryption en chrome.storage
- [ ] Missing HTTPS enforcement
- [ ] Insecure random number generation

---

## 10. INCIDENT RESPONSE PLAYBOOK

### Scenario 1: Data Breach Detected

**Indicators:**
- Acceso no autorizado a transcripciones
- Logs muestran exfiltración masiva de datos
- Usuario reporta acceso no autorizado a su cuenta

**Response:**
1. **Containment (0-1h):**
   - Deshabilitar endpoints comprometidos
   - Invalidar todas las sesiones activas
   - Cambiar API keys comprometidas

2. **Investigation (1-4h):**
   - Revisar logs de Vercel + Supabase
   - Identificar scope: ¿cuántos usuarios afectados?
   - Determinar vector de ataque

3. **Remediation (4-24h):**
   - Parchear vulnerabilidad
   - Forzar password reset de usuarios afectados
   - Notificar a usuarios (RGPD: 72h para reportar)

4. **Post-Mortem (24-72h):**
   - Documentar incidente
   - Actualizar playbook
   - Implementar controles adicionales

### Scenario 2: DDoS Attack

**Indicators:**
- Response times > 10s
- Error rate > 20%
- Rate limit hits > 1000/min

**Response:**
1. **Immediate:**
   - Activar Vercel Pro (mayor capacidad)
   - Habilitar Cloudflare en front del backend
   - Bloquear IPs atacantes (WAF)

2. **Short-term:**
   - Analizar logs para identificar patrón
   - Implementar rate limiting más agresivo
   - Contactar Vercel support

---

## 11. RECOMMENDED SECURITY TOOLS

### Development
- **Secrets scanning:** git-secrets, TruffleHog
- **SAST:** ESLint Security Plugin, Semgrep
- **Dependency scanning:** npm audit, Snyk
- **Code quality:** SonarQube

### Production Monitoring
- **Logging:** Vercel Logs, Supabase Logs
- **Error tracking:** Sentry
- **Uptime monitoring:** Better Uptime
- **Security monitoring:** Cloudflare WAF

### Testing
- **Manual testing:** Burp Suite, OWASP ZAP
- **Automated testing:** OWASP Dependency Check
- **Load testing:** k6, Artillery

---

## 12. CONTACTS & ESCALATION

### Security Contacts
- **Security Lead:** Victor Rodriguez (hola@tryconfident.com)
- **Vercel Support:** support@vercel.com
- **Supabase Support:** support@supabase.io
- **Stripe Security:** security@stripe.com

### Escalation Path
1. **LOW/MEDIUM:** Security Lead → Fix within 7 days
2. **HIGH:** Security Lead → Fix within 72 hours
3. **CRITICAL:** Immediate escalation → Fix within 24 hours

### Responsible Disclosure
Si encuentras una vulnerabilidad:
1. Email a: security@tryconfident.com
2. No publicar detalles hasta recibir confirmación
3. Timeline de respuesta: 72h para acknowled

ge, 30 días para fix

---

## APPENDIX A: SECURITY RESOURCES

### OWASP Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Chrome Extension Security
- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Content Security Policy](https://developer.chrome.com/docs/apps/contentSecurityPolicy/)

### Compliance
- [GDPR Official Text](https://gdpr-info.eu/)
- [PCI-DSS Requirements](https://www.pcisecuritystandards.org/)
- [Stripe Security](https://stripe.com/docs/security/guide)

---

**Documento generado:** 2026-03-20
**Próxima revisión:** Antes de cada deployment + mensualmente
**Versión:** 1.0
**Estado:** DRAFT - Pendiente de remediation

---

**CONCLUSIÓN EJECUTIVA:**

Este proyecto tiene una base de seguridad sólida con buenas intenciones (RLS, JWT auth, Stripe signature verification), pero tiene **6 vulnerabilidades bloqueadoras** (2 CRITICAL + 4 HIGH) que DEBEN resolverse antes de deployment público.

**Prioridad máxima:**
1. VULN-001: Service role key bypass (48h)
2. VULN-002: Input validation (72h)
3. VULN-003: Console.log cleanup (24h)
4. VULN-004: XSS mitigation (72h)
5. VULN-005: Rate limiting (pre-deployment)
6. VULN-006: Stripe webhook hardening (antes de activar pagos)

**Tiempo estimado total de remediación:** 5-7 días de desarrollo.

**Recomendación:** NO publicar en Chrome Web Store ni activar Stripe hasta resolver vulnerabilidades CRITICAL y HIGH.
