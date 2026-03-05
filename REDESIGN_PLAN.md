# Confident Redesign Plan — Sesiones 30-33

> **Basado en**: Research de Refero UX (DESIGN_RESEARCH_REFERO.md)
> **Objetivo**: Rediseñar los 5 componentes principales de Confident siguiendo patrones UI de productos top
> **Sesiones**: 4 sesiones de rediseño antes de screenshots/testing/deployment

---

## 📋 Plan de Sesiones

### **Sesión 30** — Rediseño Extension (Side Panel + Popup)
**Duración estimada**: 2-3 horas
**Tokens estimados**: 40-50K

**Componentes**:
1. **Side Panel** (extension/side-panel/)
   - Panel.html + panel.css rediseño completo
   - Background layering (slate-900/slate-800)
   - Suggestion cards con nuevo badge system (Level 1/2/3)
   - Listening indicator con pulsing dot
   - Session counter con progress bar
   - Copy button on hover

2. **Popup** (extension/popup/)
   - Popup.html + popup.css rediseño
   - Container 300px con nuevo layout
   - Action buttons hierarchy (Primary/Secondary)
   - Logo placement top-center
   - Footer con version number

**Referencias**: Jace AI, Missive, Wealthsimple, X

**Archivos a modificar**:
```
extension/side-panel/panel.html
extension/side-panel/panel.css
extension/popup/popup.html
extension/popup/popup.css
```

**Deliverables**:
- CSS actualizado con Tailwind classes
- HTML restructurado siguiendo patrones
- Dark mode optimizado (WCAG AA mínimo)

---

### **Sesión 31** — Rediseño Landing Page
**Duración estimada**: 2-3 horas
**Tokens estimados**: 40-50K

**Componentes**:
1. **Hero Section** (app/page.tsx)
   - Typography scale (48-56px headline)
   - Subhead con max-width 600px
   - CTA button con gradient Linear-style
   - Shadow cyan-500/20

2. **3 Profile Cards** (Candidato/Vendedor/Defensor)
   - Bento grid layout (grid-cols-3)
   - Card hover effects
   - Icon containers 40px
   - Benefits text styling

**Referencias**: Linear bento grid, SAVEE

**Archivos a modificar**:
```
app/[locale]/page.tsx
app/globals.css (añadir custom gradients si es necesario)
```

**Deliverables**:
- Landing page modernizada
- Profile cards con hover states
- Responsive grid (cols-3 → cols-1 mobile)

---

### **Sesión 32** — Rediseño Dashboard + Pricing
**Duración estimada**: 2-3 horas
**Tokens estimados**: 40-50K

**Componentes**:
1. **Recordings Dashboard** (app/[locale]/dashboard/page.tsx)
   - Table design Column-style
   - Search/filter bar
   - Session type badges (cyan/emerald/violet)
   - Empty state con Linear pattern
   - Pagination

2. **Pricing Page** (app/[locale]/pricing/page.tsx)
   - Two-column layout Amie-style
   - Plan cards con border highlighting
   - Feature list con check/x icons
   - CTA buttons differentiated

**Referencias**: Column, Linear, Amie, Cursor

**Archivos a modificar**:
```
app/[locale]/dashboard/page.tsx
app/[locale]/pricing/page.tsx
components/ (si creamos components reutilizables)
```

**Deliverables**:
- Dashboard con tabla profesional
- Pricing page clara y atractiva
- Empty states diseñados

---

### **Sesión 33** — Design System + Components Library
**Duración estimada**: 2 horas
**Tokens estimados**: 30-40K

**Objetivo**: Consolidar y documentar el design system

**Tareas**:
1. **Design System Documentation**:
   - Colores (palette completa)
   - Typography scale
   - Spacing system
   - Component patterns

2. **Reusable Components**:
   - Badge component (urgency levels)
   - Button component (variants)
   - Card component
   - Input component
   - Empty state component

3. **Storybook o Documentation** (opcional):
   - Si hay tiempo, crear página /design-system
   - Mostrar todos los components
   - Live examples

