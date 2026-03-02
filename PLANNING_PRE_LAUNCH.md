# Planning Pre-Lanzamiento — Confident v1.0

**Fecha**: Marzo 2, 2026
**Objetivo**: Multi-plataforma + Multi-idioma antes de publicar en Chrome Web Store

---

## Cambio de Plan

**ANTES del plan anterior** (assets → testing → publicar), debemos implementar:
1. **Multi-plataforma**: Google Meet, Microsoft Teams, Zoom
2. **Multi-idioma**: Español + Inglés (extensión + landing page)

**Razón**: Requisitos mínimos para lanzamiento v1.0 según usuario.

---

## Sesiones Reorganizadas (21-27)

### Sesión 21: Multi-plataforma — Detección y Configuración (2-3h)
**Objetivo**: Extensión funciona en Google Meet, Microsoft Teams y Zoom

#### Tareas:

1. **Crear sistema de detección de plataforma** (30 min)
   - Crear `extension/platforms.js`
   - Detectar dominio actual (meet.google.com, teams.microsoft.com, *.zoom.us)
   - Devolver configuración específica de cada plataforma

2. **Actualizar manifest.json** (15 min)
   - Añadir host_permissions para Teams y Zoom
   - Actualizar content_scripts con nuevos matches
   - Verificar que no haya conflictos

3. **Actualizar content-script.js** (30 min)
   - Importar platforms.js
   - Detectar plataforma al cargar
   - Enviar mensaje a background con plataforma detectada

4. **Actualizar background.js** (45 min)
   - Recibir plataforma desde content-script
   - Guardar en chrome.storage.session
   - Ajustar lógica de captura si es necesario

5. **Actualizar popup.js y panel.js** (30 min)
   - Mostrar logo/nombre de plataforma detectada
   - Cambiar mensajes según plataforma
   - Verificar compatibilidad de cada plataforma

6. **Testing básico** (30 min)
   - Probar en Google Meet → ✅
   - Probar en Teams web → ✅
   - Probar en Zoom web → ✅

**Archivos nuevos**:
- `extension/platforms.js` (NUEVO)

**Archivos modificados**:
- `extension/manifest.json`
- `extension/content-script.js`
- `extension/background.js`
- `extension/popup/popup.js`
- `extension/side-panel/panel.js`

---

### Sesión 22: Multi-idioma — Extensión (i18n Chrome) (2-3h)
**Objetivo**: Extensión en Español + Inglés usando Chrome i18n API

#### Tareas:

1. **Crear estructura de traducciones** (30 min)
   - Crear `extension/_locales/es/messages.json`
   - Crear `extension/_locales/en/messages.json`
   - Definir keys para todos los textos de la extensión

2. **Traducir popup.html** (30 min)
   - Reemplazar textos hardcoded con `__MSG_key__`
   - Traducir:
     - Título extensión
     - Selector de perfil
     - Checkbox consentimiento
     - Botones "Iniciar sesión" / "Ver dashboard"

3. **Traducir panel.html** (30 min)
   - Reemplazar textos hardcoded
   - Traducir:
     - "Escuchando..."
     - "Detener sesión"
     - Footer contador de sesiones
     - Historial

4. **Actualizar popup.js y panel.js** (45 min)
   - Usar `chrome.i18n.getMessage('key')` para textos dinámicos
   - Traducir mensajes de error
   - Traducir estados de sesión

5. **Actualizar manifest.json** (15 min)
   - Añadir `default_locale: "es"`
   - Reemplazar `name` y `description` con `__MSG_appName__` y `__MSG_appDesc__`

6. **Testing** (30 min)
   - Chrome configurado en Español → Verificar textos ES
   - Chrome configurado en Inglés → Verificar textos EN
   - Cambiar idioma sin recargar → Verificar que funciona

**Archivos nuevos**:
- `extension/_locales/es/messages.json` (NUEVO)
- `extension/_locales/en/messages.json` (NUEVO)

**Archivos modificados**:
- `extension/manifest.json`
- `extension/popup/popup.html`
- `extension/popup/popup.js`
- `extension/side-panel/panel.html`
- `extension/side-panel/panel.js`

---

### Sesión 23: Multi-idioma — Landing Page (next-intl) (3-4h)
**Objetivo**: Landing page, pricing, dashboard en Español + Inglés

#### Tareas:

1. **Instalar next-intl** (15 min)
   ```bash
   npm install next-intl
   ```

2. **Configurar i18n en Next.js** (30 min)
   - Crear `i18n.ts` con configuración
   - Crear middleware para detección de idioma
   - Añadir `[locale]` a app router

3. **Crear archivos de traducción** (45 min)
   - Crear `messages/es.json`
   - Crear `messages/en.json`
   - Traducir:
     - Hero section
     - Features
     - Pricing
     - Footer
     - Dashboard

