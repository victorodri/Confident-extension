// offscreen.js — Offscreen Document de Confident
// Tiene acceso completo al DOM, AudioContext y getUserMedia.
// Recibe el streamId desde background.js, captura el audio del tab
// y lo envía al backend vía HTTP POST.

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

// CONFIG se carga desde config.js (incluido en offscreen.html)
// Auto-detecta desarrollo vs producción basado en la versión del manifest

// Intervalo de envío de audio (en milisegundos)
const SEND_INTERVAL_MS = 3000; // 3 segundos

// ─────────────────────────────────────────────────────────────
// ESTADO (local al offscreen document, no al Service Worker)
// ─────────────────────────────────────────────────────────────

let audioCtx = null;
let processor = null;
let tabSource = null;
let micSource = null;
let tabStream = null;
let micStream = null;
let currentProfile = null;

// Estado para acumular audio
let audioChunks = [];
let lastSendTime = Date.now();

// ─────────────────────────────────────────────────────────────
// LOG DE INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────
console.log('[DEBUG OFFSCREEN] ========== OFFSCREEN DOCUMENT CARGADO ==========');
console.log('[DEBUG OFFSCREEN] CONFIG:', typeof CONFIG !== 'undefined' ? CONFIG : 'NO DEFINIDO');
console.log('[DEBUG OFFSCREEN] CONFIG.BASE_URL:', typeof CONFIG !== 'undefined' ? CONFIG.BASE_URL : 'NO DEFINIDO');
console.log('[DEBUG OFFSCREEN] LOG:', typeof LOG !== 'undefined' ? 'Disponible' : 'NO DEFINIDO');

// ─────────────────────────────────────────────────────────────
// LISTENER DE MENSAJES DESDE BACKGROUND
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('[DEBUG OFFSCREEN] ========== MENSAJE RECIBIDO ==========');
    console.log('[DEBUG OFFSCREEN] message:', message);
    console.log('[DEBUG OFFSCREEN] sender:', sender);
    console.log('[DEBUG OFFSCREEN] action:', message?.action);

    if (message.action === 'START_AUDIO') {
      LOG.log('[DEBUG OFFSCREEN] ✅ START_AUDIO recibido');
      LOG.log('[DEBUG OFFSCREEN] streamId:', message.streamId);
      LOG.log('[DEBUG OFFSCREEN] profile:', message.profile);

      startAudioPipeline(message.streamId, message.profile)
        .then(() => {
          LOG.log('[DEBUG OFFSCREEN] startAudioPipeline completado correctamente');
          sendResponse({ ok: true });
        })
        .catch((err) => {
          LOG.error('[Offscreen] ❌ Error al iniciar pipeline de audio:', err.name, '-', err.message);
          LOG.error('[Offscreen] ❌ Stack:', err.stack);
          sendResponse({ ok: false, error: err.message || err.name });
        });
      return true; // mantener canal abierto para respuesta asíncrona
    }

    if (message.action === 'STOP_AUDIO') {
      LOG.log('[DEBUG OFFSCREEN] STOP_AUDIO recibido');
      stopAudioPipeline();
      sendResponse({ ok: true });
      return false;
    }

    console.log('[DEBUG OFFSCREEN] Acción no reconocida:', message.action);
    return false;

  } catch (err) {
    console.error('[DEBUG OFFSCREEN] ❌❌❌ ERROR EN LISTENER:', err);
    console.error('[DEBUG OFFSCREEN] Error name:', err.name);
    console.error('[DEBUG OFFSCREEN] Error message:', err.message);
    console.error('[DEBUG OFFSCREEN] Error stack:', err.stack);
    return false;
  }
});

console.log('[DEBUG OFFSCREEN] ✅ Listener de mensajes registrado');

// ─────────────────────────────────────────────────────────────
// PIPELINE DE AUDIO
// ─────────────────────────────────────────────────────────────

async function startAudioPipeline(streamId, profile) {
  LOG.log('[Offscreen] startAudioPipeline llamado');
  LOG.log('[Offscreen] streamId:', streamId);
  LOG.log('[Offscreen] profile:', profile);

  currentProfile = profile;

  // 1. Capturar audio del TAB (otros participantes)
  LOG.log('[Offscreen] Capturando audio del tab...');

  try {
    tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });
    LOG.log('[Offscreen] ✅ Tab stream obtenido');
  } catch (err) {
    LOG.error('[Offscreen] ❌ Error al obtener tab stream:', err.name, '-', err.message);
    throw err;
  }

  // 2. Capturar audio del MICRÓFONO (permiso ya concedido desde popup)
  LOG.log('[Offscreen] Capturando audio del micrófono...');

  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });
    LOG.log('[Offscreen] ✅ Micrófono obtenido');
  } catch (err) {
    LOG.warn('[Offscreen] ⚠️ No se pudo capturar micrófono:', err.message);
    LOG.warn('[Offscreen] Continuando solo con audio del tab');
    micStream = null;
  }

  // 3. Configurar AudioContext a 16kHz
  audioCtx = new AudioContext({ sampleRate: 16000 });

  // 4. Crear nodos de fuente
  tabSource = audioCtx.createMediaStreamSource(tabStream);

  if (micStream) {
    micSource = audioCtx.createMediaStreamSource(micStream);
  }

  // 5. ScriptProcessor para capturar audio
  const bufferSize = 4096;
  processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);

  // 6. IMPORTANTE: Conectar tabSource directamente al destination para que el usuario escuche el audio
  // Esto asegura que el audio de la videollamada NO se silencie
  tabSource.connect(audioCtx.destination);

  // 7. Si tenemos ambos streams, mezclarlos para procesamiento
  if (micSource) {
    // Crear mezclador
    const merger = audioCtx.createChannelMerger(2);
    tabSource.connect(merger, 0, 0);
    micSource.connect(merger, 0, 1);

    // Convertir a mono mezclando ambos canales
    const splitter = audioCtx.createChannelSplitter(2);
    merger.connect(splitter);

    const mixGain = audioCtx.createGain();
    mixGain.gain.value = 0.5; // 50/50 mix

    splitter.connect(mixGain, 0);
    splitter.connect(mixGain, 1);

    mixGain.connect(processor);
  } else {
    // Solo tab - conectar al processor para procesamiento
    tabSource.connect(processor);
  }

  // NO conectar processor a destination - ya tenemos el audio directo del tab

  // 7. Procesar audio: acumular y enviar cada N segundos
  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    const pcm16 = float32ToInt16(inputData);

    audioChunks.push(pcm16);

    const now = Date.now();
    if (now - lastSendTime >= SEND_INTERVAL_MS) {
      sendAudioToBackend();
      lastSendTime = now;
    }
  };

  if (micSource) {
    LOG.log('[Offscreen] ✅ Pipeline iniciado - mezclando tab + micrófono');
  } else {
    LOG.log('[Offscreen] ✅ Pipeline iniciado - solo audio del tab');
  }
  LOG.log('[Offscreen] Enviando audio cada', SEND_INTERVAL_MS / 1000, 'segundos al backend');
}