**Referencias**: Todos los anteriores consolidados

**Archivos a crear**:
```
DESIGN_SYSTEM.md (documentación completa)
components/ui/ (si creamos library)
app/[locale]/design-system/page.tsx (opcional)
```

**Deliverables**:
- Design system documentado
- Components reutilizables
- Consistencia visual completa

---

## 🗓️ Timeline Actualizado

```
✅ Sesiones 1-26: Core funcional + Assets
✅ Sesión 27-28: Screenshots + Testing (Documentación)

🎨 REDESIGN PHASE (NUEVAS)
├── Sesión 30: Extension Redesign (Side Panel + Popup)
├── Sesión 31: Landing Page Redesign
├── Sesión 32: Dashboard + Pricing Redesign
└── Sesión 33: Design System Consolidado

📸 FINALIZATION PHASE (POSPUESTAS)
├── Sesión 34: Screenshots (captura real con nuevo diseño)
├── Sesión 35: Testing Multi-plataforma/Idioma (ejecución)
└── Sesión 36: Deployment Chrome Web Store
```

---

## 🎯 Objetivos del Redesign

### Visual
- ✅ Dark mode optimizado (reduce eye strain en videollamadas)
- ✅ Contraste WCAG AA mínimo (AAA preferido)
- ✅ Espaciado consistente (4/8/12/16/24/32px scale)
- ✅ Typography hierarchy clara

### UX
- ✅ Reducir cognitive load (max 3 botones en popup)
- ✅ Feedback visual claro (urgency badges, copy confirmation)
- ✅ Progressive disclosure (solo mostrar lo necesario)
- ✅ Responsive en todos los breakpoints

### Performance
- ✅ CSS optimizado (Tailwind purge)
- ✅ Animaciones performant (transform/opacity only)
- ✅ No layout shifts (dimensions fijas donde sea posible)

---

## 📦 Entregables Finales

Al completar las 4 sesiones de redesign:

1. **Extension completamente rediseñada**:
   - Side panel profesional
   - Popup moderno
   - Consistencia con landing/dashboard

2. **Landing page mejorada**:
   - Hero impactante
   - Profile cards con hover effects
   - CTA con gradients

3. **Dashboard + Pricing profesionales**:
   - Tabla limpia y legible
   - Pricing claro con feature comparison
   - Empty states diseñados

4. **Design system documentado**:
   - Colors, typography, spacing
   - Component library reutilizable
   - Guía de uso para futuros componentes

---

## 🔄 Proceso por Sesión

Cada sesión de redesign seguirá este workflow:

1. **Review research** (5-10 min):
   - Leer patrones de DESIGN_RESEARCH_REFERO.md
   - Identificar referencias clave

2. **Planificación** (10-15 min):
   - Listar archivos a modificar
   - Definir estructura HTML/CSS

3. **Implementación** (90-120 min):
   - Modificar HTML
   - Actualizar CSS con Tailwind
   - Probar en navegador
   - Ajustar spacing/colors

4. **Verificación** (10-15 min):
   - Check contrast ratios
   - Test responsive
   - Validar consistencia

5. **Documentation** (5-10 min):
   - Actualizar PROGRESS.md
   - Commit + push a GitHub

---

## ✅ Checklist Pre-Redesign

Antes de empezar Sesión 30:

- [x] Research de Refero compilado (DESIGN_RESEARCH_REFERO.md)
- [x] Plan de sesiones creado (REDESIGN_PLAN.md)
- [ ] Backend Next.js funcionando (para probar cambios)
- [ ] Extensión cargada en Chrome (para probar side panel/popup)
- [ ] Tailwind CSS configurado correctamente
- [ ] Git branch limpio (main actualizado)

---

**Creado**: Marzo 3, 2026
**Sesiones planificadas**: 4 (30-33)
**Tokens estimados totales**: 150-190K
**Plan compatible con**: Plan 19€ Claude (200K tokens)
