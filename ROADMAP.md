# 🗺️ Confident — Roadmap 2026

> **Última actualización**: Marzo 24, 2026
> **Versión actual**: 0.1.0-dev
> **Sesión completada**: 42

---

## 📊 Estado Actual del Proyecto

### ✅ Core Completado (95%)

| Componente | Estado | Notas |
|------------|--------|-------|
| 🎤 **Audio Pipeline** | ✅ 100% | Captura bidireccional, Web Audio API, MV3 Port API |
| 🗣️ **Transcripción** | ✅ 100% | Deepgram Nova-2 streaming, ES/EN |
| 🤖 **Análisis IA** | ✅ 100% | Claude Sonnet 4.6, 4 perfiles (Candidato/Vendedor/Profesor/Defensor) |
| 🎨 **UI Extension** | ✅ 100% | Panel lateral, 12 estados, Figma-accurate |
| 🌐 **Multi-plataforma** | ✅ 100% | Google Meet, Teams, Zoom |
| 🌍 **Multi-idioma** | ✅ 100% | ES/EN (extensión + web + IA) |
| 🔐 **Auth & Security** | ✅ 95% | Google OAuth, RLS, rate limiting, input validation |
| 💰 **Freemium** | ✅ 100% | 5 anónimas / 15 free / ∞ pro, paywalls soft/hard |
| 📊 **Dashboard** | ⏳ 80% | Historial, transcripciones (diseño en progreso) |
| 🎯 **Landing** | ⏳ 80% | Página principal (diseño en progreso) |

### 🔒 Seguridad (Sesión 42 — 95% Score)

**Todas las vulnerabilidades CRITICAL y HIGH resueltas**:
- ✅ VULN-001: RLS bypass (service role key) → Migrado a ANON key
- ✅ VULN-002: Input validation → Zod schemas en todos los endpoints
- ✅ VULN-003: Sensitive data in logs → Logger sanitizado
- ✅ VULN-004: XSS protection → Verificado (textContent only)
- ✅ VULN-005: Rate limiting → 7 endpoints protegidos (5-60 req/min)
- ⏸️ VULN-006: Stripe webhooks → Pospuesto hasta integración

**Mejoras de seguridad**:
- Rate limiting con sliding window (in-memory)
- Anonymous_id validation en backend
- Headers estándar: X-RateLimit-Limit/Remaining/Reset
- Production logger con data sanitization
- 0 vulnerabilidades npm audit

---

## 🎯 Roadmap por Fases

### 📅 **FASE 1 — PRE-LAUNCH** (En progreso)
*Objetivo: Deployment a producción con MVP funcional*

#### 🔥 **CRÍTICO — Landing + Dashboard Design** (En progreso - Victor)
- [ ] **Terminar diseño Landing en Figma**
  - Prioridad: 🔴 CRÍTICA
  - Responsable: Victor
  - Estimado: 2-3 días
  - Bloqueante para: Deployment

- [ ] **Terminar diseño Dashboard en Figma**
  - Prioridad: 🔴 CRÍTICA
  - Responsable: Victor
  - Estimado: 2-3 días
  - Bloqueante para: Deployment

- [ ] **Implementar Landing desde Figma**
  - Prioridad: 🔴 CRÍTICA
  - Dependencias: Diseño Figma completado
  - Estimado: 1 día
  - Archivos: `/app/[locale]/page.tsx`, `/app/[locale]/pricing/page.tsx`

- [ ] **Implementar Dashboard desde Figma**
  - Prioridad: 🔴 CRÍTICA
  - Dependencias: Diseño Figma completado
  - Estimado: 1 día
  - Archivos: `/app/[locale]/dashboard/page.tsx`

#### 💳 **Integración Stripe** (Siguiente)
- [ ] **Configurar Stripe Products & Prices**
  - Crear 3 productos: Free (€0), Pro (€19/mes), Diamond (€49/mes)
  - Configurar webhooks en Stripe Dashboard
  - Obtener API keys (test + production)
  - Prioridad: 🔴 CRÍTICA
  - Estimado: 2 horas

