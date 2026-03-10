# Icon Design Specifications — Confident

## Brand Identity
- **Nombre**: Confident
- **Propósito**: Asistente IA silencioso para videollamadas
- **Valores**: Confianza, profesionalismo, discreción, inteligencia

## Concept Visual

### Símbolo principal: "C" + AI Assistant
- **Forma base**: Letra "C" de Confident estilizada
- **Elemento secundario**: Marca de diálogo/conversación o brain/chip element
- **Estilo**: Moderno, minimalista, premium (inspiración Apple/Wispr Flow)

### Paleta de colores
```
Gradiente Purple (principal):
- #8B5CF6 (Purple 500) → #6366F1 (Indigo 500)
- Alternativa: #7C3AED (Violet 600) → #8B5CF6 (Purple 500)

Fondo:
- Blanco puro #FFFFFF (para iconos sobre fondos claros)
- Transparente con sombra suave (para adaptabilidad)

Acentos (opcional):
- #10B981 (Green 500) para elemento de "activo/inteligente"
- #F59E0B (Amber 500) para alertas/urgencia
```

## Especificaciones técnicas

### icon128.png (Master icon)
```
Dimensiones: 128 x 128 px
Formato: PNG con transparencia
DPI: 72 (web)

Diseño:
- Padding interno: 12px desde el borde
- Área de diseño efectiva: 104 x 104 px
- Corner radius: 24px (estilo iOS app icon, pero adaptado)
- Sombra: 0 4px 12px rgba(139, 92, 246, 0.25)

Elementos:
1. Fondo: Gradiente radial purple
   - Centro: #A78BFA (lighter purple)
   - Borde: #7C3AED (darker purple)

2. Símbolo principal: "C" mayúscula
   - Font: SF Pro Rounded Bold o similar
   - Color: #FFFFFF (white)
   - Tamaño: ~70% del área efectiva
   - Grosor: 10-12px

3. Elemento secundario (opcional):
   - Pequeño icono de chat bubble o sparkle/star (⭐) en esquina superior derecha
   - Color: #10B981 (green) o #F59E0B (amber)
   - Tamaño: 24x24px
   - Posición: +8px desde esquina
```

### icon48.png (Toolbar icon)
```
Dimensiones: 48 x 48 px
Formato: PNG con transparencia

Simplificación del master:
- Mismo concepto visual pero más simple
- Padding: 4px
- Área efectiva: 40 x 40 px
- Corner radius: 8px
- Símbolo "C" más grueso: 14-16px stroke
- Sin elemento secundario si dificulta legibilidad
```

### icon16.png (Extension management)
```
Dimensiones: 16 x 16 px
Formato: PNG con transparencia

Máxima simplificación:
- Padding: 2px
- Área efectiva: 12 x 12 px
- Solo "C" simplificada o círculo con gradiente
- Sin detalles pequeños
- Alto contraste
```

### Promotional Tile 440x280 (Chrome Web Store)
```
Dimensiones: 440 x 280 px (ratio 11:7)
Formato: PNG

Diseño:
- Fondo: Gradiente purple diagonal
  - Top-left: #8B5CF6
  - Bottom-right: #6366F1

- Logo grande: Versión del icon128 escalada
  - Posición: Centrado verticalmente, alineado a la izquierda (80px desde borde)
  - Tamaño: 160 x 160 px

- Texto principal: "Confident"
  - Posición: Centrado verticalmente, a la derecha del logo
  - Font: SF Pro Display Bold o Inter Bold
  - Size: 48px
  - Color: #FFFFFF
  - Letter spacing: -1px

- Texto secundario: "Tu confidente en cada conversación"
  - Posición: Debajo del título
  - Font: SF Pro Text Regular o Inter Regular
  - Size: 18px
  - Color: #FFFFFF con 80% opacity
  - Line height: 1.4

- Elemento visual: 3 cards de sugerencia pequeñas flotando (opcional)
  - Posición: Esquina inferior derecha
  - Efecto: Blur backdrop, semi-transparente
  - Colores: Verde (info), Amarillo (importante), Rojo (crítico)
```

## Prompts para generadores IA

### Prompt para icon128.png (DALL-E, Midjourney, etc.)
```
Modern minimalist app icon for AI conversation assistant.
Purple gradient background (#8B5CF6 to #6366F1), radial gradient from center.
White bold letter "C" in center, rounded sans-serif font, 10px stroke weight.
Small green sparkle or star accent in top-right corner.
Soft shadow underneath. Rounded corners (24px radius).
Clean, professional, Apple-style design. 128x128px, transparent PNG.
Flat design, no 3D effects, no text besides the C.
```

### Prompt para Promotional Tile 440x280
```
Chrome extension promotional banner. 440x280px.
Purple gradient background diagonal (#8B5CF6 to #6366F1).
Left side: Large white "C" icon with soft shadow, 160px.
Right side: "Confident" in white bold text (48px) with subtitle
"Tu confidente en cada conversación" in light text below.
3 small floating cards in bottom-right with green, yellow, red accents.
Clean, modern, professional SaaS aesthetic. Apple-inspired minimalism.
```

## Herramientas recomendadas

### Opción 1: Figma (manual, más control)
1. Crear artboard 128x128px
2. Dibujar gradiente radial purple
3. Añadir texto "C" con SF Pro Rounded Bold
4. Añadir sombra con blur
5. Exportar PNG 1x, 2x, 3x
6. Redimensionar para 48px y 16px

### Opción 2: Generador IA
1. Usar prompt arriba en DALL-E / Midjourney / Leonardo.ai
2. Descargar PNG
3. Redimensionar con Photoshop/Figma/Pixelmator

### Opción 3: Icon generator online
- https://icon.kitchen/ (Chrome extension icons)
- https://www.figma.com/community/plugin/735098390272716381/iconify
- https://realfavicongenerator.net/

## Archivos a reemplazar

```bash
extension/icons/icon16.png   # 16x16px
extension/icons/icon48.png   # 48x48px
extension/icons/icon128.png  # 128x128px
```

## Archivo nuevo a crear

```bash
CHROME_WEB_STORE_ASSETS/promotional-tile.png  # 440x280px
```

---

**Última actualización**: Marzo 2, 2026
**Versión**: 1.0
**Status**: Especificaciones completas — listo para implementación
