// constants.js - Constantes consolidadas para la extensión
// Centraliza magic numbers y valores de configuración

const CONSTANTS = {
  // Límites de historial y logs
  HISTORY_MAX_ENTRIES: 20,
  FEEDBACK_LOG_MAX_ENTRIES: 50,

  // Timings (en milisegundos)
  STATUS_MESSAGE_TIMEOUT_MS: 4000,
  SESSION_GATE_CHECK_DELAY_MS: 500,

  // Umbrales de advertencia
  REMAINING_SESSIONS_WARNING_THRESHOLD: 3,

  // Buffer de contexto para análisis
  CONTEXT_BUFFER_SIZE: 3,

  // Audio
  AUDIO_SEND_INTERVAL_MS: 3000,
  AUDIO_BUFFER_SIZE: 4096
};

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
}
