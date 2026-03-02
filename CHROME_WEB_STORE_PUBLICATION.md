# Chrome Web Store Publication Guide — Confident v1.0

**Fecha preparación**: Marzo 2, 2026
**Versión**: 1.0.0
**Status**: Listo para publicación (testing manual pendiente)

---

## 1. Información Básica

### Nombre de la extensión
```
Confident
```

### Descripción corta (132 caracteres máximo)
```
Tu confidente silencioso en videollamadas. Sugerencias IA en tiempo real para entrevistas, ventas y reuniones.
```
**Caracteres**: 127/132 ✅

### Categoría
```
Productivity
```

###Idiomas soportados
```
Español (es)
Inglés (en) — futuro
```

---

## 2. Descripción Detallada (HTML)

```html
<h2>¿Qué es Confident?</h2>
<p>
  <strong>Confident</strong> es tu coach silencioso durante conversaciones importantes.
  Escucha ambas partes de la videollamada, analiza con IA en tiempo real y te muestra
  sugerencias de qué decir ahora mismo — sin interrumpir el flujo natural.
</p>

<h3>✨ Características principales</h3>
<ul>
  <li><strong>Sugerencias IA en tiempo real</strong> — Claude Sonnet 4.5 analiza la conversación y te sugiere qué decir</li>
  <li><strong>3 perfiles especializados</strong>:
    <ul>
      <li><strong>Candidato</strong> — Para entrevistas de trabajo (detecta preguntas behavioral, técnicas, salariales)</li>
      <li><strong>Vendedor</strong> — Para llamadas comerciales (detecta objeciones, señales de compra, momentos de cierre)</li>
      <li><strong>Defensor</strong> — Para reuniones complejas (descompone preguntas, sugiere estructura de respuesta)</li>
    </ul>
  </li>
  <li><strong>Smart cards con urgencia</strong> — Verde (info), Amarillo (importante), Rojo (crítico)</li>
  <li><strong>Personalización IA</strong> — Completa tu perfil y recibe sugerencias adaptadas a tu nivel y preocupaciones</li>
  <li><strong>Dashboard con historial</strong> — Revisa tus sesiones, transcripciones y sugerencias</li>
  <li><strong>Email con transcripción</strong> — Recibe email al finalizar cada sesión</li>
</ul>

<h3>🔒 Privacidad primero</h3>
<ul>
  <li><strong>NO almacenamos audio</strong> — Solo procesamos transcripciones de texto</li>
  <li><strong>Consentimiento obligatorio</strong> — Debes marcar checkbox antes de cada sesión</li>
  <li><strong>Datos cifrados en EU</strong> — Almacenamiento en Supabase (Frankfurt) cumpliendo RGPD</li>
  <li><strong>Derechos ARCO</strong> — Elimina tus datos cuando quieras desde el dashboard</li>
</ul>

<h3>🌐 Plataformas soportadas</h3>
<ul>
  <li>Google Meet (completo)</li>
  <li>Microsoft Teams web (próximamente)</li>
  <li>Zoom web (próximamente)</li>
</ul>

<h3>💎 Modelo freemium</h3>
<ul>
  <li><strong>Anónimo</strong> — 5 sesiones gratuitas sin registro</li>
  <li><strong>Free</strong> — 15 sesiones con cuenta Google</li>
  <li><strong>Pro</strong> — Sesiones ilimitadas</li>
</ul>

<h3>📖 Casos de uso</h3>
<ul>
  <li><strong>Entrevistas de trabajo</strong> — Estructura tus respuestas con STAR, maneja preguntas difíciles</li>
  <li><strong>Llamadas comerciales</strong> — Detecta señales de compra, maneja objeciones con confianza</li>
  <li><strong>Reuniones técnicas</strong> — Comprende preguntas complejas, argumenta con claridad</li>
  <li><strong>Negociaciones</strong> — Mantén tu posición, identifica momentos clave</li>
</ul>

<h3>🚀 Cómo empezar</h3>
<ol>
  <li>Instala la extensión</li>
  <li>Abre Google Meet (cualquier reunión)</li>
  <li>Clic en el icono de Confident → Selecciona perfil (Candidato/Vendedor/Defensor)</li>
  <li>Marca checkbox de consentimiento</li>
  <li>Clic "Iniciar sesión"</li>
  <li>Habla con confianza — las sugerencias aparecerán en el panel lateral</li>
</ol>

<h3>🔗 Enlaces importantes</h3>
<ul>
  <li><a href="https://tryconfident.vercel.app/privacy" target="_blank">Política de Privacidad</a></li>
  <li><a href="https://tryconfident.vercel.app/terms" target="_blank">Términos de Servicio</a></li>
  <li><a href="https://tryconfident.vercel.app" target="_blank">Sitio Web</a></li>
</ul>

<h3>📧 Soporte</h3>
<p>
  ¿Dudas o problemas? Escríbenos a <strong>hola@tryconfident.com</strong>
</p>

<hr>

<p style="text-align: center; color: #666; font-size: 12px;">
  Confident v1.0 — Tu confidente en cada conversación importante<br>
  RGPD Compliant • Solo texto, no audio • Datos cifrados en EU
</p>
```

