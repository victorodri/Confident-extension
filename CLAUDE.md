# CLAUDE.md — Confident
> **Documento de referencia absoluta. Consultar antes de implementar.**

---

## 1. QUÉ ES ESTE PROYECTO

**Confident** es una extensión de Chrome que actúa como confidente silencioso durante videollamadas en Google Meet. Escucha ambas partes de la conversación, analiza con IA, y muestra en panel lateral:

1. **Sugerencia principal** — qué decir ahora mismo (texto grande)
2. **Contexto** — qué tipo de pregunta es y qué busca
3. **Keywords** — palabras clave a incluir en la respuesta

**Valor:** chuleta inteligente en tiempo real. El usuario ve lo que tiene que decir, no lo que se ha dicho.

### Los tres perfiles de usuario

**CANDIDATO** — Procesos de selección. Detecta preguntas de competencias, técnicas, motivacionales. Sugiere marcos STAR/CAR. Tono: coach de carrera.

**VENDEDOR** — Llamadas comerciales. Detecta objeciones, señales de compra, momentos de cierre. Tono: mentor de ventas consultivas.

**DEFENSOR** — Comprensión y argumentación. Descompone preguntas complejas, explica qué se pide realmente, sugiere estructura de respuesta. Tono: asesor estratégico.

### Contexto del usuario
- Victor (propietario) — no tiene perfil técnico de desarrollo
- Usa Claude Code para todo
- Cuentas activas: Vercel, Supabase, Anthropic, Deepgram, Posthog, Resend

### Principios de desarrollo
1. **Funcionamiento > Simplicidad > Elegancia**
2. Si funciona simple aunque no sea elegante, es correcto
3. Nunca cambiar stack sin preguntar
4. Nunca asumir que funciona — verificar primero
5. Al final de cada sesión, actualizar PROGRESS.md

---

## 2. STACK TÉCNICO

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Landing + API | Next.js 14.x App Router | SSR, mismo repo que backend |
| Estilos | Tailwind + shadcn/ui | Rápido, componentes listos |
| Extensión | Chrome MV3 Vanilla JS | Sin frameworks, máxima compatibilidad |
| Captura audio | tabCapture + getUserMedia + Web Audio API | Nativo Chrome |
| Transcripción | Deepgram Nova-2 streaming | $200 free tier, baja latencia |
| Análisis IA | Claude Sonnet 4.6 | Razonamiento contextual superior |
| Backend | Vercel Serverless | Deploy automático |
| Base de datos | Supabase PostgreSQL | Auth + DB + RLS, Frankfurt |
| Analytics | Posthog EU | Funnel tracking |
| Email | Resend | 3K emails/mes gratis |
| Pagos (prep.) | Stripe | Arquitectura lista, NO activo MVP |

---

## 3. ARQUITECTURA DEL SISTEMA

```
CHROME EXTENSION
├── content-script.js → detecta meet.google.com
├── background.js (Service Worker)
│   ├── chrome.tabCapture (audio entrevistador)
│   ├── getUserMedia (micrófono usuario)
│   ├── Mezcla streams con AudioContext
│   ├── WebSocket → Deepgram → transcripciones
│   ├── POST /api/analyze → Claude → sugerencias
│   └── Reenvía al Side Panel
├── side-panel/panel.html + panel.js
│   ├── Sugerencia principal + contexto + keywords
│   ├── Botón "Iniciar sesión" (user gesture)
│   ├── Checkbox consentimiento (obligatorio)
│   ├── Contador sesiones
│   └── Historial colapsado
└── popup/popup.html + popup.js
    ├── Selector de perfil
    ├── Estado sesión
    └── Enlace a dashboard

VERCEL BACKEND (Next.js API Routes)
├── /api/analyze → {text, profile, context} → Claude → JSON
├── /api/session → POST crear / PATCH cerrar
├── /api/usage → GET contador sesiones
└── /api/send-transcript → POST email transcripción

SUPABASE
└── auth.users, profiles, sessions, transcriptions, suggestions
```

### Flujo completo sesión
1. Usuario en Google Meet → content-script detecta
2. Abre Side Panel → checkbox consentimiento → clic "Iniciar"
3. background.js captura audio tab + micrófono
4. Mezcla en AudioContext → WebSocket Deepgram
5. Deepgram → transcripciones cada ~1s
6. Fin de frase → POST /api/analyze → Claude → JSON
7. background.js → panel actualiza UI
8. Usuario ve sugerencia <5s desde fin de frase
9. Al finalizar → email con transcripción

---

## 4. ESTRUCTURA DE CARPETAS

