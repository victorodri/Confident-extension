# Visual Reference - Session 30 Dark Mode Redesign

## 🎨 Color Palette (Refero Research)

### Backgrounds (7% contrast between levels)
```
--bg-primary:   #0f172a  (slate-900) ← Base background
--bg-elevated:  #1e293b  (slate-800) ← Cards, elevated surfaces
--bg-subtle:    #334155  (slate-700) ← Hover states, borders
```

### Text Colors (WCAG Verified)
```
--text-primary:   #cbd5e1  (slate-300) → 12.02:1 ✅ AAA
--text-secondary: #94a3b8  (slate-400) →  6.96:1 ✅ AA
--text-tertiary:  #94a3b8  (slate-400) →  6.96:1 ✅ AA
--text-disabled:  #475569  (slate-600)
```

### Accent Colors
```
--accent-primary: #0e7490  (cyan-700) → 5.36:1 ✅ AA (buttons)
--accent-hover:   #0891b2  (cyan-600)
--accent-active:  #06b6d4  (cyan-500)
```

### Urgency Colors
```
--urgency-info:      #10b981  (emerald-500) ← Informative (1)
--urgency-important: #f59e0b  (amber-500)   ← Important (2)
--urgency-critical:  #ef4444  (red-500)     ← Critical (3)
```

---

## 📱 VISTA 1: Profile Selection (Sin sesión activa)

```
╔════════════════════════════════════════════════════╗
║                    HEADER                          ║
║  [Confident 🎯]           [🇪🇸 ES ▼]              ║
║  [⚪ Sin sesión activa]                            ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  ⚠️ Abre una videollamada en:                     ║
║     🎥 Google Meet                                 ║
║     💼 Microsoft Teams                             ║
║     📹 Zoom                                        ║
║                                                    ║
║  ─────────────────────────────────────────────────║
║                                                    ║
║  Selecciona tu perfil                             ║
║                                                    ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ║
║  │   🎯        │ │   💼        │ │   🛡️        │ ║
║  │ Candidato   │ │  Vendedor   │ │  Defensor   │ ║
║  │ Entrevistas │ │  Comercial  │ │  Técnicas   │ ║
║  └─────────────┘ └─────────────┘ └─────────────┘ ║
║                                                    ║
║  ─────────────────────────────────────────────────║
║                                                    ║
║  [✓] He informado a los participantes...          ║
║                                                    ║
║  Emails de participantes (opcional)                ║
║  ┌───────────────────────────────────────────┐   ║
║  │ email1@ejemplo.com, email2@ejemplo.com    │   ║
║  └───────────────────────────────────────────┘   ║
║                                                    ║
║          ┌───────────────────┐                    ║
║          │  Iniciar sesión   │                    ║
║          └───────────────────┘                    ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║ FOOTER                                             ║
║ 5 sesiones disponibles                             ║
╚════════════════════════════════════════════════════╝
```

### Colors Vista 1:
- Background: `#0f172a` (slate-900)
- Cards/Buttons: `#1e293b` (slate-800)
- Borders: `#334155` (slate-700)
- Primary text: `#cbd5e1` (slate-300)
- Secondary text: `#94a3b8` (slate-400)
- Accent button: `#0e7490` (cyan-700)
- Status dot: `#64748b` (slate-500 - inactive)

---

## 📱 VISTA 2: Active Session (Sesión activa)

```
╔════════════════════════════════════════════════════╗
║                    HEADER                          ║
║  [Confident 🎯]           [🇪🇸 ES ▼]              ║
║  [🟢 Sesión activa - Candidato]                   ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║            ● ● ●  (pulsing animation)              ║
║            Escuchando...                           ║
║                                                    ║
║  ─────────────────────────────────────────────────║
║                                                    ║
║  ┌────────────────────────────────────────────┐  ║
║  │ 🔴 URGENTE                          [👍][👎]│  ║
║  │                                             │  ║
║  │ Contexto: Te están preguntando sobre tu    │  ║
║  │ experiencia en liderazgo de equipos        │  ║
║  │                                             │  ║
║  │ Responde con marco STAR:                   │  ║
║  │ • Situación: Proyecto crítico...           │  ║
║  │ • Tarea: Coordinar equipo de 5...          │  ║
║  │ • Acción: Implementé sprints...            │  ║
║  │ • Resultado: Entregamos 2 semanas antes    │  ║
║  │                                             │  ║
║  │ [liderazgo] [STAR] [resultados]            │  ║
║  └────────────────────────────────────────────┘  ║
║                                                    ║
║  ┌────────────────────────────────────────────┐  ║
║  │ 🟡 IMPORTANTE                       [👍][👎]│  ║
║  │                                             │  ║
║  │ Pregunta sobre salario esperado            │  ║
║  │                                             │  ║
║  │ Da rango basado en investigación:          │  ║
║  │ "Según el mercado para este rol..."        │  ║
║  │                                             │  ║
║  │ [salario] [negociación]                    │  ║
║  └────────────────────────────────────────────┘  ║
║                                                    ║
║  ─────────────────────────────────────────────────║
║                                                    ║
║  ▸ Historial de sesión (3)                        ║
║                                                    ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ ✓ He terminado esta reunión                 │ ║
║  │ Ver resumen y transcripción en Dashboard    │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║ FOOTER                                             ║
║ 4 sesiones disponibles                             ║
╚════════════════════════════════════════════════════╝
```

