# Confident

> **Tu coach silencioso en conversaciones importantes**

![Versión](https://img.shields.io/badge/version-0.1.0--dev-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Chrome Extension](https://img.shields.io/badge/Chrome-MV3-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 💡 ¿Qué es Confident?

**Confident** es una extensión de Chrome con IA que te asiste en tiempo real durante videollamadas críticas. Escucha la conversación, analiza con inteligencia artificial y te muestra sugerencias contextuales en un panel lateral para ayudarte a responder con confianza.

Imagina tener un coach experto que entiende exactamente lo que te están preguntando y te sugiere cómo responder, pero sin interrumpir tu conversación. Eso es Confident.

---

## 🎯 Para quién es Confident

### 🎓 **Candidatos en procesos de selección**
Detecta preguntas behavioral (STAR), técnicas, motivacionales y salariales. Te sugiere marcos de respuesta como STAR/CAR, te recuerda incluir logros cuantificables y te ayuda a mantener el foco en tus fortalezas. Evita respuestas vagas o que te hagan parecer inseguro.

**Objetivo:** Conseguir que destaques en la entrevista mostrando competencias claras y resultados concretos.

### 💼 **Vendedores en llamadas comerciales**
Identifica objeciones de precio, necesidad y confianza. Detecta señales de compra (momentos críticos donde el cliente está listo para cerrar) y te sugiere técnicas de cierre consultivo. Te ayuda a convertir objeciones en oportunidades y a no dejar pasar señales clave.

**Objetivo:** Incrementar tu tasa de conversión cerrando más ventas con confianza y sin sonar agresivo.

### 🛡️ **Defensores en presentaciones estratégicas**
Descompone preguntas complejas en su esencia real (qué se pregunta vs qué se dice). Te muestra la intención detrás de cuestionamientos sobre riesgos, alternativas o datos. Te sugiere cómo estructurar respuestas que demuestren que has pensado en profundidad, sin divagar.

**Objetivo:** Defender tus ideas con claridad, anticipando objeciones y comunicando decisiones de forma estratégica.

---

## 📊 Stack Técnico

| Componente | Tecnología | Para qué se usa |
|------------|-----------|-----------------|
| **Interfaz web** | Next.js 15 + Tailwind CSS | Landing page, dashboard de sesiones y configuración de perfil |
| **Extensión** | Chrome Manifest V3 | Captura audio, muestra sugerencias en panel lateral |
| **Captura de audio** | Web Audio API + Chrome TabCapture | Escucha tu voz y la de los participantes en tiempo real |
| **Transcripción** | Deepgram Nova-2 | Convierte el audio en texto al instante |
| **Inteligencia Artificial** | Claude Sonnet 4.6 (Anthropic) | Analiza la conversación y genera sugerencias personalizadas |
| **Base de datos** | Supabase PostgreSQL (EU) | Almacena transcripciones, sugerencias y tu historial |
| **Autenticación** | Supabase Auth + Google OAuth | Inicio de sesión seguro con tu cuenta de Google |
| **Email** | Resend | Envía transcripciones automáticas al finalizar sesión |
| **Analytics** | Posthog (EU) | Métricas de uso (RGPD compliant) |
| **Hosting** | Vercel | Servidor web con funciones serverless |

---

## 🚀 Evolución del Proyecto

### **Sesión 1-3** — POC Audio + Transcripción en tiempo real 
Captura bidireccional de audio (tab + micrófono), mezcla de streams con Web Audio API, integración con Deepgram Nova-2 streaming.

### **Sesión 4-6** — Análisis IA + Panel Lateral
Integración Claude Sonnet 4.6, 3 prompts especializados (Candidato/Vendedor/Defensor), panel lateral funcional con sugerencias y sistema de urgencia visual.

### **Sesión 7-9** — Backend + Base de Datos
Next.js API Routes en Vercel, Supabase PostgreSQL con RLS, schema completo (profiles, sessions, transcriptions, suggestions), Google OAuth.

### **Sesión 10-12** — Freemium + Dashboard
Sistema de límites (5 anónimas / 15 gratis / ∞ pro), device fingerprinting, paywalls suave y duro, dashboard con historial, email automático con transcripción.

### **Sesión 13** — Fix Bugs Críticos + Smart Cards
Endpoint `/api/usage` corregido, smart cards con lógica de urgencia 1/2/3, CSS diferenciado por urgencia (verde/amarillo/rojo), testing checklist creado.

### **Sesión 14** — Onboarding Personalizado
Modal de onboarding Apple/Wispr Flow style, 3 campos de personalización (Descripción, Preocupaciones, Objetivos), endpoint `/api/profile/context`, columna `user_context` en base de datos.

### **Sesión 15** — Fix Errores Críticos + UX Mejoras
CORS configurado, funciones Supabase con `search_path` seguro, políticas RLS optimizadas, redirección automática al dashboard con sesión seleccionada, onboarding movido a `/profile` (reducción fricción UX).

### **Sesión 16** — Políticas Legales (RGPD + Chrome Web Store)
Páginas `/privacy` y `/terms` creadas y RGPD-compliant, links en footer de landing y dashboard, diseño Apple-style con sticky header, secciones completas: datos, base legal, derechos ARCO, terceros, cookies.

### **Sesión 17** — IA Contextual (Personalización de Sugerencias)
Claude ahora usa el contexto del usuario (descripción, preocupaciones, objetivos) guardado en `/profile` para personalizar sugerencias. Inyección dinámica de contexto en system prompt, soporte para usuarios autenticados y anónimos.

### **Sesión 18** — Assets Profesionales (Especificaciones de Diseño)
ICON_DESIGN_SPECS.md creado con paleta de colores, specs para icon16/48/128, promotional tile 440x280, prompts para generadores IA listos, carpeta CHROME_WEB_STORE_ASSETS/ con checklist pre-publicación.

### **Sesión 19** — Testing Exhaustivo Pre-Publicación (Code Review)
TESTING_REPORT.md con 51 tests documentados, code review completo ejecutado (15/15 tests de código pasados), verificación endpoint `/api/usage`, smart cards logic, CSS styles, XSS protection, manifest.json, IA contextual.

### **Sesión 20** — Preparación Final para Publicación Chrome Web Store
Manifest.json v1.0.0, CHROME_WEB_STORE_PUBLICATION.md con guía completa, descripción corta/detallada, justificación de permisos, proceso de publicación, checklist pre-publicación, métricas de éxito, roadmap v1.1.

### **Sesión 21** — Multi-plataforma (Google Meet, Teams, Zoom)
Sistema de detección automática de plataforma (platforms.js), soporte para Google Meet, Microsoft Teams y Zoom, manifest.json con permisos extendidos, indicador visual de plataforma en panel.

### **Sesión 22** — Multi-idioma Extensión + Fix Audio Crítico
Sistema de traducciones manual ES/EN, selector de idioma en popup y panel, traducciones en español e inglés (50+ keys), preferencia guardada en storage. **BUG CRÍTICO RESUELTO**: Audio de participantes silenciado al activar extensión (offscreen.js: tabSource conectado a audioCtx.destination).

### **Sesión 23** — Multi-idioma Web (next-intl)
Configuración next-intl con locales ES/EN, rutas localizadas `/[locale]/`, traducciones completas en messages/es.json y messages/en.json, landing/pricing/privacy/terms traducidos, language selector en navbar, middleware integrado con Supabase auth. **Fix contador sesiones**: Trigger corregido de `usage_sessions` a `sessions`, función `handle_new_user()` actualizada con valores explícitos.

### **Sesión 24** — Fix Creación Automática de Perfiles (CRÍTICO)
**Problema**: Trigger Supabase `on_auth_user_created` no funcionaba, usuarios sin perfil mostraban "0 sesiones". **Solución**: Backend safety net creado (`lib/ensure-profile.ts`), endpoints `/api/profile` y `/api/usage` garantizan creación automática de perfiles usando service role, eliminados 11 archivos SQL innecesarios.

### **Sesión 25** — Claude Multi-idioma (Sugerencias ES/EN)
Claude responde en español o inglés según preferencia del usuario. Modificado `lib/claude.ts` con parámetro `language`, instrucciones explícitas en system prompt, `app/api/analyze` acepta idioma, `background.js` envía `user_language` desde storage. Sugerencias totalmente localizadas (suggestion, what_is_being_asked, keywords).

### **Sesión 26** — Assets Profesionales Chrome Web Store
Iconos profesionales implementados (16x16, 48x48, 128x128), promotional tile 440x280 creado desde diseños en `/visual/`, `ICON_DESIGN_SPECS.md` documentado con paleta de colores y prompts IA, checklist pre-publicación 56% completado.

### **Sesión 27** — Screenshots Chrome Web Store (Documentación)
Carpeta `screenshots/` creada con README completo, especificaciones técnicas (1280x800px), 5 screenshots documentados con instrucciones paso a paso, herramientas recomendadas y comandos de post-procesamiento. Pendiente: captura real por usuario.

### **Sesión 28** — Testing Multi-plataforma/Idioma (Checklist)
`TESTING_SESSION_28.md` creado con 15 tests organizados en 6 fases: preparación, multi-plataforma (Meet/Teams/Zoom), multi-idioma (ES/EN), funcional core, seguridad/privacidad, performance. Criterio aprobación: ≥90% tests. Pendiente: ejecución por usuario.

---

## 🎨 Sesión 30 — Sistema Paywall + Fix Crítico Audio Pipeline

> **OBJETIVO**: Implementar sistema freemium funcional + Resolver problemas críticos de captura de audio

### **Sistema Paywall Completo**
- ✅ Sistema de autenticación JWT (lectura de cookies Supabase)
- ✅ Paywall soft (usuarios anónimos 5/5 sesiones) — Modal celebratorio con CTA "Registrarme gratis"
- ✅ Paywall hard (usuarios free 15/15 sesiones) — Modal claro con CTA "Ver planes Pro"
- ✅ Verificación de límites ANTES de iniciar sesión (prevención estado "Escuchando..." cuando límite alcanzado)
- ✅ Detección automática de sesión activa + detención si límite alcanzado mid-session
- ✅ SQL script para upgrade a plan Pro (`supabase/upgrade-test-user-to-pro.sql`)
- ✅ Eliminado endpoint `/api/session` obsoleto que causaba errores 500
- ✅ Corregido endpoint en extensión (singular → plural)
- ✅ Eliminado código legacy que causaba error 400 en POST /api/sessions

### **Fix Crítico Audio Pipeline** 🔧
- ✅ **Migración a Port API** — `chrome.runtime.sendMessage` → `chrome.runtime.connect` para mejor comunicación bidireccional en MV3
- ✅ **Fix `processor.onaudioprocess` no se ejecutaba** — Conectado processor → silentGain (gain=0) → destination
- ✅ **Timeout de 10s para START_AUDIO** — Mejor manejo de errores y desconexiones
- ✅ **Deepgram encoding explícito** — Añadido `encoding=linear16&sample_rate=16000&channels=1` en `/api/transcribe-stream`
- ✅ **Logs de debug mejorados** — Diagnóstico completo del audio pipeline

### **Limpieza de repositorio**
- ✅ Carpeta `/docs` creada para documentación técnica
- ✅ Archivos temporales eliminados (testing, debug, design research)
- ✅ Archivos importantes movidos a `/docs` (planning, specs, chrome store)
- ✅ Repositorio organizado y limpio para desarrollo continuo

---

## 🔜 Próximas Sesiones

### **Sesión 34** — Screenshots Chrome Web Store (Captura)
Capturar 3-5 screenshots (1280x800px) con diseño renovado: panel lateral, dashboard, multi-plataforma.

### **Sesión 35** — Testing Completo
Ejecutar checklist de 15 tests: multi-plataforma, multi-idioma, funcional core, seguridad, performance.

### **Sesión 36** — Publicación Chrome Web Store
Versión 1.0.0, empaquetar ZIP, crear cuenta Developer, subir assets/screenshots, enviar a revisión.

---

## 🔒 Privacidad y Seguridad

- ✅ **RGPD compliant** — Datos almacenados en Frankfurt (EU)
- ✅ **Audio NUNCA almacenado** — Solo procesado en tiempo real
- ✅ **Transcripciones eliminables** — Desde dashboard o via email
- ✅ **Checkbox de consentimiento obligatorio** antes de iniciar
- ✅ **Row Level Security (RLS)** en todas las tablas Supabase
- ✅ **Sin XSS** — Construcción manual del DOM (sin `innerHTML`)
- ✅ **Security headers** — CSP, X-Frame-Options, HSTS en Next.js
- ✅ **CORS configurado** — Solo dominios autorizados

---

## 📈 Estado Actual del Proyecto

**Versión:** 0.1.0-dev (Desarrollo)
**Sesión completada:** 30
**Última actualización:** Marzo 11, 2026

### ✅ Implementado
- ✅ Core funcional (audio, transcripción, análisis IA, panel lateral)
- ✅ **Audio pipeline robusto** (Port API para MV3, processor.onaudioprocess fix, Deepgram encoding)
- ✅ Sistema freemium COMPLETO con paywalls soft/hard (UX Research + Growth Hacker)
- ✅ Multi-plataforma (Google Meet, Teams, Zoom)
- ✅ Multi-idioma web y extensión (ES/EN)
- ✅ Multi-idioma Claude IA (sugerencias ES/EN)
- ✅ Dashboard con historial y transcripciones
- ✅ Email automático al finalizar sesión
- ✅ Políticas legales (Privacy, Terms)
- ✅ IA contextual (personalización según perfil de usuario)
- ✅ Creación automática de perfiles (backend safety net)
- ✅ Autenticación JWT (cookies Supabase)
- ✅ Gestión de planes Pro (script SQL)
- ✅ Repositorio limpio y organizado

### ⏳ Pendiente
- ⏳ Verificación pipeline completo (audio → transcripción → sugerencias Claude)
- ⏳ Testing exhaustivo multi-plataforma/idioma
- ⏳ Screenshots Chrome Web Store (1280x800px)
- ⏳ Publicación Chrome Web Store v1.0.0

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo activo. Si tienes acceso al repositorio y quieres contribuir:

1. Crea un branch desde `main`
2. Haz tus cambios siguiendo las guías en `CLAUDE.md`
3. Actualiza `PROGRESS.md` al final de tu sesión
4. Crea un Pull Request con descripción clara

**Para instalación local y pruebas**, contacta a: **hola@tryconfident.com**

---

## 📁 Estructura del Proyecto

```
confident/
├── CLAUDE.md                    # ⭐ Documento de referencia absoluta
├── PROGRESS.md                  # ⭐ Estado actual del proyecto
├── README.md                    # Este archivo
│
├── docs/                        # Documentación técnica y planificación
│   ├── README.md
│   ├── CHROME_WEB_STORE_PUBLICATION.md
│   ├── ICON_DESIGN_SPECS.md
│   ├── PLANNING_PRE_LAUNCH.md
│   └── REDESIGN_PLAN.md
│
├── app/                         # Next.js App Router
│   ├── [locale]/                # Rutas localizadas (ES/EN)
│   ├── api/                     # API Routes
│   └── layout.tsx
│
├── extension/                   # Chrome Extension MV3
│   ├── manifest.json
│   ├── background.js            # Service Worker
│   ├── content-script.js
│   ├── offscreen.js             # Audio pipeline
│   ├── config.js
│   ├── side-panel/
│   └── popup/
│
├── lib/                         # Utilidades compartidas
│   ├── supabase.ts
│   ├── supabase-server.ts
│   ├── claude.ts                # Prompts IA + getSystemPrompt()
│   └── constants.ts             # Límites freemium
│
├── supabase/                    # Base de datos
│   ├── schema.sql
│   ├── migrations/
│   └── upgrade-test-user-to-pro.sql
│
└── messages/                    # Traducciones (next-intl)
    ├── es.json
    └── en.json
```

**Nota**: Archivos temporales (testing, debug, design) se eliminan al final de cada sesión para mantener el repositorio limpio.

---

## 📄 Licencia

Privado - Todos los derechos reservados © 2026 Confident