```
confident/
├── CLAUDE.md                        ← Este archivo
├── PROGRESS.md                      ← Estado actual (actualizar al final)
├── .env.local                       ← Variables (NUNCA subir)
├── .env.example                     ← Plantilla (sí subir)
├── package.json
│
├── app/
│   ├── layout.tsx                   ← Posthog provider
│   ├── page.tsx                     ← Landing
│   ├── pricing/page.tsx
│   ├── login/page.tsx               ← Login con Google
│   ├── dashboard/page.tsx
│   └── api/
│       ├── analyze/route.ts         ← Claude → sugerencia
│       ├── session/route.ts
│       ├── usage/route.ts
│       └── send-transcript/route.ts
│
├── lib/
│   ├── supabase.ts                  ← Cliente browser
│   ├── supabase-server.ts           ← Cliente server
│   ├── claude.ts                    ← Prompts + getSystemPrompt(profile)
│   ├── analytics.ts                 ← Posthog eventos
│   └── constants.ts                 ← Límites freemium
│
├── supabase/
│   └── schema.sql                   ← Schema + RLS
│
└── extension/
    ├── manifest.json
    ├── background.js
    ├── content-script.js
    ├── offscreen.js                 ← Pipeline Deepgram
    ├── side-panel/
    └── popup/
```

---

## 5. MANIFEST.JSON (Chrome MV3)

```json
{
  "manifest_version": 3,
  "name": "Confident",
  "version": "0.1.0",
  "permissions": ["tabCapture", "activeTab", "storage", "sidePanel", "scripting"],
  "host_permissions": ["https://meet.google.com/*", "https://*.vercel.app/*"],
  "background": { "service_worker": "background.js", "type": "module" },
  "content_scripts": [{
    "matches": ["https://meet.google.com/*"],
    "js": ["content-script.js"]
  }],
  "side_panel": { "default_path": "side-panel/panel.html" },
  "action": { "default_popup": "popup/popup.html" }
}
```

**Crítico:**
- `tabCapture` requiere user gesture
- NO usar `<all_urls>` — solo dominios necesarios
- Service Worker puede terminar por Chrome — NO guardar estado en variables globales

---

## 6. REGLAS TÉCNICAS CRÍTICAS

### Extensión
```
✅ Manifest V3
✅ chrome.storage.session para estado sesión activa
✅ chrome.storage.local para datos persistentes
✅ Botón "Iniciar" = user gesture para tabCapture
✅ HTTPS + Authorization header extensión ↔ backend
❌ NUNCA variables globales en Service Worker
❌ NUNCA almacenar audio
❌ NUNCA innerHTML con datos externos
```

### Backend
```
✅ Validar JWT Supabase antes de procesar
✅ Responder <10s (límite Vercel free)
✅ JSON estructurado siempre
✅ supabase-server.ts con service_role para escritura
❌ NUNCA exponer SUPABASE_SERVICE_ROLE_KEY al cliente
❌ NUNCA almacenar audio
❌ NUNCA llamadas API sin timeout (máx 8s)
```

### Analytics
Eventos críticos con Posthog:
- `extension_installed`
- `session_started` → props: {profile, session_number, is_anonymous}
- `suggestion_shown` → props: {profile, signal_type, urgency_level}
- `suggestion_rated` → props: {profile, helpful}
- `paywall_soft_shown` / `paywall_soft_converted`
- `paywall_hard_shown`
- `payment_cta_clicked` → props: {plan_selected}

---

## 7. SCHEMA DE BASE DE DATOS

```sql
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

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
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

CREATE TABLE transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  speaker TEXT CHECK (speaker IN ('user', 'other', 'unknown')),
  text TEXT NOT NULL,
  timestamp_ms INTEGER,
  language CHAR(2) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- RLS: own_profile, own_sessions, own_transcriptions, own_suggestions

-- Trigger: incrementar contador al crear sesión
CREATE FUNCTION increment_session_count() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE profiles SET total_sessions = total_sessions + 1, updated_at = NOW()
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

## 8. PROMPTS DE CLAUDE

**Un prompt diferente por perfil.** Perfil seleccionado antes de iniciar sesión.

### Estructura común

```typescript
// lib/claude.ts

const PROMPT_CANDIDATO = `
Eres coach silencioso. Asistes a CANDIDATO en proceso selección.
ROL: USUARIO=candidato / INTERLOCUTOR=entrevistador
SEÑALES: behavioral (STAR), technical, situational, salary, motivation, presentation, closing, pressure
ESTILO: Coach senior. Directo, sin adornos. 2-3 líneas. Si behavioral → mencionar STAR.
`;