### Colors Vista 2:
- Background: `#0f172a` (slate-900)
- Cards: `#1e293b` (slate-800)
- Urgency borders:
  - Critical (3): `#ef4444` (red-500) + gradient fade
  - Important (2): `#f59e0b` (amber-500) + gradient fade
  - Info (1): `#10b981` (emerald-500)
- Status dot: `#10b981` (emerald-500 - active, pulsing)
- Listening dots: `#0891b2` (cyan-600, animated)

---

## 🎭 Animaciones

### 1. Status Dot (Active)
```css
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
```
**Efecto**: Punto verde pulsando suavemente

### 2. Listening Animation
```css
@keyframes listening-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}
```
**Efecto**: 3 puntos cyan pulsando en secuencia (delay: 0s, 0.2s, 0.4s)

### 3. Suggestion Card Entrance
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Efecto**: Card aparece deslizándose desde abajo con fade-in

### 4. Critical Urgency Pulse
```css
@keyframes pulse-critical {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```
**Efecto**: Card crítica pulsa una vez al aparecer (llamar atención)

---

## 🔍 Hover States

### Profile Buttons
- **Default**: `background: #1e293b` (slate-800), `border: #334155` (slate-700)
- **Hover**: `background: #334155` (slate-700)
- **Selected**: `border: #0891b2` (cyan-600), `background: #334155`

### Primary Button (Iniciar sesión / Terminar)
- **Default**: `background: #0e7490` (cyan-700), `color: white`
- **Hover**: `background: #0891b2` (cyan-600)
- **Disabled**: `opacity: 0.5`, `cursor: not-allowed`

### Feedback Buttons (👍/👎)
- **Default**: `border: #334155`, `opacity: 0.7`
- **Hover**: `border: #475569`, `background: #334155`, `opacity: 1`
- **Selected Up**: `border: #10b981`, `background: rgba(16,185,129,0.1)`
- **Selected Down**: `border: #ef4444`, `background: rgba(239,68,68,0.1)`

---

## 📏 Spacing System

```css
--space-1: 4px   ← Minimal spacing
--space-2: 8px   ← Tight spacing
--space-3: 12px  ← Default spacing
--space-4: 16px  ← Medium spacing
--space-6: 24px  ← Large spacing
--space-8: 32px  ← Extra large spacing
```

**Usage Examples**:
- Card padding: `var(--space-3)` (12px)
- Gap between cards: `var(--space-3)` (12px)
- Section margins: `var(--space-4)` (16px)
- Header padding: `var(--space-4)` (16px)

---

## 🖼️ Typography

### Font Sizes
- **Logo**: 18px, font-weight: 600
- **Titles**: 16px, font-weight: 600
- **Body text**: 14px, line-height: 1.5
- **Secondary text**: 13px
- **Badges**: 11px, uppercase, letter-spacing: 0.05em

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

---

## 📐 Layout Structure

### Side Panel Dimensions
- Width: `400px` (fixed)
- Height: `100vh` (full viewport height)

### Sections
```
Header:          60px (fixed top)
Main Content:    flex-grow: 1 (scrollable)
Footer Counter:  auto height (sticky bottom)
```

### Scrolling Behavior
- Header: Fixed at top
- Main: Scrollable with custom scrollbar (dark themed)
- Footer: Sticky at bottom

---

## ✅ WCAG Compliance Summary

| Element | Foreground | Background | Ratio | WCAG |
|---------|-----------|------------|-------|------|
| Primary text | #cbd5e1 | #0f172a | 12.02:1 | ✅ AAA |
| Secondary text | #94a3b8 | #0f172a | 6.96:1 | ✅ AA |
| Button text | #ffffff | #0e7490 | 5.36:1 | ✅ AA |
| Card primary | #cbd5e1 | #1e293b | 9.85:1 | ✅ AAA |
| Card secondary | #94a3b8 | #1e293b | 5.71:1 | ✅ AA |

**All text meets WCAG AA standard (minimum 4.5:1)**
**Most text exceeds to AAA (7:1+)**

---

## 🎯 Key Visual Differences from Previous Design

### BEFORE (Apple Light Theme):
- White backgrounds (#ffffff)
- Blue accent (#007aff)
- Gray text (#333333, #666666)
- Light cards with subtle shadows
- Bright, high-contrast

### AFTER (Refero Dark Theme):
- Dark slate backgrounds (#0f172a, #1e293b)
- Cyan accents (#0e7490, #0891b2)
- Light text on dark (#cbd5e1, #94a3b8)
- Elevated cards with 7% contrast
- Soft, sophisticated contrast

---

**Created**: 5 March 2026
**Session**: 30 - Dark Mode Redesign
**Design System**: Refero Research (Slate + Cyan)
