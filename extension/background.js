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

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Confident] Extensión instalada. Listo para Meet.');
  }
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
      console.log(`[Confident] [FINAL] [perfil:${profile}] [hablante:${speaker ?? 'unknown'}] "${transcript}"`);
      accumulateFinalTranscript(transcript, profile);
    } else {
      console.log(`[Confident] [parcial] "${transcript}"`);
    }
    return false;
  }

  if (message.action === 'VAD_STARTED') {
    console.log('[Confident] Detectado inicio de voz');
    return false;
  }

  if (message.action === 'VAD_ENDED') {
    console.log('[Confident] Fin de enunciado — llamando a Claude...');
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
    console.log('[Confident] Sin texto acumulado — no se llama a Claude.');
    return;
  }

  // Limpiar el buffer pendiente antes de la llamada (evita duplicados si llegan más VAD_ENDED)
  await chrome.storage.session.set({ pendingText: '' });

  const contextText = contextBuffer.slice(-3).join('\n');

  console.log(`[Confident] Enviando a /api/analyze | perfil:${profile} | texto: "${text}"`);

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
    console.log('[Confident] Sugerencia de Claude:', JSON.stringify(result, null, 2));

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
  console.log(`[Confident] Iniciando sesión | Perfil: ${profile} | Tab: ${tabId}`);

  // 1. Obtener streamId (funciona desde Service Worker en MV3)
  const streamId = await getTabStreamId(tabId);
  console.log('[Confident] streamId obtenido ✓');

  // 2. Crear (o reutilizar) el offscreen document
  await createOffscreenDocument();
  console.log('[Confident] Offscreen document listo ✓');

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

  console.log('[Confident] Mensaje START_AUDIO enviado al offscreen document.');
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
    console.log('[Confident] Offscreen document ya existe, reutilizando.');
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
  console.log('[Confident] Deteniendo sesión...');

  // Notificar al offscreen document para que cierre el WebSocket y libere recursos
  try {
    await chrome.runtime.sendMessage({ action: 'STOP_AUDIO' });
  } catch (err) {
    // El offscreen document puede no estar activo si ya fue cerrado
    console.warn('[Confident] No se pudo notificar STOP_AUDIO al offscreen:', err.message);
  }

  await chrome.storage.session.set({ sessionActive: false, deepgramConnected: false });
  console.log('[Confident] Sesión detenida.');
}