4. **Actualizar app/page.tsx (landing)** (45 min)
   - Importar `useTranslations` de next-intl
   - Reemplazar textos hardcoded con `t('key')`
   - Añadir selector de idioma en header

5. **Actualizar app/pricing/page.tsx** (30 min)
   - Traducir planes (Free, Pro)
   - Traducir features y precios

6. **Actualizar app/dashboard/page.tsx** (30 min)
   - Traducir secciones
   - Traducir botones y mensajes

7. **Actualizar app/privacy y app/terms** (30 min)
   - Crear versiones ES/EN de políticas legales
   - Routing por idioma

8. **Testing** (30 min)
   - Navegar en /es → Verificar todo en español
   - Navegar en /en → Verificar todo en inglés
   - Cambiar idioma con selector → Verificar cambio

**Archivos nuevos**:
- `i18n.ts` (NUEVO)
- `middleware.ts` (NUEVO)
- `messages/es.json` (NUEVO)
- `messages/en.json` (NUEVO)
- `app/[locale]/page.tsx` (refactor)

**Archivos modificados**:
- `package.json` (dependencia next-intl)
- Todas las páginas de `app/`

---

### Sesión 24: Testing Multi-plataforma + Multi-idioma (2-3h)
**Objetivo**: Verificar que todo funciona en 3 plataformas y 2 idiomas

#### Test Suite 1: Multi-plataforma

**Google Meet** (30 min):
- [ ] Extensión detecta plataforma correctamente
- [ ] Audio capturado correctamente
- [ ] Transcripciones aparecen
- [ ] Sugerencias funcionan
- [ ] Panel muestra logo/nombre de Google Meet
- [ ] Session creada en Supabase con plataforma

**Microsoft Teams** (30 min):
- [ ] Extensión detecta plataforma correctamente
- [ ] Audio capturado correctamente (puede requerir ajustes)
- [ ] Transcripciones aparecen
- [ ] Sugerencias funcionan
- [ ] Panel muestra logo/nombre de Teams
- [ ] Session creada en Supabase con plataforma

**Zoom** (30 min):
- [ ] Extensión detecta plataforma correctamente
- [ ] Audio capturado correctamente (puede requerir ajustes)
- [ ] Transcripciones aparecen
- [ ] Sugerencias funcionan
- [ ] Panel muestra logo/nombre de Zoom
- [ ] Session creada en Supabase con plataforma

#### Test Suite 2: Multi-idioma Extensión

**Español** (15 min):
- [ ] Chrome en ES → Popup en español
- [ ] Panel en español
- [ ] Mensajes de error en español
- [ ] Contador sesiones en español

**Inglés** (15 min):
- [ ] Chrome en EN → Popup en inglés
- [ ] Panel en inglés
- [ ] Mensajes de error en inglés
- [ ] Contador sesiones en inglés

#### Test Suite 3: Multi-idioma Web

**Español** (15 min):
- [ ] Landing /es en español
- [ ] Pricing /es en español
- [ ] Dashboard en español
- [ ] Privacy/Terms en español

**Inglés** (15 min):
- [ ] Landing /en en inglés
- [ ] Pricing /en en inglés
- [ ] Dashboard en inglés
- [ ] Privacy/Terms en inglés

#### Test Suite 4: Cross-testing

**ES usuario + EN plataforma** (15 min):
- [ ] Chrome en ES + Google Meet → Todo funciona
- [ ] Sugerencias en español

**EN usuario + ES plataforma** (15 min):
- [ ] Chrome en EN + Google Meet → Todo funciona
- [ ] Sugerencias en inglés

---

### Sesión 25: Actualizar Prompts Claude Multi-idioma (1-2h)
**Objetivo**: Claude responde en español o inglés según el idioma del usuario

#### Tareas:

1. **Actualizar lib/claude.ts** (30 min)
   - Crear `PROMPT_CANDIDATO_EN`, `PROMPT_VENDEDOR_EN`, `PROMPT_DEFENSOR_EN`
   - Añadir parámetro `language` a `getSystemPrompt()`
   - Seleccionar prompt ES o EN según language

2. **Actualizar app/api/analyze/route.ts** (30 min)
   - Recibir `language` en request body
   - Detectar idioma del navegador del usuario si no se envía
   - Pasar `language` a `getSystemPrompt()`

3. **Actualizar extension/background.js** (30 min)
   - Detectar idioma de Chrome con `chrome.i18n.getUILanguage()`
   - Enviar `language` ('es' o 'en') al endpoint /api/analyze

4. **Testing** (30 min)
   - Chrome en ES → Sugerencias en español
   - Chrome en EN → Sugerencias en inglés
   - Verificar que detecta idioma correctamente

**Archivos modificados**:
- `lib/claude.ts`
- `app/api/analyze/route.ts`
- `extension/background.js`

---

