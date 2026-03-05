# Debug: Cards No Aparecen

## Paso 1: Abrir DevTools en el Side Panel

1. Abre el Side Panel de Confident (click en el icono)
2. Click derecho en cualquier parte del panel
3. Selecciona "Inspect" o "Inspeccionar"
4. Se abrirá DevTools para el Side Panel

## Paso 2: Verificar en Console

En la pestaña **Console** de DevTools, pega esto y presiona Enter:

```javascript
// Verificar elementos del DOM
console.log('=== DEBUG CARDS ===');
console.log('suggestionsContainer:', document.getElementById('suggestionsContainer'));
console.log('activeSessionView visible:', !document.getElementById('activeSessionView').classList.contains('hidden'));
console.log('profileSelectionView visible:', !document.getElementById('profileSelectionView').classList.contains('hidden'));
console.log('Cards actuales:', document.querySelectorAll('.suggestion-card').length);
```

**Dime qué imprime esto en la consola.**

## Paso 3: Crear Card de Prueba

Si el contenedor existe, crea una card de prueba pegando esto en Console:

```javascript
// Crear card de prueba
const container = document.getElementById('suggestionsContainer');
const testCard = document.createElement('div');
testCard.className = 'suggestion-card';
testCard.dataset.urgency = '1';
testCard.innerHTML = `
  <div class="urgency-badge">🟢 TEST</div>
  <div class="suggestion-section">
    <p class="suggestion-main">Esta es una card de prueba</p>
    <p class="suggestion-details">Si ves esto, el CSS funciona</p>
  </div>
`;
container.appendChild(testCard);
console.log('Card de prueba creada');
```

**¿Aparece la card verde de prueba en el panel?**

## Paso 4: Verificar Backend

En la consola, revisa si hay errores relacionados con:
- `NEW_SUGGESTION`
- `renderSuggestion`
- Errores de red (pestaña Network)

## Paso 5: Verificar Session State

Pega esto en Console:

```javascript
chrome.storage.session.get(['sessionActive', 'profile'], (data) => {
  console.log('Sesión activa:', data.sessionActive);
  console.log('Perfil:', data.profile);
});
```

**Dime qué valores tiene.**

---

## Posibles Problemas

### Si el contenedor es `null`:
- El panel no está en vista activa
- Necesitas iniciar sesión primero

### Si la card de prueba NO aparece:
- Problema de CSS (variables no cargadas)
- Verificar que panel.css se cargó

### Si la card de prueba SÍ aparece:
- El CSS funciona ✅
- El problema es que no llegan sugerencias del backend
- Verificar que el backend está corriendo
- Verificar que hay audio en la llamada

---

**Ejecuta los pasos 1-3 y dime qué ves.**
