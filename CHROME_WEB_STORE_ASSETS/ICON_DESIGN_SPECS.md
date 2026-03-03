# Icon Design Specifications — Confident

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| **Purple Principal** | `#8B5CF6` | Fondo principal, gradientes |
| **Purple Oscuro** | `#6366F1` | Segundo color gradiente, sombras |
| **Blanco** | `#FFFFFF` | Iconografía, texto sobre purple |
| **Verde (Urgencia 1)** | `#10B981` | Info, no urgente |
| **Amarillo (Urgencia 2)** | `#F59E0B` | Importante |
| **Rojo (Urgencia 3)** | `#EF4444` | Crítico |

---

## Iconos de extensión

### icon16.png (16x16px)
**Uso**: Extension management, barra de herramientas small

**Diseño**:
- Fondo: Purple sólido (`#8B5CF6`)
- Símbolo: Letra "C" blanca, bold, centrada
- Alternativa: Bocadillo de conversación minimalista

**Prompt IA**:
```
"Simple app icon 16x16px, letter C in white on purple background #8B5CF6,
flat design, no gradients, high contrast, modern sans-serif font,
centered, minimal padding"
```

---

### icon48.png (48x48px)
**Uso**: Toolbar, extension details page

**Diseño**:
- Fondo: Gradiente radial purple (`#8B5CF6` centro → `#6366F1` bordes)
- Símbolo: Letra "C" blanca estilizada con pequeño detalle de ondas de sonido
- Bordes redondeados (border-radius: 12px)

**Prompt IA**:
```
"Modern app icon 48x48px, white letter C on purple gradient background
(#8B5CF6 to #6366F1), subtle sound wave accent, rounded corners,
flat design, professional, conversation assistant theme"
```

---

### icon128.png (128x128px)
**Uso**: Chrome Web Store listing, main promotional icon

**Diseño**:
- Fondo: Gradiente diagonal purple (`#8B5CF6` top-left → `#6366F1` bottom-right)
- Símbolo central: Letra "C" grande blanca con sombra suave
- Detalle: 3 ondas de sonido pequeñas en el lado derecho (simbolizando escucha)
- Bordes redondeados (border-radius: 24px)
- Sombra exterior: rgba(139, 92, 246, 0.3), blur 8px

**Prompt IA**:
```
"Professional app icon 128x128px for Chrome extension, large white letter C
on purple diagonal gradient (#8B5CF6 to #6366F1), subtle sound waves on right,
rounded corners, soft shadow, modern flat design, conversation coach assistant,
minimalist, high quality"
```

**Especificaciones técnicas**:
- Formato: PNG 24-bit con transparencia
- Dimensiones exactas: 128x128px
- DPI: 72 (web standard)
- Espacio de color: sRGB

---

## Promotional Tile

### promotional-tile.png (440x280px)
**Uso**: Banner promocional en Chrome Web Store listing page

**Diseño sugerido**:

**Layout**:
```
┌────────────────────────────────────────┐
│  [Logo C]    Confident                  │
│   160px      Tu confidente en cada      │
│              conversación importante    │
│                                         │
│   [Card 🟢]  [Card 🟡]  [Card 🔴]      │
│   "Listo"   "Importante" "¡Urgente!"    │
└────────────────────────────────────────┘
```

**Elementos**:

1. **Fondo**: Gradiente diagonal purple (`#8B5CF6` → `#6366F1`)

2. **Logo izquierda** (160x160px):
   - Letra "C" grande blanca
   - Ondas de sonido sutiles
   - Centrado verticalmente

3. **Texto derecha** (top):
   - "Confident" — 48px, bold, blanco
   - "Tu confidente en cada conversación importante" — 18px, regular, blanco 90% opacity

4. **Cards flotantes** (bottom) — opcional:
   - 3 mini-cards con colores de urgencia
   - Verde: "Listo" (Info)
   - Amarillo: "Importante" (Warning)
   - Rojo: "¡Urgente!" (Critical)
   - Sombra suave para efecto flotante

**Prompt IA**:
```
"Professional Chrome extension promotional banner 440x280px,
purple gradient background (#8B5CF6 to #6366F1),
large white letter C logo on left,
'Confident' title and 'Your confident in every conversation' tagline in white on right,
three floating card elements at bottom (green, yellow, red),
modern flat design, clean, minimalist, professional"
```

**Especificaciones técnicas**:
- Formato: PNG 24-bit
- Dimensiones exactas: 440x280px
- DPI: 72
- Espacio de color: sRGB
- Peso máximo: 1MB (Chrome Web Store limit)

---

## Tipografía

**Fuente recomendada**: Inter, San Francisco, o similar sans-serif moderna

**Weights**:
- Bold (700): Títulos, letra "C"
- Regular (400): Descripciones, taglines

---

## Herramientas de generación

### Opción 1: Generador IA (DALL-E, Midjourney)
**Pros**: Rápido, profesional
**Cons**: Requiere iteraciones, ajustes en Figma/Photoshop post-generación

**Workflow**:
1. Usar prompts de arriba en DALL-E o Midjourney
2. Generar 3-4 variantes
3. Seleccionar la mejor
4. Ajustar dimensiones exactas en Photoshop/Figma
5. Exportar como PNG optimizado

---

### Opción 2: Diseño manual en Figma
**Pros**: Control total, editable, escalable
**Cons**: Requiere tiempo y habilidades de diseño

**Workflow**:
1. Crear frames de 16x16, 48x48, 128x128, 440x280
2. Añadir gradientes purple
3. Crear letra "C" con tipografía Inter Bold
4. Añadir ondas de sonido con Pen tool
5. Aplicar sombras y efectos
6. Exportar como PNG @1x

**Template Figma**: https://www.figma.com/community/file/chrome-extension-icons (buscar templates similares)

---

### Opción 3: Icon Kitchen (específico Chrome)
**URL**: https://icon.kitchen/

**Pros**: Diseñado específicamente para Chrome Web Store, genera todos los tamaños automáticamente
**Cons**: Menos personalización que Figma

**Workflow**:
1. Subir logo o letra "C" en SVG/PNG
2. Seleccionar paleta purple
3. Ajustar padding y background
4. Descargar pack completo (16/48/128)

---

## Checklist de calidad

Antes de usar los assets, verificar:

- [ ] Dimensiones exactas (16x16, 48x48, 128x128, 440x280)
- [ ] Formato PNG 24-bit con transparencia (si aplica)
- [ ] Colores purple consistentes con paleta
- [ ] Letra "C" legible en todos los tamaños
- [ ] Sin pixelación o bordes dentados
- [ ] Peso de archivo optimizado (<100KB por ícono, <1MB promotional tile)
- [ ] Probado en Chrome con extensión cargada (chrome://extensions)
- [ ] Visible en tema claro y oscuro de Chrome

---

## Referencias visuales

**Inspiración de otros coaches IA**:
- Grammarly: Verde minimalista
- Notion AI: Gradiente purple/pink
- Otter.ai: Ondas de sonido + letra
- Jasper: Purple moderno

**Estilo objetivo**: Minimalista, profesional, confiable, discreto

---

**Creado**: Marzo 3, 2026
**Versión**: 1.0
**Última actualización**: Marzo 3, 2026
