<div align="center">

# 🎯 Confident

### Tu coach silencioso con IA en conversaciones importantes

[![Version](https://img.shields.io/badge/version-0.1.0--dev-purple?style=for-the-badge)](https://github.com/victorodri/Confident-extension)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Chrome](https://img.shields.io/badge/Chrome-MV3-blue?style=for-the-badge&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/)
[![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-orange?style=for-the-badge)](https://anthropic.com)
[![Security](https://img.shields.io/badge/Security-95%25-success?style=for-the-badge&logo=shield)](./docs/SECURITY_AUDIT.md)

[🚀 Roadmap](#-roadmap) • [📦 Features](#-features) • [🛠️ Stack](#%EF%B8%8F-stack-técnico) • [📄 Docs](./docs/README.md) • [🔒 Security](./docs/SECURITY_AUDIT.md)

</div>

---

## 💡 ¿Qué es Confident?

**Confident** es una extensión de Chrome potenciada por IA que te asiste **en tiempo real** durante videollamadas críticas. Escucha la conversación, analiza el contexto con **Claude Sonnet 4.6**, y te muestra sugerencias inteligentes en un panel lateral — sin interrumpir tu flujo.

Imagina tener un **coach experto** que entiende exactamente qué te están preguntando y te sugiere cómo responder con confianza. Eso es Confident.

<div align="center">

### 🎬 Demo

> 📸 **[Screenshots & Video Demo Coming Soon]**
>
> Actualmente en desarrollo — Landing y Dashboard design en progreso

</div>

---

## 🎯 ¿Para quién es?

<table>
<tr>
<td width="33%" align="center">

### 🎓 **Candidatos**
Entrevistas de trabajo

Detecta preguntas **behavioral** (STAR), **técnicas**, **motivacionales**. Te sugiere marcos de respuesta estructurados y te ayuda a destacar logros cuantificables.

**Objetivo**: Conseguir el trabajo mostrando competencias claras

</td>
<td width="33%" align="center">

### 💼 **Vendedores**
Llamadas comerciales

Identifica **objeciones** (precio/necesidad/confianza) y **señales de compra**. Te sugiere técnicas de cierre consultivo y cómo convertir objeciones en oportunidades.

**Objetivo**: Aumentar conversión sin sonar agresivo

</td>
<td width="33%" align="center">

### 🛡️ **Defensores**
Presentaciones estratégicas

Descompone preguntas complejas en su **esencia real**. Te muestra la intención detrás de cuestionamientos y cómo estructurar respuestas sin divagar.

**Objetivo**: Defender ideas con claridad y anticipar objeciones

</td>
</tr>
</table>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 **Core Features**

- ✅ **Análisis IA en tiempo real** con Claude Sonnet 4.6
- ✅ **Multi-plataforma**: Google Meet, Teams, Zoom
- ✅ **Multi-idioma**: Español + English (extensión + IA)
- ✅ **4 perfiles especializados**: Candidato, Vendedor, Profesor, Defensor
- ✅ **Sistema de urgencia visual**: Verde/Amarillo/Rojo
- ✅ **Transcripciones automáticas** con Deepgram Nova-2
- ✅ **Email automático** al finalizar sesión
- ✅ **Dashboard** con historial completo

</td>
<td width="50%">

### 🔒 **Security & Privacy**

- ✅ **RGPD compliant** — Datos en Frankfurt (EU)
- ✅ **Audio NUNCA almacenado** — Solo procesado en tiempo real
- ✅ **Rate limiting** — DoS protection (5-60 req/min)
- ✅ **Input validation** — Zod schemas en todos los endpoints
- ✅ **RLS activo** — Row Level Security en Supabase
- ✅ **XSS protection** — textContent only, sin innerHTML
- ✅ **Logger sanitizado** — Sin datos sensibles en producción
- ✅ **95% security score** — 0 vulnerabilidades críticas

</td>
</tr>
</table>

### 💰 **Freemium Model**

| Plan | Sesiones | Precio | Características |
|------|----------|--------|-----------------|
| **Anonymous** | 5 gratis | €0 | Sin registro, prueba rápida |
| **Free** | 15 totales | €0 | Con cuenta Google |
| **Pro** | ∞ Ilimitadas | €19/mes | Analytics, soporte prioritario |
| **Diamond** | ∞ Ilimitadas | €49/mes | Todo Pro + acceso anticipado a features |

---

## 🛠️ Stack Técnico

<div align="center">

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/-Next.js_15-black?style=flat-square&logo=next.js) ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Landing + Dashboard con App Router |
| **Extension** | ![Chrome](https://img.shields.io/badge/-Chrome_MV3-blue?style=flat-square&logo=googlechrome&logoColor=white) ![JavaScript](https://img.shields.io/badge/-Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Manifest V3, Web Audio API, Port API |
| **Transcripción** | ![Deepgram](https://img.shields.io/badge/-Deepgram_Nova--2-13EF93?style=flat-square) | Streaming, baja latencia, ES/EN |
| **IA** | ![Claude](https://img.shields.io/badge/-Claude_Sonnet_4.6-orange?style=flat-square) | Análisis contextual, 4 prompts especializados |
| **Database** | ![Supabase](https://img.shields.io/badge/-Supabase_PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | RLS, Auth, Frankfurt (EU) |
| **Auth** | ![Google](https://img.shields.io/badge/-Google_OAuth-4285F4?style=flat-square&logo=google&logoColor=white) | Supabase Auth integration |
| **Payments** | ![Stripe](https://img.shields.io/badge/-Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white) | Checkout, webhooks (en integración) |
| **Email** | ![Resend](https://img.shields.io/badge/-Resend-000000?style=flat-square) | Transcripciones automáticas |
| **Analytics** | ![Posthog](https://img.shields.io/badge/-Posthog_EU-1D4AFF?style=flat-square) | RGPD compliant |
| **Hosting** | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Edge functions, auto-deploy |

</div>

---

## 🚀 Roadmap

> **📋 Ver roadmap completo**: [`ROADMAP.md`](./ROADMAP.md)

### 🔥 **Ahora (FASE 1 — Pre-Launch)**

- 🎨 **Landing + Dashboard Design** (Victor) — En progreso
- 💳 **Integración Stripe** — Siguiente
- 🚀 **Deployment a Producción** — Staging → QA → Production
- 🏪 **Chrome Web Store Publication** — v1.0.0

### 🎯 **Después (FASE 2 — Post-Launch)**

- 🎨 UX enhancements (dark mode, tooltips)
- 📊 Analytics dashboard (gráficas, insights)
- 🤖 IA improvements (nuevos perfiles, ejemplos)
- 🌍 Expansión (FR/DE idiomas, Firefox/Safari)

### 🔮 **Futuro (FASE 3 — Scale)**

- ⚡ Performance (Redis, CDN, caching)
- 🔧 Infrastructure (monitoring, CI/CD, E2E testing)
- 📱 Mobile app (React Native)
- 🎯 API pública para developers

---

## 📊 Estado Actual

<div align="center">

| Métrica | Estado |
|---------|--------|
| **Versión** | `0.1.0-dev` |
| **Sesión completada** | `42` |
| **Core funcional** | ✅ 95% |
| **Security score** | ✅ 95% (0 vulnerabilidades críticas) |
| **npm audit** | ✅ 0 vulnerabilities |
| **Tests passing** | ⏳ Pendiente QA manual |
| **Production ready** | ⏳ Esperando Landing/Dashboard design |

</div>

### ✅ Completado

- ✅ Audio pipeline robusto (MV3 Port API, Web Audio API)
- ✅ Sistema freemium con paywalls (soft/hard)
- ✅ Multi-plataforma (Meet/Teams/Zoom)
- ✅ Multi-idioma completo (ES/EN)
- ✅ IA contextual personalizada
- ✅ Dashboard con historial
- ✅ Security fixes (VULN-001 a VULN-005 resueltos)
- ✅ Rate limiting (DoS protection)
- ✅ Input validation (Zod)
- ✅ Logger sanitizado

### ⏳ En Progreso

- 🎨 **Landing design** (Victor)
- 🎨 **Dashboard design** (Victor)

### 📅 Próximos Pasos

1. **Terminar diseños** Landing + Dashboard (Victor)
2. **Implementar diseños** desde Figma (1-2 días)
3. **Integrar Stripe** checkout + webhooks (1 día)
4. **QA manual** con 15+ screenshots (2 horas)
5. **Deploy a producción** (Vercel)
6. **Publicar en Chrome Web Store** (v1.0.0)

---

## 📁 Estructura del Proyecto

```
confident/
├── 📋 CLAUDE.md              # Documento de referencia absoluta
├── 📊 PROGRESS.md            # Estado actual detallado (Sesión 1-42)
├── 🗺️ ROADMAP.md             # Roadmap 2026 con prioridades
├── 📖 README.md              # Este archivo
│
├── 📂 docs/                  # Documentación técnica
│   ├── DEPLOYMENT_GUIDE.md   # 7 fases deployment profesional
│   ├── SECURITY_AUDIT.md     # Auditoría seguridad completa
│   ├── ARCHITECTURE_AUDIT.md # Auditoría arquitectura
│   ├── GUIA_CONFIGURACION_STRIPE.md
│   └── CHROME_WEB_STORE_PUBLICATION.md
│
├── 📂 app/                   # Next.js App Router
│   ├── [locale]/             # Rutas localizadas (ES/EN)
│   │   ├── page.tsx          # Landing
│   │   ├── dashboard/        # Dashboard con historial
│   │   ├── pricing/          # Planes Pro/Diamond
│   │   ├── privacy/          # RGPD compliant
│   │   └── terms/
│   └── api/                  # API Routes
│       ├── analyze/          # Claude IA (rate limited)
│       ├── sessions/         # CRUD sesiones
│       ├── transcriptions/   # Guardar transcripciones
│       ├── suggestions/      # Guardar sugerencias
│       ├── usage/            # Contador sesiones
│       ├── health/           # Health check
│       └── send-transcript/  # Email Resend
│
├── 📂 extension/             # Chrome Extension MV3
│   ├── manifest.json         # v0.1.0-dev
│   ├── background.js         # Service Worker (Port API)
│   ├── content-script.js     # Detección Meet/Teams/Zoom
│   ├── offscreen.js          # Audio pipeline (Web Audio API)
│   ├── config.js             # Auto-detect dev/prod
│   ├── logger.js             # Sanitized logging
│   ├── side-panel/
│   │   ├── panel.html
│   │   ├── panel-v2.js       # State machine (12 estados)
│   │   ├── panel-v2.css      # Figma-accurate
│   │   ├── components.js     # UI components
│   │   └── assets/           # Icons, logos
│   └── popup/
│       ├── popup.html
│       └── popup.js          # Selector perfil, idioma
│
├── 📂 lib/                   # Shared utilities
│   ├── supabase.ts           # Client browser
│   ├── supabase-server.ts    # Client server (service role)
│   ├── claude.ts             # Prompts IA + getSystemPrompt()
│   ├── validation.ts         # Zod schemas (VULN-002 fix)
│   ├── rate-limit.ts         # Rate limiting (VULN-005 fix)
│   ├── logger.ts             # Backend logger (VULN-003 fix)
│   ├── constants.ts          # Límites freemium
│   └── utils.ts
│
├── 📂 supabase/              # Database
│   ├── schema.sql            # Tables + RLS policies
│   └── migrations/
│
├── 📂 messages/              # i18n (next-intl)
│   ├── es.json               # Español
│   └── en.json               # English
│
├── 📂 branding/              # Assets de marca
│   ├── icons/
│   └── logo/
│
└── 📂 visual/                # Chrome Web Store assets
    ├── icon16.png, icon48.png, icon128.png
    └── promotional-tile.png
```

---

## 🔒 Privacidad y Seguridad

<table>
<tr>
<td width="50%">

### 🛡️ **Seguridad**

- ✅ **Input validation** — Zod schemas
- ✅ **Rate limiting** — 5-60 req/min por endpoint
- ✅ **RLS activo** — Row Level Security
- ✅ **XSS protection** — textContent only
- ✅ **CORS configurado** — Dominios autorizados
- ✅ **Logger sanitizado** — Sin datos sensibles
- ✅ **JWT validation** — Supabase auth
- ✅ **Anonymous_id validation** — Backend ownership

</td>
<td width="50%">

### 🔐 **Privacidad**

- ✅ **RGPD compliant** — Datos en Frankfurt (EU)
- ✅ **Audio NUNCA almacenado** — Procesado en tiempo real
- ✅ **Transcripciones eliminables** — Dashboard + email ARCO
- ✅ **Consentimiento obligatorio** — Checkbox pre-inicio
- ✅ **Analytics EU** — Posthog Frankfurt
- ✅ **Política de privacidad** — `/privacy`
- ✅ **Términos de servicio** — `/terms`
- ✅ **Email con derechos ARCO** — Automático al finalizar

</td>
</tr>
</table>

---

## 📄 Licencia

**Privado** — Todos los derechos reservados © 2026 Confident

---

## 📞 Contacto

<div align="center">

**¿Preguntas? ¿Feedback?**

📧 [hola@tryconfident.com](mailto:hola@tryconfident.com)

🔗 [GitHub Repository](https://github.com/victorodri/Confident-extension)

📚 [Documentación Completa](./docs/README.md)

---

**Hecho con ❤️ usando Claude Sonnet 4.5**

</div>
