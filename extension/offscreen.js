// offscreen.js — Offscreen Document de Confident
// Tiene acceso completo al DOM, AudioContext y getUserMedia.
// Recibe el streamId desde background.js, captura el audio del tab
// y lo envía al backend vía HTTP POST.

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

// URL del backend (cambiar según entorno)
const BACKEND_URL = 'http://localhost:3000'; // Desarrollo
// const BACKEND_URL = 'https://tryconfident.vercel.app'; // Producción

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
// LISTENER DE MENSAJES DESDE BACKGROUND
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_AUDIO') {
    startAudioPipeline(message.streamId, message.profile)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => {
        console.error('[Offscreen] ❌ Error al iniciar pipeline de audio:', err.name, '-', err.message);
        console.error('[Offscreen] ❌ Stack:', err.stack);
        sendResponse({ ok: false, error: err.message || err.name });
      });
    return true; // mantener canal abierto para respuesta asíncrona
  }

  if (message.action === 'STOP_AUDIO') {
    stopAudioPipeline();
    sendResponse({ ok: true });
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// PIPELINE DE AUDIO
// ─────────────────────────────────────────────────────────────

async function startAudioPipeline(streamId, profile) {
  console.log('[Offscreen] startAudioPipeline llamado');
  console.log('[Offscreen] streamId:', streamId);
  console.log('[Offscreen] profile:', profile);

  currentProfile = profile;

  // 1. Capturar audio del TAB (otros participantes)
  console.log('[Offscreen] Capturando audio del tab...');

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
    console.log('[Offscreen] ✅ Tab stream obtenido');
  } catch (err) {
    console.error('[Offscreen] ❌ Error al obtener tab stream:', err.name, '-', err.message);
    throw err;
  }

  // 2. Capturar audio del MICRÓFONO (permiso ya concedido desde popup)
  console.log('[Offscreen] Capturando audio del micrófono...');

  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });
    console.log('[Offscreen] ✅ Micrófono obtenido');
  } catch (err) {
    console.warn('[Offscreen] ⚠️ No se pudo capturar micrófono:', err.message);
    console.warn('[Offscreen] Continuando solo con audio del tab');
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

  // 6. Si tenemos ambos streams, mezclarlos
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
    // Solo tab
    tabSource.connect(processor);
  }

  processor.connect(audioCtx.destination);

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
    console.log('[Offscreen] ✅ Pipeline iniciado - mezclando tab + micrófono');
  } else {
    console.log('[Offscreen] ✅ Pipeline iniciado - solo audio del tab');
  }
  console.log('[Offscreen] Enviando audio cada', SEND_INTERVAL_MS / 1000, 'segundos al backend');
}

async function sendAudioToBackend() {
  if (audioChunks.length === 0) return;

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
    console.log('[Offscreen] Enviando', combined.length, 'muestras al backend (', (combined.length * 2), 'bytes )');

    const response = await fetch(`${BACKEND_URL}/api/transcribe-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/raw',
      },
      body: combined.buffer,
    });

    if (!response.ok) {
      console.error('[Offscreen] Backend error:', response.status);
      return;
    }

    const data = await response.json();

    if (data.transcript && data.transcript.trim()) {
      console.log('[Offscreen] Transcripción recibida:', data.transcript);

      chrome.runtime.sendMessage({
        action: 'TRANSCRIPT',
        transcript: data.transcript,
        isFinal: true,
        speaker: null,
        profile: currentProfile,
      });
    }

  } catch (err) {
    console.error('[Offscreen] Error enviando audio:', err);
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
  console.log('[Offscreen] Liberando recursos de audio...');

  audioChunks = [];

  try {
    if (processor) {
      processor.disconnect();
      processor = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al desconectar processor:', e.message);
  }

  try {
    if (tabSource) {
      tabSource.disconnect();
      tabSource = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al desconectar tabSource:', e.message);
  }

  try {
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al desconectar micSource:', e.message);
  }

  try {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al cerrar audioCtx:', e.message);
  }

  try {
    if (tabStream) {
      tabStream.getTracks().forEach((track) => track.stop());
      tabStream = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al detener tabStream:', e.message);
  }

  try {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      micStream = null;
    }
  } catch (e) {
    console.warn('[Offscreen] Error al detener micStream:', e.message);
  }

  console.log('[Offscreen] ✅ Recursos de audio liberados');
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
