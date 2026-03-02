// content-script.js — Inyectado en plataformas de videollamadas soportadas
// Sesión 21: Soporte multi-plataforma (Google Meet, Teams, Zoom)
// Detecta la plataforma actual y notifica al background

(function () {
  // Detectar plataforma usando platforms.js (inyectado antes)
  const currentUrl = window.location.href;
  const platform = detectPlatform(currentUrl);

  if (!platform) {
    console.log('[Confident] Plataforma no soportada:', window.location.hostname);
    return;
  }

  console.log('[Confident] Plataforma detectada:', platform.name);

  // Notificar al background que la plataforma está lista
  chrome.runtime.sendMessage({
    action: 'PLATFORM_READY',
    platform: {
      id: platform.id,
      name: platform.name,
      displayName: platform.displayName,
      domain: platform.domain,
      icon: platform.icon,
      color: platform.color
    },
    url: currentUrl
  });

  // Listeners para cambios de URL (SPA navigation)
  let lastUrl = currentUrl;
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;

      // Re-detectar plataforma (por si cambió)
      const newPlatform = detectPlatform(lastUrl);
      if (newPlatform) {
        chrome.runtime.sendMessage({
          action: 'PLATFORM_READY',
          platform: {
            id: newPlatform.id,
            name: newPlatform.name,
            displayName: newPlatform.displayName,
            domain: newPlatform.domain,
            icon: newPlatform.icon,
            color: newPlatform.color
          },
          url: lastUrl
        });
      }
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
