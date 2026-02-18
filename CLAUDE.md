# CLAUDE.md — Confident
> **Lee este archivo completo antes de escribir cualquier línea de código.**
> Este es el documento de referencia absoluta del proyecto. Cualquier decisión técnica
> que no esté aquí debe consultarse antes de implementarse.

---

## 1. QUÉ ES ESTE PROYECTO

**Confident** es una extensión de Chrome que actúa como confidente silencioso durante
videollamadas en Google Meet. Como un amigo experto que te habla al oído, escucha
ambas partes de la conversación, analiza el contexto con IA, y muestra en un panel
lateral discreto tres elementos:

### Nombre y concepto de marca
- **Nombre:** Confident
- **Concepto:** confidente — amigo, colega de confianza, chivato en el buen sentido
- **Tagline:** *"Tu confidente en cada conversación importante"*
- **Tono de marca:** cercano, directo, cómplice — como ese amigo listo que siempre
  sabe qué decir y te lo susurra en el momento justo. No es un asistente corporativo.
  Es tu colega de confianza.
- **Voz de la app:** primera persona del plural cómplice — *"Te tenemos"*, *"Aquí estamos"*,
  *"Lo vemos"*. Nunca frío, nunca formal en exceso.

### Lo que hace

1. **Sugerencia principal** — qué decir ahora mismo (texto grande, destacado)
2. **Contexto** — qué tipo de pregunta es y qué busca el entrevistador con ella
3. **Keywords** — palabras clave que el usuario debe incluir en su respuesta

El valor del producto **NO es la transcripción**. La transcripción es el mecanismo.
El valor es la chuleta inteligente en tiempo real. El usuario ve lo que tiene que decir,
no lo que se ha dicho.

### Los tres perfiles de usuario del MVP

El sistema debe comportarse de forma diferente según el perfil activo. El usuario
lo selecciona antes de iniciar cada sesión. Cada perfil tiene su propio rol,
sus propios tipos de señal a detectar, y su propio estilo de sugerencia.

**Perfil 1 — CANDIDATO** (procesos de selección)
El usuario es el candidato. El interlocutor es el entrevistador, reclutador o
evaluador técnico. El sistema detecta preguntas de competencias, técnicas,
motivacionales y situacionales, y sugiere cómo responderlas usando marcos
estructurados (STAR, CAR, etc.). El tono es el de un coach de carrera
experimentado hablándole al oído.

**Perfil 2 — VENDEDOR** (llamadas comerciales)
El usuario está ofreciendo sus servicios o productos. El interlocutor es un
cliente potencial, decisor o stakeholder. El sistema detecta objeciones,
señales de compra, preguntas de precio/valor, y momentos de cierre, y sugiere
cómo manejarlos. El tono es el de un mentor de ventas consultivas.

**Perfil 3 — DEFENSOR / EXPERTO** (comprensión y argumentación)
El usuario necesita entender bien una pregunta compleja antes de responder,
o defender una posición con argumentos sólidos. Puede ser una reunión técnica,
una negociación, una presentación a dirección, o cualquier contexto donde la
comprensión profunda y la argumentación son la clave. El sistema descompone
la pregunta, explica qué se está pidiendo realmente, y sugiere la estructura
de respuesta más sólida. El tono es el de un asesor estratégico.

Plataforma del MVP: exclusivamente Google Meet (meet.google.com).

### Contexto del usuario
- Victor (el propietario del proyecto) no tiene perfil técnico de desarrollo
- No gestiona servidores, no escribe código, no hace deploys manuales
- Usa Claude Code para todo el desarrollo
- Tiene cuentas activas en: Vercel, Supabase, Anthropic, Deepgram, Posthog, Resend

### Principios de desarrollo
1. **Funcionamiento > Simplicidad > Elegancia técnica**
2. Si algo funciona de forma simple aunque no sea elegante, es la decisión correcta
3. Nunca cambies el stack sin preguntar explícitamente
4. Nunca asumas que algo funciona — verifica con un test mínimo primero
5. Al final de cada sesión, actualiza PROGRESS.md con estado actual y próximo paso

---

## 2. STACK TÉCNICO DEFINITIVO

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Landing + API routes | Next.js App Router | 14.x | SSR para SEO, mismo repo que backend |
| Estilos | Tailwind CSS + shadcn/ui | latest | Rápido, sin diseñador, componentes listos |
| Extensión | Chrome MV3 Vanilla JS | — | Sin frameworks, máxima compatibilidad Chrome |
| Captura audio tab | chrome.tabCapture API | — | Nativo, audio del entrevistador |
| Captura micrófono | getUserMedia API | — | Nativo, audio del usuario |
| Mezcla de streams | Web Audio API / AudioContext | — | Combina ambas fuentes en un stream |
| Transcripción | Deepgram API (Nova-2, streaming) | latest | $200 free tier, baja latencia, WebSocket |
| Análisis IA | Anthropic Claude | claude-sonnet-4-6 | Razonamiento contextual superior |
| Backend | Vercel Serverless Functions | Node.js 18+ | Deploy automático, sin servidor que gestionar |
| Base de datos | Supabase PostgreSQL | — | Auth + DB + RLS en uno, región Frankfurt |
| Analytics | Posthog | EU region | Funnel tracking, free tier 1M eventos |
| Email transaccional | Resend | — | 3.000 emails/mes gratuitos |
| Pagos (preparado) | Stripe | — | Arquitectura lista, NO activo en MVP |
| Repositorio | GitHub | — | Integración directa con Vercel |

