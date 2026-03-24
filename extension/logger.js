// logger.js - Sistema de logging seguro para la extensión
// En desarrollo (0.x.x): Logs completos
// En producción (1.x.x+): Solo errores/warnings, datos sensibles sanitizados

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
 * Sanitiza datos sensibles antes de loguear
 * @param {any} data
 * @returns {any}
 */
function sanitizeData(data) {
  if (typeof data === 'string') {
    // Ocultar UUIDs parcialmente (mostrar solo primeros 8 chars)
    return data.replace(
      /([0-9a-f]{8})-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      '$1-****'
    );
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };

    // Campos sensibles a redactar
    const sensitiveFields = [
      'user_id', 'userId', 'anonymous_id', 'anonymousId',
      'email', 'session_id', 'sessionId', 'api_key', 'apiKey',
      'password', 'token', 'jwt', 'authorization', 'text', 'transcript'
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        if (typeof sanitized[field] === 'string' && sanitized[field].length > 20) {
          // Mostrar solo primeros 20 chars de textos largos
          sanitized[field] = sanitized[field].substring(0, 20) + '... [REDACTED]';
        } else {
          sanitized[field] = '[REDACTED]';
        }
      }
    }

    return sanitized;
  }

  return data;
}

/**
 * Logger seguro - sanitiza datos en producción
 * Uso: LOG.log('mensaje'), LOG.warn('advertencia'), LOG.error('error')
 */
const LOG = {
  /**
   * Log informativo - solo en desarrollo
   * @param {...any} args - Argumentos a loguear
   */
  log: (...args) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },

  /**
   * Advertencia - sanitizada en producción
   * @param {...any} args - Argumentos a loguear
   */
  warn: (...args) => {
    if (IS_DEV) {
      console.warn(...args);
    } else {
      console.warn(...args.map(sanitizeData));
    }
  },

  /**
   * Error - sanitizado en producción
   * @param {...any} args - Argumentos a loguear
   */
  error: (...args) => {
    if (IS_DEV) {
      console.error(...args);
    } else {
      console.error(...args.map(sanitizeData));
    }
  },

  /**
   * Info - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  info: (...args) => {
    if (IS_DEV) console.info(...args);
  },

  /**
   * Debug - solo en desarrollo
   * @param {...any} args - Argumentos a loggear
   */
  debug: (...args) => {
    if (IS_DEV) console.debug(...args);
  }
};

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOG, IS_DEV };
}