- [ ] **Implementar Checkout Flow**
  - Endpoint `/api/checkout/create-session` (Stripe Checkout)
  - Página `/checkout/success` y `/checkout/cancel`
  - Botones "Upgrade to Pro" en dashboard y pricing
  - Prioridad: 🔴 CRÍTICA
  - Estimado: 4 horas
  - Referencia: `/docs/GUIA_CONFIGURACION_STRIPE.md`

- [ ] **Webhook Handler con Validación Completa**
  - Endpoint `/api/webhooks/stripe` (POST)
  - Validar signature con `stripe.webhooks.constructEvent()`
  - Eventos: `checkout.session.completed`, `customer.subscription.updated/deleted`
  - Actualizar `profiles.plan` en Supabase
  - Idempotency key handling
  - Prioridad: 🟡 ALTA
  - Estimado: 3 horas
  - Resolver: VULN-006

- [ ] **Portal de Cliente (Manage Subscription)**
  - Endpoint `/api/customer-portal` (redirect a Stripe Portal)
  - Botón "Manage subscription" en dashboard
  - Prioridad: 🟡 ALTA
  - Estimado: 1 hora

#### 🚀 **Deployment a Producción**
- [ ] **Staging Deployment**
  - Seguir `/docs/DEPLOYMENT_GUIDE.md` FASE 1-3
  - Deploy a Vercel (branch staging)
  - Variables de entorno en Vercel
  - Testing completo en staging
  - Prioridad: 🔴 CRÍTICA
  - Estimado: 2 horas

- [ ] **QA Manual con Screenshots**
  - Protocolo 15+ screenshots (DEPLOYMENT_GUIDE FASE 2)
  - Test todos los estados del panel (1-12)
  - Test multi-plataforma (Meet/Teams/Zoom)
  - Test multi-idioma (ES/EN)
  - Test paywalls (soft/hard)
  - Test Stripe checkout (test mode)
  - Prioridad: 🔴 CRÍTICA
  - Estimado: 2 horas

- [ ] **Production Deployment**
  - Bump version a 1.0.0 en manifest.json
  - Deploy a Vercel (main branch)
  - Stripe production keys
  - Posthog production
  - DNS configuración (tryconfident.com)
  - Prioridad: 🔴 CRÍTICA
  - Estimado: 1 hora

#### 🏪 **Chrome Web Store Publication**
- [ ] **Preparar Assets**
  - Icon 128x128 (ya existe en `/visual/icon128.png`)
  - Promotional tile 440x280 (ya existe)
  - 3-5 screenshots 1280x800px (pendiente captura)
  - Prioridad: 🟡 ALTA
  - Estimado: 1 hora

- [ ] **Crear Developer Account**
  - Pago único $5 USD
  - Llenar información de desarrollador
  - Prioridad: 🟡 ALTA
  - Estimado: 30 min

- [ ] **Enviar a Revisión**
  - Empaquetar extensión (ZIP)
  - Llenar formulario Chrome Web Store
  - Justificar permisos (tabCapture, storage, etc.)
  - Política privacidad URL: https://tryconfident.com/privacy
  - Prioridad: 🟡 ALTA
  - Estimado: 1 hora
  - Referencia: `/docs/CHROME_WEB_STORE_PUBLICATION.md`

- [ ] **Monitoreo Post-Launch**
  - Reviews tracking
  - Crash reports
  - Posthog analytics (conversión, retención)
  - Prioridad: 🟢 MEDIA
  - Continuo

---

### 📅 **FASE 2 — POST-LAUNCH IMPROVEMENTS** (Después de v1.0.0)

#### 🎨 **UX Enhancements**
- [ ] Onboarding tutorial (3 steps)
- [ ] Tooltips interactivos
- [ ] Dark mode
- [ ] Keyboard shortcuts
- Prioridad: 🟢 MEDIA
- Estimado: 1 semana

#### 📊 **Analytics & Insights**
- [ ] Dashboard analytics (gráficas)
- [ ] Export transcripciones (PDF/TXT)
- [ ] Search en historial
- [ ] Tags/categorías de sesiones
- Prioridad: 🟢 MEDIA
- Estimado: 1 semana

