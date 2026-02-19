// background.js — Service Worker principal de Confident
// MV3-compatible: usa getMediaStreamId + Offscreen Document
// chrome.tabCapture.capture() fue eliminado de Service Workers en MV3
//
// REGLAS CRÍTICAS:
// - NUNCA variables globales persistentes (el SW puede morir en cualquier momento)
// - Estado de sesión en chrome.storage.session
// - tabCapture.getMediaStreamId REQUIERE user gesture real desde el popup

const ANALYZE_API_URL = 'http://localhost:3000/api/analyze';

const OFFSCREEN_URL = chrome.runtime.getURL('offscreen.html');

// ─────────────────────────────────────────────────────────────
// INSTALACIÓN
// ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener((_details) => {
  // Primera instalación — sin acción adicional por ahora
});

// ─────────────────────────────────────────────────────────────
// LISTENER DE MENSAJES DESDE POPUP / PANEL / OFFSCREEN
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_SESSION') {
    handleStartSession(message.tabId, message.profile, message.deepgramKey)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => {
        console.error('[Confident] Error al iniciar sesión:', err);
        sendResponse({ ok: false, error: err.message });
      });
    return true; // mantener canal abierto para respuesta asíncrona
  }

  if (message.action === 'STOP_SESSION') {
    handleStopSession()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  // Transcripciones provenientes del offscreen document
  if (message.action === 'TRANSCRIPT') {
    const { transcript, isFinal, speaker, profile } = message;
    if (isFinal) {
      accumulateFinalTranscript(transcript, profile);
    }
    return false;
  }

  if (message.action === 'VAD_STARTED') {
    return false;
  }

  if (message.action === 'VAD_ENDED') {
    callAnalyzeAPI();
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// ACUMULACIÓN DE TRANSCRIPCIONES Y LLAMADA A CLAUDE
// ─────────────────────────────────────────────────────────────

// Acumula la frase final en chrome.storage.session
// (no usamos variables globales porque el SW puede morir)
async function accumulateFinalTranscript(transcript, profile) {
  const data = await chrome.storage.session.get(['pendingText', 'contextBuffer']);
  const pending = data.pendingText ?? '';
  const context = data.contextBuffer ?? [];

  const newPending = pending ? `${pending} ${transcript}` : transcript;

  await chrome.storage.session.set({
    pendingText: newPending,
    contextBuffer: context,
    lastProfile: profile,
  });
}

// Envía el texto acumulado a /api/analyze y loguea la respuesta
async function callAnalyzeAPI() {
  const data = await chrome.storage.session.get(['pendingText', 'contextBuffer', 'lastProfile', 'profile']);
  const text = data.pendingText ?? '';
  const contextBuffer = data.contextBuffer ?? [];
  const profile = data.lastProfile ?? data.profile ?? 'candidato';

  if (!text.trim()) {
    return;
  }

  // Limpiar el buffer pendiente antes de la llamada (evita duplicados si llegan más VAD_ENDED)
  await chrome.storage.session.set({ pendingText: '' });

  const contextText = contextBuffer.slice(-3).join('\n');

  try {
    const response = await fetch(ANALYZE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        profile,
        context: contextText,
        session_type: 'general',
      }),
    });

    if (!response.ok) {
      console.error(`[Confident] /api/analyze respondió con status ${response.status}`);
      return;
    }

    const result = await response.json();

    // Reenviar sugerencia al side panel
    // El panel puede no estar abierto — ignorar el error de "no receiver"
    chrome.runtime.sendMessage({ action: 'NEW_SUGGESTION', result }).catch(() => {});

    // Actualizar el buffer de contexto con la frase procesada
    const updatedContext = [...contextBuffer, text].slice(-3);
    await chrome.storage.session.set({ contextBuffer: updatedContext });
  } catch (err) {
    console.error('[Confident] Error al llamar a /api/analyze:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// INICIAR SESIÓN DE CAPTURA
// ─────────────────────────────────────────────────────────────

async function handleStartSession(tabId, profile, deepgramKey) {
  // 1. Obtener streamId (funciona desde Service Worker en MV3)
  const streamId = await getTabStreamId(tabId);

  // 2. Crear (o reutilizar) el offscreen document
  await createOffscreenDocument();

  // 3. Guardar estado de sesión (y resetear buffers de contexto)
  await chrome.storage.session.set({
    sessionActive: true,
    profile,
    startedAt: Date.now(),
    pendingText: '',
    contextBuffer: [],
    lastProfile: profile,
  });

  // 4. Enviar streamId + config al offscreen document para que inicie el pipeline
  await chrome.runtime.sendMessage({
    action: 'START_AUDIO',
    streamId,
    profile,
    deepgramKey,
  });

  // Notificar al side panel que la sesión ha comenzado
  chrome.runtime.sendMessage({ action: 'SESSION_STARTED', profile }).catch(() => {});
}

// ─────────────────────────────────────────────────────────────
// OBTENER STREAM ID DEL TAB (MV3-compatible)
// ─────────────────────────────────────────────────────────────

function getTabStreamId(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, (streamId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(`getMediaStreamId falló: ${chrome.runtime.lastError.message}`));
        return;
      }
      if (!streamId) {
        reject(new Error('getMediaStreamId devolvió streamId nulo'));
        return;
      }
      resolve(streamId);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// CREAR O REUTILIZAR OFFSCREEN DOCUMENT
// ─────────────────────────────────────────────────────────────

async function createOffscreenDocument() {
  // Verificar si ya existe un offscreen document activo
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [OFFSCREEN_URL],
  });

  if (existingContexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Capturar y procesar audio del tab para transcripción en tiempo real',
  });
}

// ─────────────────────────────────────────────────────────────
// DETENER SESIÓN
// ─────────────────────────────────────────────────────────────

async function handleStopSession() {
  // Notificar al offscreen document para que cierre el WebSocket y libere recursos
  try {
    await chrome.runtime.sendMessage({ action: 'STOP_AUDIO' });
  } catch (err) {
    // El offscreen document puede no estar activo si ya fue cerrado
    console.warn('[Confident] No se pudo notificar STOP_AUDIO al offscreen:', err.message);
  }

  await chrome.storage.session.set({ sessionActive: false, deepgramConnected: false });

  // Notificar al side panel que la sesión ha terminado
  chrome.runtime.sendMessage({ action: 'SESSION_STOPPED' }).catch(() => {});
}
