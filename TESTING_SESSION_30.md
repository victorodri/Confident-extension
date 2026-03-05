# Testing Session 30 - Redesign Dark Mode + Integración Popup → Side Panel

## ✅ Pre-requisitos

- [ ] Backend Next.js corriendo en `http://localhost:3000`
- [ ] Chrome abierto
- [ ] Extensión cargada en `chrome://extensions`

---

## 📋 Test 1: Recargar Extensión

**Objetivo**: Verificar que no hay errores en la consola de la extensión

### Pasos:
1. Abrir `chrome://extensions` en Chrome
2. Buscar "Confident" en la lista
3. Click en el botón **Reload** (icono de recarga circular)
4. Click en **"Errors"** (si aparece el botón, hay errores)

### ✅ Resultado esperado:
- NO debe aparecer botón "Errors"
- Estado de la extensión debe ser "On"
- Manifest V3 sin warnings

### 🐛 Si hay errores:
- Copiar el mensaje de error completo
- Verificar que todos los archivos existen en `extension/`

---

## 📋 Test 2: Abrir Side Panel (Click en Icono)

**Objetivo**: Verificar que el popup ya no existe y se abre el side panel directamente

### Pasos:
1. Click en el **icono de Confident** en la barra de herramientas de Chrome
   - Si no está visible: click en el icono de puzzle 🧩 y pin Confident

