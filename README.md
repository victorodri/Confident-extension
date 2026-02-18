# Confident

> Tu confidente en cada conversación importante.

Confident es una extensión de Chrome que actúa como asistente silencioso durante videollamadas en Google Meet. Escucha la conversación en tiempo real, la analiza con IA y muestra en un panel lateral qué decir a continuación — como un amigo experto hablándote al oído.

Solo tú lo ves. Nadie más en la llamada sabe que está ahí.

---

## Qué hace

Cuando detecta una señal relevante en la conversación, el panel lateral muestra tres elementos:

1. **Sugerencia** — qué decir ahora mismo
2. **Contexto** — qué tipo de situación es y qué busca el interlocutor con ella
3. **Keywords** — palabras clave a incluir en la respuesta

---

## Para quién es

El sistema tiene tres perfiles. El usuario elige uno antes de cada sesión:

| Perfil | Situación | Qué detecta |
|--------|-----------|-------------|
| **Candidato** | Entrevistas de trabajo y procesos de selección | Preguntas de competencias, técnicas, situacionales, salariales |
| **Vendedor** | Llamadas comerciales y reuniones de ventas | Objeciones, señales de compra, momentos de cierre |
| **Defensor** | Reuniones técnicas, presentaciones, negociaciones | Preguntas complejas, cuestionamientos de hipótesis, argumentación |

---

## Estado del proyecto

### MVP — En desarrollo

El MVP está limitado a Google Meet y cubre el flujo completo desde la captura de audio hasta la sugerencia en pantalla.

| Sesión | Objetivo | Estado |
|--------|----------|--------|
| 1 | Proof of Concept de audio — captura + Deepgram | Completada |
| 2 | Pipeline de análisis — transcripción + Claude | Pendiente |
| 3 | Panel lateral funcional con UI | Pendiente |
| 4 | Autenticación y lógica freemium | Pendiente |
| 5 | Landing page pública | Pendiente |
| 6 | Email de transcripción al finalizar sesión | Pendiente |
| 7 | Paywall duro y página de precios | Pendiente |
| 8 | QA y publicación en Chrome Web Store | Pendiente |

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Landing + API | Next.js 14 (App Router) |
| Estilos | Tailwind CSS + shadcn/ui |
| Extensión Chrome | Vanilla JS, Manifest V3 |
| Transcripción | Deepgram API (Nova-2, streaming) |
| IA | Anthropic Claude (claude-sonnet-4-6) |
| Backend | Vercel Serverless Functions |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Supabase Auth |
| Analytics | Posthog (EU) |
| Email | Resend |

---

## Estructura del repositorio

```
Confident/
├── CLAUDE.md              # Referencia técnica completa del proyecto
├── PROGRESS.md            # Estado actual y próximos pasos
├── README.md              # Este archivo
│
├── app/                   # Next.js App Router (landing + API)
│   ├── page.tsx           # Landing page
│   ├── api/
│   │   ├── analyze/       # POST: transcripción → Claude → sugerencia
│   │   ├── session/       # Gestión de sesiones
│   │   ├── usage/         # Contador de sesiones (freemium)
│   │   └── send-transcript/ # Email de transcripción al finalizar
│   ├── login/             # Login con Google
│   ├── dashboard/         # Historial de sesiones
│   └── pricing/           # Planes y precios
│
├── components/
│   ├── landing/           # Secciones de la landing page
│   └── ui/                # Componentes shadcn/ui
│
├── lib/
│   ├── claude.ts          # Prompts por perfil + wrapper Anthropic SDK
│   ├── supabase.ts        # Cliente Supabase (browser)
│   ├── supabase-server.ts # Cliente Supabase (servidor)
│   ├── analytics.ts       # Eventos Posthog tipados
│   └── constants.ts       # Límites freemium y constantes
│
├── supabase/
│   └── schema.sql         # Schema completo con RLS
│
└── extension/             # Extensión Chrome MV3
    ├── manifest.json
    ├── background.js      # Service Worker: tabCapture + mensajes
    ├── content-script.js  # Inyectado en meet.google.com
    ├── offscreen.html/js  # Procesamiento de audio + WebSocket Deepgram
    ├── side-panel/        # Panel lateral con sugerencias
    ├── popup/             # Selector de perfil + botón de inicio
    └── icons/
```

---

## Modelo de negocio (freemium)

```
Anónimo        →  5 sesiones gratuitas, sin registro
Cuenta gratis  →  15 sesiones en total
Pro            →  Ilimitado (Stripe, preparado pero no activo en MVP)
```

El objetivo medible del MVP es validar que usuarios anónimos llegan al paywall y hacen clic en "Ver planes".

---

## Setup para colaboradores

### Requisitos previos

- Node.js 18+
- Cuenta en Supabase, Anthropic, Deepgram, Vercel

### Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

### Desarrollo local

```bash
npm install
npm run dev
```

La API estará disponible en `http://localhost:3000`.

### Cargar la extensión en Chrome

1. Abre `chrome://extensions`
2. Activa "Modo desarrollador"
3. Clic en "Cargar descomprimida"
4. Selecciona la carpeta `extension/`

La extensión solo se activa en `https://meet.google.com/*`.

---

## Privacidad

- El audio se procesa en tiempo real y **nunca se almacena**
- Las transcripciones se guardan en texto en Supabase (Frankfurt, RGPD)
- El usuario es responsable de informar a los participantes antes de iniciar
- El checkbox de consentimiento es obligatorio antes de cada sesión

---

## Documentación interna

| Archivo | Contenido |
|---------|-----------|
| `CLAUDE.md` | Referencia técnica completa: arquitectura, prompts, schema, flujos, decisiones de diseño |
| `PROGRESS.md` | Estado actualizado sesión a sesión: qué funciona, qué está pendiente, próximo paso |

---

## Versiones futuras

Este README describe el MVP. Las versiones posteriores pueden incluir soporte para otras plataformas (Zoom, Teams), perfiles adicionales, integraciones con ATS o CRM, y funciones de coaching post-sesión. Cada versión mayor tendrá su propia sección en este documento.

---

*Plataforma MVP: Google Meet*
*Marca: Confident*
*Repositorio: github.com/victorodri/Confident-extension*