### Lo que NO usamos y por qué
- **SiteGround / hosting tradicional** — no soporta Node.js backend, diseñado para WordPress
- **Whisper de OpenAI** — requiere tarjeta, mayor latencia que Deepgram para streaming
- **WebSockets propios** — Vercel free no los soporta en larga duración; Deepgram los gestiona
- **Frameworks en la extensión** — React/Vue en extensiones MV3 añade complejidad innecesaria
- **Bot participante en Meet** — visible para otros, genera desconfianza, muchas empresas lo bloquean

---

## 3. ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    CHROME EXTENSION                          │
│                                                              │
│  content-script.js                                           │
│  ├── Se inyecta en meet.google.com                           │
│  ├── Detecta que Meet está activo                            │
│  └── Comunica con background via chrome.runtime.sendMessage  │
│                                                              │
│  background.js (Service Worker MV3)                          │
│  ├── Gestiona chrome.tabCapture (audio entrevistador)        │
│  ├── Gestiona getUserMedia (micrófono usuario)               │
│  ├── Mezcla streams con AudioContext                         │
│  ├── Abre WebSocket con Deepgram para streaming              │
│  ├── Recibe transcripciones en tiempo real                   │
│  ├── Envía texto a /api/analyze cada vez que hay frase       │
│  └── Reenvía sugerencias al Side Panel                       │
│                                                              │
│  side-panel/panel.html + panel.js                            │
│  ├── Muestra sugerencia principal (grande, destacada)        │
│  ├── Muestra contexto y keywords                             │
│  ├── Botón "Iniciar sesión" (activa captura con user gesture)│
│  ├── Checkbox de consentimiento (obligatorio antes de iniciar)│
│  ├── Contador de sesiones usadas                             │
│  └── Historial colapsado de la sesión actual                 │
│                                                              │
│  popup/popup.html + popup.js                                 │
│  ├── Tipo de sesión (entrevista / técnica / ventas / otro)   │
│  ├── Estado de sesión activa                                 │
│  └── Enlace a dashboard web                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS + Supabase JWT
┌────────────────────▼────────────────────────────────────────┐
│                    VERCEL BACKEND                             │
│                    (Next.js API Routes)                      │
│                                                              │
│  /api/analyze                                                │
│  └── Recibe texto + contexto → Claude → devuelve JSON        │
│                                                              │
│  /api/session                                                │
│  └── POST crear sesión / PATCH cerrar sesión                 │
│                                                              │
│  /api/usage                                                  │
│  └── GET contador de sesiones (anónimo o autenticado)        │
│                                                              │
│  /api/send-transcript                                        │
│  └── POST al cerrar sesión → Resend → email a participantes  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    SUPABASE                                   │
│  auth.users / profiles / sessions /                          │
│  transcriptions / suggestions / usage_tracking               │
└─────────────────────────────────────────────────────────────┘

FLUJO DE AUDIO (separado, va directo desde extensión a Deepgram):

background.js → WebSocket → Deepgram API
                               ↓
                    Transcripción en tiempo real
                               ↓
               background.js recibe texto → /api/analyze
```

### Flujo completo de una sesión

```
1. Usuario abre Google Meet → content-script detecta meet.google.com
2. Usuario abre el Side Panel → ve el botón "Iniciar El Chivato"
3. Usuario marca checkbox: "He informado a los participantes"
4. Usuario hace clic en "Iniciar" (user gesture obligatorio para tabCapture)
5. background.js captura audio del tab + micrófono
6. Se mezclan en AudioContext → stream unificado
7. Se abre WebSocket con Deepgram (Nova-2, español, diarización de hablantes)
8. Deepgram devuelve transcripciones parciales cada ~1 segundo
9. Cuando detecta fin de frase → POST a /api/analyze con texto + contexto
10. Claude devuelve JSON con sugerencia, contexto, keywords, urgencia
11. background.js → chrome.runtime.sendMessage → panel actualiza UI
12. Usuario ve sugerencia en menos de 5 segundos desde que termina la frase
13. Al finalizar → POST /api/send-transcript → email con transcripción completa
```

---

## 4. ESTRUCTURA DE CARPETAS

```
el-chivato/
│
├── CLAUDE.md                        ← Este archivo (leer primero siempre)
├── PROGRESS.md                      ← Estado actual del proyecto (actualizar al final de sesión)
├── README.md                        ← Setup para humanos
├── .env.local                       ← Variables de entorno (NUNCA subir a GitHub)
├── .env.example                     ← Plantilla documentada (sí subir)
├── .gitignore                       ← Incluye .env.local
├── vercel.json                      ← Config de despliegue
├── next.config.js                   ← Config Next.js
├── package.json
│
├── app/                             ← Next.js App Router
│   ├── layout.tsx                   ← Layout global con Posthog provider
│   ├── page.tsx                     ← Landing page principal
│   ├── pricing/
│   │   └── page.tsx                 ← Página de precios (paywall duro)
│   ├── login/
│   │   └── page.tsx                 ← Login / registro con Google
│   ├── dashboard/
│   │   └── page.tsx                 ← Historial de sesiones del usuario
│   └── api/
│       ├── analyze/
│       │   └── route.ts             ← POST: texto → Claude → sugerencia JSON
│       ├── session/
│       │   └── route.ts             ← POST crear / PATCH cerrar sesión
│       ├── usage/
│       │   └── route.ts             ← GET contador sesiones
│       └── send-transcript/
│           └── route.ts             ← POST envío email transcripción
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── UseCases.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   └── ui/                          ← shadcn/ui components (auto-generados)
│
├── lib/
│   ├── supabase.ts                  ← Cliente Supabase (browser)
│   ├── supabase-server.ts           ← Cliente Supabase (server, service role)
│   ├── claude.ts                    ← Wrapper Anthropic SDK + prompt
│   ├── deepgram.ts                  ← Config Deepgram (usada en extensión)
│   ├── analytics.ts                 ← Wrapper Posthog con eventos tipados
│   └── constants.ts                 ← Límites freemium, tipos de sesión
│
├── supabase/
│   ├── schema.sql                   ← Schema completo con RLS
│   └── migrations/                  ← Migraciones futuras
│
└── extension/
    ├── manifest.json                ← Config Chrome MV3
    ├── background.js                ← Service Worker principal
    ├── content-script.js            ← Inyectado en meet.google.com
    ├── deepgram-client.js           ← WebSocket Deepgram (importado en background)
    ├── side-panel/
    │   ├── panel.html
    │   ├── panel.js
    │   └── panel.css
    ├── popup/
    │   ├── popup.html
    │   ├── popup.js
    │   └── popup.css
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## 5. MANIFEST.JSON (Chrome MV3)