const PROMPT_VENDEDOR = `
Eres mentor silencioso. Asistes a VENDEDOR en llamada comercial.
ROL: USUARIO=vendedor / INTERLOCUTOR=cliente potencial
SEÑALES: objection_price, objection_need, objection_trust, buying_signal (URGENCIA 3), closing_opportunity, discovery, value_question, negotiation
ESTILO: Director comercial senior. Orientado a acción y cierre. 2-3 líneas. Señales compra → urgencia 3.
`;

const PROMPT_DEFENSOR = `
Eres asesor silencioso. Asistes a alguien que necesita COMPRENDER pregunta compleja y DEFENDER posición.
ROL: USUARIO=defensor / INTERLOCUTOR=quien pregunta/cuestiona/decide
SEÑALES: complex_question, assumption_challenge, scope_question, risk_question, alternative_challenge, data_request, pressure_question, clarification_needed
ESTILO: Asesor estratégico senior. Primero QUÉ se pregunta (1 línea), luego estructura respuesta (2 líneas). Nunca respuesta completa — dar el mapa.
`;

const COMMON_SUFFIX = `
URGENCIA:
1 = Informativo — contexto útil, no urgente
2 = Importante — señal clara, preparar respuesta
3 = Crítico — actúa ahora, momento clave

FORMATO JSON (sin texto adicional, sin markdown):
{
  "signal_detected": boolean,
  "signal_type": string | null,
  "urgency": 1 | 2 | 3,
  "what_is_being_asked": "En 1 línea: qué se pide realmente.",
  "suggestion": "Qué hacer ahora. Máx 2-3 líneas. Directo.",
  "keywords": ["término1", "término2"],
  "speaker_detected": "user" | "other" | "unknown"
}

Si no hay señal:
{ "signal_detected": false, "signal_type": null, "urgency": 1, "what_is_being_asked": null, "suggestion": null, "keywords": [], "speaker_detected": "other" }

REGLAS:
- Usuario en vivo. Máximo 3 líneas en "suggestion"
- Detectar idioma y responder en ese idioma
- Inferir significado si hay errores transcripción
- Nunca inventar datos
- "what_is_being_asked" siempre si signal_detected=true
`;

type UserProfile = 'candidato' | 'vendedor' | 'defensor';
const PROMPTS: Record<UserProfile, string> = { candidato: PROMPT_CANDIDATO, vendedor: PROMPT_VENDEDOR, defensor: PROMPT_DEFENSOR };

export function getSystemPrompt(profile: UserProfile): string {
  return PROMPTS[profile] + COMMON_SUFFIX;
}
```

---

## 9. FUNNEL FREEMIUM

```
ANÓNIMO (sesiones 1-5)
├── UUID en chrome.storage.local
├── Contador local + Supabase (anonymous_id)
└── Sesión 5: banner "Te queda 1 sesión gratuita"

PAYWALL SUAVE (sesión 6 sin cuenta)
├── Panel: "Has usado 5 sesiones gratuitas"
├── "Crear cuenta gratis para 10 sesiones más"
├── Login Google → migrar anonymous_id
└── Evento: paywall_soft_shown / paywall_soft_converted

REGISTRADO GRATUITO (sesiones 6-15)
├── JWT en chrome.storage.sync
├── Contador profiles.total_sessions
└── Sesión 14: banner "Te queda 1 sesión gratuita"

PAYWALL DURO (sesión 16)
├── Panel bloquea inicio
├── "Límite plan gratuito"
├── Botón "Ver planes" → /pricing
└── Evento: paywall_hard_shown

PRICING PAGE (objetivo MVP)
├── Planes Free / Pro
├── Botón "Empezar Pro" → Stripe (prep, no activo)
├── MVP: formulario lista espera
└── Evento: payment_cta_clicked ← MÉTRICA PRINCIPAL MVP
```

```typescript
// lib/constants.ts
export const LIMITS = {
  ANONYMOUS_SESSIONS: 5,
  FREE_SESSIONS: 15,
  PRO_SESSIONS: Infinity
};
```

---

## 10. LANDING PAGE — ESTRUCTURA

**HERO:** *"Tu confidente en cada conversación importante"* + CTA "Probar gratis — sin registro"

**CÓMO FUNCIONA:** 3 pasos — Instalar → Activar en Meet → Recibir sugerencias

**CASOS DE USO:** 3 cards (Candidato / Vendedor / Defensor)

**PRECIOS:** Free (5) / Explorador (15) / Pro (ilimitado)

**FOOTER:** Privacidad | Términos | hola@tryconfident.com + "RGPD • Solo texto, no audio"

---

## 11. PRIVACIDAD Y CONSENTIMIENTO

**Checkbox OBLIGATORIO antes de iniciar:**
"He informado a los participantes de que esta conversación será transcrita y he obtenido su consentimiento."

**Datos:**
- Audio: procesado en tiempo real, NUNCA almacenado
- Transcripciones: Supabase, eliminables
- Sugerencias: Supabase, eliminables
- Analytics: agregados, Posthog EU

**Email transcripción:** al cerrar sesión, si hay emails de participantes → Resend envía con enlace ARCO.

---

## 12. VARIABLES DE ENTORNO

```bash
# .env.local — NUNCA subir
ANTHROPIC_API_KEY=sk-ant-...
DEEPGRAM_API_KEY=...
NEXT_PUBLIC_DEEPGRAM_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # SOLO servidor
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@tryconfident.com
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
NEXT_PUBLIC_APP_URL=https://tryconfident.com
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 13. PLAN DE DESARROLLO — 8 SESIONES

