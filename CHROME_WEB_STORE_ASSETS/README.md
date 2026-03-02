# Chrome Web Store Assets — Confident

Este directorio contiene todos los assets necesarios para la publicación en Chrome Web Store.

## Assets requeridos

### 1. Iconos de extensión ✅
**Ubicación**: `/extension/icons/`

- ✅ `icon16.png` (16x16px) — Extension management
- ✅ `icon48.png` (48x48px) — Toolbar
- ✅ `icon128.png` (128x128px) — Chrome Web Store listing

**Status**: Existen placeholders. **PENDIENTE** reemplazar con versiones profesionales.

**Cómo generar**: Ver `/ICON_DESIGN_SPECS.md` para especificaciones completas y prompts.

---

### 2. Promotional Tile ⏳
**Archivo**: `promotional-tile.png` (440x280px)

**Descripción**: Banner promocional que aparece en la página de la extensión en Chrome Web Store.

**Diseño**:
- Gradiente purple diagonal (#8B5CF6 → #6366F1)
- Logo "C" grande a la izquierda (160x160px)
- Texto "Confident" + tagline a la derecha
- 3 cards flotantes con colores de urgencia (opcional)

**Status**: ⏳ **PENDIENTE** crear.

**Cómo generar**: Ver `/ICON_DESIGN_SPECS.md` sección "Promotional Tile".

---

### 3. Screenshots (opcional pero recomendado)
**Directorio**: `screenshots/` (máximo 5 imágenes)

**Tamaños aceptados**:
- 1280x800px (recomendado)
- 640x400px (mínimo)

**Screenshots sugeridos**:
1. **Panel lateral activo**: Sugerencia visible con urgencia crítica (roja)
2. **Dashboard**: Historial de sesiones con transcripciones
3. **Multi-plataforma**: Logos de Google Meet, Teams, Zoom
4. **Perfil personalizado**: Página `/profile` con contexto del usuario
5. **Privacidad**: Mensaje de consentimiento + explicación RGPD

**Status**: ⏳ **PENDIENTE** crear.

**Cómo capturar**:
1. Abrir extensión en modo desarrollo
2. Iniciar sesión en Google Meet de prueba
3. Capturar pantalla con CMD+SHIFT+4 (Mac) o Print Screen (Windows)
4. Redimensionar a 1280x800px con Preview o Photoshop
5. Anotar con flechas/texto si es necesario (usar Excalidraw o Figma)

---

## Herramientas recomendadas

### Para iconos
- **Figma**: Diseño manual con control total
- **DALL-E / Midjourney**: Generación IA con prompts
- **Icon Kitchen**: https://icon.kitchen/ (específico para Chrome)

### Para promotional tile
- **Canva**: Templates personalizables
- **Figma**: Diseño desde cero
- **DALL-E**: Generación IA (requiere ajustes post)

### Para screenshots
- **CMD+SHIFT+4** (Mac) o **Print Screen** (Windows)
- **CleanShot X** (Mac) — Capturas profesionales con anotaciones
- **ShareX** (Windows) — Gratis con anotaciones
- **Excalidraw** — Anotaciones simples

---

## Checklist pre-publicación

Antes de enviar a Chrome Web Store, verificar:

- [ ] Iconos 16/48/128 reemplazados con versiones profesionales
- [ ] Promotional tile 440x280 creado
- [ ] Mínimo 1 screenshot (recomendado 3-5)
- [ ] Manifest.json apunta a los iconos correctos ✅
- [ ] Descripción corta (<132 caracteres) lista
- [ ] Descripción detallada lista
- [ ] Política de privacidad publicada (/privacy) ✅
- [ ] Términos de servicio publicados (/terms) ✅
- [ ] Justificación de permisos preparada

---

**Última actualización**: Marzo 2, 2026