```json
{
  "manifest_version": 3,
  "name": "El Chivato",
  "version": "0.1.0",
  "description": "Tu asistente invisible en cada entrevista",

  "permissions": [
    "tabCapture",
    "activeTab",
    "storage",
    "sidePanel",
    "scripting"
  ],

  "host_permissions": [
    "https://meet.google.com/*",
    "https://*.vercel.app/*",
    "https://elchivato.com/*"
  ],

  "background": {
    "service_worker": "background.js",
    "type": "module"
  },

  "content_scripts": [
    {
      "matches": ["https://meet.google.com/*"],
      "js": ["content-script.js"],
      "run_at": "document_idle"
    }
  ],

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

### Notas críticas sobre permisos
- `tabCapture` requiere user gesture para activarse (clic del usuario en el panel)
- `sidePanel` es la API de Chrome para panel lateral (disponible desde Chrome 114)
- NO usar `<all_urls>` en host_permissions — solo los dominios necesarios
- NO usar `eval()` ni strings como código (viola Content Security Policy de Chrome MV3)
- El Service Worker se puede terminar por Chrome en cualquier momento — no guardes estado en variables globales

---

## 6. REGLAS TÉCNICAS CRÍTICAS

### Extensión (OBLIGATORIO)
```
✅ SIEMPRE usar Manifest V3
✅ SIEMPRE usar chrome.storage.session para estado de sesión activa
✅ SIEMPRE usar chrome.storage.local para datos persistentes locales
✅ SIEMPRE usar chrome.storage.sync para preferencias del usuario
✅ El botón "Iniciar" DEBE ser un user gesture real para activar tabCapture
✅ Toda comunicación extensión ↔ backend usa HTTPS con header Authorization
❌ NUNCA variables globales persistentes en Service Worker
❌ NUNCA almacenar audio en ninguna base de datos
❌ NUNCA usar innerHTML con datos externos (XSS)
❌ NUNCA código MV2 (no uses background.html, no uses chrome.browserAction)
```

### Backend (OBLIGATORIO)
```
✅ SIEMPRE validar token JWT de Supabase antes de procesar
✅ SIEMPRE responder en menos de 10 segundos (límite Vercel free)
✅ SIEMPRE responder con JSON estructurado aunque sea un error
✅ SIEMPRE usar supabase-server.ts con service_role para operaciones de escritura
✅ Datos en Supabase región Frankfurt (cumplimiento RGPD)
❌ NUNCA exponer SUPABASE_SERVICE_ROLE_KEY al cliente
❌ NUNCA almacenar audio
❌ NUNCA hacer llamadas a APIs externas sin timeout definido (máx 8s)
```

### Analytics (OBLIGATORIO)
```
Cada uno de estos eventos DEBE dispararse en el momento correcto:

extension_installed          → background.js, onInstalled listener
session_started              → background.js, al iniciar captura
  props: { profile, session_number, is_anonymous }
  ↑ profile = "candidato" | "vendedor" | "defensor"
suggestion_shown             → panel.js, al renderizar sugerencia
  props: { profile, signal_type, urgency_level }
suggestion_rated             → panel.js, al hacer thumbs up/down
  props: { profile, helpful: boolean }
paywall_soft_shown           → panel.js, al llegar a sesión 6 sin cuenta
paywall_soft_converted       → /api/session, tras registro exitoso
paywall_hard_shown           → pricing/page.tsx, al llegar a sesión 16
pricing_page_viewed          → pricing/page.tsx, al cargar la página
payment_cta_clicked          → pricing/page.tsx, clic en botón de pago
  props: { plan_selected }
```

---

## 7. SCHEMA DE BASE DE DATOS

```sql
-- ================================================
-- PERFILES (extensión de auth.users de Supabase)
-- ================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  anonymous_id TEXT UNIQUE,      -- UUID local antes de registrarse
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SESIONES
-- ================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  anonymous_id TEXT,             -- Para sesiones sin cuenta (1-5)
  profile TEXT CHECK (
    profile IN ('candidato', 'vendedor', 'defensor')
  ) NOT NULL,
  session_type TEXT,             -- descripción libre opcional del usuario
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'completed', 'abandoned')
  ),
  consent_confirmed BOOLEAN DEFAULT FALSE,
  participants_emails TEXT[],    -- Emails para enviar transcripción
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  suggestions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TRANSCRIPCIONES
-- ================================================
CREATE TABLE transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  speaker TEXT CHECK (speaker IN ('user', 'other', 'unknown')),
  text TEXT NOT NULL,
  timestamp_ms INTEGER,
  language CHAR(2) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SUGERENCIAS