#### 🤖 **IA Improvements**
- [ ] Nuevo perfil: "Negociador"
- [ ] Sugerencias con ejemplos concretos
- [ ] Resumen automático de sesión (email)
- [ ] Detección de tono/emoción
- Prioridad: 🟡 ALTA
- Estimado: 2 semanas

#### 🌍 **Expansion**
- [ ] Soporte Francés (FR)
- [ ] Soporte Alemán (DE)
- [ ] Firefox extension
- [ ] Safari extension
- Prioridad: 🟢 MEDIA
- Estimado: 3 semanas

#### 💰 **Growth**
- [ ] Programa de referidos
- [ ] Integración Stripe Tax
- [ ] Plan Team (multi-usuario)
- [ ] Enterprise plan (custom)
- Prioridad: 🟡 ALTA
- Estimado: 1 mes

---

### 📅 **FASE 3 — SCALE** (Q3 2026)

#### ⚡ **Performance**
- [ ] Migrar rate limiting a Upstash Redis
- [ ] CDN para assets estáticos
- [ ] Database indexing optimization
- [ ] Caching strategy (Vercel Edge)
- Prioridad: 🟢 MEDIA
- Estimado: 1 semana

#### 🔧 **Infrastructure**
- [ ] Monitoring (Sentry)
- [ ] Automated backups (Supabase)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] E2E testing (Playwright)
- Prioridad: 🟡 ALTA
- Estimado: 2 semanas

#### 🎯 **Product**
- [ ] Mobile app (React Native)
- [ ] API pública (developers)
- [ ] Webhooks (integrations)
- [ ] Chrome Enterprise support
- Prioridad: 🟢 BAJA
- Estimado: 2+ meses

---

## 📈 Métricas de Éxito

### Pre-Launch (FASE 1)
- ✅ 0 vulnerabilidades críticas/high
- ✅ 95% security score
- ⏳ 100% tests passing
- ⏳ <3s load time (landing)
- ⏳ <5s latencia (sugerencia IA)

### Launch Week (FASE 1)
- 🎯 100 instalaciones
- 🎯 50 usuarios registrados
- 🎯 10 sesiones completadas
- 🎯 5 conversiones Pro

### Month 1 (FASE 2)
- 🎯 500 instalaciones
- 🎯 200 usuarios activos
- 🎯 50 conversiones Pro
- 🎯 4.5+ stars Chrome Web Store

### Quarter 1 (FASE 3)
- 🎯 2,000 instalaciones
- 🎯 800 usuarios activos
- 🎯 200 conversiones Pro
- 🎯 €3,800 MRR

---

## 🔄 Proceso de Desarrollo

### Workflow
1. **Diseño** → Figma (Victor)
2. **Desarrollo** → Claude Code (implementación)
3. **QA** → Testing manual + screenshots
4. **Deploy** → Staging → Testing → Production
5. **Monitor** → Posthog + Sentry + Chrome Web Store reviews

### Branches
- `main` — Producción (stable)
- `staging` — Pre-producción (QA)
- `dev` — Desarrollo activo

### Commits
- Seguir formato: `Type: Description (Session X)`
- Tipos: `Feat`, `Fix`, `Security`, `Docs`, `UI`, `Refactor`
- Siempre incluir: `Co-Authored-By: Claude Sonnet 4.5`

### Documentación
- Actualizar `PROGRESS.md` al final de cada sesión
- Mantener `CLAUDE.md` como referencia absoluta
- Eliminar archivos temporales (debug, testing)

---

## 🚨 Bloqueadores Conocidos

### Ninguno actualmente ✅

**Bloqueadores resueltos recientemente**:
- ~~Disco lleno (100% capacidad)~~ → Resuelto (76GB libres)
- ~~npm vulnerabilities (2 moderate)~~ → Resuelto (0 vulnerabilities)
- ~~VULN-001 a VULN-005~~ → Todos resueltos (Sesión 42)

---

## 📞 Contacto & Soporte

- **Email**: hola@tryconfident.com
- **Repositorio**: [github.com/victorodri/Confident-extension](https://github.com/victorodri/Confident-extension)
- **Documentación**: `/docs/README.md`

---

**Última actualización**: Marzo 24, 2026 — Sesión 42 completada
**Próximo hito**: Landing + Dashboard design → Stripe → Production deployment
