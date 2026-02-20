# Confident

> Tu confidente en cada conversación importante.

**Confident** es una extensión de Chrome que actúa como asistente silencioso durante videollamadas en Google Meet. Escucha la conversación en tiempo real, la analiza con IA especializada por rol, y muestra en un panel lateral **qué decir ahora mismo** — como un coach experto susurrándote al oído.

Solo tú lo ves. Nadie más en la llamada sabe que está ahí.

[![Estado](https://img.shields.io/badge/Estado-MVP%20en%20desarrollo-yellow)]()
[![Sesión](https://img.shields.io/badge/Sesión-4%2F8%20completadas-blue)]()
[![Licencia](https://img.shields.io/badge/Licencia-Privado-red)]()

---

## 🎯 Qué hace

Cuando detecta una señal relevante en la conversación, el panel lateral muestra:

1. **QUÉ SE PIDE** — Contexto de la situación (1 línea)
2. **SUGERENCIA** — Qué decir ahora mismo (2-3 líneas, texto grande)
3. **KEYWORDS** — Palabras clave a incluir en tu respuesta
4. **URGENCIA** — Nivel 1 (informativo), 2 (importante) o 3 (actúa ya)

**Diferenciador clave:** No es un resumen genérico de reuniones. Es un coach especializado que te dice **qué hacer ahora**, no qué pasó.

---

## 👥 Para quién es

El sistema tiene **tres perfiles especializados**. El usuario elige uno antes de cada sesión:

| Perfil | Situación | Qué detecta | Tono |
|--------|-----------|-------------|------|
| **🎓 Candidato** | Entrevistas de trabajo y procesos de selección | Preguntas behavioral (STAR), técnicas, situacionales, salariales, motivacionales | Coach de carrera |
| **💼 Vendedor** | Llamadas comerciales y reuniones de ventas | Objeciones (precio/necesidad/confianza), señales de compra, momentos de cierre | Mentor de ventas |
| **🛡️ Defensor** | Reuniones técnicas, presentaciones, negociaciones | Preguntas complejas, cuestionamiento de asunciones, solicitudes de datos | Asesor estratégico |

Cada perfil usa un **prompt diferente de Claude** optimizado para ese contexto específico.

---

## 📊 Estado del proyecto

### MVP — En desarrollo (Sesiones 1-8)

| Sesión | Objetivo | Estado |
|--------|----------|--------|
| **1** | Proof of Concept de audio — captura + Deepgram | ✅ **Completada** |
| **2** | Pipeline de análisis — transcripción + Claude | ✅ **Completada** |
| **3** | Panel lateral funcional con UI | ✅ **Completada** |
| **4** | Autenticación y lógica freemium | ✅ **Completada** |
| **5** | Landing page pública + Posthog | 🟡 **Siguiente** |
| **6** | Email de transcripción al finalizar sesión | ⏳ Pendiente |
| **7** | Paywall duro y página de precios + Stripe | ⏳ Pendiente |
| **8** | QA completo y publicación Chrome Web Store | ⏳ Pendiente |

**Última sesión completada:** Sesión 4 (Febrero 2026)

### ✅ Funcionalidades implementadas (Sesión 1-4)

- [x] Captura de audio (tab + micrófono) con Chrome MV3
- [x] Transcripción streaming con Deepgram Nova-2
- [x] Análisis IA con Claude Sonnet 4.6 (Structured Outputs)
- [x] Panel lateral con sugerencias en tiempo real
- [x] 3 prompts especializados (Candidato, Vendedor, Defensor)
- [x] Sistema de feedback (👍/👎)
- [x] Historial de sugerencias por sesión
- [x] Autenticación con Google (Supabase OAuth)
- [x] Freemium: 5 sesiones anónimas + 15 con cuenta
- [x] Paywall suave (sesión 6 anónima)
- [x] Sistema anti-pirateo (device fingerprinting)
- [x] Migración automática sesiones anónimas → autenticadas
- [x] API Routes completas (/analyze, /session, /usage)
- [x] Base de datos con RLS y triggers
- [x] Contador de sesiones en popup

---

## 🛠️ Stack técnico

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| **Framework Web** | Next.js App Router | 15.3.9 | SSR, API Routes, mismo repo |
| **UI Library** | React | 19.2.4 | Ecosistema, performance |
| **Estilos** | Tailwind CSS + shadcn/ui | 3.x | Desarrollo rápido, componentes accesibles |
| **Extensión** | Chrome Manifest V3 | Vanilla JS | Máxima compatibilidad, sin build |
| **Transcripción** | Deepgram API | Nova-2 | $200 free tier, baja latencia |
| **IA** | Anthropic Claude | Sonnet 4.6 | Razonamiento contextual superior |
| **Backend** | Vercel Serverless | Edge Functions | Deploy automático, escalable |
| **Base de datos** | Supabase PostgreSQL | 15.x | Auth + DB + RLS, Frankfurt (RGPD) |
| **Analytics** | Posthog | EU Cloud | Funnel tracking, privacy-first |
| **Email** | Resend | - | 3K emails/mes gratis |
| **Pagos (prep)** | Stripe | Test mode | Arquitectura lista, no activo MVP |

---

## 📁 Estructura del repositorio

```
Confident/
├── CLAUDE.md                    # Referencia técnica completa (500 líneas)
├── PROGRESS.md                  # Estado actualizado sesión a sesión
├── README.md                    # Este archivo
├── .env.example                 # Plantilla de variables de entorno
│
├── docs/                        # 📚 Documentación oficial para Notion
│   ├── README.md                # Guía de importación a Notion
│   ├── NOTION-DISEÑO.md         # Diseño UI/UX completo
│   ├── NOTION-TÉCNICO.md        # Arquitectura técnica completa
│   └── NOTION-NEGOCIO.md        # Modelo de negocio y estrategia
│
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Landing page (Sesión 5)
│   ├── layout.tsx               # Root layout + Posthog provider
│   │
│   ├── api/
│   │   ├── analyze/route.ts     # POST: transcripción → Claude → sugerencia
│   │   ├── session/route.ts     # POST: crear sesión | PATCH: cerrar
│   │   ├── usage/route.ts       # GET: contador sesiones + migración
│   │   ├── migrate-sessions/    # POST: migración manual anónimo→auth
│   │   └── send-transcript/     # POST: email transcripción (Sesión 6)
│   │
│   ├── auth/
│   │   ├── page.tsx             # Login con Google
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   └── close/page.tsx       # Auto-close post-auth
│   │
│   ├── dashboard/page.tsx       # Historial de sesiones (Sesión 6+)
│   └── pricing/page.tsx         # Planes y precios (Sesión 7)
│
├── components/
│   ├── landing/                 # Secciones landing (Sesión 5)
│   └── ui/                      # Componentes shadcn/ui
│
├── lib/
│   ├── claude.ts                # Prompts por perfil + Structured Outputs
│   ├── supabase.ts              # Cliente Supabase (browser)
│   ├── supabase-server.ts       # Cliente Supabase (server, cookies)
│   ├── analytics.ts             # Eventos Posthog tipados (Sesión 5)
│   └── constants.ts             # Límites freemium (5/15/∞)
│
├── supabase/
│   └── schema.sql               # Schema: profiles, sessions, transcriptions, suggestions
│
└── extension/                   # Extensión Chrome MV3
    ├── manifest.json            # Permisos: tabCapture, storage, sidePanel
    ├── background.js            # Service Worker: audio pipeline + API calls
    ├── content-script.js        # Detecta meet.google.com
    ├── offscreen.js             # WebSocket Deepgram + AudioContext
    ├── device-fingerprint.js    # Anti-pirateo (canvas + WebGL + audio)
    ├── clear-api-key.js         # Script limpieza API key (debug)
    ├── README.md                # Guía troubleshooting
    │
    ├── side-panel/
    │   ├── panel.html           # UI del panel lateral
    │   ├── panel.js             # Lógica: recibe sugerencias, feedback
    │   └── panel.css            # Estilos oscuros + indicadores urgencia
    │
    └── popup/
        ├── popup.html           # Selector perfil + botón inicio
        ├── popup.js             # Lógica: checkSessionGate() + contador
        └── popup.css            # Estilos del popup
```

---

## 💰 Modelo de negocio (Freemium)

```
┌─────────────────────────────────────────────────────┐
│  ANÓNIMO (Sesiones 1-5)                             │
│  • Sin registro, device fingerprint persistente     │
│  • 5 sesiones gratuitas                             │
│  • Sesión 5 → Banner: "Te queda 1 sesión gratuita"  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  PAYWALL SUAVE (Sesión 6 anónima)                   │
│  • "Has usado 5 sesiones gratuitas"                 │
│  • CTA: "Crear cuenta gratis para 10 más"           │
│  • Login con Google → Migración automática          │
│  • Target conversión: 30%                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  CUENTA GRATIS (Sesiones 6-15)                      │
│  • Total 15 sesiones                                │
│  • Email con transcripciones                        │
│  • Sesión 14 → Banner: "Te queda 1 sesión"          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  PAYWALL DURO (Sesión 16)                           │
│  • Bloqueo completo                                 │
│  • CTA: "Ver planes Pro — €19/mes"                  │
│  • Target conversión: 20%                           │
│  • MÉTRICA PRINCIPAL MVP: payment_cta_clicked       │
└─────────────────────────────────────────────────────┘
```

**Objetivo MVP:** Validar que usuarios llegan al paywall y hacen clic en "Ver planes" (willingness to pay).

**Sistema anti-pirateo:** Device fingerprinting (canvas + WebGL + audio context) → UUID persistente incluso tras desinstalar.

---

## 🚀 Setup para colaboradores

### Requisitos previos

- Node.js 20+ (LTS)
- Cuenta en Supabase, Anthropic, Deepgram, Vercel
- Chrome Browser (para extensión)

### 1. Clonar repositorio

```bash
git clone https://github.com/victorodri/Confident.git
cd Confident
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

**Variables críticas:**
```env
# IA y Transcripción (servidor)
ANTHROPIC_API_KEY=sk-ant-...
DEEPGRAM_API_KEY=...

# Supabase (público + privado)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ⚠️ SOLO servidor

# Analytics (público)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@tryconfident.com

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ver `.env.example` para todas las variables con descripciones.

### 4. Configurar Supabase

```bash
# Ejecutar schema en Supabase Dashboard > SQL Editor
cat supabase/schema.sql
```

**OAuth Google:**
1. Dashboard → Authentication → Providers → Google
2. Habilitar y agregar Client ID/Secret de Google Cloud Console

### 5. Desarrollo local

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

**Endpoints de prueba:**
- `GET /api/usage?anonymous_id=test123`
- `POST /api/analyze` con body `{"text":"Cuéntame sobre ti","profile":"candidato"}`

### 6. Cargar extensión en Chrome

1. Abre `chrome://extensions`
2. Activa **"Modo desarrollador"** (toggle arriba a la derecha)
3. Clic en **"Cargar extensión sin empaquetar"**
4. Selecciona la carpeta `extension/`

**Verificar:**
- Icono de Confident aparece en la barra de extensiones
- Solo se activa en `https://meet.google.com/*`

### 7. Probar flujo completo

1. Abre Google Meet (crea una reunión de prueba)
2. Clic en icono Confident → Popup aparece
3. Pega tu Deepgram API key
4. Selecciona perfil (Candidato/Vendedor/Defensor)
5. Clic "Iniciar sesión"
6. Panel lateral se abre → Checkbox consentimiento
7. Habla en la llamada
8. Verifica que aparecen sugerencias en <5s

---

## 🔒 Privacidad y RGPD

- ✅ **Audio procesado en tiempo real, NUNCA almacenado**
- ✅ Solo guardamos texto de transcripciones en Supabase (Frankfurt, EU)
- ✅ Checkbox consentimiento obligatorio antes de iniciar
- ✅ Usuario debe informar a participantes (responsabilidad del usuario)
- ✅ Datos eliminables bajo demanda (ARCO)
- ✅ RLS (Row Level Security) → usuario solo accede a sus datos
- ✅ Analytics agregados (Posthog EU)

**Email transcripción:** Al finalizar sesión, se envía transcripción con enlace a dashboard para eliminar datos.

---

## 📚 Documentación

### Documentación Interna (Desarrollo)

| Archivo | Contenido |
|---------|-----------|
| **CLAUDE.md** | Referencia técnica completa: arquitectura, prompts, schema, flujos, decisiones. Single source of truth para Claude Code. |
| **PROGRESS.md** | Estado actualizado sesión a sesión: qué funciona, qué está pendiente, próximo paso, contexto para continuar. |

### Documentación Oficial (Notion)

En la carpeta `/docs` encontrarás 3 documentos profesionales listos para importar a Notion:

| Archivo | Audiencia | Contenido |
|---------|-----------|-----------|
| **NOTION-DISEÑO.md** | Diseñadores, PMs | Propuesta de valor, perfiles de usuario, flujos UX, sistema de diseño, componentes, wireframes |
| **NOTION-TÉCNICO.md** | Developers, DevOps | Stack completo, arquitectura, Chrome Extension MV3, API Routes, schema DB, seguridad, deployment |
| **NOTION-NEGOCIO.md** | Founders, Inversores | Visión, mercado (TAM/SAM/SOM), modelo de negocio, pricing, métricas, roadmap, competencia, proyecciones |

**Cómo importar a Notion:**
1. Abre Notion → Página nueva
2. "..." → Import → Markdown & CSV
3. Sube los 3 archivos `.md`
4. Notion crea páginas formateadas automáticamente

Ver `docs/README.md` para guía completa.

---

## 🔧 Troubleshooting

### Error: WebSocket 1006 (Deepgram)
**Causa:** API key de Deepgram inválida o expirada

**Solución:**
1. Verifica tu API key en https://console.deepgram.com
2. Ejecuta `extension/clear-api-key.js` para limpiar key guardada
3. Recarga extensión en `chrome://extensions`
4. Pega nueva API key

Ver `extension/README.md` para más errores comunes.

### Error 500 en /api/analyze
**Causa:** Variables de entorno faltantes

**Solución:**
1. Verifica `.env.local` tiene `ANTHROPIC_API_KEY`
2. Restart servidor: `npm run dev`

### Sugerencias no aparecen
**Causa:** Latencia de red o transcripción no final

**Solución:**
1. Verifica consola de background.js (`chrome://extensions` → Inspect service worker)
2. Busca logs "VAD_ENDED received"
3. Verifica que `is_final=true` en transcripción

---

## 🗺️ Roadmap

### Fase 1: MVP (Sesiones 1-8) — **ACTUAL**
- ✅ Extensión Chrome funcional
- ✅ Auth + Freemium
- 🟡 Landing + Posthog (Sesión 5)
- 🟡 Email transcripciones (Sesión 6)
- 🟡 Pricing + Stripe prep (Sesión 7)
- 🟡 Chrome Web Store (Sesión 8)

**Criterio de éxito:** 50 instalaciones, 10 clicks "Ver planes Pro"

### Fase 2: Product-Market Fit (3 meses)
- 500 usuarios activos
- 30% conversión paywall suave
- €1K MRR
- Dashboard con analytics de sesiones
- Modo "practice" con conversaciones simuladas

### Fase 3: Escala (6 meses)
- 5K usuarios, €10K MRR
- Soporte Microsoft Teams, Zoom
- Plan B2B (Teams €49/mes)
- Partnerships (bootcamps, escuelas de ventas)

### Fase 4: Consolidación (12 meses)
- 50K usuarios, €100K MRR
- Enterprise (custom prompts, SOC2, on-premise)
- Internacionalización (inglés, francés, alemán)
- API pública + marketplace de prompts

---

## 🤝 Contribuir

Este es un proyecto privado en fase MVP. No aceptamos contribuciones externas en esta fase.

**Post-MVP:** Consideraremos abrir contribuciones para:
- Nuevos perfiles (Profesor, Founder, Abogado)
- Traducciones
- Mejoras de prompts
- Integraciones (CRM, ATS)

---

## 📄 Licencia

Copyright © 2026 Victor Rodríguez. Todos los derechos reservados.

Este proyecto es software propietario. No está permitida la redistribución, modificación o uso comercial sin autorización expresa.

---

## 📞 Contacto

- **Email:** hola@tryconfident.com
- **GitHub Issues:** Para bugs y feature requests (colaboradores autorizados)
- **Discord:** Community post-lanzamiento

---

## 🏆 Créditos

- **Founder & Developer:** Victor Rodríguez
- **IA Assistant:** Claude Sonnet 4.5 (Anthropic) via Claude Code
- **Powered by:** Anthropic, Deepgram, Supabase, Vercel

---

*"En cada conversación importante, tu mejor versión merece estar presente."*

**Confident — Tu confidente silencioso.**