---

## 3. Justificación de Permisos

Chrome Web Store requiere justificar cada permiso solicitado. Aquí están las justificaciones:

### Permission: `tabCapture`
**Justificación**:
```
Necesario para capturar el audio de la videollamada (Google Meet) en tiempo real.
Este permiso permite escuchar ambas partes de la conversación (usuario y otros participantes)
para poder analizar el contexto completo con IA y generar sugerencias relevantes.

El audio NO se almacena — solo se procesa en streaming vía Deepgram (transcripción)
y se descarta inmediatamente. Solo guardamos transcripciones de texto.
```

### Permission: `storage`
**Justificación**:
```
Necesario para guardar:
- ID anónimo del usuario (UUID) para tracking de sesiones gratuitas
- Preferencias del perfil seleccionado (Candidato/Vendedor/Defensor)
- Estado de la sesión activa (session_id, contador de sugerencias)
- Contexto personalizado del usuario (descripción, preocupaciones, objetivos)

Datos almacenados localmente en chrome.storage.local y chrome.storage.session
(se borran al cerrar sesión o desinstalar la extensión).
```

### Permission: `sidePanel`
**Justificación**:
```
Necesario para mostrar el panel lateral con las sugerencias IA en tiempo real.
El side panel permite que el usuario vea las recomendaciones sin interrumpir
la pantalla de la videollamada (no bloquea la vista de Google Meet).

Este permiso es esencial para la funcionalidad core de la extensión.
```

### Permission: `scripting`
**Justificación**:
```
Necesario para detectar cuando el usuario está en una videollamada de Google Meet
y activar la funcionalidad de la extensión solo en esos contextos.

Se usa para:
- Inyectar content script en meet.google.com
- Detectar estado de la llamada (activa/inactiva)
- Enviar mensajes entre background.js y content-script.js
```

### Permission: `offscreen`
**Justificación**:
```
Necesario para procesar el audio en un documento offscreen, ya que los Service Workers
(background.js en MV3) no tienen acceso a Web Audio API.

El offscreen document maneja:
- Mezcla de streams de audio (tab + micrófono)
- Envío a Deepgram vía WebSocket para transcripción
- Pipeline de audio en tiempo real

Sin este permiso, la extensión NO puede funcionar en Chrome MV3.
```

### Permission: `activeTab`
**Justificación**:
```
Necesario para:
- Verificar que el usuario está en meet.google.com antes de permitir iniciar sesión
- Obtener información de la tab activa (URL, título) para contexto
- Abrir el side panel en la tab correcta

Se usa solo cuando el usuario interactúa con el popup de la extensión.
```

### Host Permission: `https://meet.google.com/*`
**Justificación**:
```
La extensión SOLO funciona en Google Meet. Este host permission permite:
- Inyectar content-script.js para detectar estado de la llamada
- Capturar audio de la videollamada (requiere estar en el dominio específico)
- Mostrar el side panel en el contexto correcto

No solicitamos acceso a otros dominios para proteger la privacidad del usuario.
```

### Host Permission: `https://tryconfident.vercel.app/*`
**Justificación**:
```
Necesario para comunicarse con el backend de Confident (Next.js desplegado en Vercel).
La extensión hace llamadas API a:
- /api/analyze → Análisis IA de transcripciones
- /api/usage → Contador de sesiones gratuitas
- /api/session → Crear/cerrar sesiones
- /api/profile/context → Obtener contexto personalizado del usuario

Sin acceso a este dominio, la extensión NO puede funcionar.
```