-- ================================================
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  transcription_id UUID REFERENCES transcriptions(id),
  question_type TEXT CHECK (
    question_type IN ('behavioral','technical','situational','salary','other')
  ),
  suggestion_text TEXT NOT NULL,
  context_text TEXT,
  keywords TEXT[],
  urgency_level INTEGER CHECK (urgency_level BETWEEN 1 AND 3),
  was_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TRACKING DE USO (funnel freemium)
-- ================================================
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  anonymous_id TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "own_sessions" ON sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "own_transcriptions" ON transcriptions
  FOR ALL USING (
    session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "own_suggestions" ON suggestions
  FOR ALL USING (
    session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid())
  );

-- ================================================
-- FUNCIÓN: incrementar contador al crear sesión
-- ================================================
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
  FOR EACH ROW EXECUTE FUNCTION increment_session_count();
```

---

## 8. PROMPTS DE CLAUDE (el motor del producto)

El sistema usa **un prompt diferente por cada perfil de usuario**. El perfil se
selecciona antes de iniciar la sesión y se envía como parámetro al endpoint.
Este es el elemento más importante del producto — pequeños cambios aquí tienen
gran impacto en la calidad percibida.

### Estructura común a los tres prompts

Todos los prompts comparten el mismo formato de respuesta JSON para que el panel
lateral no necesite lógica diferente según el perfil. Lo que cambia es el rol,
los tipos de señal a detectar, y el estilo de sugerencia.

```typescript
// lib/claude.ts

// ─────────────────────────────────────────────
// PERFIL 1: CANDIDATO — Procesos de selección
// ─────────────────────────────────────────────
const PROMPT_CANDIDATO = `
Eres el coach silencioso de El Chivato. Asistes a un CANDIDATO durante una
entrevista de trabajo o proceso de selección en tiempo real.

ROL DE CADA PARTE:
- USUARIO = el candidato (quiere el puesto, debe demostrar competencias)
- INTERLOCUTOR = entrevistador, reclutador, hiring manager o evaluador técnico

SEÑALES QUE DEBES DETECTAR:
- behavioral: "Cuéntame una vez que...", "Dame un ejemplo de...", "¿Cómo gestionaste...?"
  → Sugiere estructura STAR: Situación, Tarea, Acción, Resultado
- technical: preguntas de código, arquitectura, sistemas, herramientas, tecnologías
  → Sugiere el enfoque y los puntos clave a mencionar, no la respuesta completa
- situational: "¿Qué harías si...?", "¿Cómo manejarías...?"
  → Sugiere el marco de decisión que usaría un profesional senior
- salary: preguntas sobre expectativas salariales, beneficios, condiciones
  → Sugiere cómo anclar alto, pedir el rango y no revelar primero
- motivation: "¿Por qué quieres este puesto?", "¿Por qué dejaste...?"
  → Sugiere respuesta que conecta trayectoria con oportunidad, sin negatividad
- presentation: "Cuéntame sobre ti", "¿Quién eres?", "Preséntate"
  → Sugiere estructura: pasado relevante → logro clave → por qué aquí ahora
- closing: "¿Tienes alguna pregunta para nosotros?"
  → Sugiere 1-2 preguntas de alto impacto que demuestren interés real
- pressure: preguntas difíciles, silencio incómodo, cuestionamiento de experiencia
  → Sugiere cómo mantener la calma y reconducir la conversación

ESTILO DE SUGERENCIA:
Como un coach de carrera senior hablándote al oído. Directo, sin adornos.
Máximo 2-3 líneas. Si es behavioral, siempre menciona STAR.
`;

// ─────────────────────────────────────────────
// PERFIL 2: VENDEDOR — Llamadas comerciales
// ─────────────────────────────────────────────
const PROMPT_VENDEDOR = `
Eres el mentor silencioso de El Chivato. Asistes a un VENDEDOR durante una
llamada comercial, reunión de ventas o presentación de producto/servicio.

ROL DE CADA PARTE:
- USUARIO = el vendedor (quiere cerrar, generar interés o avanzar el proceso)
- INTERLOCUTOR = cliente potencial, decisor, stakeholder o evaluador de proveedores

SEÑALES QUE DEBES DETECTAR:
- objection_price: "Es muy caro", "No tenemos presupuesto", "La competencia es más barata"
  → Sugiere cómo reencuadrar precio como inversión y explorar el ROI real
- objection_need: "No lo necesitamos ahora", "Ya tenemos algo similar"
  → Sugiere preguntas para descubrir el dolor real detrás de la objeción
- objection_trust: "No os conozco", "¿Qué experiencia tenéis?", "Dame referencias"
  → Sugiere prueba social, caso de éxito específico, garantía o piloto
- buying_signal: interés real, preguntas sobre implementación, plazos, equipo
  → URGENCIA 3: señal de compra activa — sugiere avanzar hacia el cierre
- closing_opportunity: pausa larga, "lo pensaré", "¿cuáles son los próximos pasos?"
  → Sugiere técnica de cierre suave o propuesta de siguiente acción concreta
- discovery: el cliente habla de sus problemas, necesidades, contexto
  → Sugiere preguntas de profundización para entender el dolor completo
- value_question: "¿Qué os diferencia?", "¿Por qué vosotros y no otro?"
  → Sugiere propuesta de valor diferencial, no lista de features
- negotiation: regateo, condiciones, descuentos, contrato
  → Sugiere cómo negociar sin ceder en precio, ofreciendo valor alternativo

ESTILO DE SUGERENCIA:
Como un director comercial senior hablándote al oído. Orientado a acción y cierre.
Máximo 2-3 líneas. En señales de compra, urgencia siempre 3.
`;