async function sendAudioToBackend() {
  if (audioChunks.length === 0) {
    LOG.log('[DEBUG] audioChunks vacío, saltando envío');
    return;
  }

  // Combinar todos los chunks
  const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Int16Array(totalLength);
  let offset = 0;

  for (const chunk of audioChunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  audioChunks = [];

  try {
    // DEBUG: Verificar CONFIG
    LOG.log('[DEBUG] CONFIG object:', CONFIG);
    LOG.log('[DEBUG] CONFIG.BASE_URL:', CONFIG.BASE_URL);

    const fullUrl = `${CONFIG.BASE_URL}/api/transcribe-stream`;
    LOG.log('[DEBUG] Full URL:', fullUrl);
    LOG.log('[DEBUG] Audio bytes:', combined.length * 2);

    LOG.log('[DEBUG] Iniciando fetch...');
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/raw',
      },
      body: combined.buffer,
    });

    LOG.log('[DEBUG] Fetch completado');
    LOG.log('[DEBUG] Response status:', response.status);
    LOG.log('[DEBUG] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      LOG.error('[Offscreen] Backend error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    LOG.log('[DEBUG] Response JSON:', data);

    if (data.transcript && data.transcript.trim()) {
      LOG.log('[Offscreen] Transcripción recibida:', data.transcript);

      chrome.runtime.sendMessage({
        action: 'TRANSCRIPT',
        transcript: data.transcript,
        isFinal: true,
        speaker: null,
        profile: currentProfile,
      });
    } else {
      LOG.log('[DEBUG] No transcript en respuesta o vacío');
    }

  } catch (err) {
    LOG.error('[DEBUG] Fetch FAILED - Error name:', err.name);
    LOG.error('[DEBUG] Fetch FAILED - Error message:', err.message);
    LOG.error('[DEBUG] Fetch FAILED - Full error:', err);
    LOG.error('[DEBUG] Fetch FAILED - Stack:', err.stack);
  }
}

// ─────────────────────────────────────────────────────────────
// DETENER PIPELINE
// ─────────────────────────────────────────────────────────────

function stopAudioPipeline() {
  // Enviar último chunk antes de cerrar
  if (audioChunks.length > 0) {
    sendAudioToBackend();
  }

  cleanupAudioResources();
}

// ─────────────────────────────────────────────────────────────
// LIBERAR RECURSOS DE AUDIO
// ─────────────────────────────────────────────────────────────

function cleanupAudioResources() {
  LOG.log('[Offscreen] Liberando recursos de audio...');

  audioChunks = [];

  // Recursos a limpiar: [nombre, variable, método]
  const resources = [
    ['processor', processor, 'disconnect'],
    ['tabSource', tabSource, 'disconnect'],
    ['micSource', micSource, 'disconnect'],
    ['audioCtx', audioCtx, 'close'],
    ['tabStream', tabStream, (s) => s?.getTracks().forEach(t => t.stop())],
    ['micStream', micStream, (s) => s?.getTracks().forEach(t => t.stop())]
  ];

  resources.forEach(([name, resource, method]) => {
    try {
      if (resource) {
        if (typeof method === 'string') {
          resource[method]?.();
        } else {
          method(resource);
        }
      }
    } catch (e) {
      LOG.warn(`[Offscreen] Error limpiando ${name}:`, e.message);
    }
  });

  // Reset variables
  processor = tabSource = micSource = audioCtx = tabStream = micStream = null;

  LOG.log('[Offscreen] ✅ Recursos de audio liberados');
}

// ─────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────

/**
 * Convierte Float32Array (WebAudio) a Int16Array (PCM16 para Deepgram)
 */
function float32ToInt16(float32Array) {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
  }
  return int16Array;
}

// ─────────────────────────────────────────────────────────────
// NOTIFICAR A BACKGROUND QUE ESTAMOS LISTOS
// ─────────────────────────────────────────────────────────────
// IMPORTANTE: Esto se ejecuta al FINAL del archivo, después de que
// todos los listeners estén registrados, para evitar race conditions
console.log('[DEBUG OFFSCREEN] Todos los listeners registrados, enviando OFFSCREEN_READY...');
chrome.runtime.sendMessage({ action: 'OFFSCREEN_READY' })
  .then(() => console.log('[DEBUG OFFSCREEN] ✅ OFFSCREEN_READY enviado'))
  .catch(err => console.error('[DEBUG OFFSCREEN] ❌ Error enviando OFFSCREEN_READY:', err));