### Host Permission: `http://localhost:3000/*`
**Justificación**:
```
SOLO para desarrollo local (testing). Permite probar la extensión con el servidor
Next.js corriendo localmente antes de desplegar a producción.

NOTA: Este permiso se PUEDE remover en la versión publicada si Chrome no lo permite.
En ese caso, el desarrollo se haría con el dominio de producción.
```

---

## 4. Screenshots (Requerido para publicación)

**Tamaño**: 1280x800px (o 640x400px mínimo)
**Máximo**: 5 screenshots
**Formato**: PNG o JPG

### Screenshots sugeridos:

#### Screenshot 1: Panel lateral con sugerencia activa
**Nombre**: `screenshot-1-panel-active.png`
**Descripción**: "Panel lateral mostrando sugerencia IA en tiempo real durante videollamada"
**Elementos a capturar**:
- Google Meet de fondo
- Side panel visible a la derecha
- Card de sugerencia con urgencia crítica (roja) visible
- Badge "🔴 URGENTE"
- Texto de sugerencia legible

#### Screenshot 2: Dashboard con historial
**Nombre**: `screenshot-2-dashboard.png`
**Descripción**: "Dashboard con historial de sesiones y transcripciones"
**Elementos a capturar**:
- Lista de sesiones completadas
- Transcripciones visibles
- Sugerencias con colores de urgencia
- Botón "Ver resumen IA"

#### Screenshot 3: Perfil personalizado
**Nombre**: `screenshot-3-profile.png`
**Descripción**: "Personaliza tu perfil para recibir sugerencias adaptadas"
**Elementos a capturar**:
- Página `/profile`
- 3 campos de texto (descripción, preocupaciones, objetivos)
- Botón "Guardar cambios"

#### Screenshot 4: Contador de sesiones
**Nombre**: `screenshot-4-counter.png`
**Descripción**: "Modelo freemium con contador de sesiones gratuitas"
**Elementos a capturar**:
- Footer del panel con contador visible
- Texto "X sesiones gratuitas. Regístrate para 10 más"

#### Screenshot 5: Privacidad y consentimiento
**Nombre**: `screenshot-5-privacy.png`
**Descripción**: "Consentimiento obligatorio antes de cada sesión"
**Elementos a capturar**:
- Checkbox de consentimiento marcado
- Texto del consentimiento legible
- Botón "Iniciar sesión" habilitado

**⏳ Status**: Pendiente capturar (requiere servidor + extensión cargada)

**Ubicación**: Guardar en `/CHROME_WEB_STORE_ASSETS/screenshots/`

---

## 5. Iconos (Requerido)

**Status actual**:
- ✅ Manifest configurado con rutas correctas
- ✅ Placeholders existentes en `/extension/icons/`
- ⏳ **PENDIENTE**: Reemplazar con versiones profesionales

**Iconos requeridos**:
- `icon16.png` (16x16px) → Extension management
- `icon48.png` (48x48px) → Toolbar
- `icon128.png` (128x128px) → Chrome Web Store listing

**Promotional Tile** (opcional pero recomendado):
- `promotional-tile.png` (440x280px) → Banner en Chrome Web Store

**Instrucciones**:
Ver `/ICON_DESIGN_SPECS.md` para especificaciones completas y prompts para generadores IA.

---

## 6. Checklist Pre-Publicación

### Código
- [x] ✅ Versión bumped a 1.0.0 (manifest.json)
- [x] ✅ Descripción mejorada en manifest.json
- [x] ✅ Todos los endpoints API implementados
- [x] ✅ Smart cards logic correcta
- [x] ✅ XSS protection implementada
- [x] ✅ User context personalización funcionando
- [ ] ⏳ Testing manual completado (>90% pasado)
- [ ] ⏳ No console errors en flujo normal

### Assets
- [x] ✅ Especificaciones de diseño completas
- [ ] ⏳ Iconos profesionales generados
- [ ] ⏳ Promotional tile creado
- [ ] ⏳ Screenshots capturados (mínimo 1)

### Legal
- [x] ✅ Política de privacidad publicada (/privacy)
- [x] ✅ Términos de servicio publicados (/terms)
- [x] ✅ Footer links funcionando
- [x] ✅ RGPD compliant