// ─────────────────────────────────────────────
// PERFIL 3: DEFENSOR — Comprensión y argumentación
// ─────────────────────────────────────────────
const PROMPT_DEFENSOR = `
Eres el asesor silencioso de El Chivato. Asistes a alguien que necesita
COMPRENDER BIEN una pregunta compleja y DEFENDER una posición con argumentos sólidos.

Casos típicos: reunión técnica, presentación a dirección, negociación estratégica,
defensa de proyecto, junta de accionistas, reunión con stakeholders exigentes,
debate profesional, consultoría, junta médica, vista legal informal.

ROL DE CADA PARTE:
- USUARIO = el defensor (debe comprender, argumentar y sostener su posición)
- INTERLOCUTOR = quien pregunta, cuestiona, evalúa o decide

SEÑALES QUE DEBES DETECTAR:
- complex_question: pregunta con múltiples capas, tecnicismos o ambigüedad
  → Descompón la pregunta: qué se está pidiendo realmente, en 1-2 líneas claras
  → Luego sugiere la estructura de respuesta más sólida
- assumption_challenge: cuestionan una hipótesis, un dato o una decisión tomada
  → Sugiere cómo defender con evidencia, reconocer límites y mantener posición
- scope_question: "¿Hasta dónde llega esto?", "¿Qué está fuera del alcance?"
  → Sugiere cómo delimitar claramente sin cerrar puertas innecesariamente
- risk_question: "¿Qué pasa si falla?", "¿Cuáles son los riesgos?"
  → Sugiere cómo mostrar que los riesgos están identificados y gestionados
- alternative_challenge: "¿Por qué no hicisteis X en vez de Y?"
  → Sugiere cómo justificar la decisión tomada sin descartar la alternativa
- data_request: piden números, métricas, evidencia que quizás no tienes a mano
  → Sugiere cómo responder honestamente sin perder autoridad
- pressure_question: pregunta cargada, hostil o diseñada para desestabilizar
  → Sugiere cómo mantener la calma, reencuadrar y recuperar el control
- clarification_needed: la pregunta es confusa o parece tener doble intención
  → Sugiere cómo pedir aclaración sin parecer que no entiendes

ESTILO DE SUGERENCIA:
Como un asesor estratégico senior. Primero explica brevemente QUÉ se está
preguntando realmente (1 línea), luego da la estructura de respuesta (2 líneas).
Nunca des la respuesta completa — da el mapa para que el usuario construya la suya.
`;
```

### Sistema de selección de prompt según perfil

```typescript
// lib/claude.ts

type UserProfile = 'candidato' | 'vendedor' | 'defensor';

const PROMPTS: Record<UserProfile, string> = {
  candidato: PROMPT_CANDIDATO,
  vendedor: PROMPT_VENDEDOR,
  defensor: PROMPT_DEFENSOR,
};

// Sufijo común añadido a los tres prompts
const COMMON_SUFFIX = `
NIVELES DE URGENCIA (iguales para los tres perfiles):
1 = Informativo — contexto útil, no es urgente actuar ahora
2 = Importante — señal clara, preparar respuesta en los próximos segundos
3 = Crítico — actúa ahora, están esperando tu respuesta o es un momento clave

FORMATO DE RESPUESTA — responde ÚNICAMENTE con este JSON, sin texto adicional,
sin markdown, sin explicaciones fuera del JSON:
{
  "signal_detected": boolean,
  "signal_type": string | null,
  "urgency": 1 | 2 | 3,
  "what_is_being_asked": "En 1 línea: qué se está pidiendo o qué está pasando realmente.",
  "suggestion": "Qué hacer o decir ahora. Máximo 2-3 líneas. Directo y accionable.",
  "keywords": ["término1", "término2", "término3"],
  "speaker_detected": "user" | "other" | "unknown"
}

Si no hay señal relevante (small talk, silencio, tema irrelevante), responde:
{
  "signal_detected": false,
  "signal_type": null,
  "urgency": 1,
  "what_is_being_asked": null,
  "suggestion": null,
  "keywords": [],
  "speaker_detected": "other"
}

REGLAS ABSOLUTAS:
- El usuario está en una llamada en vivo. Máximo 3 líneas en "suggestion"
- Detecta el idioma del fragmento y responde en ese mismo idioma
- Si hay errores de transcripción evidentes, infiere el significado por contexto
- Nunca inventes datos, cifras o ejemplos que el usuario no pueda verificar
- "what_is_being_asked" siempre se rellena cuando signal_detected es true
`;

export function getSystemPrompt(profile: UserProfile): string {
  return PROMPTS[profile] + COMMON_SUFFIX;
}
```

### Llamada al endpoint con perfil

```typescript
// /api/analyze/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt } from '@/lib/claude';

const client = new Anthropic();

