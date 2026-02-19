// content-script.js — Inyectado en meet.google.com
// Sesión 1: solo notifica al background que Meet está activo.
// En sesiones futuras gestionará captura de micrófono y comunicación con el panel.

(function () {
  // Verificar que estamos en una página de Meet con llamada activa
  const isMeetCall = window.location.pathname.startsWith('/') &&
    window.location.hostname === 'meet.google.com';

  if (!isMeetCall) return;

  // Notificar al background que Meet está listo
  chrome.runtime.sendMessage({ action: 'MEET_READY', url: window.location.href });
})();