**S1 — POC Audio:** Verificar captura audio funciona en Meet (si falla → pivotar Electron)
**S2 — Pipeline Claude:** Conectar transcripción → Claude → JSON
**S3 — Panel Lateral:** UI funcional con sugerencias ✅ COMPLETADA
**S4 — Auth + Freemium:** Login Google + contador + paywalls
**S5 — Landing:** Página en Vercel + Posthog tracking
**S6 — Email:** Transcripción automática al finalizar
**S7 — Paywall Duro + Pricing:** Métrica principal MVP instrumentada
**S8 — QA + Chrome Store:** Test 30min + publicar extensión

---

## 14. PROGRESS.md — PLANTILLA

```markdown
# PROGRESS.md — Confident

## Estado actual
Sesión completada: [número]
Fecha: [fecha]

## Qué está funcionando
- [lista funcionalidades verificadas]

## Qué está pendiente
- [tareas sesión actual si no terminó]

## Próxima sesión
Sesión: [número]
Objetivo: [una frase]
Primer archivo a tocar: [ruta]
Contexto importante: [decisiones que Claude Code debe saber]

## Errores conocidos / deuda técnica
- [lista si existe]
```

---

## 15. MANTENIMIENTO DEL REPOSITORIO

**REGLA CRÍTICA**: Al final de CADA sesión, limpiar archivos temporales y mantener el repositorio organizado.

### Archivos a MANTENER en raíz
```
✅ CLAUDE.md          — Documento de referencia absoluta
✅ PROGRESS.md        — Estado actual del proyecto
✅ README.md          — Descripción general para developers
✅ .env.local         — Variables de entorno (NUNCA subir a git)
✅ .env.example       — Plantilla de variables (SÍ subir)
✅ package.json       — Dependencias del proyecto
```

### Archivos a ELIMINAR (temporales)
```
❌ DEBUG_*.md                — Archivos de debugging
❌ TESTING_SESSION_*.md      — Reportes de testing específicos de sesión
❌ TESTING_*.md             — Checklists temporales de testing
❌ VISUAL_REFERENCE_*.md    — Referencias visuales temporales
❌ DESIGN_RESEARCH_*.md     — Research de diseño temporal
❌ INTEGRATION_*.md         — Guías de integración ya completadas
❌ RELOAD_*.md              — Guías de reload temporales
```

### Carpeta `/docs` — Documentación Permanente
Mover archivos importantes de planificación y especificaciones a `/docs`:
```
📁 docs/
  ├── README.md
  ├── CHROME_WEB_STORE_PUBLICATION.md
  ├── ICON_DESIGN_SPECS.md
  ├── PLANNING_PRE_LAUNCH.md
  └── REDESIGN_PLAN.md
```

### Proceso al Final de Cada Sesión
1. **Actualizar PROGRESS.md** con estado actual
2. **Eliminar archivos temporales** de testing/debug creados durante la sesión
3. **Mover archivos importantes** a `/docs` si corresponde
4. **Actualizar README.md** si hay cambios estructurales
5. **Commit limpio** con archivos organizados

---

## 16. CHECKLIST PRE-PUBLICACIÓN

```
□ Manifest V3 sin warnings
□ Permisos justificados en Store
□ Sin console.log con datos sensibles
□ Variables no expuestas (verificar build)
□ Política privacidad + Términos publicados
□ Checkbox consentimiento obligatorio
□ Email transcripción con enlace eliminación
□ RLS activo en Supabase
□ Endpoints validan JWT
□ Test Chrome perfil limpio
□ Test audio inglés + español
□ Latencia <5s verificada
```

---

*Versión: 4.2 — Mantenimiento Repositorio + Paywall System*
*Última actualización: Marzo 2026*
