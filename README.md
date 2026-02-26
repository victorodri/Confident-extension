# Confident

> **Tu confidente en cada conversación importante**

Extensión de Chrome que actúa como coach silencioso durante videollamadas en Google Meet. Escucha ambas partes de la conversación, analiza con IA, y muestra en panel lateral sugerencias en tiempo real sobre qué decir.

![Versión](https://img.shields.io/badge/version-1.0.0--dev-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Chrome Extension](https://img.shields.io/badge/Chrome-MV3-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🎯 ¿Qué es Confident?

Confident es una extensión de Chrome que te asiste en tiempo real durante conversaciones críticas en Google Meet. Utiliza IA (Claude Sonnet 4.6) para:

- **Detectar señales** en la conversación (preguntas behavioral, objeciones de venta, preguntas complejas)
- **Sugerir respuestas** adaptadas a tu perfil (Candidato, Vendedor, Defensor)
- **Mostrar contexto** sobre qué se está preguntando realmente
- **Destacar keywords** importantes para incluir en tu respuesta

### Los tres perfiles especializados

| Perfil | Contexto | Señales que detecta |
|--------|----------|---------------------|
| **🎓 Candidato** | Entrevistas de trabajo | Preguntas STAR, técnicas, salariales, motivacionales |
| **💼 Vendedor** | Llamadas comerciales | Objeciones, señales de compra, momentos de cierre |
| **🛡️ Defensor** | Presentaciones estratégicas | Preguntas complejas, cuestionamientos, riesgos |

---

## 🚀 Funcionalidades principales

### ✅ **Implementado (MVP)**

- ✅ Captura de audio bidireccional (tab + micrófono) con Web Audio API
- ✅ Transcripción en tiempo real con Deepgram Nova-2
- ✅ Análisis inteligente con Claude Sonnet 4.6 (Structured Outputs)
- ✅ Panel lateral con sugerencias en <5 segundos
- ✅ 3 perfiles especializados con prompts optimizados
- ✅ Sistema freemium completo:
  - **Anónimo**: 5 sesiones sin registro
  - **Gratis**: 15 sesiones con cuenta Google
  - **Pro**: Sesiones ilimitadas (lista de espera)
- ✅ Dashboard con historial de transcripciones y sugerencias
- ✅ Email automático con transcripción al finalizar sesión
- ✅ Checkbox de consentimiento obligatorio (RGPD)
- ✅ Sistema anti-pirateo con device fingerprinting
- ✅ Analytics con Posthog (funnel completo)
- ✅ Landing page + página de precios
- ✅ UI estilo Apple (SF Pro, SF Blue, sombras sutiles)

### 🔜 **En desarrollo activo (Roadmap v1.0)**

**Sesiones 13-15** (CRÍTICO):
- 🔴 Fix contador de sesiones en panel lateral
- 🔴 Fix cards inteligentes (lógica de urgencia)

**Sesiones 16-23** (ALTA PRIORIDAD):
- 🟡 Políticas legales (Privacy + Terms)
- 🟡 Assets profesionales (iconos, screenshots)
- 🟡 Testing exhaustivo pre-publicación
- 🟡 Publicación en Chrome Web Store v1.0.0

**Sesiones 24-27** (OPCIONAL - mientras revisión CWS):
- 🟢 Onboarding personalizado
- 🟢 Contexto de usuario en IA
- 🟢 Dashboard con perfil editable
- 🟢 Soporte multi-platform (Teams, Zoom)

### 📅 **Diferido a v1.1**

- Plan Pro con pagos (Stripe) - activar cuando waitlist ≥ 20
- IA contextual con historial de sesiones previas
- Modo practice (simulaciones)
- Analytics de rendimiento personal avanzado

---

## 📦 Stack Técnico

### Frontend (Landing + Dashboard)
- **Framework**: Next.js 15.3.9 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Tipografía**: SF Pro Display (estilo Apple)
- **Analytics**: Posthog EU

### Extensión Chrome
- **Manifest**: V3
- **Audio**: Web Audio API + tabCapture + getUserMedia
- **Arquitectura**: Vanilla JS (sin frameworks, máxima compatibilidad)
- **Storage**: chrome.storage.local + chrome.storage.session

### Backend (Serverless)
- **Plataforma**: Vercel Edge Functions
- **Database**: Supabase PostgreSQL (Frankfurt, EU)
- **Auth**: Supabase Auth (Google OAuth)
- **Transcripción**: Deepgram Nova-2 (streaming WebSocket)
- **IA**: Anthropic Claude Sonnet 4.6
- **Email**: Resend

---

## 🛠️ Configuración local

### Prerequisitos

- Node.js 18+
- npm o pnpm
- Cuenta en Supabase
- Cuenta en Anthropic (Claude API)
- Cuenta en Deepgram
- Cuenta en Resend (para emails)
- Chrome browser

### 1. Clonar repositorio

\`\`\`bash
git clone https://github.com/victorodri/Confident.git
cd Confident
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Variables de entorno

Copia \`.env.example\` a \`.env.local\` y completa las variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

**Variables críticas:**

\`\`\`bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Deepgram (Transcripción)
DEEPGRAM_API_KEY=...
NEXT_PUBLIC_DEEPGRAM_API_KEY=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # SOLO servidor

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_NOTIFICATION_EMAIL=tu@email.com

# Posthog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el schema desde \`supabase/schema.sql\` en el SQL Editor
3. Configura Google OAuth:
   - Dashboard → Authentication → Providers → Google
   - Habilitar y agregar Client ID/Secret de Google Cloud Console
4. Añade las variables de entorno

### 5. Cargar extensión en Chrome

1. Abre Chrome y ve a \`chrome://extensions\`
2. Activa "Modo de desarrollador"
3. Clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta \`extension/\` del proyecto

### 6. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000)

### 7. Probar el flujo completo

1. Abre Google Meet (o crea una reunión de prueba)
2. Clic en el icono de Confident en la barra de extensiones
3. Pega tu API key de Deepgram
4. Selecciona un perfil (Candidato/Vendedor/Defensor)
5. Marca el checkbox de consentimiento
6. Clic "Iniciar sesión"
7. Habla en la reunión y observa el panel lateral

---

## 📁 Estructura del proyecto

\`\`\`
confident/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── pricing/page.tsx          # Página de precios + waitlist
│   ├── dashboard/page.tsx        # Dashboard con transcripciones
│   ├── auth/                     # Login con Google OAuth
│   └── api/                      # API Routes
│       ├── analyze/route.ts      # Claude → sugerencias
│       ├── sessions/route.ts     # Gestión de sesiones
│       ├── usage/route.ts        # Contador freemium
│       ├── send-transcript/route.ts
│       └── waitlist/route.ts
│
├── components/                   # Componentes React
│   ├── landing/                  # Hero, HowItWorks, UseCases, Footer
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Utilidades
│   ├── claude.ts                 # Prompts + getSystemPrompt(profile)
│   ├── supabase.ts               # Cliente browser
│   ├── supabase-server.ts        # Cliente server
│   ├── analytics.ts              # Posthog eventos
│   └── constants.ts              # Límites freemium
│
├── extension/                    # Chrome Extension (MV3)
│   ├── manifest.json
│   ├── config.js                 # URLs centralizadas (dev/prod)
│   ├── logger.js                 # Logging condicional
│   ├── constants.js              # Constantes consolidadas
│   ├── background.js             # Service Worker
│   ├── offscreen.js              # Audio pipeline + Deepgram
│   ├── device-fingerprint.js     # Anti-pirateo
│   ├── popup/                    # Popup (selector perfil)
│   └── side-panel/               # Panel lateral (sugerencias)
│
├── supabase/
│   └── schema.sql                # Schema completo con RLS
│
├── CLAUDE.md                     # Documento de referencia técnica
├── PROGRESS.md                   # Estado actual del proyecto
└── README.md                     # Este archivo
\`\`\`

---

## 🔒 Privacidad y seguridad

- ✅ **RGPD compliant** - Datos en Frankfurt (EU)
- ✅ **Audio NUNCA almacenado** - Solo procesado en tiempo real
- ✅ **Transcripciones eliminables** - Desde dashboard o email
- ✅ **Checkbox de consentimiento obligatorio** antes de iniciar
- ✅ **Row Level Security (RLS)** en todas las tablas de Supabase
- ✅ **Sin XSS** - Construcción manual del DOM (sin innerHTML)
- ✅ **Security headers** en Next.js (CSP, X-Frame-Options, etc.)
- ✅ **Logs solo en desarrollo** - Sistema de logging condicional

---

## 📊 Métricas clave (MVP)

| Métrica | Evento Posthog | Descripción |
|---------|----------------|-------------|
| **🎯 Principal** | \`payment_cta_clicked\` | Usuario hace clic en "Unirse a lista de espera Pro" |
| Instalación | \`extension_installed\` | Usuario instala la extensión |
| Primera sesión | \`session_started\` | Primera vez que inicia sesión |
| Paywall soft | \`paywall_soft_shown\` | Usuario llega a sesión 6 (anónimo) |
| Conversión soft | \`paywall_soft_converted\` | Usuario crea cuenta después del paywall soft |
| Paywall hard | \`paywall_hard_shown\` | Usuario llega a sesión 16 (plan free) |

---

## 🧪 Testing

### Test manual del flujo freemium

\`\`\`bash
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
\`\`\`

### Test endpoints

\`\`\`bash
# Contador de sesiones
curl "http://localhost:3000/api/usage?anonymous_id=xxx"

# Análisis Claude
curl -X POST http://localhost:3000/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Cuéntame sobre un proyecto difícil","profile":"candidato"}'

# Sesiones del usuario
curl "http://localhost:3000/api/sessions" \\
  -H "Authorization: Bearer <access_token>"
\`\`\`

---

## 📝 Documentación adicional

- **CLAUDE.md** - Documento de referencia absoluta (consultar antes de implementar)
- **PROGRESS.md** - Estado actual del proyecto por sesión
- **extension/README.md** - Guía de solución de errores de la extensión
- **.env.example** - Plantilla documentada de variables de entorno

---

## 🚢 Deploy a producción

### Backend (Vercel)

\`\`\`bash
vercel --prod
\`\`\`

### Extensión Chrome

1. Cambiar \`manifest.json\` version de \`"1.0.0-dev"\` a \`"1.0.0"\`
2. Actualizar \`extension/config.js\` con URL de producción
3. Crear ZIP del folder \`extension/\`
4. Subir a [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

---

## 🤝 Contribución

Este es un proyecto privado. Si tienes acceso y quieres contribuir:

1. Crea un branch desde \`main\`
2. Haz tus cambios
3. Asegúrate de actualizar \`PROGRESS.md\` al final de la sesión
4. Crea un Pull Request

---

## 📧 Contacto

- **Email**: hola@tryconfident.com
- **GitHub**: [@victorodri](https://github.com/victorodri)

---

## 📄 Licencia

Privado - Todos los derechos reservados © 2026 Confident

---

**Hecho con Claude Code** 🤖
