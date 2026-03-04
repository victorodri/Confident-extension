# Screenshots Chrome Web Store — Confident

Esta carpeta contiene los screenshots para la publicación en Chrome Web Store.

## Especificaciones técnicas

**Tamaño recomendado**: 1280x800px (16:10)
**Tamaño mínimo**: 640x400px
**Formato**: PNG o JPEG
**Máximo**: 5 imágenes
**Peso máximo**: 2MB por imagen

---

## Screenshots requeridos

### 1. Panel lateral con sugerencia crítica ⚠️ URGENTE
**Nombre**: `01-panel-lateral-urgencia-critica.png`

**Qué mostrar**:
- Panel lateral abierto en Google Meet
- Sugerencia visible con urgencia 3 (roja) - "🔴 URGENTE"
- Texto de la sugerencia claro y legible
- Indicador "Candidato — Activo" visible
- (Opcional) Parte de la videollamada de fondo

**Cómo capturar**:
1. Abrir Google Meet (puede ser una llamada de prueba o meet.google.com/new)
2. Cargar extensión Confident en Chrome (chrome://extensions → Load unpacked → /extension)
3. Iniciar sesión desde popup (seleccionar perfil "Candidato")
4. Decir algo que genere una sugerencia crítica, por ejemplo:
   - "¿Cuál es tu mayor debilidad?" (pregunta behavioral)
   - "¿Por qué deberíamos contratarte?" (pregunta de cierre)
5. Esperar a que aparezca la sugerencia en el panel
6. CMD+SHIFT+4 (Mac) o Print Screen (Windows)
7. Seleccionar área del panel lateral + parte de Meet
8. Redimensionar a 1280x800px

---

### 2. Dashboard con historial de sesiones
**Nombre**: `02-dashboard-historial.png`

**Qué mostrar**:
- Dashboard completo en localhost:3000/es/dashboard
- Lista de sesiones completadas (mínimo 2-3 sesiones)
- Perfiles variados (Candidato, Vendedor, Defensor)
- Duración de sesiones visible
- Contador de sesiones visible
- (Opcional) Una sesión expandida mostrando transcripción

**Cómo capturar**:
1. Asegurarse de tener mínimo 2-3 sesiones completadas en la base de datos
2. Navegar a http://localhost:3000/es/dashboard
3. CMD+SHIFT+4 (Mac) o Print Screen (Windows)
4. Capturar ventana completa del dashboard
5. Redimensionar a 1280x800px

**Datos de ejemplo sugeridos** (si el dashboard está vacío):
- Crear 3 sesiones manualmente en Supabase con diferentes perfiles
- Insertar transcripciones y sugerencias de ejemplo

---

### 3. Multi-plataforma (Google Meet, Teams, Zoom)
**Nombre**: `03-multi-plataforma.png`

**Qué mostrar**:
- Diseño visual mostrando los 3 logos:
  - 🎥 Google Meet
  - 💼 Microsoft Teams
  - 📹 Zoom
- Texto: "Funciona en tus plataformas favoritas"
- (Opcional) Capturas pequeñas de cada plataforma con Confident activo

**Cómo crear**:
**Opción A - Diseño en Figma/Canva**:
1. Crear canvas 1280x800px
2. Fondo gradiente purple (#8B5CF6 → #6366F1)
3. Añadir logos de Meet, Teams, Zoom (centrados)
4. Texto "Funciona en Google Meet, Microsoft Teams y Zoom"
5. Exportar como PNG

**Opción B - Collage de capturas reales**:
1. Capturar Confident funcionando en Google Meet
2. Capturar Confident funcionando en Microsoft Teams
3. Capturar Confident funcionando en Zoom
4. Combinar las 3 capturas en un collage con Photoshop/Preview
5. Redimensionar a 1280x800px

---

### 4. Perfil personalizado (opcional)
**Nombre**: `04-perfil-personalizado.png`

**Qué mostrar**:
- Página /profile con formulario completo
- Campos rellenados con datos de ejemplo:
  - Descripción: "Desarrollador senior buscando oportunidades en startups"
  - Preocupaciones: "Responder preguntas técnicas complejas con claridad"
  - Objetivos: "Conseguir oferta en empresa con cultura de innovación"
- Diseño limpio y profesional

**Cómo capturar**:
1. Navegar a http://localhost:3000/es/profile
2. Rellenar formulario con datos de ejemplo
3. CMD+SHIFT+4 (Mac) o Print Screen (Windows)
4. Capturar ventana completa
5. Redimensionar a 1280x800px

---

### 5. Privacidad y consentimiento (opcional)
**Nombre**: `05-privacidad-consentimiento.png`

**Qué mostrar**:
- Panel lateral con checkbox de consentimiento visible
- Texto del consentimiento legible:
  - "He informado a los participantes de que esta conversación será transcrita..."
- Campo de emails de participantes (opcional)
- Botón "Iniciar sesión" deshabilitado hasta marcar checkbox
- Badge RGPD visible o texto "RGPD • Solo texto, no audio"

**Cómo capturar**:
1. Abrir panel lateral sin iniciar sesión (estado inicial)
2. Mostrar pantalla de consentimiento
3. CMD+SHIFT+4 (Mac) o Print Screen (Windows)
4. Capturar panel completo
5. Redimensionar a 1280x800px

---

## Herramientas recomendadas

### macOS
- **CMD+SHIFT+4**: Captura de área seleccionada (nativo)
- **CleanShot X**: Capturas profesionales con anotaciones ($29, recomendado)
- **Skitch**: Anotaciones simples (gratis)

### Windows
- **Print Screen**: Captura de pantalla completa (nativo)
- **Snipping Tool**: Captura de área (nativo)
- **ShareX**: Capturas avanzadas con anotaciones (gratis)

### Edición
- **Preview** (Mac): Redimensionar imágenes
- **Photoshop**: Edición avanzada
- **Figma**: Diseño de screenshots compuestos
- **Excalidraw**: Anotaciones minimalistas

---

## Post-procesamiento

Después de capturar los screenshots:

1. **Redimensionar** a 1280x800px exactos:
   ```bash
   sips -z 800 1280 screenshot.png --out screenshot_resized.png
   ```

2. **Optimizar peso** (si >2MB):
   ```bash
   # macOS con ImageOptim
   imageoptim screenshot.png

   # O con pngquant
   pngquant --quality=80-90 screenshot.png
   ```

3. **Anotar** (opcional):
   - Añadir flechas señalando características clave
   - Texto explicativo breve
   - Mantener diseño limpio y profesional

4. **Revisar**:
   - ✅ Dimensiones: 1280x800px
   - ✅ Formato: PNG o JPEG
   - ✅ Peso: <2MB
   - ✅ Sin información sensible (emails reales, nombres, etc.)
   - ✅ UI legible y sin pixelación
   - ✅ Colores correctos (purple #8B5CF6)

---

## Orden sugerido para Chrome Web Store

Los screenshots aparecen en el orden que los subas:

1. **01-panel-lateral-urgencia-critica.png** - Hero shot, muestra el valor principal
2. **02-dashboard-historial.png** - Demuestra funcionalidad completa
3. **03-multi-plataforma.png** - Diferenciador clave (3 plataformas)
4. **04-perfil-personalizado.png** - Personalización avanzada (opcional)
5. **05-privacidad-consentimiento.png** - Confianza y seguridad (opcional)

**Mínimo recomendado**: 3 screenshots (01, 02, 03)
**Óptimo**: 5 screenshots completos

---

## Checklist pre-captura

Antes de empezar a capturar:

- [ ] Backend Next.js corriendo en localhost:3000
- [ ] Extensión cargada en Chrome (chrome://extensions)
- [ ] Base de datos Supabase conectada
- [ ] Mínimo 2-3 sesiones completadas en dashboard
- [ ] Deepgram API key configurada (para transcripciones reales)
- [ ] Google Meet abierto (para screenshot 01)

---

**Última actualización**: Marzo 3, 2026
