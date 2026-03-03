# Confident

> **Tu coach silencioso en conversaciones importantes**

![Versión](https://img.shields.io/badge/version-1.0.0--dev-purple)
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
**Contexto:** Estás en una entrevista de trabajo y necesitas responder con estructura y confianza.
**Problema que resuelve:** Detecta preguntas behavioral (STAR), técnicas, motivacionales y salariales. Te sugiere marcos de respuesta como STAR/CAR, te recuerda incluir logros cuantificables y te ayuda a mantener el foco en tus fortalezas. Evita respuestas vagas o que te hagan parecer inseguro.
**Objetivo:** Conseguir que destaques en la entrevista mostrando competencias claras y resultados concretos.

### 💼 **Vendedores en llamadas comerciales**
**Contexto:** Estás en una llamada de ventas y el cliente plantea objeciones o dudas sobre el producto.
**Problema que resuelve:** Identifica objeciones de precio, necesidad y confianza. Detecta señales de compra (momentos críticos donde el cliente está listo para cerrar) y te sugiere técnicas de cierre consultivo. Te ayuda a convertir objeciones en oportunidades y a no dejar pasar señales clave.
**Objetivo:** Incrementar tu tasa de conversión cerrando más ventas con confianza y sin sonar agresivo.

### 🛡️ **Defensores en presentaciones estratégicas**
**Contexto:** Estás defendiendo un proyecto, propuesta o decisión ante stakeholders que cuestionan tus asunciones.
**Problema que resuelve:** Descompone preguntas complejas en su esencia real (qué se pregunta vs qué se dice). Te muestra la intención detrás de cuestionamientos sobre riesgos, alternativas o datos. Te sugiere cómo estructurar respuestas que demuestren que has pensado en profundidad, sin divagar.
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

---

## 🔜 Próximas Sesiones

### **Sesión 26-27** — Assets Finales + Screenshots
Generar iconos profesionales (16x16, 48x48, 128x128, promotional tile 440x280), capturar 5 screenshots para Chrome Web Store.

### **Sesión 28** — Testing Multi-plataforma/idioma Completo
Probar extensión en Google Meet, Teams, Zoom, verificar funcionamiento en ES/EN, cross-testing de flujos completos.

### **Sesión 29** — Publicación Chrome Web Store
Crear cuenta Developer ($5), empaquetar ZIP v1.0.0, subir a Chrome Web Store con descripción/screenshots/permisos, enviar a revisión.

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

**Versión:** 1.0.0-dev (Pre-lanzamiento)
**Sesión completada:** 25/29 (86%)
**Próxima sesión:** 26 — Assets Profesionales Finales
**Objetivo:** Publicación Chrome Web Store en Sesión 29

### ✅ Implementado
- Core funcional (audio, transcripción, análisis IA, panel lateral)
- Sistema freemium completo (5/15/∞ sesiones)
- Multi-plataforma (Google Meet, Teams, Zoom)
- Multi-idioma web y extensión (ES/EN)
- **Multi-idioma Claude IA (sugerencias ES/EN)** — NUEVO ✨
- Dashboard con historial y transcripciones
- Email automático al finalizar sesión
- Políticas legales (Privacy, Terms)
- IA contextual (personalización según perfil de usuario)
- Creación automática de perfiles (backend safety net)

### ⏳ Pendiente
- Assets profesionales finales (Sesión 26-27)
- Testing exhaustivo multi-plataforma/idioma (Sesión 28)
- Publicación Chrome Web Store (Sesión 29)

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo activo. Si tienes acceso al repositorio y quieres contribuir:

1. Crea un branch desde `main`
2. Haz tus cambios siguiendo las guías en `CLAUDE.md`
3. Actualiza `PROGRESS.md` al final de tu sesión
4. Crea un Pull Request con descripción clara

**Para instalación local y pruebas**, contacta a: **hola@tryconfident.com**

---

## 🐛 Issues Conocidos

### ScriptProcessorNode deprecated (No crítico)
- **Ubicación**: `extension/offscreen.js:115`
- **Impacto**: Solo warning, NO bloquea funcionalidad
- **Fix futuro**: Migrar a AudioWorkletNode (Sesión futura)
- **Prioridad**: Baja (funciona hasta Chrome 2027+)

### Testing manual pendiente
- **Descripción**: Tests E2E en las 3 plataformas (Meet, Teams, Zoom) pendientes de ejecución
- **Impacto**: Funcionalidad verificada en código, falta validación en producción
- **Acción**: Ejecutar TESTING_REPORT.md completo antes de Sesión 29

---

## 📄 Licencia

Privado - Todos los derechos reservados © 2026 Confident

---

**Última actualización:** Marzo 3, 2026 (Sesión 24 - Fix Creación Automática de Perfiles)
