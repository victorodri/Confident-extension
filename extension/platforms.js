// platforms.js — Detección y configuración de plataformas de videollamadas
// Soportadas: Google Meet, Microsoft Teams, Zoom

const PLATFORMS = {
  'meet.google.com': {
    id: 'google-meet',
    name: 'Google Meet',
    displayName: 'Google Meet',
    icon: '🎥',
    color: '#00897B', // Teal de Google
    audioSupported: true,
    notes: 'Completamente soportado'
  },
  'teams.microsoft.com': {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    displayName: 'Microsoft Teams',
    icon: '💼',
    color: '#6264A7', // Purple de Teams
    audioSupported: true,
    notes: 'Soportado en versión web'
  },
  'zoom.us': {
    id: 'zoom',
    name: 'Zoom',
    displayName: 'Zoom',
    icon: '📹',
    color: '#2D8CFF', // Blue de Zoom
    audioSupported: true,
    notes: 'Soportado en versión web'
  }
};

/**
 * Detecta la plataforma actual basándose en la URL
 * @param {string} url - URL completa de la página
 * @returns {Object|null} Configuración de la plataforma o null si no es soportada
 */
function detectPlatform(url) {
  if (!url) return null;

  // Verificar cada dominio
  for (const [domain, config] of Object.entries(PLATFORMS)) {
    if (url.includes(domain)) {
      return {
        domain,
        ...config
      };
    }
  }

  return null;
}

/**
 * Verifica si la URL actual es de una plataforma soportada
 * @param {string} url - URL a verificar
 * @returns {boolean}
 */
function isSupportedPlatform(url) {
  return detectPlatform(url) !== null;
}

/**
 * Obtiene la configuración de una plataforma específica por ID
 * @param {string} platformId - ID de la plataforma ('google-meet', 'microsoft-teams', 'zoom')
 * @returns {Object|null}
 */
function getPlatformById(platformId) {
  for (const [domain, config] of Object.entries(PLATFORMS)) {
    if (config.id === platformId) {
      return { domain, ...config };
    }
  }
  return null;
}

/**
 * Obtiene lista de todas las plataformas soportadas
 * @returns {Array}
 */
function getAllPlatforms() {
  return Object.entries(PLATFORMS).map(([domain, config]) => ({
    domain,
    ...config
  }));
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  // Node.js / Jest
  module.exports = {
    PLATFORMS,
    detectPlatform,
    isSupportedPlatform,
    getPlatformById,
    getAllPlatforms
  };
}