### Documentación
- [x] ✅ Descripción corta (<132 chars)
- [x] ✅ Descripción detallada (HTML)
- [x] ✅ Justificación de permisos
- [x] ✅ Screenshots sugeridos documentados

---

## 7. Proceso de Publicación

### Paso 1: Crear cuenta Developer
1. Ir a https://chrome.google.com/webstore/devconsole
2. Login con cuenta Google
3. Pagar $5 one-time developer fee

### Paso 2: Empaquetar extensión
```bash
cd extension/
zip -r confident-v1.0.0.zip * -x "*.DS_Store" -x "node_modules/*"
```

**Archivos a incluir en ZIP**:
```
manifest.json
background.js
content-script.js
offscreen.js
offscreen.html
config.js
constants.js
logger.js
device-fingerprint.js
icons/
  ├── icon16.png
  ├── icon48.png
  └── icon128.png
side-panel/
  ├── panel.html
  ├── panel.js
  └── panel.css
popup/
  ├── popup.html
  ├── popup.js
  └── popup.css
```

### Paso 3: Subir a Chrome Web Store
1. Developer Dashboard → "New Item"
2. Upload `confident-v1.0.0.zip`
3. Completar formulario:
   - **Product name**: Confident
   - **Summary**: (Descripción corta arriba)
   - **Description**: (Descripción detallada HTML arriba)
   - **Category**: Productivity
   - **Language**: Spanish
   - **Icon**: Upload icon128.png
   - **Screenshots**: Upload 1-5 PNG (1280x800)
   - **Promotional tile**: Upload promotional-tile.png (opcional)
   - **Privacy policy URL**: `https://tryconfident.vercel.app/privacy`
   - **Terms of service URL**: `https://tryconfident.vercel.app/terms`

4. Permissions → Justification:
   - Copiar justificaciones de la sección 3 arriba

5. Click "Submit for review"

### Paso 4: Revisión de Chrome
- Tiempo estimado: **1-7 días**
- Posibles resultados:
  - ✅ **Aprobado** → Extensión publicada
  - ❌ **Rechazado** → Fix issues y resubmit
  - ⚠️ **Requiere aclaraciones** → Responder a Chrome team

### Paso 5: Post-publicación
1. Verificar extensión visible en Chrome Web Store
2. Probar instalación desde store
3. Monitorear reviews y feedback
4. Documentar en PROGRESS.md

---

## 8. URLs Finales

### Extensión publicada (post-approval)
```
https://chrome.google.com/webstore/detail/confident/[ID-GENERADO-POR-CHROME]
```

### Landing page
```
https://tryconfident.vercel.app
```

### Dashboard
```
https://tryconfident.vercel.app/dashboard
```

### Legal
```
https://tryconfident.vercel.app/privacy
https://tryconfident.vercel.app/terms
```

---

## 9. Métricas de Éxito (Post-lanzamiento)

### Semana 1
- [ ] Instalaciones: Meta 100+
- [ ] Reviews promedio: Meta 4.0+ estrellas
- [ ] Sesiones completadas: Meta 200+
- [ ] Conversión anónimo → Free: Meta 20%

### Mes 1
- [ ] Instalaciones: Meta 500+
- [ ] Usuarios activos semanales: Meta 100+
- [ ] Conversión Free → Pro: Meta 5%

### Tracking
Usar Posthog EU para analíticas:
- `extension_installed`
- `session_started`
- `suggestion_shown`
- `paywall_soft_shown` / `paywall_soft_converted`
- `payment_cta_clicked`

---

## 10. Roadmap Post-Publicación (v1.1)

### Prioridad Alta
- [ ] Multi-platform (Teams, Zoom)
- [ ] Testing E2E automatizado (Playwright)
- [ ] Onboarding mejorado (tooltips, tutorial)

### Prioridad Media
- [ ] Idioma inglés
- [ ] Modo practice (simulaciones sin llamada real)
- [ ] Analytics dashboard para usuarios

### Prioridad Baja
- [ ] Integración Stripe activa
- [ ] API pública para desarrolladores
- [ ] Soporte empresarial (SSO, facturación por equipo)

---

**Última actualización**: Marzo 2, 2026
**Versión**: 1.0.0
**Status**: ✅ Documentación completa — Listo para testing manual y publicación