export async function POST(request: Request) {
  // 1. Validar JWT de Supabase
  // 2. Validar límite de uso (freemium)
  // 3. Obtener perfil + texto + contexto

  const { text, context, profile, session_type } = await request.json();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 350,
    system: getSystemPrompt(profile),   // ← perfil seleccionado por el usuario
    messages: [{
      role: 'user',
      content: `Perfil activo: ${profile}
Tipo de sesión: ${session_type}

Contexto previo (últimas 3 frases para mantener hilo):
${context}

Fragmento actual a analizar:
"${text}"`
    }]
  });

  const raw = message.content[0].text;
  const result = JSON.parse(raw);

  // Guardar sugerencia en Supabase si signal_detected
  // Devolver resultado al panel lateral

  return Response.json(result);
}
```

### Cómo el panel lateral usa el campo `what_is_being_asked`

El campo nuevo `what_is_being_asked` es especialmente valioso para el Perfil 3
(Defensor), donde la primera necesidad del usuario es entender qué se le está
preguntando antes de saber qué responder. En el panel se muestra así:

```
┌─────────────────────────────┐
│ 🔍 LO QUE TE ESTÁN PIDIENDO │  ← solo visible si signal_detected
│ [what_is_being_asked]       │
├─────────────────────────────┤
│ 💡 QUÉ HACER AHORA          │
│ [suggestion]                │  ← texto grande, el más importante
├─────────────────────────────┤
│ Keywords: tag1  tag2  tag3  │
├─────────────────────────────┤
│ [👍] [👎]    ● ● ○  urgency │
└─────────────────────────────┘
```

Para los Perfiles 1 y 2 (Candidato y Vendedor), `what_is_being_asked` actúa
como contexto rápido pero la sugerencia sigue siendo el elemento principal.

---

## 9. FUNNEL FREEMIUM — LÓGICA COMPLETA

```
ESTADO: ANÓNIMO (sesiones 1-5)
├── UUID generado en chrome.storage.local al instalar
├── Contador en chrome.storage.local + Supabase (anonymous_id)
├── Sin login, sin fricción
└── En sesión 5: mostrar banner "Te queda 1 sesión gratuita"

TRANSICIÓN 1: PAYWALL SUAVE (sesión 6 sin cuenta)
├── Panel muestra: "Has usado tus 5 sesiones gratuitas"
├── Opción: "Crear cuenta gratis para 10 sesiones más"
├── Login con Google (1 clic via Supabase Auth)
├── Se migra anonymous_id al perfil autenticado
└── Evento Posthog: paywall_soft_shown / paywall_soft_converted

ESTADO: REGISTRADO GRATUITO (sesiones 6-15)
├── JWT de Supabase guardado en chrome.storage.sync
├── Contador en profiles.total_sessions
├── Acceso a dashboard web con historial
└── En sesión 14: mostrar banner "Te queda 1 sesión gratuita"

TRANSICIÓN 2: PAYWALL DURO (sesión 16)
├── Panel bloquea inicio de sesión
├── Muestra: "Has alcanzado el límite del plan gratuito"
├── Botón: "Ver planes" → abre elchivato.com/pricing
└── Evento Posthog: paywall_hard_shown

ESTADO: PRICING PAGE (objetivo del MVP)
├── Usuario ve planes (Free / Pro)
├── Botón "Empezar con Pro" → Stripe (preparado, no activo en MVP)
├── En MVP: formulario de lista de espera con email
└── Evento Posthog: payment_cta_clicked ← MÉTRICA PRINCIPAL DEL MVP
```

### Función de verificación de límite

```typescript
// lib/constants.ts
export const LIMITS = {
  ANONYMOUS_SESSIONS: 5,
  FREE_SESSIONS: 15,  // total incluyendo anónimas
  PRO_SESSIONS: Infinity
} as const;

// /api/usage/route.ts
// Devuelve: { sessions_used, limit, plan, can_start_session }
```

---

## 10. LANDING PAGE — ESTRUCTURA Y COPY

### Secciones en orden

**HERO**
- Headline: *"Tu confidente en cada conversación importante"*
- Subheadline: *"Confident escucha tu videollamada en Google Meet y te dice exactamente qué responder. En tiempo real. Solo tú lo ves. Como un amigo experto hablándote al oído."*
- CTA primario: *"Probar gratis — sin registro"* → descarga extensión
- CTA secundario: *"Ver cómo funciona"* → scroll a sección 2
- Indicador social: *"X conversaciones acompañadas esta semana"* (dato real de Supabase)

**CÓMO FUNCIONA** (3 pasos visuales)
1. Instala la extensión en Chrome en 30 segundos
2. Entra a Google Meet y activa El Chivato con un clic
3. Recibe sugerencias en tiempo real mientras hablas

**CASOS DE USO** (cards — uno por perfil)
- 🎯 **Candidato** — Responde con el método STAR sin bloquearte. El Chivato detecta qué tipo de pregunta es y te dice exactamente qué estructura usar.
- 💼 **Vendedor** — Detecta objeciones, señales de compra y momentos de cierre. Te sugiere cómo manejar cada situación sin improvisar.
- 🛡️ **Defensor** — Antes de responder, entiende exactamente qué te están preguntando. Argumenta con solidez aunque la pregunta sea compleja o confusa.

**PRUEBA SOCIAL**
- Contador de sesiones (dato real)
- Espacio para 2-3 testimonios cuando los haya

**PRECIOS**
```
GRATIS              EXPLORADOR          PRO
5 sesiones          15 sesiones         Ilimitado
Sin registro        Con cuenta          [precio a definir]
                    gratuita
