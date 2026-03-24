# Guía de Deployment Profesional — Confident
> **Versión 0.2.0 — Pre-Launch**

Esta guía te llevará paso a paso desde el estado actual hasta tener Confident desplegado profesionalmente en staging y producción.

---

## 📋 Estado Actual del Proyecto

### ✅ Completado
- [x] Arquitectura base sólida (Next.js + Chrome Extension MV3)
- [x] Database schema con RLS correctamente implementado
- [x] VULN-001 (RLS bypass) — RESUELTO
- [x] VULN-002 (Input validation) — RESUELTO
- [x] VULN-003 (Logger seguro) — RESUELTO
- [x] VULN-004 (XSS protection) — VERIFICADO SEGURO
- [x] Side panel UI con diseño Figma
- [x] 4 perfiles: Candidato, Vendedor, Profesor, Reunión/Defensa

### ⏸️ Pendiente (esta guía te ayudará)
- [ ] QA manual con screenshots
- [ ] Deploy a staging (Vercel)
- [ ] Testing E2E
- [ ] Publicar extensión en Chrome Web Store
- [ ] Deploy a producción

---

## 🎯 Objetivo Final

Al completar esta guía tendrás:
1. **Staging environment** funcionando (https://confident-staging.vercel.app)
2. **Extension versión 0.2.0** cargada y testeada
3. **15+ screenshots** de evidencia QA
4. **Checklist de pre-launch** completado
5. **Chrome Web Store submission** lista

---

## FASE 1: Preparación Local (30 minutos)

### Paso 1.1: Actualizar Versión del Proyecto

```bash
cd /Users/victormanuelrodriguezgutierrez/Desktop/Confident
```

Edita `extension/manifest.json`:
```json
{
  "manifest_version": 3,
  "name": "Confident",
  "version": "0.2.0",  ← CAMBIAR de 0.1.0 a 0.2.0
  "description": "Tu confidente en videollamadas importantes"
}
```

### Paso 1.2: Verificar Variables de Entorno

Asegúrate de que `.env.local` tiene todas las keys necesarias:

```bash
# Verificar que existen todas las variables
cat .env.local
```

**Variables requeridas**:
```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Deepgram
DEEPGRAM_API_KEY=...
NEXT_PUBLIC_DEEPGRAM_API_KEY=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@tryconfident.com

# Posthog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (opcional por ahora)
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

✅ **Checkpoint**: Todas las variables tienen valores (no vacías).

### Paso 1.3: Limpiar Archivos Temporales

```bash
# Eliminar archivos de backup innecesarios
rm extension/side-panel/panel-backup.js
rm extension/side-panel/panel-backup.html
rm extension/side-panel/panel-backup.css
rm extension/side-panel/panel.js  # Usar solo panel-v2.js

# Verificar que se eliminaron
ls extension/side-panel/
```

**Deberías ver solo**:
```
assets/
components.js
panel-v2.css
panel-v2.js
panel.html
```

### Paso 1.4: Instalar Dependencias Actualizadas

```bash
# Instalar todas las dependencias
npm install

# Verificar que Zod está instalado (para validación)
npm list zod
```

✅ **Checkpoint**: `npm install` completó sin errores.

---

## FASE 2: Testing Local Completo (1-2 horas)

### Paso 2.1: Iniciar Servidor de Desarrollo

```bash
# Terminal 1: Servidor Next.js
npm run dev
```

Deberías ver:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

**IMPORTANTE**: Deja este terminal abierto.

### Paso 2.2: Cargar Extensión en Chrome

1. **Abre Chrome** y ve a: `chrome://extensions/`

2. **Activa "Modo de desarrollador"** (toggle arriba a la derecha)

3. **Click en "Cargar extensión sin empaquetar"**

4. **Selecciona la carpeta**: `/Users/victormanuelrodriguezgutierrez/Desktop/Confident/extension`

5. **Verifica**:
   - ✅ Nombre: "Confident"
   - ✅ Versión: "0.2.0"
   - ✅ Sin errores en rojo

### Paso 2.3: Testing Manual con Screenshots

#### 📸 Captura 1: Estado IDLE
1. Abre un tab normal (NO videollamada)
2. Click en icono de Confident → se abre side panel
3. **Screenshot 1**: `01-estado-idle.png`
   - ✅ Muestra "Abre una videollamada"
   - ✅ Iconos de Meet/Zoom/Teams visibles
   - ✅ Status pill "Inactivo" (gris)

#### 📸 Captura 2-5: Selección de Perfil
1. Abre Google Meet: https://meet.google.com/new
2. Click en icono Confident
3. **Screenshot 2**: `02-profile-selection.png`
   - ✅ Muestra 4 perfiles (Candidato, Vendedor, Profesor, Reunión)
   - ✅ Checkbox de consentimiento visible
   - ✅ Botón "Comenzar" deshabilitado

4. Click en "Candidato"
5. **Screenshot 3**: `03-profile-selected-candidato.png`
   - ✅ Card "Candidato" seleccionada (borde azul)

6. Marca checkbox de consentimiento
7. **Screenshot 4**: `04-consent-confirmed.png`
   - ✅ Checkbox marcado
   - ✅ Botón "Comenzar" habilitado (azul)

8. Click "Comenzar"
9. **Screenshot 5**: `05-session-starting.png`
   - ✅ Spinner o mensaje "Iniciando..."

#### 📸 Captura 6-7: Estado Listening/Analyzing
10. **Screenshot 6**: `06-estado-listening.png`
    - ✅ Status pill "Activo" (verde, parpadeando)
    - ✅ Texto "Escuchando..."
    - ✅ Spinner de 3 puntos
    - ✅ Historial colapsado
    - ✅ Botón "Terminar reunión"

11. Habla algo en la videollamada (o simula audio)
12. **Screenshot 7**: `07-estado-analyzing.png`
    - ✅ Texto "Analizando conversación"

#### 📸 Captura 8-10: Sugerencias (simuladas)
Para estas capturas, vamos a inyectar datos de prueba manualmente.

**Abre la consola de Chrome** (F12) en el side panel:

```javascript
// Inyectar sugerencia de prueba
window.panelStateMachine.addSuggestion({
  urgency: 3,
  suggestion: 'Menciona tu experiencia liderando equipos remotos',
  what_is_being_asked: '¿Cómo manejas el trabajo remoto?',
  signal_type: 'behavioral',
  keywords: ['liderazgo', 'remoto', 'STAR']
});
```

13. **Screenshot 8**: `08-sugerencia-urgente.png`
    - ✅ Card con borde rojo (urgente)
    - ✅ Badge "URGENTE" visible
    - ✅ Texto de sugerencia visible y legible
    - ✅ Contexto visible
    - ✅ Badge de contexto visible

Inyecta otra sugerencia:
```javascript
window.panelStateMachine.addSuggestion({
  urgency: 2,
  suggestion: 'Pregunta sobre el presupuesto disponible',
  what_is_being_asked: 'Señal de interés en el producto',
  signal_type: 'buying_signal',
  keywords: ['presupuesto', 'precio', 'cierre']
});
```

14. **Screenshot 9**: `09-dos-sugerencias.png`
    - ✅ 2 cards visibles
    - ✅ Segunda card con borde naranja (importante)

Inyecta tercera:
```javascript
window.panelStateMachine.addSuggestion({
  urgency: 1,
  suggestion: 'Mantén contacto visual y sonríe',
  what_is_being_asked: 'Consejo general de comunicación',
  signal_type: 'presentation',
  keywords: ['comunicación', 'lenguaje corporal']
});
```

15. **Screenshot 10**: `10-tres-sugerencias.png`
    - ✅ 3 cards visibles
    - ✅ Tercera card con borde verde (baja prioridad)
    - ✅ Layout no roto, sin scroll innecesario
    - ✅ "Analizando conversación" centrado debajo

#### 📸 Captura 11-12: Historial
16. Click en "Historial" para expandir
17. **Screenshot 11**: `11-historial-expandido.png`
    - ✅ Muestra las 3 sugerencias previas
    - ✅ Números de urgencia visibles (3, 2, 1)
    - ✅ Textos visibles

18. Click en "Historial" para colapsar
19. **Screenshot 12**: `12-historial-colapsado.png`
    - ✅ Muestra "Historial 3" con flecha

#### 📸 Captura 13: Terminar Reunión
20. Click en "Terminar reunión"
21. **Screenshot 13**: `13-session-ended.png`
    - ✅ Se abre tab del dashboard
    - ✅ Panel vuelve a IDLE

#### 📸 Captura 14-15: Estados de Error y Paywall
22. Para simular error, detén el servidor (`Ctrl+C` en terminal)
23. Intenta iniciar sesión
24. **Screenshot 14**: `14-estado-error.png`
    - ✅ Icono de error (warning-red.svg)
    - ✅ Mensaje de error visible
    - ✅ Botón "Reintentar"

25. Para simular paywall, abre consola:
```javascript
window.panelStateMachine.data.sessionsRemaining = 0;
window.panelStateMachine.data.isAnonymous = true;
window.panelStateMachine.setState(window.panelStateMachine.STATES.PAYWALL_FREE);
```

26. **Screenshot 15**: `15-paywall-free.png`
    - ✅ Icono de paywall visible
    - ✅ Mensaje "Has usado X sesiones"
    - ✅ Botón "Crear cuenta" o "Upgrade"

### Paso 2.4: Guardar Screenshots

Crea carpeta y guarda todos los screenshots:
```bash
mkdir -p /Users/victormanuelrodriguezgutierrez/Desktop/Confident/docs/qa-screenshots
```

Mueve las 15 capturas a esa carpeta con los nombres indicados.

✅ **Checkpoint**: Tienes 15 screenshots organizados en `/docs/qa-screenshots/`.

### Paso 2.5: Verificar Checklist de Funcionalidad

Marca cada item:

**UI/UX**:
- [ ] Logo PNG visible en header
- [ ] Pill "Activo" parpadea correctamente
- [ ] Pill se ajusta al contenido (no estirada)
- [ ] Cards muestran texto de sugerencia (18px bold)
- [ ] Cards muestran contexto (14px gray)
- [ ] Cards tienen bordes de color según urgencia
- [ ] Badges de contexto visibles
- [ ] Historial expand/collapse funciona
- [ ] Footer muestra sesiones restantes

**Funcionalidad**:
- [ ] Detecta videollamada automáticamente
- [ ] 4 perfiles seleccionables
- [ ] Checkbox consentimiento obligatorio
- [ ] Botón "Comenzar" se habilita solo con consentimiento
- [ ] Estado "Listening" se muestra correctamente
- [ ] Sugerencias inyectadas aparecen en UI
- [ ] Máximo 3 cards visibles (scroll si más)
- [ ] Botón "Terminar" abre dashboard
- [ ] Error state muestra mensaje correcto
- [ ] Paywall bloquea sesión 16+

**Seguridad** (verificar en consola):
- [ ] Versión 0.2.0 en desarrollo = logs visibles
- [ ] No se exponen UUIDs completos en logs
- [ ] Textos largos se truncan en logs

✅ **Checkpoint**: Al menos 18/20 items marcados.

---

## FASE 3: Deploy a Staging (30 minutos)

### Paso 3.1: Configurar Vercel Staging

1. **Ve a**: https://vercel.com/dashboard

2. **Crea nuevo proyecto** o ve al existente "Confident"

3. **Settings → Environment Variables**

Añade TODAS las variables de `.env.local` en 3 environments:
- ✅ Production
- ✅ Preview
- ✅ Development

**Variables críticas**:
```
ANTHROPIC_API_KEY
DEEPGRAM_API_KEY
NEXT_PUBLIC_DEEPGRAM_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
NEXT_PUBLIC_APP_URL → https://tryconfident.vercel.app
```

### Paso 3.2: Crear Branch de Staging

```bash
# Crear y cambiar a branch staging
git checkout -b staging

# Verificar archivos modificados
git status

# Añadir cambios de Sesión 42
git add .

# Commit con mensaje descriptivo
git commit -m "$(cat <<'EOF'
Release: Version 0.2.0 - Security Hardening

## Security Fixes
- VULN-001: RLS bypass resolved (ANON key + anonymous_id validation)
- VULN-002: Input validation with Zod schemas
- VULN-003: Secure logger with data sanitization
- VULN-004: XSS protection verified (textContent usage)

## Features
- 4 profiles: Candidato, Vendedor, Profesor, Reunión/Defensa
- Auto-detect dev/prod with CONFIG.BASE_URL
- Property mismatch fixed in history component

## Documentation
- DEPLOYMENT_GUIDE.md created
- SECURITY_AUDIT.md completed
- ARCHITECTURE_AUDIT.md completed

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# Push a staging branch
git push origin staging
```

### Paso 3.3: Deploy en Vercel

1. **Ve a Vercel Dashboard**
2. **Deployments** tab
3. Debería aparecer el deploy automático de `staging` branch
4. Espera a que termine (2-3 minutos)

Obtendrás URL tipo: `https://confident-git-staging-victor.vercel.app`

### Paso 3.4: Testing en Staging

1. **Actualiza `extension/config.js`** temporalmente:
```javascript
PROD: 'https://confident-git-staging-victor.vercel.app', // TU URL de staging
```

2. **Recarga extensión** en Chrome:
   - Ve a `chrome://extensions/`
   - Click en ↻ (reload)

3. **Cambia versión a 0.2.1** en `manifest.json`:
```json
{
  "version": "0.2.1"  ← indica staging
}
```

4. **Repite testing del Paso 2.3** pero contra staging

5. **Verifica en logs**:
   - Abre https://confident-git-staging-victor.vercel.app
   - Ve a Vercel → Logs
   - Verifica llamadas a `/api/analyze`, `/api/sessions`

✅ **Checkpoint**: Staging funciona correctamente.

---

## FASE 4: Chrome Web Store Preparation (1 hora)

### Paso 4.1: Preparar Assets para Chrome Web Store

**Crear iconos** (si aún no existen):
```bash
# Verifica que existen los iconos
ls extension/icons/
```

**Necesitas**:
- `icon-16.png` (16x16)
- `icon-48.png` (48x48)
- `icon-128.png` (128x128)

Si no existen, cópialos de `/branding/logo` y redimensiona.

### Paso 4.2: Actualizar `manifest.json` para Producción

```json
{
  "manifest_version": 3,
  "name": "Confident",
  "version": "1.0.0",  ← IMPORTANTE: 1.0.0 = producción
  "description": "Tu confidente silencioso en videollamadas. Sugerencias en tiempo real con IA.",
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "permissions": [
    "tabCapture",
    "activeTab",
    "storage",
    "sidePanel",
    "scripting"
  ],
  "host_permissions": [
    "https://meet.google.com/*",
    "https://zoom.us/*",
    "https://teams.microsoft.com/*",
    "https://tryconfident.vercel.app/*"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": [
        "https://meet.google.com/*",
        "https://zoom.us/*",
        "https://teams.microsoft.com/*"
      ],
      "js": ["content-script.js"]
    }
  ],
  "side_panel": {
    "default_path": "side-panel/panel.html"
  },
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  }
}
```

### Paso 4.3: Crear Package para Chrome Web Store

```bash
# Volver a main branch
git checkout main

# Merge staging
git merge staging

# Actualizar version a 1.0.0
# (editar manifest.json manualmente)

# Crear zip para Chrome Web Store
cd extension
zip -r ../confident-extension-v1.0.0.zip . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Verificar zip
unzip -l confident-extension-v1.0.0.zip
```

✅ **Checkpoint**: Archivo `confident-extension-v1.0.0.zip` creado.

### Paso 4.4: Screenshots para Chrome Web Store

Necesitas **5 screenshots mínimo** (1280x800 o 640x400):

Usa las capturas del Paso 2.3:
1. `02-profile-selection.png` → Redimensionar a 1280x800
2. `06-estado-listening.png` → Redimensionar a 1280x800
3. `10-tres-sugerencias.png` → Redimensionar a 1280x800
4. `11-historial-expandido.png` → Redimensionar a 1280x800
5. `01-estado-idle.png` → Redimensionar a 1280x800

**Herramienta recomendada**: Preview (macOS) o GIMP (gratis)

### Paso 4.5: Texto para Chrome Web Store

**Title** (max 45 chars):
```
Confident - Confidente IA en Videollamadas
```

**Short Description** (max 132 chars):
```
Sugerencias en tiempo real con IA durante entrevistas, ventas y reuniones. Tu confidente silencioso en Google Meet, Zoom y Teams.
```

**Detailed Description** (max 16,000 chars):
```markdown
# Confident - Tu Confidente Silencioso en Videollamadas

Confident escucha tus videollamadas en Google Meet, Zoom y Teams, y te ofrece sugerencias inteligentes en tiempo real para ayudarte a destacar en entrevistas, cerrar ventas o defender tus ideas.

## 🎯 ¿Para quién es Confident?

### 📋 Candidatos en Procesos de Selección
- Detecta preguntas de competencias (STAR method)
- Sugiere ejemplos relevantes de tu experiencia
- Te recuerda mencionar logros cuantificables

### 💼 Vendedores y Comerciales
- Identifica señales de compra
- Detecta objeciones y sugiere respuestas
- Te indica cuándo hacer preguntas de cierre

### 👨‍🏫 Profesores de Inglés
- Sugiere correcciones gramaticales en tiempo real
- Recomienda vocabulario avanzado
- Identifica oportunidades de enseñanza

### 🎤 Reuniones y Presentaciones
- Descompone preguntas complejas
- Sugiere estructura de respuesta (MECE, Pyramid)
- Te ayuda a defender tus argumentos

## ✨ Características Principales

✅ **Análisis en Tiempo Real**: Transcripción automática + IA de Claude
✅ **Sugerencias Priorizadas**: Urgente / Importante / Informativo
✅ **Panel Lateral Discreto**: No interrumpe tu videollamada
✅ **100% Privado**: Audio procesado en tiempo real, nunca almacenado
✅ **Funciona en Meet, Zoom y Teams**

## 🔒 Privacidad y Seguridad

- ❌ NO almacenamos audio
- ✅ Solo texto transcrito (eliminable)
- ✅ Consentimiento obligatorio de participantes
- ✅ Cumple RGPD (datos en EU)
- ✅ Código open source (próximamente)

## 🚀 Cómo Empezar (30 segundos)

1. Instala la extensión
2. Abre Google Meet / Zoom / Teams
3. Click en el icono de Confident
4. Selecciona tu perfil (Candidato / Vendedor / etc.)
5. Marca el checkbox de consentimiento
6. Click "Comenzar" → ¡Listo!

## 📊 Planes y Precios

**Free** (5 sesiones):
- Prueba sin registro
- Todas las funcionalidades

**Explorer** (15 sesiones):
- Crea cuenta gratis
- Historial de sesiones

**Pro** (Ilimitado):
- Sesiones ilimitadas
- Soporte prioritario
- Análisis avanzado

## 🛠️ Soporte

- Email: hola@tryconfident.com
- Documentación: https://tryconfident.vercel.app/help
- Issues: GitHub (próximamente)

---

**Made with ❤️ by Victor Rodriguez**
Powered by Claude AI + Deepgram
```

**Category**: Productivity

**Language**: Spanish (España) + English

✅ **Checkpoint**: Tienes todo el contenido preparado.

---

## FASE 5: Deploy a Producción (30 minutos)

### Paso 5.1: Merge a Main y Tag

```bash
# Asegúrate de estar en main
git checkout main

# Verificar que staging está merged
git log --oneline -5

# Crear tag de release
git tag -a v1.0.0 -m "Release: Confident v1.0.0 - Public Launch

## Features
- 4 perfiles (Candidato, Vendedor, Profesor, Reunión/Defensa)
- Real-time AI suggestions with Claude
- Deepgram transcription
- Side panel UI (Figma design)
- Anonymous + authenticated users
- Free (5) / Explorer (15) / Pro (unlimited) plans

## Security
- RLS protection (VULN-001 fixed)
- Input validation with Zod (VULN-002 fixed)
- Secure logging (VULN-003 fixed)
- XSS protection verified (VULN-004)

## Infrastructure
- Next.js 14 App Router
- Supabase (Auth + DB)
- Vercel deployment
- Posthog analytics
- Resend emails"

# Push tag
git push origin v1.0.0

# Push main
git push origin main
```

### Paso 5.2: Verificar Deploy en Vercel

1. Ve a https://vercel.com/dashboard
2. Verifica que deploy de `main` está en progreso
3. Espera a que termine (2-3 min)
4. URL final: `https://tryconfident.vercel.app`

### Paso 5.3: Testing en Producción

1. **Abre**: https://tryconfident.vercel.app

2. **Verifica**:
   - [ ] Landing page carga correctamente
   - [ ] `/pricing` funciona
   - [ ] `/login` funciona
   - [ ] `/dashboard` redirige a login si no autenticado

3. **Test API health**:
```bash
curl https://tryconfident.vercel.app/api/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"..."}
```

4. **Test extensión contra producción**:
   - Cambia version en manifest a `1.0.0`
   - Recarga extensión
   - Testea flow completo

✅ **Checkpoint**: Producción funciona correctamente.

---

## FASE 6: Publicar en Chrome Web Store (1 hora)

### Paso 6.1: Crear Developer Account

1. Ve a: https://chrome.google.com/webstore/devconsole

2. **Si no tienes cuenta**:
   - Paga $5 USD (one-time fee)
   - Completa verificación de identidad

3. **Si ya tienes cuenta**:
   - Click "New Item"

### Paso 6.2: Subir Extension

1. **Upload ZIP**: `confident-extension-v1.0.0.zip`

2. **Store Listing**:
   - Product Name: `Confident - Confidente IA en Videollamadas`
   - Summary: [copiar Short Description del Paso 4.5]
   - Description: [copiar Detailed Description del Paso 4.5]
   - Category: Productivity
   - Language: Spanish + English

3. **Upload Screenshots**: (5 screenshots preparadas en Paso 4.4)

4. **Upload Icons**:
   - Small tile: `icon-128.png`
   - Large promo tile: 440x280 (crear desde logo)

5. **Privacy**:
   - Single Purpose: "AI-powered real-time suggestions for video calls"
   - Permission Justifications:
     - `tabCapture`: "Capture audio from Google Meet/Zoom/Teams for transcription"
     - `storage`: "Store user preferences and session history"
     - `sidePanel`: "Display suggestions in side panel during calls"
   - Host Permissions: "Access Meet/Zoom/Teams to detect active calls"
   - Data Usage: "Audio is processed in real-time, never stored"
   - Privacy Policy URL: `https://tryconfident.vercel.app/privacy`

### Paso 6.3: Submit for Review

1. **Review Summary** → Check todos los campos

2. **Submit for Review**

3. **Tiempo de revisión**: 1-3 días hábiles

✅ **Checkpoint**: Extensión enviada a revisión.

---

## FASE 7: Monitoreo Post-Launch (Continuo)

### Paso 7.1: Configurar Alertas

**Vercel**:
- Deployment notifications → Email activado
- Error tracking → Email activado

**Supabase**:
- Database health → Monitor cada 5 min

**Posthog**:
- Crear dashboard con métricas clave:
  - `session_started` (daily)
  - `suggestion_shown` (daily)
  - `paywall_soft_shown` (conversions)

### Paso 7.2: Checklist Diario (Primera Semana)

**Día 1-7 post-launch**:
- [ ] Verificar Vercel logs (errores 5xx)
- [ ] Verificar Supabase usage (no exceder free tier)
- [ ] Verificar Posthog analytics (users activos)
- [ ] Responder reviews en Chrome Web Store
- [ ] Verificar email hola@tryconfident.com

### Paso 7.3: Métricas de Éxito

**Semana 1**:
- Target: 10-50 instalaciones
- Target: 5-10 sesiones completadas
- Target: 0 errores críticos

**Mes 1**:
- Target: 100-500 instalaciones
- Target: 50-100 usuarios activos
- Target: 10%+ conversion free → explorer

---

## 📚 Recursos Adicionales

### Documentación Creada
- `/docs/SECURITY_AUDIT.md` — Vulnerabilidades y fixes
- `/docs/ARCHITECTURE_AUDIT.md` — Estructura del proyecto
- `/docs/REFACTORING_EXAMPLES.md` — Código de mejoras
- `/docs/QA_REPORT.md` — Testing completo
- `/docs/DEPLOYMENT_GUIDE.md` — Esta guía

### Enlaces Útiles
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Chrome Web Store Dev: https://chrome.google.com/webstore/devconsole
- Posthog: https://eu.posthog.com

### Comandos Útiles

```bash
# Ver versión actual de extensión
cat extension/manifest.json | grep version

# Ver logs de Vercel en tiempo real
vercel logs --follow

# Test health check
curl https://tryconfident.vercel.app/api/health

# Ver variables de entorno en Vercel
vercel env ls
```

---

## ✅ Checklist Final Pre-Launch

Marca cada item antes de enviar a Chrome Web Store:

### Código
- [ ] Versión 1.0.0 en manifest.json
- [ ] Logger sanitiza datos sensibles
- [ ] CONFIG.PROD apunta a URL correcta
- [ ] No hay console.log con datos sensibles
- [ ] No hay TODOs críticos en código

### Testing
- [ ] 15+ screenshots capturados
- [ ] Todos los estados testeados
- [ ] Extension funciona en Meet/Zoom/Teams
- [ ] Producción testeada end-to-end
- [ ] No hay errores en console de producción

### Deploy
- [ ] Vercel producción funcionando
- [ ] Todas las env vars configuradas
- [ ] Database RLS activo
- [ ] APIs responden < 3 segundos
- [ ] Posthog tracking funciona

### Chrome Web Store
- [ ] ZIP creado y testeado
- [ ] 5 screenshots preparados
- [ ] Textos (título, description) listos
- [ ] Privacy policy publicada
- [ ] Terms of service publicados

### Documentación
- [ ] DEPLOYMENT_GUIDE.md completa
- [ ] PROGRESS.md actualizado
- [ ] README.md actualizado
- [ ] Git tags creados (v1.0.0)

---

## 🎉 ¡Felicidades!

Al completar esta guía, habrás:
✅ Desplegado Confident a producción
✅ Publicado la extensión en Chrome Web Store
✅ Configurado monitoreo y analytics
✅ Documentado todo el proceso

**Próximos pasos**:
1. Esperar aprobación de Chrome Web Store (1-3 días)
2. Anunciar launch en redes sociales
3. Recopilar feedback de primeros usuarios
4. Iterar según feedback
5. Planear integración de Stripe (Fase 2)

---

**Última actualización**: Sesión 42 - Marzo 21, 2026
**Versión guía**: 1.0.0
**Autor**: Claude Sonnet 4.5 + Victor Rodriguez
