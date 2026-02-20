# Confident — Documentación de Diseño

> **Tu confidente silencioso en cada conversación importante**

---

## 📋 Índice

1. [Propuesta de Valor](#propuesta-de-valor)
2. [Perfiles de Usuario](#perfiles-de-usuario)
3. [Flujo de Usuario](#flujo-de-usuario)
4. [Arquitectura de Interfaz](#arquitectura-de-interfaz)
5. [Sistema de Diseño](#sistema-de-diseño)
6. [Pantallas Principales](#pantallas-principales)
7. [Componentes Clave](#componentes-clave)
8. [Microinteracciones](#microinteracciones)
9. [Accesibilidad](#accesibilidad)
10. [Diseño Responsivo](#diseño-responsivo)

---

## 🎯 Propuesta de Valor

### El Problema
Las personas enfrentan conversaciones críticas donde cada palabra cuenta:
- **Candidatos** en entrevistas técnicas o de competencias
- **Vendedores** en llamadas comerciales con objeciones complejas
- **Profesionales** defendiendo posiciones o proyectos ante stakeholders

El estrés, la presión del momento y la carga cognitiva les impide estructurar respuestas óptimas en tiempo real.

### La Solución
**Confident** es un coach silencioso que:
- Escucha ambas partes de la conversación
- Detecta señales críticas (preguntas behavioral, objeciones, momentos de cierre)
- Sugiere **qué decir ahora mismo** (no un resumen de lo que pasó)
- Aparece en panel lateral sin interrumpir la llamada

### Diferenciador Clave
No es un transcriptor. No es un "copiloto" genérico. Es un **confidente especializado por rol** que entiende el contexto y anticipa lo que el usuario necesita decir.

---

## 👥 Perfiles de Usuario

### 🎓 CANDIDATO
**Contexto:** Procesos de selección técnica, behavioral o ejecutiva

**Señales que detecta:**
- Preguntas behavioral (STAR/CAR)
- Preguntas técnicas de arquitectura
- Preguntas situacionales
- Negociación salarial
- Preguntas motivacionales
- Preguntas de cierre

**Tono:** Coach de carrera senior. Directo, estructurado, sin adornos.

**Ejemplo de sugerencia:**
```
🟣 BEHAVIORAL — URGENCIA 3

QUÉ SE PIDE:
Ejemplo de liderazgo bajo presión con resultado medible

SUGERENCIA:
Usa STAR: Situación del proyecto retrasado → Tu acción (rediseño sprint)
→ Resultado (entrega 2 semanas antes). Menciona métrica específica.

KEYWORDS: liderazgo, presión, resultado medible, STAR
```

---

### 💼 VENDEDOR
**Contexto:** Llamadas comerciales, demos, negociaciones

**Señales que detecta:**
- Objeciones de precio
- Objeciones de necesidad
- Objeciones de confianza
- Señales de compra (URGENCIA 3)
- Oportunidades de cierre
- Preguntas de descubrimiento
- Preguntas de valor
- Negociación

**Tono:** Director comercial senior. Orientado a acción y cierre.

**Ejemplo de sugerencia:**
```
🔴 BUYING SIGNAL — URGENCIA 3

QUÉ SE PIDE:
Confirmación de implementación interna (señal de decisión)

SUGERENCIA:
Momento de cierre. Pregunta: "¿Qué necesitas de mi lado para avanzar
esta semana?". No vender más, facilitar decisión.

KEYWORDS: cierre, decisión, implementación, esta semana
```

---

### 🛡️ DEFENSOR
**Contexto:** Reuniones estratégicas, defensas de tesis, presentaciones ejecutivas

**Señales que detecta:**
- Preguntas complejas multi-parte
- Cuestionamiento de asunciones
- Preguntas de alcance
- Preguntas de riesgo
- Desafíos a alternativas
- Solicitud de datos
- Preguntas de presión
- Necesidad de clarificación

**Tono:** Asesor estratégico senior. Primero descompone, luego estructura.

**Ejemplo de sugerencia:**
```
🟡 COMPLEX QUESTION — URGENCIA 2

QUÉ SE PIDE:
Te preguntan 3 cosas: viabilidad técnica + ROI + riesgos operacionales

SUGERENCIA:
Reconoce las 3 dimensiones. Responde en orden: (1) Viabilidad → sí,
arquitectura probada. (2) ROI → 18 meses según modelo. (3) Riesgos →
migration plan con rollback. Pide 2 min para desarrollar cada una.

KEYWORDS: viabilidad, ROI, riesgos, arquitectura, migration plan
```

---

## 🔄 Flujo de Usuario

### Flujo Principal (Primera Vez)

```
1. INSTALACIÓN
   └─ Descargar desde Chrome Web Store
   └─ Permisos: tabCapture, activeTab, storage, sidePanel
   └─ Icono aparece en barra de extensiones

2. CONFIGURACIÓN INICIAL
   └─ Clic en icono Confident
   └─ Popup aparece
   └─ Pegar API key de Deepgram (instrucciones en popup)
   └─ Seleccionar perfil (Candidato / Vendedor / Defensor)
   └─ Ver contador: "Sesión 1 de 5 (gratis)"

3. EN GOOGLE MEET
   └─ Usuario entra a videollamada
   └─ Clic en icono Confident
   └─ Clic "Iniciar sesión"
   └─ Panel lateral se abre automáticamente
   └─ Checkbox consentimiento: "He informado a los participantes..."
   └─ Estado: "Escuchando..." (punto verde pulsante)

4. DURANTE LA LLAMADA
   └─ Usuario y otra persona hablan
   └─ Panel muestra transcripción en tiempo real
   └─ Cuando detecta señal → Sugerencia aparece en <5s
   └─ Usuario lee sugerencia, responde
   └─ Usuario da feedback (👍/👎) opcional
   └─ Historial de sugerencias colapsado abajo

5. FIN DE LLAMADA
   └─ Clic "Detener sesión" en popup o panel
   └─ Panel muestra resumen: X sugerencias en Y minutos
   └─ Email con transcripción completa (si autenticado)
   └─ Contador se incrementa: "Sesión 2 de 5"
```

---

### Flujo Freemium

```
SESIONES 1-5 (Anónimo)
├─ Uso completo sin registro
├─ Sesión 5 → Banner: "Te queda 1 sesión gratuita"
└─ Sesión 6 → PAYWALL SUAVE

PAYWALL SUAVE (Sesión 6)
├─ Panel muestra: "Has usado 5 sesiones gratuitas"
├─ CTA: "Crear cuenta gratis para 10 sesiones más"
├─ Botón "Iniciar sesión con Google"
├─ Redirige a /auth?reason=limit_soft
└─ Login → Migración automática de sesiones anónimas

SESIONES 6-15 (Registrado Free)
├─ Uso completo con perfil persistente
├─ Email con transcripciones al finalizar
├─ Sesión 14 → Banner: "Te queda 1 sesión gratuita"
└─ Sesión 16 → PAYWALL DURO

PAYWALL DURO (Sesión 16)
├─ Panel bloquea inicio de sesión
├─ "Has alcanzado el límite del plan gratuito (15 sesiones)"
├─ CTA: "Ver planes Pro"
├─ Botón "Ver planes" → /pricing
└─ Métrica clave: payment_cta_clicked
```

---

## 🏗️ Arquitectura de Interfaz

### Estructura de la Extensión

```
CHROME EXTENSION
│
├─ POPUP (popup.html)
│  ├─ Header con logo Confident
│  ├─ Selector de perfil (3 radio buttons)
│  ├─ Input para API key Deepgram (password, guardado)
│  ├─ Contador de sesiones (ej. "Sesión 3 de 5")
│  ├─ Botón "Iniciar sesión" (primario, verde)
│  ├─ Botón "Detener sesión" (secundario, rojo, solo si activa)
│  ├─ Estado de conexión (offline/conectando/conectado)
│  └─ Link "Ver dashboard" (solo si autenticado)
│
├─ SIDE PANEL (panel.html)
│  ├─ Header
│  │  ├─ Logo + título "Confident"
│  │  ├─ Perfil actual (ej. "Modo: Candidato")
│  │  └─ Estado sesión (🟢 Escuchando / 🔴 Detenida)
│  │
│  ├─ Sección Consentimiento (solo al iniciar)
│  │  └─ Checkbox: "He informado a los participantes..."
│  │
│  ├─ Sección Transcripción (colapsable)
│  │  └─ Últimas 3-5 líneas de transcripción
│  │     (detecta quién habla: USUARIO / OTRO)
│  │
│  ├─ Sección Sugerencia (principal, grande)
│  │  ├─ Indicador de urgencia (3 dots: 🟣 / 🟡 / 🔴)
│  │  ├─ Tipo de señal + urgencia
│  │  │  Ej: "BEHAVIORAL — URGENCIA 3"
│  │  ├─ "QUÉ SE PIDE:" (1 línea, contexto)
│  │  ├─ "SUGERENCIA:" (2-3 líneas, texto grande)
│  │  ├─ "KEYWORDS:" (chips con términos clave)
│  │  └─ Feedback: 👍 👎
│  │
│  └─ Historial (colapsado por defecto)
│     └─ Lista de sugerencias anteriores de esta sesión
│
└─ LANDING WEB (app/page.tsx)
   ├─ Hero
   │  ├─ Headline: "Tu confidente en cada conversación importante"
   │  ├─ Subhead: "IA que te sugiere qué decir en tiempo real"
   │  ├─ CTA primario: "Probar gratis — sin registro"
   │  └─ CTA secundario: "Ver cómo funciona"
   │
   ├─ Cómo Funciona (3 pasos)
   │  ├─ 1. Instala la extensión
   │  ├─ 2. Activa en Google Meet
   │  └─ 3. Recibe sugerencias en <5s
   │
   ├─ Casos de Uso (3 cards)
   │  ├─ 🎓 Para Candidatos
   │  ├─ 💼 Para Vendedores
   │  └─ 🛡️ Para Defensores
   │
   ├─ Precios
   │  ├─ Free: 5 sesiones sin registro
   │  ├─ Explorador: 15 sesiones con cuenta
   │  └─ Pro: Ilimitado (€19/mes)
   │
   └─ Footer
      ├─ Privacidad | Términos | ARCO
      ├─ hola@tryconfident.com
      └─ "RGPD • Solo texto, no audio"
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Primarios */
--confident-purple: #8B5CF6    /* Violeta principal */
--confident-dark: #1E1E2E      /* Fondo oscuro */
--confident-text: #E2E8F0      /* Texto claro */

/* Urgencia */
--urgency-1: #A78BFA           /* Violeta suave (informativo) */
--urgency-2: #FBBF24           /* Ámbar (importante) */
--urgency-3: #EF4444           /* Rojo (crítico) */

/* Estados */
--success: #10B981             /* Verde */
--warning: #F59E0B             /* Naranja */
--error: #DC2626               /* Rojo oscuro */
--info: #3B82F6                /* Azul */

/* Grises */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

### Tipografía

```css
/* Familia */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;

/* Tamaños */
--text-xs: 0.75rem;    /* 12px - metadatos */
--text-sm: 0.875rem;   /* 14px - secundario */
--text-base: 1rem;     /* 16px - cuerpo */
--text-lg: 1.125rem;   /* 18px - keywords */
--text-xl: 1.25rem;    /* 20px - contexto */
--text-2xl: 1.5rem;    /* 24px - sugerencia */
--text-3xl: 1.875rem;  /* 30px - títulos */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espaciado

```css
/* Escala 4px */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Bordes y Sombras

```css
/* Radios */
--radius-sm: 0.25rem;  /* 4px - chips */
--radius-md: 0.5rem;   /* 8px - cards */
--radius-lg: 0.75rem;  /* 12px - modales */

/* Sombras */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

---

## 🖼️ Pantallas Principales

### 1. POPUP (320x600px aprox)

```
┌──────────────────────────┐
│   [Logo] Confident       │
│                          │
│  Selecciona tu perfil:   │
│  ○ Candidato             │
│  ○ Vendedor              │
│  ● Defensor              │
│                          │
│  API Key Deepgram:       │
│  [••••••••••••••••]      │
│  📋 Copiar desde...      │
│                          │
│  ┌────────────────────┐  │
│  │ Sesión 3 de 5      │  │
│  │ (Gratis)           │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ ▶ INICIAR SESIÓN   │  │ (verde, grande)
│  └────────────────────┘  │
│                          │
│  Estado: ● Conectado     │
│                          │
│  [Ver Dashboard →]       │
└──────────────────────────┘
```

**Interacciones:**
- Selección de perfil → guarda en storage.local
- Input API key → validación 40+ caracteres → guarda encriptado
- Botón iniciar → checkSessionGate() → envía START_SESSION
- Contador actualizado en tiempo real

---

### 2. SIDE PANEL (400px ancho, 100vh altura)

```
┌────────────────────────────────────┐
│ [Logo] Confident    🟢 Escuchando  │
│ Modo: Candidato                    │
├────────────────────────────────────┤
│                                    │
│ ☑ He informado a los participantes │
│   de que esta conversación será... │
│                                    │
├────────────────────────────────────┤
│ Transcripción ▼                    │
│                                    │
│ [OTRO] "Cuéntame sobre una vez..." │
│ [USER] "Claro, en mi anterior..." │
│                                    │
├════════════════════════════════════┤
│                                    │
│  ●●● (3 dots rojos - urgencia 3)   │
│                                    │
│  BEHAVIORAL — URGENCIA 3           │
│                                    │
│  QUÉ SE PIDE:                      │
│  Ejemplo de liderazgo bajo presión │
│  con resultado medible             │
│                                    │
│  SUGERENCIA:                       │
│  Usa STAR: Situación del proyecto  │
│  retrasado → Tu acción (rediseño   │
│  sprint) → Resultado (entrega 2    │
│  semanas antes). Menciona métrica. │
│                                    │
│  KEYWORDS:                         │
│  [liderazgo] [presión] [STAR]     │
│                                    │
│  ¿Útil? 👍 👎                      │
│                                    │
├────────────────────────────────────┤
│ Historial (3) ▼                    │
│                                    │
│ • 14:23 - Pregunta técnica         │
│ • 14:18 - Pregunta motivacional    │
│ • 14:12 - Presentación inicial     │
│                                    │
└────────────────────────────────────┘
```

**Interacciones:**
- Checkbox consentimiento → obligatorio para iniciar
- Transcripción → scroll automático a última línea
- Sugerencia → aparece con animación fade-in
- Feedback → guarda en storage.local → envía a analytics
- Historial → clic en item → expande sugerencia completa

---

### 3. LANDING PAGE

**Hero (viewport completo)**
```
┌────────────────────────────────────────────────┐
│                                                │
│         Tu confidente en cada                  │
│       conversación importante                  │
│                                                │
│    IA que te sugiere qué decir en tiempo real  │
│                                                │
│   [Probar gratis — sin registro]               │
│   [Ver cómo funciona ↓]                        │
│                                                │
│   🎓 5 sesiones gratis • 💼 Sin tarjeta        │
│                                                │
└────────────────────────────────────────────────┘
```

**Cómo Funciona (3 columnas)**
```
┌──────────────────────────────────────────────┐
│  1️⃣              2️⃣              3️⃣          │
│  Instala         Activa          Recibe      │
│  Extensión       en Meet         Sugerencias │
│  1 clic          Selecciona      En <5s      │
│                  perfil                       │
└──────────────────────────────────────────────┘
```

**Casos de Uso (3 cards)**
```
┌──────────────────────────────────────────────┐
│                                              │
│  🎓 CANDIDATOS        💼 VENDEDORES          │
│  Entrevistas técnicas Cierres comerciales    │
│  STAR automático      Manejo objeciones     │
│                                              │
│          🛡️ DEFENSORES                       │
│          Presentaciones ejecutivas           │
│          Descompone preguntas complejas      │
│                                              │
└──────────────────────────────────────────────┘
```

**Precios (3 columnas)**
```
┌──────────────────────────────────────────────┐
│                                              │
│  GRATIS        EXPLORADOR        PRO         │
│  5 sesiones    15 sesiones      Ilimitado    │
│  Sin registro  + Email trans.   + Analytics  │
│  €0            €0               €19/mes      │
│                                              │
│  [Empezar]     [Empezar]        [Empezar]   │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🧩 Componentes Clave

### Indicador de Urgencia (Urgency Dots)

```tsx
interface UrgencyDotsProps {
  level: 1 | 2 | 3;
}

// Visual:
// Nivel 1: ●●○ (2 violeta, 1 gris)
// Nivel 2: ●●● (3 ámbar)
// Nivel 3: ●●● (3 rojo, pulsante)
```

**Uso:** Señal visual instantánea de prioridad.

---

### Chip de Keyword

```tsx
interface KeywordChipProps {
  text: string;
  onClick?: () => void; // Opcional: copiar al portapapeles
}

// Visual:
// [liderazgo] - fondo violeta suave, texto blanco, radius-sm
```

**Uso:** Keywords accionables para incluir en respuesta.

---

### Tarjeta de Sugerencia

```tsx
interface SuggestionCardProps {
  signal_type: string;
  urgency: 1 | 2 | 3;
  what_is_being_asked: string;
  suggestion: string;
  keywords: string[];
  onFeedback: (helpful: boolean) => void;
}

// Partes:
// 1. Header: Tipo señal + urgencia + dots
// 2. Context: "QUÉ SE PIDE" (1 línea)
// 3. Suggestion: Texto principal (2-3 líneas, grande)
// 4. Keywords: Chips
// 5. Footer: Feedback thumbs
```

---

### Contador de Sesiones

```tsx
interface SessionCounterProps {
  current: number;
  limit: number;
  plan: 'free' | 'pro';
}

// Visual:
// Sesión 3 de 5 (ⓘ icono info)
// Colores:
// - Verde si remaining > 2
// - Ámbar si remaining = 1
// - Rojo si remaining = 0
```

---

### Banner de Paywall

```tsx
interface PaywallBannerProps {
  type: 'soft' | 'hard';
  sessionCount: number;
}

// Soft (sesión 6):
// "Has usado 5 sesiones gratuitas"
// [Crear cuenta gratis para 10 más →]

// Hard (sesión 16):
// "Límite del plan gratuito alcanzado"
// [Ver planes Pro →]
```

---

## ⚡ Microinteracciones

### 1. Aparición de Sugerencia
- Fade-in desde opacidad 0 → 1 (300ms)
- Ligero slide-down desde -10px → 0 (ease-out)
- Vibración suave del dispositivo si urgencia = 3 (opcional)

### 2. Feedback de Thumbs
- Click → escala 1.2 → 1.0 (150ms bounce)
- Color cambia a verde (👍) o rojo (👎)
- Desaparece el otro thumb

### 3. Transcripción en Tiempo Real
- Nuevas líneas aparecen con fade-in
- Auto-scroll suave a última línea
- Highlight de palabras clave detectadas

### 4. Botón Iniciar Sesión
- Hover → elevación sombra + escala 1.02
- Click → pulse ring violeta
- Loading → spinner + "Conectando..."

### 5. Urgency Dots Pulsantes
- Urgencia 3 → pulse animation continuo (2s)
- Glow sutil rojo alrededor de los dots

---

## ♿ Accesibilidad

### Contraste
- Todos los textos cumplen WCAG AA (4.5:1 mínimo)
- Urgencia 3 usa rojo oscuro #DC2626 sobre fondo gris oscuro

### Navegación por Teclado
- Tab order lógico: Perfil → API Key → Iniciar → Feedback
- Enter activa botones primarios
- Espacio activa checkboxes

### Screen Readers
- ARIA labels en iconos ("Urgencia nivel 3")
- Live regions para sugerencias nuevas
- Alt text descriptivo en imágenes de landing

### Tamaños de Toque
- Botones mínimo 44x44px (iOS guidelines)
- Separación mínima 8px entre elementos interactivos

---

## 📱 Diseño Responsivo

### Side Panel (fijo 400px)
- No responsivo (Chrome side panel width fijo)
- Scroll vertical si contenido excede altura

### Landing Page (breakpoints)

```css
/* Mobile: 320px - 768px */
- Hero: Stack vertical
- Cómo funciona: Stack vertical
- Casos de uso: 1 columna
- Precios: Stack vertical

/* Tablet: 768px - 1024px */
- Hero: Centrado
- Cómo funciona: 3 columnas
- Casos de uso: 2 columnas
- Precios: 3 columnas

/* Desktop: 1024px+ */
- Hero: Max-width 1200px centrado
- Cómo funciona: 3 columnas espaciadas
- Casos de uso: 3 columnas
- Precios: 3 columnas con highlights
```

### Popup (fijo 320x600px)
- No responsivo (Chrome extension popup size)
- Layout vertical optimizado para scroll mínimo

---

## 📐 Wireframes Anotados

### Popup — Estado Inicial
```
┌─────────────────────────────┐
│ Header                      │ 60px - Logo + título
├─────────────────────────────┤
│ Selector Perfil             │ 120px - 3 radios
├─────────────────────────────┤
│ Input API Key               │ 80px - Input + help text
├─────────────────────────────┤
│ Contador                    │ 60px - Info sesiones
├─────────────────────────────┤
│ CTA Primario                │ 48px - Botón grande
├─────────────────────────────┤
│ Estado                      │ 40px - Conexión
├─────────────────────────────┤
│ Link Dashboard              │ 32px - Opcional
└─────────────────────────────┘
Total: ~440px (cabe en 600px)
```

### Panel — Durante Sesión
```
┌─────────────────────────────┐
│ Header + Estado             │ 80px - Fixed top
├─────────────────────────────┤
│ Transcripción               │ 200px - Scrollable
├═════════════════════════════┤
│ SUGERENCIA PRINCIPAL        │ Variable - Focus visual
│ (Destacada)                 │ Min 300px - Max sin límite
├─────────────────────────────┤
│ Historial                   │ Resto - Scrollable
└─────────────────────────────┘
```

---

## 🎬 Guía de Animaciones

### Tiempos
- **Micro:** 150ms (hover, clicks)
- **Cortas:** 300ms (aparición elementos)
- **Medias:** 500ms (transiciones de estado)
- **Largas:** 1000ms+ (efectos decorativos)

### Curvas
- **Ease-out:** Apariciones (cubic-bezier(0, 0, 0.2, 1))
- **Ease-in:** Desapariciones (cubic-bezier(0.4, 0, 1, 1))
- **Bounce:** Feedback clicks (cubic-bezier(0.68, -0.55, 0.265, 1.55))

### Reducción de Movimiento
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📊 Métricas de Diseño

### Éxito Medible
1. **Tiempo hasta primera sugerencia:** <5s desde fin de frase
2. **Tasa de feedback positivo:** >60% de 👍
3. **Tasa de conversión paywall suave:** >30%
4. **Clicks en CTA principal landing:** >15% visitantes

### Testing UX
- **A/B Test 1:** Urgency dots vs. color de fondo
- **A/B Test 2:** "Probar gratis" vs. "Empezar ahora"
- **User Testing:** 5 personas por perfil (15 total) antes de lanzar

---

## 🔄 Evolución del Diseño

### V1 (MVP - Febrero 2026)
- ✅ 3 perfiles funcionales
- ✅ Panel lateral con sugerencias
- ✅ Landing básica
- ✅ Freemium 5/15 sesiones

### V2 (Post-MVP)
- Dashboard con analytics de sesiones
- Modo "practice" con conversaciones simuladas
- Personalización de prompts por usuario
- Sugerencias con opciones múltiples

### V3 (Futuro)
- Soporte Microsoft Teams / Zoom
- Modo offline con modelo local
- Integración con CRM (Vendedor)
- Integración con ATS (Candidato)

---

**Última actualización:** Febrero 2026
**Versión:** 1.0
**Próxima revisión:** Post-Sesión 5 (Landing Page)
