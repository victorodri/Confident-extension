// Script para limpiar la API key guardada inválida
// Ejecutar desde DevTools > Console en el popup de la extensión:
//
// 1. Haz clic derecho en el icono de la extensión
// 2. Inspeccionar popup
// 3. En la consola, copia y pega este código:

chrome.storage.local.remove('deepgramKey', () => {
  console.log('✅ API key limpiada. Ingresa una nueva API key válida desde console.deepgram.com');
  location.reload();
});