### Sesión 26: Assets Profesionales (1h)
**Objetivo**: Generar iconos y promotional tile

#### Tareas:

1. **Generar iconos con IA** (30 min)
   - Usar prompts de ICON_DESIGN_SPECS.md
   - DALL-E o Midjourney
   - Descargar y redimensionar

2. **Crear promotional tile** (30 min)
   - Usar Canva o Figma
   - Diseño según specs
   - Exportar 440x280px

**Ubicación**:
- `extension/icons/icon16.png` (reemplazar)
- `extension/icons/icon48.png` (reemplazar)
- `extension/icons/icon128.png` (reemplazar)
- `CHROME_WEB_STORE_ASSETS/promotional-tile.png` (nuevo)

---

### Sesión 27: Screenshots + Publicación (2-3h)
**Objetivo**: Capturar screenshots y publicar en Chrome Web Store

#### Tareas:

1. **Capturar screenshots** (1h)
   - 5 screenshots según CHROME_WEB_STORE_PUBLICATION.md
   - Redimensionar a 1280x800px
   - Guardar en `/CHROME_WEB_STORE_ASSETS/screenshots/`

2. **Empaquetar extensión** (15 min)
   ```bash
   cd extension/
   zip -r confident-v1.0.0.zip * -x "*.DS_Store" -x "node_modules/*"
   ```

3. **Crear cuenta Developer** (15 min)
   - https://chrome.google.com/webstore/devconsole
   - Pagar $5

4. **Subir extensión** (1h)
   - Upload ZIP
   - Completar formulario (usar CHROME_WEB_STORE_PUBLICATION.md)
   - Justificar permisos
   - Upload screenshots
   - Submit for review

5. **Actualizar PROGRESS.md** (15 min)
   - Documentar publicación
   - Status: "Pending review"

---

## Resumen de Cambios

### Código
- ✅ Multi-plataforma (Google Meet, Teams, Zoom)
- ✅ Multi-idioma extensión (ES/EN)
- ✅ Multi-idioma web (ES/EN)
- ✅ Claude responde en idioma del usuario
- ✅ Prompts Claude en ES/EN

### Assets
- ⏳ Iconos profesionales
- ⏳ Promotional tile
- ⏳ Screenshots (5)

### Testing
- ⏳ Multi-plataforma (3 plataformas)
- ⏳ Multi-idioma (2 idiomas)
- ⏳ Cross-testing (idioma x plataforma)

---

## Estimación de Tiempo

| Sesión | Duración | Acumulado |
|--------|----------|-----------|
| 21. Multi-plataforma | 2-3h | 2-3h |
| 22. i18n Extensión | 2-3h | 4-6h |
| 23. i18n Web | 3-4h | 7-10h |
| 24. Testing | 2-3h | 9-13h |
| 25. Claude multi-idioma | 1-2h | 10-15h |
| 26. Assets | 1h | 11-16h |
| 27. Publicación | 2-3h | 13-19h |

**Total**: 13-19 horas de trabajo antes de publicar

**Organización sugerida**:
- Semana 1: Sesiones 21-23 (implementación core)
- Semana 2: Sesiones 24-25 (testing + ajustes)
- Semana 3: Sesiones 26-27 (assets + publicación)

---

## Checklist Pre-Lanzamiento (Actualizado)

### Funcionalidades
- [x] ✅ Audio capture + transcripción
- [x] ✅ Smart cards con urgencia 1/2/3
- [x] ✅ Personalización de perfil
- [x] ✅ IA contextual
- [x] ✅ Dashboard + Email
- [ ] ⏳ Multi-plataforma (Meet, Teams, Zoom)
- [ ] ⏳ Multi-idioma extensión (ES/EN)
- [ ] ⏳ Multi-idioma web (ES/EN)
- [ ] ⏳ Claude multi-idioma

### Assets
- [ ] ⏳ Iconos profesionales 16/48/128
- [ ] ⏳ Promotional tile 440x280
- [ ] ⏳ Screenshots (5)

### Testing
- [x] ✅ Code review (100%)
- [ ] ⏳ Multi-plataforma (3 plataformas)
- [ ] ⏳ Multi-idioma (2 idiomas)
- [ ] ⏳ Testing manual completo

### Legal
- [x] ✅ Privacy policy (ES)
- [ ] ⏳ Privacy policy (EN)
- [x] ✅ Terms of service (ES)
- [ ] ⏳ Terms of service (EN)

### Publicación
- [x] ✅ Manifest v1.0.0
- [x] ✅ Descripción Chrome Web Store
- [x] ✅ Justificación permisos
- [ ] ⏳ Cuenta Developer
- [ ] ⏳ ZIP creado
- [ ] ⏳ Submitted for review

---

**Próximo paso**: Comenzar Sesión 21 (Multi-plataforma)

**Última actualización**: Marzo 2, 2026