[Instalar]          [Crear cuenta]      [Lista de espera]
```

**FOOTER**
- Política de privacidad | Términos de uso | hola@tryconfident.com
- "Tus datos se procesan en servidores europeos bajo RGPD"
- "Confident no almacena audio. Solo texto."

---

## 11. PRIVACIDAD Y CONSENTIMIENTO

### Principio: responsabilidad del usuario

El sistema NO envía ningún mensaje automático al chat de Meet. El usuario es
responsable de informar a los participantes. El mecanismo es:

```
ANTES de iniciar cualquier sesión:
├── Checkbox OBLIGATORIO: "He informado a los participantes de que esta
│   conversación será transcrita y he obtenido su consentimiento."
├── El botón "Iniciar" está deshabilitado hasta marcar el checkbox
├── La marca del checkbox se guarda en Supabase con timestamp
└── Esto constituye declaración de responsabilidad del usuario
```

### Datos que se recogen y conservan
- **Audio:** procesado en tiempo real, NUNCA almacenado
- **Transcripciones:** texto en Supabase, eliminable por el usuario
- **Sugerencias:** texto en Supabase, eliminable por el usuario
- **Metadatos de sesión:** fecha, duración, tipo — eliminables
- **Datos de analytics:** agregados y anonimizados en Posthog EU

### Email de transcripción al finalizar
Al cerrar sesión, si el usuario proporcionó emails de participantes:
- Resend envía email a cada dirección con transcripción completa
- Asunto: *"Transcripción de vuestra sesión — [fecha]"*
- Incluye: texto completo, duración, fecha
- Footer: enlace para solicitar eliminación de datos (ARCO)

---

## 12. VARIABLES DE ENTORNO

```bash
# .env.local — NUNCA subir a GitHub (está en .gitignore)

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Deepgram
DEEPGRAM_API_KEY=...
NEXT_PUBLIC_DEEPGRAM_API_KEY=...   # Solo para extensión (cliente)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # SOLO en servidor, nunca en cliente

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@tryconfident.com

# Posthog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://tryconfident.com

# Stripe (preparado, no activo en MVP)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 13. COSTES OPERATIVOS

### Durante el MVP (fase de validación)

| Servicio | Plan | Límite gratuito | Coste estimado MVP |
|---------|------|----------------|-------------------|
| Vercel | Free | 100GB transfer, 100h compute | $0 |
| Supabase | Free | 500MB DB, 50K usuarios | $0 |
| Deepgram | Pay-as-you-go | $200 crédito inicial | $0 hasta ~860 sesiones 30min |
| Anthropic Claude | Pay-per-use | — | ~$0.003/sugerencia → ~$5-20 total MVP |
| Posthog | Free | 1M eventos/mes | $0 |
| Resend | Free | 3.000 emails/mes | $0 |
| GitHub | Free | Repos privados incluidos | $0 |
| **TOTAL MVP** | | | **$0 — $20** |

### Cuándo empezar a pagar (post-MVP)

- **Vercel Pro ($20/mes):** cuando superes 100GB de transferencia o necesites funciones >10s
- **Supabase Pro ($25/mes):** cuando superes 500MB de base de datos o 50K usuarios
- **Deepgram Pay-as-you-go:** agotados los $200, ~$0.0077/min de audio
- **Hetzner VPS ($4.51/mes):** si decides centralizar múltiples proyectos en servidor propio

---

## 14. ESTRATEGIA DE TOKENS CON CLAUDE PRO

Claude Pro ($18/mes) tiene límites de uso diario. Para maximizar el rendimiento:

### Reglas de sesión de trabajo
1. **Una sesión = un objetivo concreto y verificable** — nunca abras sesión sin objetivo
2. **Lee PROGRESS.md antes de empezar** — evita re-contextualizar desde cero
3. **Al 70% del límite diario, para** — guarda estado en PROGRESS.md y continúa mañana
4. **Pide el código antes de explicaciones** — las explicaciones consumen tokens sin producir resultado

### Tareas de bajo consumo (cualquier momento)
- Corrección de errores puntuales con mensaje de error específico
- Ajustes de copy o texto
- Consultas de sintaxis concretas
- Revisión de un archivo específico

### Tareas de alto consumo (reservar para inicio de sesión)
- Generación inicial de archivos grandes
- Refactorizaciones de arquitectura
- Debugging de flujos complejos end-to-end
- Sesiones de testing con múltiples archivos

### Prompt óptimo para iniciar cada sesión
```
"Lee CLAUDE.md y PROGRESS.md. Estamos en [Sesión X].
Objetivo: [una frase concreta].
Entregable verificable: [qué debe funcionar al terminar].
Empieza por [primer archivo a crear/modificar]."
```

---

## 15. PLAN DE DESARROLLO — 8 SESIONES

### SESIÓN 1 — Proof of Concept de Audio
**Objetivo:** Verificar que la captura de audio funciona en Google Meet antes de construir nada más.
**Si esto falla, hay que pivotar a Electron antes de invertir más tiempo.**

Archivos a crear:
- `extension/manifest.json` (versión mínima)
- `extension/background.js` (solo captura + WebSocket Deepgram)
- `extension/popup/popup.html` + `popup.js` (selector de perfil + botón "Iniciar")

