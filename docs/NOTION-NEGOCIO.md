# Confident — Documentación de Negocio

> **Producto, mercado, modelo de ingresos y roadmap estratégico**

---

## 📋 Índice

1. [Visión y Misión](#visión-y-misión)
2. [Problema y Solución](#problema-y-solución)
3. [Mercado Objetivo](#mercado-objetivo)
4. [Propuesta de Valor](#propuesta-de-valor)
5. [Modelo de Negocio](#modelo-de-negocio)
6. [Estrategia Freemium](#estrategia-freemium)
7. [Pricing](#pricing)
8. [Métricas Clave](#métricas-clave)
9. [Roadmap](#roadmap)
10. [Competencia](#competencia)
11. [Go-to-Market](#go-to-market)
12. [Riesgos y Mitigación](#riesgos-y-mitigación)
13. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Visión y Misión

### Visión (3 años)
Ser el asistente IA de referencia para conversaciones profesionales críticas, presente en 100K+ sesiones mensuales en múltiples plataformas (Meet, Teams, Zoom).

### Misión
Democratizar el acceso a coaching en tiempo real, ayudando a cualquier persona a tener conversaciones más efectivas mediante IA contextual especializada.

### Valores
- **Transparencia:** El usuario siempre sabe qué hace la IA y con qué datos
- **Privacidad:** Solo texto, nunca audio. Eliminación bajo demanda
- **Utilidad:** Sugerencias accionables, no resúmenes genéricos
- **Especialización:** Un prompt por rol, no una IA genérica para todo

---

## 🔍 Problema y Solución

### El Problema

**Conversaciones críticas son cognitivamente demandantes:**

1. **Candidatos en entrevistas:**
   - Nervios → olvidan estructurar respuestas con STAR
   - Preguntas inesperadas → responden de forma desorganizada
   - No detectan cuándo el entrevistador busca algo específico

2. **Vendedores en llamadas comerciales:**
   - Objeciones complejas → responden reactivamente
   - Pierden señales de compra → no cierran en el momento óptimo
   - No tienen guión mental para cada escenario

3. **Profesionales defendiendo posiciones:**
   - Preguntas complejas multi-parte → pierden el hilo
   - Asunciones cuestionadas → se ponen defensivos
   - No estructuran respuestas de forma estratégica

**Problema común:** Necesitan un coach silencioso que detecte señales y sugiera qué decir **ahora mismo**, no después.

---

### La Solución: Confident

**¿Qué es?**
Una extensión de Chrome que escucha conversaciones en Google Meet, detecta señales críticas mediante IA (Claude), y muestra sugerencias en tiempo real en un panel lateral.

**¿Qué NO es?**
- ❌ No es un transcriptor (aunque transcribe)
- ❌ No es un resumen de reuniones (aunque puede generarlo)
- ❌ No es un "copiloto" genérico (es especializado por rol)

**Diferenciador clave:**
**Tres prompts especializados (Candidato, Vendedor, Defensor)** que detectan señales específicas por contexto y sugieren **qué hacer ahora**, no qué pasó.

---

## 🎯 Mercado Objetivo

### Segmentos Primarios (MVP)

#### 1. Candidatos en Procesos de Selección
**Tamaño de mercado:**
- España: 2.5M entrevistas/año (búsqueda activa ~10% población activa)
- Europa: 25M entrevistas/año
- Global: 200M+ entrevistas/año

**Características:**
- Edad: 25-45 años
- Tecnológicamente competentes
- Alta motivación (proceso en curso)
- Willingness to pay: Media-alta (€19/mes si consiguen trabajo)

**Jobs to be done:**
- Estructurar respuestas behavioral (STAR)
- Responder preguntas técnicas con confianza
- Negociar salario sin dejar dinero en la mesa

---

#### 2. Vendedores B2B
**Tamaño de mercado:**
- España: 500K profesionales de ventas B2B
- Europa: 5M profesionales ventas B2B
- Global: 40M+ profesionales ventas

**Características:**
- Edad: 28-50 años
- Incentivados por comisiones
- Usuarios habituales de CRM y herramientas
- Willingness to pay: Alta (ROI directo en cierres)

**Jobs to be done:**
- Manejar objeciones de precio/necesidad/confianza
- Detectar señales de compra
- Cerrar en el momento óptimo

---

#### 3. Profesionales en Presentaciones Estratégicas
**Tamaño de mercado:**
- España: 200K profesionales (directores, consultores, académicos)
- Europa: 2M profesionales
- Global: 15M+ profesionales

**Características:**
- Edad: 30-55 años
- Roles: Product Managers, Consultores, Directores
- Alta expertise técnica
- Willingness to pay: Media (beneficio indirecto)

**Jobs to be done:**
- Descomponer preguntas complejas
- Defender asunciones con datos
- Estructurar respuestas estratégicamente

---

### Segmentos Secundarios (Post-MVP)

- **Estudiantes en defensas de tesis:** Similar a Defensor, menor WTP
- **Founders en pitches:** Mezcla Vendedor + Defensor
- **Abogados en mediaciones:** Defensor con señales legales
- **Profesores en clases virtuales:** Nuevo perfil (Educador)

---

### TAM / SAM / SOM (3 años)

```
TAM (Total Addressable Market)
├─ 260M profesionales en conversaciones críticas globalmente
├─ Asumiendo €19/mes → $59B/año
└─ Realista: 10% dispuestos a pagar → $5.9B/año

SAM (Serviceable Addressable Market)
├─ Europa + América (habla inglesa/española) = 80M profesionales
├─ €19/mes → $18B/año
└─ Realista: 10% dispuestos → $1.8B/año

SOM (Serviceable Obtainable Market - 3 años)
├─ Capturable con recursos actuales
├─ Meta: 100K usuarios activos
├─ Conversión 20% a Pro → 20K pagadores
├─ €19/mes × 20K = €380K MRR = €4.5M ARR
└─ Cuota de mercado: 0.25% del SAM
```

---

## 💎 Propuesta de Valor

### Canvas de Propuesta de Valor

```
┌─────────────────────────────────────────────────────────┐
│                   PERFIL DEL CLIENTE                    │
├─────────────────────────────────────────────────────────┤
│ TRABAJOS (Jobs to be done):                             │
│ • Estructurar respuestas bajo presión                   │
│ • Detectar qué busca realmente el interlocutor          │
│ • Cerrar conversaciones en momentos clave               │
│                                                         │
│ FRUSTRACIONES (Pains):                                  │
│ • Estrés → olvidan técnicas (STAR, frameworks)          │
│ • Carga cognitiva → no procesan señales sutiles         │
│ • Post-análisis inútil → necesitan ayuda en vivo        │
│                                                         │
│ ALEGRÍAS (Gains):                                       │
│ • Sentirse preparado y en control                       │
│ • Responder con confianza y estructura                  │
│ • Cerrar/conseguir el resultado esperado                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   MAPA DE VALOR                         │
├─────────────────────────────────────────────────────────┤
│ PRODUCTOS Y SERVICIOS:                                  │
│ • Extensión Chrome con IA especializada por rol         │
│ • Sugerencias en tiempo real (<5s)                      │
│ • Transcripción + email post-sesión                     │
│                                                         │
│ ANALGÉSICOS (Pain relievers):                           │
│ • Detecta señales automáticamente → cero carga cognitiva│
│ • Prompts especializados → sugerencias útiles           │
│ • Panel lateral → no interrumpe la conversación         │
│                                                         │
│ CREADORES DE ALEGRÍA (Gain creators):                   │
│ • Urgencia 3 → sabe cuándo actuar YA                    │
│ • Keywords → vocabulario preciso para responder         │
│ • Feedback loop → mejora con el uso                     │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Modelo de Negocio

### Business Model Canvas

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ KEY PARTNERS         │ KEY ACTIVITIES       │ VALUE PROPOSITIONS   │
│                      │                      │                      │
│ • Anthropic (Claude) │ • Desarrollo producto│ • Coach IA tiempo    │
│ • Deepgram (STT)     │ • Soporte usuarios   │   real especializado │
│ • Google (OAuth)     │ • Marketing contenido│ • 3 perfiles: no     │
│ • Chrome Web Store   │ • Análisis métricas  │   genérico           │
│                      │                      │ • <5s latencia       │
├──────────────────────┤                      │                      │
│ KEY RESOURCES        │                      ├──────────────────────┤
│                      │                      │ CUSTOMER             │
│ • IP: Prompts Claude │                      │ RELATIONSHIPS        │
│ • Equipo: 1 founder  │                      │                      │
│ • Infraestructura:   │                      │ • Self-service       │
│   Vercel + Supabase  │                      │ • Email soporte      │
│                      │                      │ • Comunidad (futuro) │
└──────────────────────┴──────────────────────┴──────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────────────┐
│ CHANNELS             │                      │ CUSTOMER SEGMENTS    │
│                      │                      │                      │
│ • Chrome Web Store   │                      │ • Candidatos         │
│ • SEO (entrevistas)  │                      │ • Vendedores B2B     │
│ • LinkedIn Ads       │                      │ • Profesionales      │
│ • Product Hunt       │                      │   (PM, consultores)  │
│ • Referidos          │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│ COST STRUCTURE                   │ REVENUE STREAMS                  │
│                                  │                                  │
│ • Claude API: €0.15/sesión       │ • Suscripción Pro: €19/mes       │
│ • Deepgram API: €0.13/sesión     │ • Freemium → conversión objetivo │
│ • Infraestructura: €25/mes       │   20% paywall suave              │
│ • Total: €0.28/sesión + fijo     │ • LTV objetivo: €228/usuario     │
│                                  │   (12 meses retención)           │
│ Margen objetivo: 80%+            │                                  │
└──────────────────────────────────┴──────────────────────────────────┘
```

---

## 🎁 Estrategia Freemium

### Filosofía

**"Probar gratis sin fricción, convertir con valor demostrado"**

El objetivo del freemium no es monetizar usuarios gratuitos, sino:
1. **Adquirir usuarios** sin fricción (sin tarjeta)
2. **Demostrar valor** en primeros usos
3. **Convertir** cuando el usuario depende del producto

---

### Tiers y Límites

| Plan | Sesiones | Precio | Características |
|------|----------|--------|----------------|
| **Anónimo** | 5 | €0 | Sin registro, UUID device |
| **Free** | 15 | €0 | Login Google, email transcripciones |
| **Pro** | ∞ | €19/mes | Todo + analytics + prioridad |

---

### Funnel de Conversión

```
100 Instalaciones
│
├─ 80 Inician sesión 1 (80% activación)
│  └─ "Primera impresión cuenta"
│
├─ 60 Completan sesión 5 (75% retención anónima)
│  └─ Banner: "Te queda 1 sesión gratuita"
│
├─ 40 Sesión 6 → PAYWALL SUAVE (67% reach)
│  ├─ CTA: "Crear cuenta gratis para 10 más"
│  └─ Target conversión: 30%
│
├─ 12 Se registran (30% conversión paywall suave) ✅ MÉTRICA CLAVE
│  └─ Migración automática sesiones anónimas
│
├─ 10 Completan sesión 15 (83% retención free)
│  └─ Banner: "Te queda 1 sesión gratuita"
│
├─ 8 Sesión 16 → PAYWALL DURO
│  ├─ CTA: "Ver planes Pro"
│  └─ Target conversión: 20%
│
└─ 2 Se suscriben a Pro (20% conversión paywall duro) ✅ MÉTRICA CLAVE
   └─ LTV: €228 (12 meses × €19)
```

**Métricas objetivo:**
- Activación (sesión 1): **80%**
- Retención anónima (sesión 5): **75%**
- Conversión paywall suave: **30%**
- Retención free (sesión 15): **83%**
- Conversión paywall duro: **20%**
- **CAC payback:** 3 meses
- **LTV/CAC:** 3:1

---

### Psicología del Funnel

**Sesión 1-3:** Demostrar valor
- Sugerencias útiles
- Feedback loop (👍 refuerza uso)
- Sin mencionar límites

**Sesión 4-5:** Crear hábito
- Usuario ya confía en el producto
- Banner suave: "Te queda 1 sesión gratuita"
- No bloquear, solo informar

**Sesión 6 (Paywall Suave):** Amplificar valor
- Mensaje: "Has usado 5 sesiones. ¿Te ha sido útil?"
- CTA: "Crea cuenta GRATIS para 10 más"
- Social proof: "15,000 usuarios confían en Confident"
- **Ancla psicológica:** 10 más suena generoso (vs. bloqueo total)

**Sesión 14-15:** Crear dependencia
- Usuario ya ha usado 14 veces → hábito formado
- Banner: "Te queda 1 sesión. Actualiza a Pro para ilimitado"
- Destacar analytics Pro: "Mejora 40% en feedback positivo"

**Sesión 16 (Paywall Duro):** Monetizar dependencia
- Bloqueo completo
- Mensaje: "Has aprovechado 15 sesiones gratuitas. Para seguir..."
- CTA: "Ver planes Pro — €19/mes"
- Urgencia: "Tienes una entrevista mañana? Actualiza ahora"

---

## 💵 Pricing

### Estructura de Precios (MVP)

| Plan | Mensual | Anual | Descuento | Por Sesión |
|------|---------|-------|-----------|------------|
| Free | €0 | €0 | — | €0 (15 límite) |
| Pro | €19 | €190 | 17% | ~€0.60 (asumiendo 30/mes) |

---

### Justificación de €19/mes

**Comparables:**
- Grammarly Premium: €12/mes (escritura)
- Otter.ai Pro: €17/mes (transcripción)
- Copilot GitHub: €10/mes (código)
- Confident: €19/mes (coaching en vivo)

**Value-based pricing:**
- Valor para **Candidato:** Conseguir trabajo mejor pagado → ROI 100x
- Valor para **Vendedor:** Cerrar 1 venta extra/mes → ROI 50x+
- Valor para **Profesional:** Aprobar proyecto clave → ROI inmensurable

**Cost-based pricing:**
- COGS: €0.28/sesión (Claude + Deepgram)
- Asumiendo 30 sesiones/mes/usuario Pro → €8.40 COGS
- Margen: €19 - €8.40 = €10.60 (56% margen bruto)

**Competitor-based pricing:**
- Posicionamiento: Premium pero accesible
- €19 está entre Otter (€17) y Descript (€24)

---

### Optimización de Precio (Post-MVP)

**A/B Tests planificados:**
1. €19 vs. €24 vs. €29 (elasticidad precio)
2. Anual €190 vs. €180 vs. €200 (descuento óptimo)
3. Freemium 15 sesiones vs. 10 sesiones (impacto conversión)

**Planes futuros:**
- **Teams:** €49/mes para 5 usuarios (B2B)
- **Enterprise:** Custom pricing (SSO, compliance)

---

## 📊 Métricas Clave

### North Star Metric

**Sesiones con sugerencias útiles (feedback positivo) por semana**

Combina:
- Activación (usuarios usando el producto)
- Engagement (frecuencia de uso)
- Valor percibido (feedback positivo)

---

### OKRs Q1 2026 (MVP)

**Objetivo:** Validar product-market fit

| Key Result | Target | Actual | Status |
|------------|--------|--------|--------|
| KR1: Instalaciones Chrome Web Store | 500 | — | 🟡 |
| KR2: Activación (sesión 1 completada) | 80% | — | 🟡 |
| KR3: Conversión paywall suave | 30% | — | 🟡 |
| KR4: Feedback positivo promedio | 60% | — | 🟡 |
| KR5: Payment CTA clicked (pricing) | 50 | — | 🟡 |

---

### Métricas AARRR (Pirate Metrics)

#### 1. Acquisition
- **Fuentes:**
  - Organic (Chrome Web Store): 40%
  - SEO ("cómo preparar entrevista"): 30%
  - LinkedIn Ads: 20%
  - Referidos: 10%

- **KPIs:**
  - Instalaciones/semana: Target 100 (MVP)
  - CAC (Customer Acquisition Cost): Target <€20

---

#### 2. Activation
- **Definición:** Usuario completa sesión 1 con al menos 1 sugerencia

- **KPIs:**
  - Activación rate: Target 80%
  - Time to first value: <10 min

---

#### 3. Retention
- **Cohortes:**
  - D1 (siguiente día): Target 40%
  - D7 (semana): Target 25%
  - D30 (mes): Target 15%

- **Segmentación:**
  - Por perfil (¿Vendedor retiene más que Candidato?)
  - Por feedback (usuarios con 👍 retienen 2x más)

---

#### 4. Revenue
- **KPIs:**
  - MRR (Monthly Recurring Revenue): Meta €10K (Mes 6)
  - ARPU (Average Revenue Per User): €19 (solo Pro)
  - LTV (Lifetime Value): €228 (12 meses)

- **Conversion funnel:**
  ```
  100 Free users
  └─ 20 convert to Pro (20%)
     └─ MRR: 20 × €19 = €380
  ```

---

#### 5. Referral
- **Programa (Post-MVP):**
  - Referir amigo → +5 sesiones gratis (ambos)
  - Viral loop: Target K-factor 1.2

- **KPIs:**
  - Referrals/usuario: Target 0.3
  - Conversión de referidos: Target 25% (más alta que cold)

---

### Dashboard Posthog

**Vistas principales:**

1. **Acquisition Dashboard**
   - Instalaciones por fuente
   - CAC por canal
   - Trend semanal

2. **Engagement Dashboard**
   - Sesiones activas/día
   - Feedback 👍/👎 ratio
   - Sugerencias por perfil

3. **Conversion Dashboard**
   - Funnel anónimo → Free → Pro
   - Paywall soft conversion rate
   - Paywall hard conversion rate
   - Payment CTA clicked ← **MÉTRICA PRINCIPAL MVP**

4. **Retention Dashboard**
   - Cohort analysis (D1, D7, D30)
   - Churn rate mensual
   - Reactivación de usuarios abandonados

---

## 🗺️ Roadmap

### Fase 1: MVP (Sesiones 1-8) — **ACTUAL**
**Objetivo:** Validar que el producto funciona y usuarios pagan

**Entregables:**
- ✅ Extensión Chrome funcional (Sesión 1-3)
- ✅ Auth + Freemium (Sesión 4)
- 🟡 Landing page + Posthog (Sesión 5)
- 🟡 Email transcripciones (Sesión 6)
- 🟡 Pricing page + Stripe (Sesión 7)
- 🟡 Deploy Vercel + Chrome Store (Sesión 8)

**Criterio de éxito:**
- 50 instalaciones orgánicas
- 10 clicks en "Ver planes Pro"
- 1 usuario dispuesto a pagar (aunque Stripe no activo)

---

### Fase 2: Product-Market Fit (3 meses)
**Objetivo:** 500 usuarios, 20% conversión paywall suave

**Iniciativas:**
1. **Marketing contenido:**
   - Blog: "Cómo responder preguntas behavioral" (SEO)
   - YouTube: "Mis 5 entrevistas usando Confident" (demo)
   - LinkedIn: Casos de uso por perfil

2. **Optimización conversión:**
   - A/B test mensajes paywall
   - Onboarding mejorado (video explicativo)
   - Referral program

3. **Features clave:**
   - Dashboard con analytics (sesiones, feedback, mejora)
   - Modo "practice" con conversaciones simuladas
   - Integración calendario (recordatorio antes de entrevistas)

**Criterio de éxito:**
- 500 usuarios activos
- 30% conversión paywall suave
- 20% conversión paywall duro
- €1K MRR

---

### Fase 3: Escala (6 meses)
**Objetivo:** 5K usuarios, €10K MRR

**Iniciativas:**
1. **Nuevas plataformas:**
   - Microsoft Teams
   - Zoom
   - Google Meet mobile (Android/iOS)

2. **Nuevos perfiles:**
   - Profesor (Educador)
   - Founder (Investor pitch)
   - Abogado (Mediaciones)

3. **B2B (Teams):**
   - Plan €49/mes para 5 usuarios
   - Admin dashboard
   - SSO (Google Workspace, Microsoft Entra)

4. **Partnerships:**
   - Bootcamps (Ironhack, Le Wagon) → descuento estudiantes
   - Escuelas de ventas (ESIC) → licencias educativas

**Criterio de éxito:**
- 5K usuarios activos
- €10K MRR (500 Pro)
- 2 partnerships firmados
- Expansión a Teams/Zoom funcional

---

### Fase 4: Consolidación (12 meses)
**Objetivo:** 50K usuarios, €100K MRR, rentabilidad

**Iniciativas:**
1. **Enterprise:**
   - Custom prompts (industrias específicas)
   - Compliance (SOC2, ISO 27001)
   - On-premise deployment (grandes corporaciones)

2. **Internacionalización:**
   - Soporte multiidioma (inglés, francés, alemán)
   - Servidores regionales (LATAM, Asia)

3. **Ecosystem:**
   - API pública (integraciones CRM, ATS)
   - Marketplace de prompts custom
   - Community de usuarios (Discord)

**Criterio de éxito:**
- 50K usuarios activos
- €100K MRR
- Margen operativo positivo
- 5 clientes Enterprise

---

## 🥊 Competencia

### Competidores Directos

| Producto | Propuesta | Precio | Fortaleza | Debilidad |
|----------|-----------|--------|-----------|-----------|
| **Otter.ai** | Transcripción + resumen | €17/mes | Brand, investors | Genérico, post-meeting |
| **Fireflies.ai** | Transcripción + CRM | €10/mes | Integraciones | No tiempo real |
| **Grain** | Video clips + insights | €19/mes | UI/UX premium | No coaching activo |

**Ninguno hace coaching en tiempo real especializado por rol.**

---

### Competidores Indirectos

| Alternativa | Propuesta | Por qué no resuelve |
|-------------|-----------|-------------------|
| **Coach humano** | 1-on-1 preparación | Caro (€100/sesión), no en vivo |
| **Cursos online** | Técnicas STAR, etc. | Genérico, no personalizado |
| **ChatGPT manual** | Consultar durante llamada | Interrumpe conversación |
| **Notas preparadas** | Cheat sheet escrita | Estática, no contextual |

---

### Ventaja Competitiva Sostenible

1. **Prompts especializados por rol**
   - IP propietaria (mejora con feedback)
   - Difícil de replicar (requiere expertise dominio)

2. **Latencia <5s**
   - Streaming Deepgram + Claude optimizado
   - Competidores hacen batch processing (post-meeting)

3. **Freemium sin fricción**
   - 5 sesiones sin email ni tarjeta
   - Competidores piden tarjeta (Otter) o solo trial (Grain)

4. **Privacy-first**
   - No almacenar audio
   - RGPD compliance desde día 1
   - Diferenciador en Europa

---

### Moat (Foso Competitivo)

**Corto plazo (1 año):**
- Velocidad ejecución (MVP en 8 semanas)
- Nicho específico (coaching activo, no transcripción)

**Medio plazo (2-3 años):**
- Data network effects (mejores prompts con uso)
- Switching costs (usuarios dependientes del producto)
- Brand ("el Grammarly de las conversaciones")

**Largo plazo (5+ años):**
- Multi-plataforma (Meet, Teams, Zoom, presencial)
- Ecosystem (API, marketplace prompts)
- Enterprise lock-in (compliance, SSO)

---

## 🚀 Go-to-Market

### Estrategia de Lanzamiento

#### Pre-lanzamiento (Semana -2 a 0)

**Objetivos:**
- Generar anticipación
- Lista espera 100 emails

**Tácticas:**
1. **Landing page teaser:**
   - "Confident lanza en 2 semanas"
   - Form: Email + "¿Candidato, Vendedor o Defensor?"
   - Early bird: 3 meses gratis (primeros 50)

2. **LinkedIn personal:**
   - Victor posts 3x/semana:
     - "Estoy construyendo un coach IA para entrevistas..."
     - "He hecho 50 entrevistas. Aquí mi aprendizaje..."
     - "Lanzamos en 1 semana. DM para early access"

3. **Product Hunt preparación:**
   - Draft de lanzamiento
   - Hunter contactado (upvotes día 1)
   - Assets (GIF demo, screenshots)

---

#### Lanzamiento (Semana 1-4)

**Día 1: Product Hunt**
- Publicar 00:01 AM PT (optimal time)
- Responder todos los comentarios (engagement)
- Target: Top 5 del día → 500 visitas

**Semana 1: SEO rápido**
- Publicar 5 blog posts:
  1. "Cómo responder preguntas behavioral en entrevistas"
  2. "Técnica STAR explicada con ejemplos"
  3. "10 objeciones de precio y cómo manejarlas"
  4. "Confident vs. Otter.ai: ¿Cuál necesitas?"
  5. "Privacidad en IA: por qué no grabamos audio"

**Semana 2-4: LinkedIn Ads**
- Presupuesto: €500
- Targeting:
  - Vendedores B2B (título: "Account Executive", "Sales Manager")
  - Tech roles buscando empleo (siguiendo #OpenToWork)
- Formato: Carousel con casos de uso
- CTA: "Probar gratis"

---

#### Tracción temprana (Mes 2-3)

**Growth loops:**

1. **Viral loop orgánico:**
   ```
   Usuario usa Confident → Consigue trabajo/cierra venta
   → Cuenta en LinkedIn → Menciona Confident
   → Sus contactos instalan
   ```

2. **SEO compound:**
   ```
   Blog post rankea → Usuario descubre → Instala
   → Deja review Chrome Store → Mejora ranking Store
   → Más instalaciones orgánicas
   ```

3. **Referral incentivado:**
   ```
   Usuario en sesión 14 → "Invita amigo, ambos +5 sesiones"
   → Amigo instala → Ambos amplían free tier
   → Más engagement → Más conversión Pro
   ```

---

### Canales de Adquisición (Prioridad MVP)

| Canal | CAC | Conversión | Prioridad | Escala |
|-------|-----|------------|-----------|--------|
| Chrome Web Store SEO | €0 | 5% | 🟢 Alta | Media |
| Blog SEO | €0 | 8% | 🟢 Alta | Alta |
| Product Hunt | €0 | 10% | 🟢 Alta | Baja (one-time) |
| LinkedIn Ads | €15 | 12% | 🟡 Media | Alta |
| Referidos | €5 | 20% | 🟡 Media | Media |
| YouTube demos | €0 | 15% | 🟢 Alta | Alta |

**Foco inicial:** SEO + Product Hunt (€0 CAC)
**Scale:** LinkedIn Ads cuando CAC payback <3 meses

---

## ⚠️ Riesgos y Mitigación

### Riesgos Críticos

#### 1. Dependencia de Google Meet
**Riesgo:** Google cambia API o bloquea extensiones

**Probabilidad:** Baja (Chrome Web Store bien establecido)

**Impacto:** Crítico (100% del producto depende)

**Mitigación:**
- Roadmap: Soportar Teams/Zoom en 6 meses
- Plan B: Pivot a Electron app (screen capture)
- Monitoreo: Chrome Developer newsletter, foros

---

#### 2. Costos de Claude/Deepgram insostenibles
**Riesgo:** Uso abusivo → pérdidas por usuario

**Probabilidad:** Media (usuarios Pro podrían abusar)

**Impacto:** Alto (margen se evapora)

**Mitigación:**
- Límites técnicos: Máx 2h sesión continua
- Throttling: Si >100 sesiones/mes → alerta manual
- Plan B: Migrar a modelo local (Whisper) si escala

---

#### 3. Privacidad / RGPD
**Riesgo:** Demanda por grabación sin consentimiento

**Probabilidad:** Baja (checkbox obligatorio)

**Impacto:** Crítico (multas RGPD hasta €20M)

**Mitigación:**
- ✅ Checkbox consentimiento obligatorio antes de iniciar
- ✅ No almacenar audio (solo texto)
- ✅ Política privacidad clara + ARCO (derecho eliminación)
- ✅ Hosting EU (Supabase Frankfurt)
- Seguro responsabilidad civil (€500/año)

---

#### 4. Competencia de big tech
**Riesgo:** Google lanza "Meet Coach" nativo

**Probabilidad:** Media (tendencia: Google Duet, Microsoft Copilot)

**Impacto:** Alto (perderíamos ventaja plataforma)

**Mitigación:**
- First-mover advantage (marca "Confident")
- Especialización por rol (Google haría genérico)
- Multi-plataforma (no solo Meet)
- Opción: Vender a Google si ocurre (exit)

---

#### 5. Bajo product-market fit
**Riesgo:** Usuarios no pagan después de freemium

**Probabilidad:** Media-alta (MVP unproven)

**Impacto:** Crítico (sin revenue, proyecto muere)

**Mitigación:**
- MVP lean (8 semanas, bajo costo)
- Métrica early: Payment CTA clicked (willingness to pay)
- Pivot rápido si <10% conversión paywall duro
- Alternativas: B2B2C (vender a bootcamps), Freemium más agresivo

---

### Riesgos Secundarios

#### 6. Calidad transcripciones baja
**Riesgo:** Deepgram falla con acentos

**Mitigación:** Soportar múltiples idiomas, fallback a Whisper

#### 7. Latencia >5s
**Riesgo:** Sugerencias llegan tarde

**Mitigación:** Edge functions, optimizar prompts, caching

#### 8. Churn alto post-conversión
**Riesgo:** Usuarios pagan 1 mes y cancelan

**Mitigación:** Engagement emails, feature releases, comunidad

---

## ❓ Preguntas Frecuentes

### General

**P: ¿Confident graba mis conversaciones?**
R: No. Solo procesamos audio en tiempo real para transcribir. El audio nunca se almacena. Solo guardamos texto de transcripciones (eliminable bajo demanda).

**P: ¿Es legal usar Confident en entrevistas?**
R: Depende de la jurisdicción. En España/UE, debes informar a los participantes (checkbox obligatorio en la app). Recomendamos mencionar: "Uso una herramienta de notas asistida por IA".

**P: ¿Funciona en otros idiomas además de español?**
R: MVP es español. Soporte inglés en Fase 2 (Mes 3). Otros idiomas en roadmap.

**P: ¿Qué pasa si mi internet es lento?**
R: Latencia puede aumentar. Recomendamos mínimo 5 Mbps. Futuro: modo offline con modelo local.

---

### Producto

**P: ¿Por qué solo Google Meet?**
R: MVP foco en una plataforma. Teams/Zoom en 6 meses según demanda.

**P: ¿Puedo usar Confident en llamadas telefónicas?**
R: No en MVP. Futuro: app móvil con captura audio del teléfono.

**P: ¿Las sugerencias son siempre correctas?**
R: No. La IA puede equivocarse. Usa tu criterio. Feedback 👍/👎 mejora el sistema.

**P: ¿Puedo customizar los prompts?**
R: No en MVP. Plan Enterprise (futuro) permitirá prompts custom.

---

### Pricing

**P: ¿Por qué €19/mes es caro?**
R: Comparado con Grammarly (€12) o Otter (€17), es competitivo. El valor: conseguir un trabajo o cerrar una venta vale 100x más.

**P: ¿Hay descuento para estudiantes?**
R: Sí, 50% descuento con email .edu (Fase 2).

**P: ¿Puedo cancelar cuando quiera?**
R: Sí, sin penalización. Cancela desde dashboard.

**P: ¿Hay plan de por vida?**
R: No. Modelo SaaS recurrente para mantener calidad y actualizaciones.

---

### Privacidad

**P: ¿Quién ve mis transcripciones?**
R: Solo tú. Ni Victor ni el equipo tienen acceso. RLS (Row Level Security) en base de datos lo garantiza.

**P: ¿Usan mis datos para entrenar la IA?**
R: No. Claude API no entrena con datos de usuarios (política Anthropic). Posthog analytics es agregado y anónimo.

**P: ¿Cómo elimino mis datos?**
R: Dashboard → Configuración → "Eliminar mi cuenta". Borrado permanente en 48h.

**P: ¿Dónde se almacenan mis datos?**
R: Supabase (Frankfurt, Alemania). 100% RGPD compliant.

---

### Soporte

**P: ¿Hay soporte técnico?**
R: Email: hola@tryconfident.com. Respuesta <24h. Discord community (Fase 2).

**P: ¿Confident tiene roadmap público?**
R: Sí, en GitHub (transparencia). Vota features en Discord.

**P: ¿Puedo solicitar una feature?**
R: Sí, en roadmap.tryconfident.com (Canny). Votación pública.

---

## 📈 Proyecciones Financieras (3 años)

### Asunciones Base

```
CAC (Customer Acquisition Cost): €20
LTV (Lifetime Value): €228 (12 meses * €19)
LTV/CAC: 11.4 (excelente)
Churn mensual: 8% (anual ~60% retención)
Conversión freemium → Pro: 20%
COGS por sesión: €0.28
Sesiones promedio Pro/mes: 30
```

---

### Año 1 (2026)

| Métrica | Q1 | Q2 | Q3 | Q4 | Total |
|---------|----|----|----|----|-------|
| Usuarios totales | 500 | 2K | 5K | 10K | 10K |
| Usuarios Pro | 10 | 100 | 400 | 1K | 1K |
| MRR | €190 | €1.9K | €7.6K | €19K | €19K |
| ARR | — | — | — | — | €228K |
| Costos | €2K | €5K | €12K | €25K | €44K |
| Margen bruto | -€1.8K | -€3.1K | -€4.4K | -€6K | -€15K |

**Año 1: Pérdidas esperadas (inversión en crecimiento)**

---

### Año 2 (2027)

| Métrica | Q1 | Q2 | Q3 | Q4 | Total |
|---------|----|----|----|----|-------|
| Usuarios totales | 15K | 25K | 40K | 60K | 60K |
| Usuarios Pro | 2K | 4K | 7K | 12K | 12K |
| MRR | €38K | €76K | €133K | €228K | €228K |
| ARR | — | — | — | — | €2.7M |
| Costos | €40K | €70K | €110K | €170K | €390K |
| Margen bruto | €~10K | €60K | €150K | €300K | €520K |

**Año 2: Break-even Q2, rentable Q3+**

---

### Año 3 (2028)

| Métrica | Q4 Año 3 |
|---------|----------|
| Usuarios totales | 150K |
| Usuarios Pro | 30K |
| MRR | €570K |
| ARR | €6.8M |
| Costos | €900K |
| Margen bruto | €~2M |
| Equipo | 8 personas |

**Año 3: Escala rentable, preparación Serie A**

---

## 🎯 Criterios de Éxito (MVP)

### Must-Have (Validación mínima)

- ✅ 50 instalaciones orgánicas
- ✅ 10 usuarios completan 5+ sesiones
- ✅ 60% feedback positivo (👍)
- ✅ 10 clicks en "Ver planes Pro"
- ✅ 0 errores críticos en producción

### Should-Have (Señal fuerte PMF)

- ⭐ 200 instalaciones
- ⭐ 30% conversión paywall suave
- ⭐ 1 usuario solicita pagar (aunque Stripe inactivo)
- ⭐ 5 reviews positivas en Chrome Store
- ⭐ 1 mención orgánica en LinkedIn/Twitter

### Could-Have (Traction extraordinaria)

- 🚀 500 instalaciones
- 🚀 €1K MRR (aunque Stripe inactivo = lista espera)
- 🚀 Feature request específica de 10+ usuarios
- 🚀 Ángel investor contacta espontáneamente

---

## 🧭 Decisiones Pendientes (Post-MVP)

### Estratégicas
1. ¿Levantar inversión o bootstrapping?
2. ¿Expandir a B2B (Teams) o consolidar B2C?
3. ¿Pivot a plataforma multi-propósito o mantener nicho?

### Tácticas
1. ¿LinkedIn Ads o Google Ads primero?
2. ¿Programa referidos o lista espera prioritaria?
3. ¿Lanzar móvil (iOS/Android) o consolidar desktop?

### Producto
1. ¿Dashboard analytics o modo "practice" primero?
2. ¿Soporte Teams o Zoom primero?
3. ¿Customización prompts o nuevo perfil (Profesor)?

**Método de decisión:** Datos MVP + feedback usuarios primeros 100

---

**Última actualización:** Febrero 2026
**Versión:** 1.0
**Próxima revisión:** Post-lanzamiento MVP (Sesión 8)