### ✅ Resultado esperado:
- Se abre el **Side Panel** a la derecha (NO un popup pequeño)
- El panel muestra la vista de "Selección de Perfil"
- Fondo: Dark mode (slate-900 #0f172a)

### 🐛 Si aparece popup:
- Verificar que `manifest.json` NO tiene `default_popup`
- Verificar que `background.js` tiene listener `chrome.action.onClicked`

---

## 📋 Test 3: Vista de Selección de Perfil (Dark Mode)

**Objetivo**: Verificar diseño visual dark mode y colores WCAG AA

### Elementos a verificar:

#### Header
- [ ] Logo "Confident" visible (texto cyan claro)
- [ ] Selector de idioma (🇪🇸 ES / 🇬🇧 EN) funcionando
- [ ] Status dot: color gris (sin sesión activa)
- [ ] Texto "Sin sesión activa" en slate-400

#### Warning "No estás en plataforma" (si NO estás en Meet/Teams/Zoom)
- [ ] Banner con ⚠️ visible
- [ ] Fondo: slate-800 (más claro que el fondo base)
- [ ] Texto legible con buen contraste

#### Selección de Perfil
- [ ] Título "Selecciona tu perfil" en slate-300 (texto claro)
- [ ] 3 botones: Candidato 🎯 / Vendedor 💼 / Defensor 🛡️
- [ ] Botones con fondo slate-800, borde slate-700
- [ ] Hover: background cambia a slate-700
- [ ] Click en un perfil → borde cyan-600 + background slate-700

#### Checkbox Consentimiento (aparece después de seleccionar perfil)
- [ ] Checkbox funcional
- [ ] Texto legible con contraste correcto
- [ ] Fondo: slate-800

#### Input Emails (aparece después de seleccionar perfil)
- [ ] Input con placeholder visible
- [ ] Fondo: slate-800
- [ ] Borde: slate-700
- [ ] Focus: borde cyan-600

#### Botón "Iniciar sesión"
- [ ] Deshabilitado inicialmente (gris opaco)
- [ ] Después de seleccionar perfil + check consentimiento: **habilitado**
- [ ] Color: cyan-700 (background), texto blanco
- [ ] Hover: cyan-600 (más claro)

#### Footer Contador de Sesiones
- [ ] Aparece al fondo
- [ ] Texto: "5 sesiones disponibles" (si eres anónimo)
- [ ] Color: slate-400

---

## 📋 Test 4: Abrir Google Meet y Verificar Plataforma

**Objetivo**: Verificar detección de plataforma

### Pasos:
1. En otra pestaña, abrir `https://meet.google.com`
2. Crear o unirse a una reunión
3. Volver al Side Panel de Confident

### ✅ Resultado esperado:
- Warning "⚠️ Abre una videollamada en..." debe **desaparecer**
- Botones de perfil deben estar habilitados
- Botón "Iniciar sesión" debe funcionar

---

## 📋 Test 5: Iniciar Sesión (Flujo Completo)

**Objetivo**: Verificar transición de Vista 1 → Vista 2

### Pasos:
1. Estar en Google Meet (reunión activa)
2. Seleccionar perfil (ej: Candidato)
3. Check en consentimiento ✅
4. (Opcional) Añadir email: `test@ejemplo.com`
5. Click en **"Iniciar sesión"**

### ✅ Resultado esperado:
- Vista de selección de perfil desaparece
- Aparece **Vista de Sesión Activa**:
  - Estado: "Escuchando..." con animación de 3 puntos cyan pulsando
  - Fondo: dark mode slate-900
  - Header sigue visible con status dot **verde** (activo)

### 🐛 Si falla:
- Abrir DevTools (`F12`) → Console
- Buscar errores en rojo
- Verificar que el backend está corriendo (`npm run dev`)

---

## 📋 Test 6: Vista Sesión Activa (Dark Mode)

**Objetivo**: Verificar diseño de la vista activa y sugerencias

### Header (mismo que antes)
- [ ] Status dot: **verde** pulsando
- [ ] Texto: "Sesión activa" (en vez de "Sin sesión activa")

### Estado Escuchando
- [ ] 3 puntos cyan animándose (pulsando)
- [ ] Texto "Escuchando..." en slate-400

### Sugerencias (si hay actividad de audio)
- [ ] Cards aparecen con animación slide-in
- [ ] Fondo de card: slate-800
- [ ] Borde izquierdo de colores según urgencia:
  - Verde (emerald-500): Urgency 1 - Info
  - Amarillo (amber-500): Urgency 2 - Important
  - Rojo (red-500): Urgency 3 - Critical
- [ ] Badge de urgencia visible (🟢 INFO / 🟡 IMPORTANTE / 🔴 URGENTE)
- [ ] Texto de sugerencia legible (slate-300)
- [ ] Contexto en texto secundario (slate-400)

### Historial de Sesión (colapsado)
- [ ] Botón "▸ Historial de sesión" visible
- [ ] Click expande/colapsa
- [ ] Lista de sugerencias anteriores visible cuando expandido

### Botón "He terminado esta reunión"
- [ ] Visible al fondo
- [ ] Fondo: slate-800
- [ ] Hover: slate-700
- [ ] Texto con ✓ y "He terminado esta reunión"

---

## 📋 Test 7: Contrast Ratios (Opcional pero Recomendado)

**Objetivo**: Verificar visualmente que los textos son legibles

### Herramienta:
- Extensión Chrome: "WCAG Color contrast checker"
- O usar inspector manual

### Elementos a verificar:
- [ ] Texto principal (slate-300) sobre fondo (slate-900): **12.02:1** ✅ AAA
- [ ] Texto secundario (slate-400) sobre fondo (slate-900): **6.96:1** ✅ AA
- [ ] Texto botón (blanco) sobre cyan-700: **5.36:1** ✅ AA

---

## 📋 Test 8: Terminar Sesión

**Objetivo**: Verificar transición Vista 2 → Vista 1

### Pasos:
1. Click en **"He terminado esta reunión"**

### ✅ Resultado esperado:
- Se abre nueva pestaña con Dashboard (`http://localhost:3000/es/dashboard`)
- Side Panel vuelve a **Vista de Selección de Perfil**
- Status dot vuelve a **gris** (sin sesión)
- Contador de sesiones se actualiza: "4 sesiones disponibles"

---

## 📋 Test 9: Selector de Idioma

**Objetivo**: Verificar que las traducciones funcionan

### Pasos:
1. Cambiar selector de idioma: ES → EN
2. Verificar textos traducidos:
   - "Selecciona tu perfil" → "Select your profile"
   - "Candidato" → "Candidate"
   - "Iniciar sesión" → "Start session"

### ✅ Resultado esperado:
- Todos los textos cambian al idioma seleccionado
- Idioma se guarda en `chrome.storage.local`

---

## 🐛 Checklist de Errores Comunes

### Si el panel no se abre:
- [ ] Verificar que `manifest.json` NO tiene `default_popup`
- [ ] Verificar que `background.js` tiene `chrome.action.onClicked`
- [ ] Recargar extensión en `chrome://extensions`

### Si el diseño no es dark mode:
- [ ] Verificar que `panel.css` fue actualizado
- [ ] Inspeccionar elemento y verificar variables CSS `:root`
- [ ] Verificar que `panel.html` tiene `<link rel="stylesheet" href="panel.css" />`

### Si el botón "Iniciar" no funciona:
- [ ] Verificar que estás en Google Meet
- [ ] Verificar que seleccionaste un perfil
- [ ] Verificar que marcaste el checkbox de consentimiento
- [ ] Abrir Console (`F12`) y buscar errores

### Si las sugerencias no aparecen:
- [ ] Verificar que el backend está corriendo (`npm run dev`)
- [ ] Verificar que hay audio en la reunión
- [ ] Verificar Console del background script:
  - `chrome://extensions` → Confident → "service worker" link

---

## ✅ Resultados del Testing

### Funcionamiento General:
- [ ] ✅ Extensión carga sin errores
- [ ] ✅ Side panel se abre al click en icono
- [ ] ✅ Vista de selección funciona correctamente
- [ ] ✅ Transición a vista activa funciona
- [ ] ✅ Sugerencias aparecen con diseño dark mode
- [ ] ✅ Terminar sesión vuelve a vista inicial

### Diseño Visual (Dark Mode):
- [ ] ✅ Colores Slate/Cyan aplicados
- [ ] ✅ Contraste WCAG AA verificado
- [ ] ✅ Animaciones funcionando
- [ ] ✅ Urgency badges con colores correctos

### Bugs Encontrados:
- [ ] Ninguno (ideal)
- [ ] Lista de bugs si hay

---

## 📝 Próximos Pasos

Si el testing es exitoso:
1. ✅ Actualizar PROGRESS.md con Sesión 30 completada
2. ✅ Planificar Sesión 31 (siguiente mejora)

Si hay bugs:
1. Documentar en PROGRESS.md
2. Priorizar fixes críticos
3. Crear nuevas tareas en TodoWrite

---

**Fecha**: 5 marzo 2026
**Sesión**: 30 - Redesign Dark Mode Refero
**Commits**: 2 (integración + redesign CSS)
