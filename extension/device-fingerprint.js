// device-fingerprint.js — Genera un fingerprint único del dispositivo
// Este fingerprint persiste incluso si se desinstala/reinstala la extensión

/**
 * Genera un fingerprint único del dispositivo basado en características del navegador
 * que son consistentes para el mismo dispositivo/navegador.
 *
 * @returns {Promise<string>} Hash SHA-256 del fingerprint
 */
async function getDeviceFingerprint() {
  const components = [];

  // 1. User Agent (navegador + OS)
  components.push(navigator.userAgent);

  // 2. Idioma del navegador
  components.push(navigator.language);
  components.push(navigator.languages.join(','));

  // 3. Zona horaria
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // 4. Resolución de pantalla
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  components.push(`${screen.availWidth}x${screen.availHeight}`);

  // 5. Hardware concurrency (número de cores)
  components.push(navigator.hardwareConcurrency || 'unknown');

  // 6. Device memory (si está disponible)
  components.push(navigator.deviceMemory || 'unknown');

  // 7. Platform
  components.push(navigator.platform);

  // 8. Canvas fingerprint (técnica avanzada)
  const canvasFingerprint = await generateCanvasFingerprint();
  components.push(canvasFingerprint);

  // 9. WebGL fingerprint
  const webglFingerprint = generateWebGLFingerprint();
  components.push(webglFingerprint);

  // 10. Audio context fingerprint
  const audioFingerprint = await generateAudioFingerprint();
  components.push(audioFingerprint);

  // Combinar todos los componentes
  const fingerprintString = components.join('|||');

  // Generar hash SHA-256
  const hash = await hashString(fingerprintString);

  LOG.log('[Fingerprint] Componentes detallados:', {
    userAgent: navigator.userAgent.substring(0, 50) + '...',
    language: navigator.language,
    languages: navigator.languages.join(','),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    canvas: canvasFingerprint.substring(0, 30) + '...',
    webgl: webglFingerprint.substring(0, 30) + '...',
    audio: audioFingerprint.substring(0, 30) + '...',
    finalHash: hash
  });

  LOG.log('[Fingerprint] 🆔 Hash completo:', hash);

  return hash;
}

/**
 * Genera un fingerprint basado en cómo el navegador renderiza un canvas
 * Cada navegador/dispositivo renderiza de forma ligeramente diferente
 */
async function generateCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    // Dibujar texto con diferentes estilos
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 100, 50);
    ctx.fillStyle = '#069';
    ctx.fillText('Confident 🎯', 2, 2);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('fingerprint', 4, 17);

    // Dibujar formas
    ctx.strokeStyle = 'rgb(255, 0, 255)';
    ctx.beginPath();
    ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
    ctx.stroke();

    // Obtener los datos del canvas como string
    const dataUrl = canvas.toDataURL();

    // Hash simple del canvas data
    return await hashString(dataUrl);
  } catch (err) {
    LOG.warn('[Fingerprint] Canvas error:', err);
    return 'canvas-unavailable';
  }
}

/**
 * Genera un fingerprint basado en las capacidades de WebGL
 */
function generateWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return 'webgl-unavailable';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'webgl-no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return `${vendor}~~~${renderer}`;
  } catch (err) {
    LOG.warn('[Fingerprint] WebGL error:', err);
    return 'webgl-error';
  }
}

/**
 * Genera un fingerprint basado en Audio Context
 * Diferentes hardware de audio generan señales ligeramente diferentes
 */
async function generateAudioFingerprint() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return 'audio-unavailable';

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0; // Silenciar
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(0);

    let cleaned = false; // Flag para evitar doble cleanup

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;

      try {
        if (oscillator && oscillator.context.state !== 'closed') {
          oscillator.stop();
        }
      } catch (e) {
        // Ignorar error si ya está stopped
      }

      try {
        if (context && context.state !== 'closed') {
          context.close();
        }
      } catch (e) {
        // Ignorar error si ya está closed
      }
    };

    return new Promise((resolve) => {
      scriptProcessor.addEventListener('audioprocess', function handler(event) {
        const output = event.outputBuffer.getChannelData(0);
        const fingerprint = Array.from(output.slice(0, 30))
          .map(v => Math.abs(v))
          .join(',');

        scriptProcessor.removeEventListener('audioprocess', handler);
        cleanup();
        resolve(fingerprint.substring(0, 100));
      });

      // Timeout de seguridad
      setTimeout(() => {
        cleanup();
        resolve('audio-timeout');
      }, 100);
    });
  } catch (err) {
    LOG.warn('[Fingerprint] Audio error:', err);
    return 'audio-error';
  }
}

/**
 * Genera un hash SHA-256 de un string
 */
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getDeviceFingerprint };
}
