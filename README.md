# Confident

> Tu confidente en cada conversación importante.

**Confident** es una extensión de Chrome que actúa como tu asistente personalizado durante videollamadas en Google Meet. Escucha la conversación en tiempo real, la analiza con IA y te muestra en un panel lateral **qué decir ahora mismo** — como un coach experto susurrándote al oído.

Solo tú lo ves. Nadie más en la llamada sabe que está ahí.

[![Estado](https://img.shields.io/badge/Estado-MVP%20Sesión%208-green)]()
[![Progreso](https://img.shields.io/badge/Progreso-8%2F8%20sesiones-blue)]()
[![Licencia](https://img.shields.io/badge/Licencia-Privado-red)]()

---

## 🎯 Qué hace

Cuando detecta una señal relevante en la conversación, el panel lateral muestra:

1. **Contexto** — Qué tipo de pregunta es (1 línea)
2. **Sugerencia principal** — Qué decir ahora mismo (texto grande, 2-3 líneas)
3. **Keywords** — Palabras clave a incluir en tu respuesta
4. **Urgencia** — Nivel 1 (informativo), 2 (importante) o 3 (actúa ya)

**Diferenciador clave:** No es un resumen genérico de reuniones. Es un asistente especializado que te dice **qué hacer ahora**, no qué pasó.

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

### ✅ MVP Completado (Sesiones 1-8)

| Sesión | Objetivo | Estado |
|--------|----------|--------|
| **1** | Proof of Concept de audio — captura + Deepgram | ✅ Completada |
| **2** | Pipeline de análisis — transcripción + Claude | ✅ Completada |
| **3** | Panel lateral funcional con UI | ✅ Completada |
| **4** | Autenticación y lógica freemium | ✅ Completada |
| **5** | Landing page pública + Posthog | ✅ Completada |
| **6** | Email de transcripción al finalizar sesión | ✅ Completada |
| **7** | Paywall duro y página de precios | ✅ Completada |
| **8** | UI Apple Style + Onboarding + Dashboard | ✅ Completada |

**Última actualización:** Febrero 23, 2026

### ✨ Funcionalidades implementadas

#### Core Features
- [x] Captura de audio (tab + micrófono) con Chrome MV3
- [x] Transcripción streaming con Deepgram Nova-2
- [x] Análisis IA con Claude Sonnet 4.6 (Structured Outputs)
- [x] Panel lateral con sugerencias en tiempo real
- [x] 3 prompts especializados (Candidato, Vendedor, Defensor)
- [x] Sistema de feedback (👍/👎)
- [x] Historial de sugerencias por sesión

#### Auth & Freemium
- [x] Autenticación con Google (Supabase OAuth)
- [x] Freemium: 5 sesiones anónimas + 15 con cuenta
- [x] Paywall suave (sesión 6 anónima)
- [x] Paywall duro (sesión 16)
- [x] Sistema anti-pirateo (device fingerprinting)
- [x] Migración automática sesiones anónimas → autenticadas

#### UX & Design (Sesión 8)
- [x] UI estilo Apple minimalista (blanco, SF Blue)
- [x] Onboarding pidiendo email en primera instalación
- [x] Contador de sesiones discreto en panel lateral
- [x] Dashboard básico (placeholder)

#### Backend
- [x] API Routes completas (/analyze, /session, /usage, /send-transcript)
- [x] Base de datos con RLS y triggers
- [x] Email automático con transcripción al finalizar sesión
- [x] Landing page pública con Posthog tracking
- [x] Página de precios (/pricing) con waitlist

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
├── README.md                    # Este archivo
├── SETUP.md                     # Guía de configuración completa
├── CLAUDE.md                    # Referencia técnica para desarrollo
├── PROGRESS.md                  # Estado actualizado sesión a sesión
├── .env.example                 # Plantilla de variables de entorno
│
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout + Posthog provider
│   │
│   ├── api/
│   │   ├── analyze/route.ts     # POST: transcripción → Claude → sugerencia
│   │   ├── session/route.ts     # POST: crear sesión | PATCH: cerrar
│   │   ├── usage/route.ts       # GET: contador sesiones + migración
│   │   ├── send-transcript/     # POST: email transcripción
│   │   └── waitlist/            # POST: lista de espera Pro
│   │
│   ├── auth/
│   │   ├── page.tsx             # Login con Google
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   └── success/page.tsx     # Confirmación post-login
│   │
│   ├── dashboard/page.tsx       # Dashboard básico (placeholder)
│   └── pricing/page.tsx         # Planes y precios
│
├── lib/
│   ├── claude.ts                # Prompts por perfil + Structured Outputs
│   ├── supabase.ts              # Cliente Supabase (browser)
│   ├── supabase-server.ts       # Cliente Supabase (server)
│   ├── analytics.ts             # Eventos Posthog tipados
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
    ├── device-fingerprint.js    # Anti-pirateo
    │
    ├── side-panel/
    │   ├── panel.html           # UI del panel lateral (Apple style)
    │   ├── panel.js             # Lógica: recibe sugerencias, feedback
    │   └── panel.css            # Estilos blancos minimalistas
    │
    └── popup/
        ├── popup.html           # Selector perfil + botón inicio
        ├── popup.js             # Lógica: checkSessionGate()
        └── popup.css            # Estilos Apple style
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

## 🚀 Instalación y Setup

### Requisitos previos

- Node.js 20+
- Cuenta en Supabase, Anthropic, Deepgram
- Chrome Browser (para extensión)

### Instalación rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/victorodri/Confident.git
cd Confident

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys

# 4. Ejecutar servidor de desarrollo
npm run dev
```

**Configuración completa:** Ver `SETUP.md` para guía paso a paso de:
- Configuración de Supabase + Schema SQL
- Google Cloud Console OAuth
- Deepgram API
- Resend Email
- Cargar extensión en Chrome

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

## 🗺️ Roadmap

### ✅ Fase 1: MVP (Sesiones 1-8) — COMPLETADA
- ✅ Extensión Chrome funcional
- ✅ Auth + Freemium completo
- ✅ Landing + Analytics
- ✅ Email transcripciones
- ✅ Pricing page + Waitlist
- ✅ UI Apple Style + Onboarding

**Criterio de éxito:** 50 instalaciones, 10 clicks "Ver planes Pro"

### 🔜 Fase 2: Chrome Web Store (Próximamente)
- Iconos profesionales
- Screenshots y assets
- Política de privacidad pública
- Términos de servicio
- Publicación en Chrome Web Store

### 📈 Fase 3: Product-Market Fit (3 meses)
- 500 usuarios activos
- 30% conversión paywall suave
- €1K MRR
- Dashboard con analytics de sesiones
- Modo "practice" con conversaciones simuladas

### 🚀 Fase 4: Escala (6 meses)
- 5K usuarios, €10K MRR
- Soporte Microsoft Teams, Zoom
- Plan B2B (Teams €49/mes)
- Partnerships (bootcamps, escuelas de ventas)

---

## 📚 Documentación

| Archivo | Propósito | Audiencia |
|---------|-----------|-----------|
| **README.md** | Overview del proyecto, instalación rápida | Todos |
| **SETUP.md** | Guía completa de configuración paso a paso | Developers |
| **CLAUDE.md** | Referencia técnica: arquitectura, prompts, schema | Claude Code / Developers |
| **PROGRESS.md** | Estado actualizado sesión a sesión | Team interno |
| **extension/DEBUG-PANEL.md** | Debugging del panel lateral | Developers |

---

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev              # Servidor en localhost:3000
npm run build            # Build producción
npm run start            # Servidor producción

# Testing
curl http://localhost:3000/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Cuéntame sobre ti","profile":"candidato"}'

# Extensión
# Cargar en chrome://extensions
# Activar "Modo desarrollador" → "Cargar extensión sin empaquetar" → seleccionar carpeta extension/
```

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

---

## 🏆 Créditos

- **Founder & Developer:** Victor Rodríguez
- **IA Assistant:** Claude Sonnet 4.5 (Anthropic) via Claude Code
- **Powered by:** Anthropic, Deepgram, Supabase, Vercel, Resend

---

## 🎨 Screenshots

### Popup de la extensión (Apple Style)
![Popup](https://via.placeholder.com/320x400/FFFFFF/007AFF?text=Popup+Apple+Style)

### Panel lateral con sugerencias
![Panel Lateral](https://via.placeholder.com/400x600/FFFFFF/007AFF?text=Panel+Lateral)

### Landing page
![Landing](https://via.placeholder.com/800x600/FFFFFF/007AFF?text=Landing+Page)

---

*"En cada conversación importante, tu mejor versión merece estar presente."*

**Confident — Tu confidente silencioso.**
