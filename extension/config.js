// config.js - Configuración centralizada de URLs y endpoints
// Auto-detecta desarrollo vs producción basado en la versión del manifest

const CONFIG = {
  // URLs base
  DEV: 'http://localhost:3000',
  PROD: 'https://tryconfident.vercel.app', // CAMBIAR a URL final de producción

  /**
   * Detecta automáticamente si estamos en desarrollo o producción
   * basado en la versión del manifest:
   * - Versiones 0.x.x = desarrollo (localhost)
   * - Versiones 1.x.x o superior = producción
   */
  get BASE_URL() {
    try {
      const manifestData = chrome.runtime.getManifest();
      const version = manifestData.version;
      const majorVersion = parseInt(version.split('.')[0]);
      const isDev = majorVersion === 0;
      return isDev ? this.DEV : this.PROD;
    } catch (e) {
      // Fallback a DEV si hay error al obtener el manifest
      return this.DEV;
    }
  },

  /**
   * Endpoints de la API
   * Todos se construyen dinámicamente usando BASE_URL
   */
  ENDPOINTS: {
    get ANALYZE() {
      return `${CONFIG.BASE_URL}/api/analyze`;
    },
    get SEND_TRANSCRIPT() {
      return `${CONFIG.BASE_URL}/api/send-transcript`;
    },
    get SESSION() {
      return `${CONFIG.BASE_URL}/api/session`;
    },
    get SESSION_CLOSE() {
      return `${CONFIG.BASE_URL}/api/sessions/close`;
    },
    get TRANSCRIPTIONS() {
      return `${CONFIG.BASE_URL}/api/transcriptions`;
    },
    get SUGGESTIONS() {
      return `${CONFIG.BASE_URL}/api/suggestions`;
    },
    get USAGE() {
      return `${CONFIG.BASE_URL}/api/usage`;
    },
    get PROFILE_CONTEXT() {
      return `${CONFIG.BASE_URL}/api/profile/context`;
    },
    get AUTH() {
      return `${CONFIG.BASE_URL}/auth`;
    },
    get LOGIN() {
      return `${CONFIG.BASE_URL}/login`;
    },
    get PRICING() {
      return `${CONFIG.BASE_URL}/pricing`;
    },
    get DASHBOARD() {
      return `${CONFIG.BASE_URL}/dashboard`;
    }
  }
};

// Exportar para uso en módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