El popup debe mostrar los tres perfiles antes de iniciar:
```
┌─────────────────────────┐
│     El Chivato          │
│  Selecciona tu perfil:  │
│                         │
│  🎯 Candidato           │
│  💼 Vendedor            │
│  🛡️  Defensor           │
│                         │
│  [Iniciar sesión]       │
└─────────────────────────┘
```

El perfil seleccionado se guarda en `chrome.storage.session` y se envía
en cada llamada a `/api/analyze` como parámetro `profile`.

Entregable verificable: texto transcrito aparece en la consola del Service Worker
con el perfil activo visible durante una llamada de Google Meet real.

---

### SESIÓN 2 — Pipeline de Análisis con Claude
**Objetivo:** Conectar transcripción con Claude y obtener JSON de sugerencia.

Archivos a crear:
- `app/api/analyze/route.ts`
- `lib/claude.ts`
- Actualizar `extension/background.js` para llamar al endpoint

Entregable verificable: en consola del Service Worker aparece el JSON con sugerencia después de hablar en Meet.

---

### SESIÓN 3 — Panel Lateral Funcional
**Objetivo:** Mostrar sugerencias en UI real en el panel lateral de Chrome.

Archivos a crear:
- `extension/side-panel/panel.html`
- `extension/side-panel/panel.js`
- `extension/side-panel/panel.css`
- Actualizar `extension/background.js` para enviar al panel

Diseño del panel:
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

Entregable verificable: primera demo end-to-end funcionando con UI.

---

### SESIÓN 4 — Autenticación y Lógica Freemium
**Objetivo:** Login con Google + contador de sesiones + paywalls.

Archivos a crear:
- `supabase/schema.sql` (ejecutar en Supabase dashboard)
- `lib/supabase.ts` + `lib/supabase-server.ts`
- `app/login/page.tsx`
- `app/api/session/route.ts`
- `app/api/usage/route.ts`
- Actualizar `extension/background.js` para gestionar JWT y contador
- Actualizar `extension/side-panel/panel.js` para mostrar paywalls

Entregable verificable: usuario anónimo llega a sesión 6 y ve el paywall suave.

---

### SESIÓN 5 — Landing Page
**Objetivo:** Landing page publicada en Vercel con tracking de conversión.

Archivos a crear:
- `app/page.tsx` (landing completa)
- `components/landing/Hero.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/UseCases.tsx`
- `components/landing/Pricing.tsx`
- `lib/analytics.ts` (Posthog con eventos tipados)
- `app/layout.tsx` (con Posthog provider)

Entregable verificable: URL pública de Vercel con landing funcional y eventos en Posthog dashboard.

---

### SESIÓN 6 — Email de Transcripción
**Objetivo:** Email automático con transcripción al finalizar sesión.

Archivos a crear:
- `app/api/send-transcript/route.ts`
- Template de email en Resend

Entregable verificable: email real recibido con transcripción formateada.

---

### SESIÓN 7 — Paywall Duro y Página de Precios
**Objetivo:** La métrica principal del MVP está instrumentada.

Archivos a crear:
- `app/pricing/page.tsx`
- `app/dashboard/page.tsx` (historial de sesiones)
- Lógica de bloqueo en sesión 16

Entregable verificable: usuario en sesión 16 ve página de precios, clic en "Empezar con Pro" trackea en Posthog.

---

### SESIÓN 8 — QA y Preparación Chrome Web Store
**Objetivo:** Producto listo para usuarios reales.

Tareas:
- Test end-to-end en llamada real de 30 minutos
- Ajuste de latencia y prompts
- Revisar políticas de Chrome Web Store (privacidad, permisos)
- Crear cuenta en Chrome Web Store ($5 única vez)
- Preparar screenshots y descripción para la store
- Publicar extensión (revisión puede tardar 1-3 días)

Entregable verificable: extensión publicada en Chrome Web Store o en revisión.

---

## 16. PROGRESS.md — PLANTILLA

Al final de cada sesión, actualiza este archivo:

```markdown
# PROGRESS.md — El Chivato

## Estado actual
Sesión completada: [número]
Fecha: [fecha]

## Qué está funcionando
- [lista de funcionalidades verificadas]

## Qué está pendiente
- [lista de tareas de la sesión actual si no se terminó]

## Próxima sesión
Sesión: [número]
Objetivo: [una frase]
Primer archivo a tocar: [ruta]
Contexto importante: [cualquier decisión tomada que Claude Code debe saber]

## Errores conocidos o deuda técnica
- [lista si existe]
```

---

## 17. CHECKLIST PRE-PUBLICACIÓN

Antes de publicar en Chrome Web Store:

```
□ Manifest V3 sin warnings en chrome://extensions
□ Todos los permisos en manifest.json están justificados en descripción de Store
□ No hay console.log con datos sensibles en producción
□ Variables de entorno no expuestas al cliente (verificar con build de Vercel)
□ Política de privacidad publicada en URL pública
□ Términos de uso publicados en URL pública
□ El checkbox de consentimiento es obligatorio antes de iniciar sesión
□ El email de transcripción incluye enlace de eliminación de datos
□ RLS activado en todas las tablas de Supabase
□ Los endpoints validan JWT antes de procesar
□ Test en Chrome con perfil limpio (sin extensiones propias)
□ Test con audio en inglés y español
□ Latencia media verificada < 5 segundos en condiciones normales
```

---

*Versión del documento: 4.0*
*Última actualización: Febrero 2026*
*Propietario: Victor*
*Marca: Confident*
*Desarrollado con: Claude Code*
