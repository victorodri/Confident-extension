# Confident

> **Tu coach silencioso en conversaciones importantes**

Extensión de Chrome que actúa como asistente inteligente en tiempo real durante videollamadas de Google Meet. Escucha, analiza con IA y muestra sugerencias contextuales en un panel lateral.

![Versión](https://img.shields.io/badge/version-1.0.0--dev-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Chrome Extension](https://img.shields.io/badge/Chrome-MV3-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🎯 ¿Qué es Confident?

Confident es una extensión de Chrome que te asiste en tiempo real durante conversaciones críticas. Utiliza IA (Claude Sonnet 4.6) para:

- ✅ **Detectar señales clave** — Identifica preguntas STAR, objeciones de venta, cuestionamientos complejos
- ✅ **Sugerir respuestas** — Adaptadas a tu perfil (Candidato, Vendedor, Defensor)
- ✅ **Mostrar contexto** — Qué se está preguntando realmente y por qué
- ✅ **Destacar keywords** — Palabras clave para incluir en tu respuesta
- ✅ **Urgencia visual** — Sistema de 3 niveles (info/importante/crítico)

### Los tres perfiles especializados

| Perfil | Contexto | Señales que detecta |
|--------|----------|---------------------|
| **🎓 Candidato** | Entrevistas de trabajo | Preguntas behavioral (STAR), técnicas, salariales, motivacionales |
| **💼 Vendedor** | Llamadas comerciales | Objeciones (precio/necesidad/confianza), señales de compra, cierre |
| **🛡️ Defensor** | Presentaciones estratégicas | Preguntas complejas, cuestionamientos, desafíos de asunciones |

---

## 🚀 Funcionalidades principales

### ✅ Implementado (MVP)

**Core:**
- ✅ Captura bidireccional de audio (tab + micrófono) con Web Audio API
- ✅ Transcripción en tiempo real con Deepgram Nova-2
- ✅ Análisis inteligente con Claude Sonnet 4.6 (Structured Outputs)
- ✅ Panel lateral con sugerencias en <5 segundos
- ✅ Sistema de urgencia visual (verde/amarillo/rojo)

**Autenticación & Freemium:**
- ✅ Sistema freemium completo con 3 niveles:
  - **Anónimo**: 5 sesiones sin registro
  - **Gratis**: 15 sesiones con cuenta Google
  - **Pro**: Sesiones ilimitadas (lista de espera activa)
- ✅ Google OAuth con Supabase Auth
- ✅ Device fingerprinting anti-pirateo
- ✅ Contador de sesiones en panel lateral
- ✅ Paywalls suave (sesión 6) y duro (sesión 16)

**Dashboard & Email:**
- ✅ Dashboard con historial de sesiones
- ✅ Transcripciones y sugerencias guardadas por sesión
- ✅ Auto-selección de sesión al cerrar desde panel
- ✅ Email automático con resumen al finalizar
- ✅ Página de perfil para personalización opcional

**UX & Compliance:**
- ✅ Checkbox de consentimiento obligatorio (RGPD)
- ✅ UI estilo Apple (SF Pro, minimalista, sombras sutiles)
- ✅ Onboarding NO bloqueante (movido a /profile)
- ✅ Analytics con Posthog (funnel completo)
- ✅ Landing page + página de precios

### 🔜 Próximas sesiones (Roadmap v1.0)

**Sesión 16** — Políticas Legales (CRÍTICO para CWS):
- 📄 Página `/privacy` con política de privacidad RGPD-compliant
- 📄 Página `/terms` con términos de servicio
- 🔗 Links en footer de landing page y dashboard

**Sesión 17** — Assets Profesionales:
- 🎨 Iconos de extensión (16px, 32px, 48px, 128px)
- 📸 Screenshots para Chrome Web Store (1280x800)
- 🖼️ Promotional tiles (440x280, 920x680, 1400x560)

**Sesión 18-20** — Testing Exhaustivo:
- ✅ Test matriz de navegadores (Chrome, Edge)
- ✅ Test flujo freemium completo
- ✅ Test audio en diferentes escenarios (muted, 2+ speakers)
- ✅ Test latencia <5s en 10 sesiones consecutivas

**Sesión 21-23** — Publicación Chrome Web Store:
- 📦 Preparar package final (manifest v3 validated)
- 📝 Descripción optimizada para CWS
- 🚀 Enviar a revisión + monitorear aprobación

**Sesión 24-27** (OPCIONAL - mientras revisión CWS):
- 🌍 Soporte multi-platform (Teams, Zoom)
- 📊 Dashboard analytics avanzado (métricas de rendimiento personal)
- 🎓 Modo práctica (simulaciones sin estar en llamada)

---

## 📦 Stack Técnico

### Frontend (Landing + Dashboard)
- **Framework**: Next.js 15.3.9 (App Router, React Server Components)
- **Estilos**: Tailwind CSS + diseño custom Apple-inspired
- **Tipografía**: SF Pro Display (system font)
- **Analytics**: Posthog EU (RGPD-compliant)

### Extensión Chrome
- **Manifest**: V3 (MV3)
- **Audio**: Web Audio API + `chrome.tabCapture` + `getUserMedia`
- **Arquitectura**: Vanilla JS (sin frameworks, máxima compatibilidad)
- **Storage**: `chrome.storage.local` + `chrome.storage.session`
- **Logging**: Sistema condicional (solo dev mode)

### Backend (Serverless)
- **Plataforma**: Vercel Edge Functions
- **Database**: Supabase PostgreSQL (Frankfurt, EU)
- **Auth**: Supabase Auth con Google OAuth
- **Transcripción**: Deepgram Nova-2 (streaming WebSocket)
- **IA**: Anthropic Claude Sonnet 4.6
- **Email**: Resend (3K emails/mes gratis)
- **CORS**: Configurado para extensión Chrome

---

## 🛠️ Instalación Local

### Prerequisitos

- Node.js 18+
- npm o pnpm
- Cuenta en Supabase (gratuita)
- Cuenta en Anthropic (Claude API)
- Cuenta en Deepgram ($200 crédito gratis)
- Cuenta en Resend (3K emails/mes gratis)
- Chrome browser

### 1. Clonar repositorio

```bash
git clone https://github.com/victorodri/Confident.git
cd Confident
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Completa las variables (ver `.env.example` para detalles):

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Deepgram (Transcripción)
DEEPGRAM_API_KEY=...
NEXT_PUBLIC_DEEPGRAM_API_KEY=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # SOLO servidor, NUNCA exponer

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Posthog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el schema: `supabase/schema.sql` en SQL Editor
3. Aplica la migración de seguridad: `supabase/migrations/20260301_fix_security_issues.sql`
4. Configura Google OAuth en Authentication → Providers → Google

### 5. Cargar extensión en Chrome

1. Abre Chrome → `chrome://extensions`
2. Activa "Modo de desarrollador"
3. Clic "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `extension/` del proyecto

### 6. Ejecutar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 7. Probar el flujo completo

1. Abre Google Meet (o crea una reunión de prueba)
2. Clic en el icono de Confident en la barra de extensiones
3. Selecciona un perfil (Candidato/Vendedor/Defensor)
4. Marca el checkbox de consentimiento
5. Clic "Iniciar sesión"
6. El panel lateral se abre automáticamente
7. Habla en la reunión y observa las sugerencias aparecer

---

## 📁 Estructura del Proyecto

```
confident/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── pricing/page.tsx          # Pricing + waitlist
│   ├── dashboard/page.tsx        # Dashboard con sesiones
│   ├── profile/page.tsx          # Personalización de perfil (NEW)
│   ├── auth/                     # Login con Google OAuth
│   └── api/                      # API Routes
│       ├── analyze/route.ts      # Claude → sugerencias
│       ├── sessions/             # CRUD sesiones
│       ├── usage/route.ts        # Contador freemium
│       ├── profile/context/      # Contexto de usuario
│       ├── send-transcript/      # Email transcripciones
│       └── waitlist/route.ts     # Lista de espera Pro
│
├── components/                   # Componentes React
│   ├── landing/                  # Hero, HowItWorks, UseCases, Footer
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Utilidades compartidas
│   ├── claude.ts                 # Prompts + getSystemPrompt(profile)
│   ├── supabase.ts               # Cliente browser
│   ├── supabase-server.ts        # Cliente server
│   ├── analytics.ts              # Posthog eventos
│   └── constants.ts              # Límites freemium
│
├── extension/                    # Chrome Extension (MV3)
│   ├── manifest.json             # Manifest V3
│   ├── config.js                 # URLs centralizadas (dev/prod)
│   ├── logger.js                 # Logging condicional
│   ├── constants.js              # Constantes compartidas
│   ├── device-fingerprint.js     # Anti-pirateo
│   ├── background.js             # Service Worker principal
│   ├── offscreen.js              # Audio pipeline + Deepgram
│   ├── content-script.js         # Inyección en Meet
│   ├── popup/                    # Popup de configuración
│   │   ├── popup.html
│   │   ├── popup.js              # Lógica: perfil + inicio sesión
│   │   └── popup.css             # Apple Style
│   └── side-panel/               # Panel lateral con sugerencias
│       ├── panel.html
│       ├── panel.js              # Renderizado de sugerencias
│       └── panel.css             # Apple Style + urgencia visual
│
├── supabase/
│   ├── schema.sql                # Schema completo con RLS
│   └── migrations/               # Migraciones SQL
│       └── 20260301_fix_security_issues.sql
│
├── CLAUDE.md                     # Referencia técnica (⭐ IMPORTANTE)
├── PROGRESS.md                   # Estado actual + historial de sesiones
├── TESTING_CHECKLIST.md          # Checklist pre-publicación
└── README.md                     # Este archivo
```

---

## 🔒 Privacidad y Seguridad

- ✅ **RGPD compliant** — Datos almacenados en Frankfurt (EU)
- ✅ **Audio NUNCA almacenado** — Solo procesado en tiempo real
- ✅ **Transcripciones eliminables** — Desde dashboard o via email
- ✅ **Checkbox de consentimiento obligatorio** antes de iniciar
- ✅ **Row Level Security (RLS)** en todas las tablas Supabase
- ✅ **Sin XSS** — Construcción manual del DOM (sin `innerHTML`)
- ✅ **Security headers** — CSP, X-Frame-Options, HSTS en Next.js
- ✅ **Logs solo en desarrollo** — Sistema de logging condicional
- ✅ **CORS configurado** — Solo dominios autorizados

---

## 📊 Métricas Clave (MVP)

| Métrica | Evento Posthog | Objetivo |
|---------|----------------|----------|
| **🎯 Principal** | `payment_cta_clicked` | Usuario hace clic en "Unirse a lista de espera Pro" |
| Instalación | `extension_installed` | Usuario instala la extensión |
| Primera sesión | `session_started` | Primera vez que inicia sesión |
| Paywall soft | `paywall_soft_shown` | Usuario llega a sesión 6 (anónimo) |
| Conversión soft | `paywall_soft_converted` | Usuario crea cuenta después del paywall |
| Paywall hard | `paywall_hard_shown` | Usuario llega a sesión 16 (plan free) |

---

## 📝 Historial de Desarrollo

### Sesiones 1-12 — Fundamentos & Arquitectura MVP

**Sesión 1-3** — POC Audio + Pipeline Transcripción:
- ✅ Captura audio bidireccional (tab + micrófono)
- ✅ Mezcla de streams con Web Audio API
- ✅ WebSocket streaming con Deepgram Nova-2
- ✅ Transcripciones en tiempo real

**Sesión 4-6** — Análisis IA + Panel Lateral:
- ✅ Integración Claude Sonnet 4.6 con Structured Outputs
- ✅ 3 prompts especializados (Candidato, Vendedor, Defensor)
- ✅ Panel lateral funcional con sugerencias
- ✅ Sistema de feedback (👍/👎)

**Sesión 7-9** — Backend + Base de Datos:
- ✅ Next.js API Routes (Vercel Serverless)
- ✅ Supabase PostgreSQL con RLS
- ✅ Schema completo (profiles, sessions, transcriptions, suggestions)
- ✅ Google OAuth con Supabase Auth

**Sesión 10-12** — Freemium + Dashboard:
- ✅ Sistema de límites (5/15/∞ sesiones)
- ✅ Device fingerprinting para usuarios anónimos
- ✅ Paywalls suave y duro
- ✅ Dashboard con historial de sesiones
- ✅ Email automático con transcripción

### Sesión 13 — Fix Bugs Críticos (Smart Cards + Testing)

**Problemas resueltos:**
- ✅ Endpoint `/api/usage` verificado funcionando correctamente
- ✅ Smart cards con lógica de urgencia 1/2/3 implementada
- ✅ CSS diferenciado por urgencia (verde/amarillo/rojo)
- ✅ Creado TESTING_CHECKLIST.md con matriz de tests

**Mejoras UX:**
- ✅ Bordes coloreados según urgencia
- ✅ Backgrounds sutiles con gradientes
- ✅ Animación pulse para urgencia crítica (nivel 3)
- ✅ Badge visual "INFO/IMPORTANTE/CRÍTICO"

### Sesión 14 — Onboarding Personalizado Apple/Wispr Flow Style

**Funcionalidad:**
- ✅ Modal de onboarding con diseño premium
- ✅ 3 campos de personalización (Descripción, Preocupaciones, Objetivos)
- ✅ Endpoint POST/GET `/api/profile/context`
- ✅ Migración SQL: columna `user_context` en `profiles`
- ✅ Botones Skip y Submit con animaciones suaves

**Diseño:**
- ✅ Backdrop con blur (12px)
- ✅ Header degradado (purple → blue)
- ✅ Textareas con focus states premium
- ✅ Responsive design (mobile-friendly)

### Sesión 15 — Fix Errores Extensión + Supabase + UX Mejoras

**Errores críticos resueltos:**
1. ✅ **"Failed to fetch" en todos los endpoints**
   - Causa: CORS no configurado en Next.js
   - Solución: Headers CORS añadidos en `next.config.js`
   - Servidor reiniciado en `localhost:3000` con CORS funcionando

2. ✅ **Funciones Supabase con "role mutable search_path"**
   - Causa: Funciones sin `SET search_path`
   - Solución: Migración `20260301_fix_security_issues.sql` creada
   - Agregado `SET search_path = public` a `handle_new_user` e `increment_session_count`

3. ✅ **Políticas RLS con re-evaluaciones innecesarias**
   - Causa: Llamadas repetidas a `auth.uid()` en cada fila
   - Solución: Función helper `auth.current_user_id()` con cache
   - Reemplazado en todas las políticas RLS

4. ✅ **Syntax error en popup.js (línea 375)**
   - Causa: Extra closing brace al añadir logging
   - Solución: Eliminado brace extra + verificado con `node -c`

**Mejoras UX:**
1. ✅ **Redirección automática al dashboard con sesión seleccionada**
   - Panel pasa `session_id` en URL: `?session=UUID`
   - Dashboard detecta parámetro y auto-selecciona sesión
   - Loading contextual: "Cargando resumen de tu sesión..."

2. ✅ **Contador de sesiones en panel lateral** (ya funcionaba desde Sesión 14)
   - Errores CORS impedían que funcionara
   - Ahora muestra correctamente:
     - Anónimo: "X sesiones gratuitas. Regístrate para 10 más"
     - Free (≤3 restantes): "X sesiones restantes. Ver planes Pro"
     - Pro: No muestra contador (ilimitado)

3. ✅ **Reducción de fricción UX — Onboarding movido al dashboard**
   - Problema: Modal onboarding en panel lateral creaba fricción ANTES de mostrar valor
   - Solución:
     - Onboarding eliminado completamente del panel (HTML, CSS, JS)
     - Nueva página `/profile` creada con formulario de personalización
     - Link "Mi Perfil" añadido al header del dashboard
     - Filosofía: **Primero mostrar valor (sugerencias), después personalizar**

**Archivos modificados:**
```
next.config.js                     ← CORS headers
extension/popup/popup.js           ← Error handling + syntax fix
extension/side-panel/panel.js      ← Session redirect + onboarding removed
extension/side-panel/panel.html    ← Onboarding HTML removed (líneas 23-94)
extension/side-panel/panel.css     ← Onboarding CSS removed (290 líneas)
app/dashboard/page.tsx             ← Auto-select session + profile link
app/profile/page.tsx               ← NEW: Página de personalización
app/api/profile/context/route.ts   ← JWT auth + legacy support
supabase/migrations/20260301_...   ← Security fixes
```

---

## 🧪 Testing

Ver `TESTING_CHECKLIST.md` para matriz completa de tests.

### Test rápido del flujo freemium

```bash
# 1. Usuario anónimo (sesiones 1-5)
# - Abrir popup → seleccionar perfil → iniciar 5 veces
# - Sesión 6 → debe abrir /auth?reason=limit_soft

# 2. Usuario autenticado (sesiones 6-15)
# - Login con Google
# - Iniciar 10 sesiones más
# - Sesión 16 → debe abrir /pricing

# 3. Plan Pro waitlist
# - Clic "Unirse a lista de espera"
# - Llenar formulario → debe enviar email
```

### Test endpoints

```bash
# Contador de sesiones
curl "http://localhost:3000/api/usage?anonymous_id=xxx"

# Análisis Claude
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Cuéntame sobre un proyecto difícil","profile":"candidato"}'

# Sesiones del usuario
curl "http://localhost:3000/api/sessions" \
  -H "Authorization: Bearer <access_token>"
```

---

## 🚢 Deploy a Producción

### Backend (Vercel)

```bash
vercel --prod
```

### Extensión Chrome

1. Actualizar `manifest.json` version → `"1.0.0"`
2. Actualizar `extension/config.js` con URL de producción
3. Crear ZIP del folder `extension/`
4. Subir a [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

---

## 📖 Documentación Adicional

- **CLAUDE.md** — Documento de referencia técnica completa (⭐ CONSULTAR ANTES DE IMPLEMENTAR)
- **PROGRESS.md** — Estado actual detallado + historial completo de sesiones
- **TESTING_CHECKLIST.md** — Checklist pre-publicación Chrome Web Store
- **.env.example** — Plantilla documentada de variables de entorno

---

## 🤝 Contribución

Este es un proyecto privado. Si tienes acceso y quieres contribuir:

1. Crea un branch desde `main`
2. Haz tus cambios
3. Actualiza `PROGRESS.md` al final de la sesión
4. Crea un Pull Request

---

## 🐛 Issues Conocidos

### ScriptProcessorNode deprecated (No crítico)
- **Ubicación**: `extension/offscreen.js:115`
- **Impacto**: Solo warning, NO bloquea funcionalidad
- **Fix futuro**: Migrar a AudioWorkletNode (Sesión futura)
- **Prioridad**: Baja (funciona hasta Chrome 2027+)

### Migración Supabase pendiente
- **Descripción**: Migración `20260301_fix_security_issues.sql` debe aplicarse manualmente
- **Impacto**: Warnings en Supabase Performance Advisor
- **Acción**: Ejecutar en SQL Editor de Supabase Dashboard

---

## 📧 Contacto

- **Email**: hola@tryconfident.com
- **GitHub**: [@victorodri](https://github.com/victorodri)

---

## 📄 Licencia

Privado - Todos los derechos reservados © 2026 Confident

---

**Desarrollado con Claude Code** 🤖 | **Última actualización**: Marzo 1, 2026 (Sesión 15)
