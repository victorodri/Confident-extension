// offscreen.js — Offscreen Document de Confident
// Tiene acceso completo al DOM, AudioContext y getUserMedia.
// Recibe el streamId desde background.js, captura el audio del tab
// y lo envía a Deepgram via WebSocket.

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';

const DEEPGRAM_PARAMS = new URLSearchParams({
  model: 'nova-2-phonecall',
  language: 'es',
  punctuate: 'true',
  interim_results: 'true',
  utterance_end_ms: '1500',
  vad_events: 'true',
  diarize: 'true',
  encoding: 'linear16',
  sample_rate: '16000',
  channels: '1',
}).toString();

// ─────────────────────────────────────────────────────────────
// ESTADO (local al offscreen document, no al Service Worker)
// ─────────────────────────────────────────────────────────────

let audioCtx = null;
let processor = null;
let source = null;
let socket = null;
let activeStream = null;
let currentProfile = null;

// ─────────────────────────────────────────────────────────────
// LISTENER DE MENSAJES DESDE BACKGROUND
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_AUDIO') {
    startAudioPipeline(message.streamId, message.profile, message.deepgramKey)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => {
        console.error('[Offscreen] Error al iniciar pipeline de audio:', err);
        sendResponse({ ok: false, error: err.message });
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

async function startAudioPipeline(streamId, profile, deepgramKey) {
  if (!deepgramKey) {
    throw new Error('Deepgram API key no proporcionada.');
  }

  currentProfile = profile;

  // 1. Obtener el MediaStream del tab usando el streamId
  //    chromeMediaSource: 'tab' es la única forma válida en offscreen documents
  activeStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId,
      },
    },
    video: false,
  });

  // 2. Configurar AudioContext a 16kHz (lo que espera Deepgram con linear16)
  audioCtx = new AudioContext({ sampleRate: 16000 });
  source = audioCtx.createMediaStreamSource(activeStream);

  // ScriptProcessor para interceptar los chunks de audio y convertirlos a PCM16
  // bufferSize 4096 ≈ 256ms de audio a 16kHz — balance entre latencia y overhead
  const bufferSize = 4096;
  processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);

  // 3. Abrir WebSocket con Deepgram
  const wsUrl = `${DEEPGRAM_URL}?${DEEPGRAM_PARAMS}`;
  socket = new WebSocket(wsUrl, ['token', deepgramKey]);

  let wsReady = false;

  socket.onopen = () => {
    wsReady = true;
    chrome.storage.session.set({ deepgramConnected: true });
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
        const alt = data.channel.alternatives[0];
        const transcript = alt.transcript?.trim();

        if (!transcript) return;

        const speaker = alt.words?.[0]?.speaker ?? null;

        // Reenviar transcripción al background para que la imprima / procese
        chrome.runtime.sendMessage({
          action: 'TRANSCRIPT',
          transcript,
          isFinal: data.is_final,
          speaker,
          profile: currentProfile,
        });
      }

      if (data.type === 'SpeechStarted') {
        chrome.runtime.sendMessage({ action: 'VAD_STARTED' });
      }

      if (data.type === 'UtteranceEnd') {
        chrome.runtime.sendMessage({ action: 'VAD_ENDED' });
      }

    } catch (err) {
      console.error('[Offscreen] Error parsing Deepgram message:', err);
    }
  };

  socket.onerror = (err) => {
    console.error('[Offscreen] WebSocket error:', err);
  };

  socket.onclose = (_event) => {
    wsReady = false;
    chrome.storage.session.set({ deepgramConnected: false });
    cleanupAudioResources();
  };

  // 4. Conectar nodos: source → processor → destination
  //    (destination necesita estar conectado aunque no reproduzcamos nada)
  source.connect(processor);
  processor.connect(audioCtx.destination);

  // 5. En cada chunk de audio: convertir Float32 → PCM16 y enviar al WebSocket
  processor.onaudioprocess = (e) => {
    if (!wsReady || socket.readyState !== WebSocket.OPEN) return;

    const inputData = e.inputBuffer.getChannelData(0);
    const pcm16 = float32ToInt16(inputData);
    socket.send(pcm16.buffer);
  };
}

// ─────────────────────────────────────────────────────────────
// DETENER PIPELINE
// ─────────────────────────────────────────────────────────────

function stopAudioPipeline() {

  if (socket && socket.readyState === WebSocket.OPEN) {
    // Enviar mensaje de cierre limpio a Deepgram antes de cerrar
    try {
      socket.send(JSON.stringify({ type: 'CloseStream' }));
    } catch (err) {
      // ignorar si falla — el close() a continuación lo maneja
    }
    socket.close();
  } else {
    // Si el socket ya estaba cerrado, limpiar recursos directamente
    cleanupAudioResources();
  }
}

// ─────────────────────────────────────────────────────────────
// LIBERAR RECURSOS DE AUDIO
// ─────────────────────────────────────────────────────────────

function cleanupAudioResources() {
  if (processor) {
    processor.disconnect();
    processor = null;
  }
  if (source) {
    source.disconnect();
    source = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  if (activeStream) {
    activeStream.getTracks().forEach((track) => track.stop());
    activeStream = null;
  }
  socket = null;
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
