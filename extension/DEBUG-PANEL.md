# Debug Panel Lateral - No se muestran sugerencias

## Diagnóstico paso a paso

### 1. Verificar que el servidor esté corriendo
```bash
curl http://localhost:3000/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Cuéntame sobre tu experiencia","profile":"candidato"}'
```

✅ Debe retornar JSON con suggestion

### 2. Verificar consola de background.js

**Abrir consola:**
1. `chrome://extensions`
2. Buscar "Confident"
3. Clic en "service worker" (texto azul debajo del nombre)

**Ejecutar en consola:**
```javascript
// Ver si hay texto pendiente
chrome.storage.session.get(['pendingText', 'sessionActive', 'profile'], console.log);

// Forzar análisis manual
callAnalyzeAPI();
```

**Logs esperados:**
```
[Confident] Analizando transcripción: "texto aquí..."
[Confident] /api/analyze respondió: {signal_detected: true, ...}
```

### 3. Verificar consola del panel lateral

**Abrir consola:**
1. Clic derecho en el panel lateral
2. "Inspeccionar elemento"
3. Pestaña Console

**Ejecutar en consola:**
```javascript
// Ver estado actual
document.getElementById('listeningState').classList.contains('hidden');
document.getElementById('suggestionCard').classList.contains('hidden');

// Test manual de renderizado
renderSuggestion({
  signal_detected: true,
  signal_type: 'behavioral',
  urgency: 3,
  what_is_being_asked: 'Test de pregunta',
  suggestion: 'Test de sugerencia',
  keywords: ['test', 'debug'],
  speaker_detected: 'other'
});
```

**Logs esperados:**
```
[DEBUG Panel] Mensaje recibido: {action: 'NEW_SUGGESTION', result: {...}}
```

### 4. Verificar estado de onboarding

**En consola del panel:**
```javascript
chrome.storage.local.get('onboarding_completed', console.log);
```

✅ Debe retornar `{onboarding_completed: true}`

❌ Si retorna `{}`, ejecuta:
```javascript
chrome.storage.local.set({onboarding_completed: true}, () => {
  console.log('Onboarding marcado como completado');
  location.reload();
});
```

### 5. Verificar que el panel esté en modo "listening"

**En consola del panel:**
```javascript
// Ver qué estado está activo
['onboardingState', 'consentState', 'emptyState', 'listeningState', 'suggestionCard'].forEach(id => {
  const el = document.getElementById(id);
  const hidden = el.classList.contains('hidden');
  console.log(`${id}: ${hidden ? 'HIDDEN' : 'VISIBLE'}`);
});
```

**Resultado esperado durante sesión activa:**
```
onboardingState: HIDDEN
consentState: HIDDEN
emptyState: HIDDEN
listeningState: VISIBLE  ← Este debe estar visible
suggestionCard: HIDDEN
```

### 6. Test completo del flujo

**Simular mensaje desde background:**

En consola del panel:
```javascript
// Simular que llega una sugerencia
window.postMessage = chrome.runtime.onMessage.addListener;
chrome.runtime.sendMessage({
  action: 'NEW_SUGGESTION',
  result: {
    signal_detected: true,
    signal_type: 'behavioral',
    urgency: 3,
    what_is_being_asked: '¿Qué tipo de pregunta es esta?',
    suggestion: 'Responde usando el método STAR: Situación, Tarea, Acción, Resultado.',
    keywords: ['STAR', 'experiencia', 'liderazgo'],
    speaker_detected: 'other'
  }
});
```

## Problemas comunes

### Problema 1: Panel en estado "onboarding"
**Síntoma:** Panel muestra "Bienvenido a Confident"
**Solución:**
```javascript
chrome.storage.local.set({onboarding_completed: true}, () => location.reload());
```

### Problema 2: Panel en estado "empty" durante sesión
**Síntoma:** Panel dice "Listo para ayudarte" aunque la sesión está activa
**Solución:** Verificar en background.js:
```javascript
chrome.storage.session.get(['sessionActive'], console.log);
// Si muestra false, pero debería estar activa, hay un bug en popup.js
```

### Problema 3: No llegan mensajes al panel
**Síntoma:** No aparece nada en console.log
**Solución:**
1. Recargar extensión en `chrome://extensions`
2. Cerrar y reabrir el panel lateral
3. Verificar que no haya errores en consola de background

### Problema 4: API no responde
**Síntoma:** Error 500 o timeout
**Verificar:**
```bash
# En terminal
npm run dev  # Debe estar corriendo

# Test directo
curl http://localhost:3000/api/analyze -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"test","profile":"candidato"}'
```

## Checklist de verificación rápida

- [ ] Servidor Next.js corriendo (`npm run dev`)
- [ ] Extensión recargada en `chrome://extensions`
- [ ] Onboarding completado (`onboarding_completed: true`)
- [ ] Sesión activa en storage (`sessionActive: true`)
- [ ] Panel en estado "listening" (no "empty" ni "onboarding")
- [ ] Background.js sin errores en consola
- [ ] Panel.js sin errores en consola
- [ ] Deepgram conectado (sin error 400/1006)

## Comandos útiles

```javascript
// Limpiar todo y empezar de cero
chrome.storage.local.clear();
chrome.storage.session.clear();
location.reload();

// Ver todo el storage
chrome.storage.local.get(null, console.log);
chrome.storage.session.get(null, console.log);

// Forzar estado "listening"
showState('listening');

// Forzar renderizar sugerencia de prueba
renderSuggestion({
  signal_detected: true,
  urgency: 2,
  suggestion: 'Esto es una prueba',
  keywords: ['test']
});
```
