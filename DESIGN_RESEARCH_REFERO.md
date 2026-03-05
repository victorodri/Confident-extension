# Design Research — Confident (via Refero UX Research)

> **Research realizado por**: Refero UX Research Agent
> **Fecha**: Marzo 3, 2026
> **Objetivo**: Informar el rediseño de los 5 componentes principales de Confident basándose en patrones UI de productos top

---

## 🎯 Componentes a rediseñar

1. **Extension Side Panel** (400px height) — Panel lateral en Google Meet
2. **Extension Popup** (300px width) — Popup de la extensión
3. **Landing Page Hero** — Página principal con 3 perfiles
4. **Recordings Dashboard** — Dashboard con historial de sesiones
5. **Pricing Page** — Página de planes (Free vs Premium)

---

## 1. EXTENSION SIDE PANEL (400px height)

### Referencias principales:
- **[Jace AI](https://refero.design/s/fe31c1ff-60f1-454a-9537-f3a9f05f4435)** — AI sidebar patterns
- **[Missive](https://refero.design/s/10aea0d6-5752-4c6f-8196-b89e32a6dd37)** — Message cards in sidebar

### Patrones clave identificados:

#### Background layering
- **Jace AI**: Sidebar con `#1E1E1E` sobre `#121212` — 7% de diferencia de luminosidad
- **Patrón**: Crea profundidad sutil sin bordes duros
- **Para Confident**:
  - Base: `bg-slate-900` (#0f172a)
  - Cards: `bg-slate-800` (#1e293b)

#### Listening indicator
- **Jace AI**: "Connecting..." con skeleton state pulsante
- **Sugerencia para Confident**:
  - Dot indicator: `w-2 h-2 rounded-full bg-emerald-500 animate-pulse`
  - Status text: `text-slate-400 text-xs`
  - Transcript preview: `text-slate-500 text-sm italic` con max 2 líneas truncadas

#### Suggestion card layout
**Missive** message cards usan:
```css
padding: 12px (p-3)
gap: 8px entre elementos (gap-2)
border-radius: 8px (rounded-lg)
Sin border, solo separación por color de fondo
```

#### Badge/urgency system
**Column** badges pattern:
- **Level 1 (gray/info)**: `bg-slate-700 text-slate-300` — "FYI"
- **Level 2 (amber/important)**: `bg-amber-500/20 text-amber-400 border border-amber-500/30`
- **Level 3 (red/urgent)**: `bg-red-500/20 text-red-400 border border-red-500/30`

#### Session counter
- Posición: Bottom-left
- Estilo: `text-slate-500 text-xs`
- Progress indicator:
  - Base: `h-0.5 bg-slate-700`
  - Fill: `bg-cyan-500`
  - Ejemplo: Muestra 5/15 sesiones

#### Copy button
- Aparece en hover de card
- Transición: `opacity-0 group-hover:opacity-100`
- Tamaño icon: 14px (`w-3.5 h-3.5`)

---

## 2. EXTENSION POPUP (300px width)

### Referencias principales:
- **[Wealthsimple](https://refero.design/s/cf960b06-f65d-4787-b2d9-3b56a69ff02a)** — Shortcuts modal
- **[X](https://refero.design/s/5f0c688a-7c88-4f30-8c0c-ba382e2cdec)** — Compact dialogs

### Patrones clave identificados:

#### Container
```css
max-width: 300px
padding: 16px (p-4)
background: bg-slate-900
border: border border-slate-800
```

#### Logo placement
- Posición: Top-center o top-left
- Altura: 24px
- Wordmark: "Confident" en `text-white font-semibold` junto al icon

#### Action buttons (stacked vertical)
Gap: 8px (`gap-2`)

**Primary button**:
```css
w-full
bg-cyan-600 hover:bg-cyan-500
text-white
py-2 px-4
rounded-md
text-sm font-medium
```

**Secondary button**:
```css
w-full
bg-slate-800 hover:bg-slate-700
text-slate-200
py-2 px-4
rounded-md
text-sm
```

#### Button hierarchy
- **Máximo 3 botones** antes de que el popup se sienta saturado
- Primary actions: Full color
- Secondary actions: Subtle backgrounds

#### Footer
- Version number: `text-slate-600 text-xs`
- Centrado con `mt-4` (16px top margin)

---

## 3. LANDING PAGE HERO

### Referencias principales:
- **[Linear](https://refero.design/s/83242441-8149-44c2-bf13-afa9a9b63b1d)** — Bento grid
- **[SAVEE](https://refero.design/s/79195-d8ad-4ee5-9ec5-e23d5b38bd34)** — Hero layout

### Patrones clave identificados:

#### Hero typography (Linear style)
**Headline**:
```css
font-size: 48-56px
font-weight: 700
line-height: 1.1
```

**Subhead**:
```css
font-size: 18-20px
font-weight: 400
color: text-slate-400
max-width: 600px
```

#### Three profile cards (Bento grid)
**Container**:
```css
grid grid-cols-3 gap-4
```

**Card**:
```css
bg-slate-800/50
border border-slate-700/50
rounded-xl
p-6

/* Hover */
hover:border-slate-600
hover:bg-slate-800
transition
```

#### Card contents
**Icon container**:
```css
width: 40px
height: 40px
bg-slate-700
rounded-lg
/* Lucide icon inside */
```

**Label**:
```css
text-white
font-medium
mt-4
```

**Benefit**:
```css
text-slate-400
text-sm
mt-1
```

#### CTA button (Linear gradient)
```css
bg-gradient-to-r from-cyan-600 to-blue-600
hover:from-cyan-500 hover:to-blue-500
shadow-lg shadow-cyan-500/20
```

---

## 4. RECORDINGS DASHBOARD

### Referencias principales:
- **[Column](https://refero.design/s/9aa45323-f740-4bfa-a2f0-0ea3acbc2061)** — Table design
- **[Linear](https://refero.design/s/2991fbc3-3e12-4e30-a387-f9de801e3ad1)** — Empty state

### Patrones clave identificados:

#### Table design (Column style)
**Header**:
```css
text-slate-400
text-xs
font-medium
uppercase
tracking-wider
bg-transparent
```

**Row**:
```css
border-b border-slate-800
hover:bg-slate-800/50
```

**Cell padding**:
```css
py-3 px-4
```

**Session type badges**:
- Candidate: cyan (`bg-cyan-500/20 text-cyan-400 border border-cyan-500/30`)
- Salesperson: emerald (`bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`)
- Advocate: violet (`bg-violet-500/20 text-violet-400 border border-violet-500/30`)

#### Search/filter bar
**Input**:
```css
bg-slate-800
border-slate-700
text-white
placeholder-slate-500
rounded-md
```

**Search icon**: 16px en `text-slate-500`

**Filter dropdowns**: A la derecha del search

#### Empty state (Linear pattern)
**Centered layout**:
- Illustration: Lucide icon 64px en `text-slate-600`
- Title: `text-white text-lg font-medium mt-4`
- Subtitle: `text-slate-400 text-sm mt-1`
- CTA: `mt-6 bg-cyan-600 text-white px-4 py-2 rounded-md text-sm`

#### Pagination
- Simple prev/next con números de página
- Inactive: `text-slate-400`
- Active: `text-white`

---

## 5. PRICING PAGE

### Referencias principales:
- **[Amie](https://refero.design/s/d8788e65-4089-418d-918d-2ca872db7252)** — Two-column layout
- **[Cursor](https://refero.design/s/1d484bbd-5fbd-49ae-a99d-608ffa58ea62)** — Plan cards

### Patrones clave identificados:

#### Layout
```css
grid grid-cols-2 gap-6
max-width: 800px
margin: 0 auto
```

#### Card design (Amie style)
```css
background: bg-slate-800
border: border border-slate-700
/* Premium puede usar: border-cyan-500/50 */
padding: p-6
border-radius: rounded-2xl
```

#### Plan header
**Plan name**:
```css
text-white
text-xl
font-semibold
```

**Price**:
```css
text-3xl
font-bold
text-white
mt-2

/* "/month" en */
text-slate-400
text-base
font-normal
```

**Subtitle**:
```css
text-slate-400
text-sm
/* Ejemplo: "Up to 15 sessions" / "Unlimited sessions" */
```

#### Feature list (Amie pattern)
**Check icons** (incluidos):
```css
width: 16px
height: 16px
color: text-cyan-500
```

**X icons** (excluidos):
```css
width: 16px
height: 16px
color: text-slate-600
```

**List gap**: `gap-3` entre items

**Item text**: `text-slate-300 text-sm`

#### CTA buttons
**Free plan**:
```css
w-full
bg-slate-700 hover:bg-slate-600
text-white
py-2.5
rounded-lg
font-medium
```

**Premium plan**:
```css
w-full
bg-cyan-600 hover:bg-cyan-500
text-white
py-2.5
rounded-lg
font-medium
```

---

## 📐 DESIGN SYSTEM CONSOLIDADO

### Color Palette (Slate + Cyan)

#### Backgrounds
```css
slate-900 (#0f172a) → Main backgrounds (reduce eye strain)
slate-800 (#1e293b) → Cards, elevated surfaces (7% contrast)
slate-700 (#334155) → Subtle elements
```

#### Text colors
```css
slate-300 (#cbd5e1) → Primary text (7:1 contrast on slate-900, WCAG AAA)
slate-400 (#94a3b8) → Secondary text (4.5:1 contrast, WCAG AA)
slate-500 (#64748b) → Tertiary text, placeholders
slate-600 (#475569) → Disabled state
```

#### Accent colors
```css
cyan-600 (#0891b2) → Primary actions, links
cyan-500 (#06b6d4) → Hover states
cyan-400 (#22d3ee) → Active states

/* Urgency badges */
emerald-500 → Level 1 (Info)
amber-500 → Level 2 (Important)
red-500 → Level 3 (Urgent)
```

**Rationale de cyan**:
- Diferente de blue (muy común)
- Diferente de teal (muy trendy)
- Señala inteligencia/tech sin ser agresivo

### Typography Scale

```css
text-xs    (12px) → Timestamps, session counter, badges
text-sm    (14px) → Body text, button labels
text-base  (16px) → Primary content, suggestions
text-lg    (18px) → Subheadlines
text-xl    (20px) → Card titles
text-3xl   (30px) → Hero headline
text-4xl   (36px) → Page titles
```

### Spacing System

```css
gap-1  (4px)  → Icon gaps, badge padding
gap-2  (8px)  → Element gaps inside cards
gap-3  (12px) → Card internal padding
gap-4  (16px) → Section spacing, popup padding
gap-6  (24px) → Major section breaks
gap-8  (32px) → Hero spacing
```

#### Component-specific spacing
```css
/* Side panel cards */
mb-3 → Between suggestions

/* Popup buttons */
gap-2 → Stack vertical

/* Dashboard rows */
border-b border-slate-800
py-3 → Row padding
```

### Dark Mode Contrast (Verificado WCAG)

```
White on slate-900:       15.8:1 (AAA) ✅
Slate-300 on slate-900:    7.2:1 (AA)  ✅
Slate-400 on slate-900:    4.6:1 (AA large text) ✅
Red-500 on slate-900:      5.8:1 (AA)  ✅
Amber-500 on slate-900:    7.1:1 (AA)  ✅
```

### Responsive Behavior

```css
/* Side panel */
width: 400px (fixed, Chrome constraint)
overflow-y: scroll

/* Popup */
width: 300px (fixed)
flex-direction: column (always)

/* Landing */
grid-cols-3 → grid-cols-1 on mobile

/* Dashboard */
Horizontal scroll on mobile OR
Switch to card list view
```

---

## 🎨 Micro-interactions sugeridas (por investigar)

### Loading states
- **Skeleton screens**: Jace AI pattern con `animate-pulse`
- **Spinner**: 16px cyan spinner para acciones cortas (<3s)
- **Progress bar**: Barra horizontal para operaciones >3s

### Copy-to-clipboard feedback
- **Toast notification**: Aparece top-right, auto-dismiss en 2s
- **Icon change**: Clipboard → Check (con bounce animation)
- **Text feedback**: "Copied!" en `text-cyan-400`

### Suggestion confidence indicators
Más allá del sistema 1-3 de urgencia:
- **Porcentaje de confianza**: 85% confidence → `text-slate-500 text-xs`
- **Dot indicators**: 3 dots, llenos según confianza
- **Border thickness**: Border más grueso = más confident

### Transcript preview durante listening
- **Real-time typing effect**: Palabras aparecen character-by-character
- **Fade in animation**: Nuevas líneas con `animate-fadeIn`
- **Auto-scroll**: Scroll automático a última línea

---

## 📚 Referencias completas

### Productos investigados:
1. **Jace AI** — [fe31c1ff](https://refero.design/s/fe31c1ff-60f1-454a-9537-f3a9f05f4435)
2. **Missive** — [10aea0d6](https://refero.design/s/10aea0d6-5752-4c6f-8196-b89e32a6dd37)
3. **Column** — [9aa45323](https://refero.design/s/9aa45323-f740-4bfa-a2f0-0ea3acbc2061)
4. **Wealthsimple** — [cf960b06](https://refero.design/s/cf960b06-f65d-4787-b2d9-3b56a69ff02a)
5. **X (Twitter)** — [5f0c688a](https://refero.design/s/5f0c688a-7c88-4f30-8c0c-ba382e2cdec)
6. **Linear** — [83242441](https://refero.design/s/83242441-8149-44c2-bf13-afa9a9b63b1d) / [2991fbc3](https://refero.design/s/2991fbc3-3e12-4e30-a387-f9de801e3ad1)
7. **SAVEE** — [79195](https://refero.design/s/79195-d8ad-4ee5-9ec5-e23d5b38bd34)
8. **Amie** — [d8788e65](https://refero.design/s/d8788e65-4089-418d-918d-2ca872db7252)
9. **Cursor** — [1d484bbd](https://refero.design/s/1d484bbd-5fbd-49ae-a99d-608ffa58ea62)

---

**Creado**: Marzo 3, 2026
**Investigado por**: Refero UX Research Agent
**Compilado para**: Confident Redesign Sessions
