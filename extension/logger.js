// logger.js - Sistema de logging condicional para la extensión
// Solo muestra logs en desarrollo (versión 0.x.x)
// En producción (versión 1.x.x+), no genera ningún output en console (privacidad + performance)

let IS_DEV = true; // Default a desarrollo
try {
  const manifestVersion = chrome.runtime.getManifest().version;
  const majorVersion = parseInt(manifestVersion.split('.')[0]);
  IS_DEV = majorVersion === 0;
} catch (e) {
  // Si hay error al obtener manifest, asumir desarrollo
  IS_DEV = true;
}

/**
 * Logger condicional - solo activo en desarrollo
 * Uso: LOG.log('mensaje'), LOG.warn('advertencia'), LOG.error('error')
 */
const LOG = {
  /**
   * Log informativo - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  log: (...args) => {
    if (IS_DEV) console.log(...args);
  },

  /**
   * Advertencia - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  warn: (...args) => {
    if (IS_DEV) console.warn(...args);
  },

  /**
   * Error - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  error: (...args) => {
    if (IS_DEV) console.error(...args);
  },

  /**
   * Info - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  info: (...args) => {
    if (IS_DEV) console.info(...args);
  }
};

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOG, IS_DEV };
}
