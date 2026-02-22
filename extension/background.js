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

// Coordina la carrera entre TRANSCRIPT y VAD_ENDED.
// No es estado de sesión — es una promesa de coordinación en vuelo.
let pendingAccumulate = null;

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
    handleStartSession(message.tabId, message.profile)
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
      // Acumular y analizar inmediatamente cuando la transcripción es final
      (async () => {
        await accumulateFinalTranscript(transcript, profile);
        await callAnalyzeAPI();
      })();
    }
    return false;
  }

  if (message.action === 'VAD_STARTED') {
    return false;
  }

  if (message.action === 'VAD_ENDED') {
    // Esperar a que el write de TRANSCRIPT haya terminado antes de leer
    (async () => {
      if (pendingAccumulate) await pendingAccumulate;
      pendingAccumulate = null;
      await callAnalyzeAPI();
    })();
    return false;
  }

  if (message.action === 'DEEPGRAM_ERROR') {
    sendToPanel('PANEL_ERROR', { text: 'Error Deepgram — API key inválida' });
    return false;
  }

  if (message.action === 'DEEPGRAM_DISCONNECTED') {
    if (message.code === 1006) {
      sendToPanel('PANEL_ERROR', { text: 'API key de Deepgram inválida — obtén una válida en console.deepgram.com' });
    } else if (message.code !== 1000) { // 1000 = cierre limpio
      sendToPanel('PANEL_ERROR', { text: `Deepgram desconectado (${message.code})` });
    }
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// ACUMULACIÓN DE TRANSCRIPCIONES Y LLAMADA A CLAUDE
// ─────────────────────────────────────────────────────────────

// Acumula la frase final en chrome.storage.session
// (no usamos variables globales porque el SW puede morir)
async function accumulateFinalTranscript(transcript, profile) {
  const data = await chrome.storage.session.get(['pendingText', 'contextBuffer', 'sessionTranscript']);
  const pending = data.pendingText ?? '';
  const context = data.contextBuffer ?? [];
  const sessionTranscript = data.sessionTranscript ?? '';

  const newPending = pending ? `${pending} ${transcript}` : transcript;
  const newSessionTranscript = sessionTranscript ? `${sessionTranscript}\n${transcript}` : transcript;

  await chrome.storage.session.set({
    pendingText: newPending,
    contextBuffer: context,
    lastProfile: profile,
    sessionTranscript: newSessionTranscript,
  });
}

// Helper para enviar mensajes al panel sin romper si no está abierto
function sendToPanel(action, payload) {
  chrome.runtime.sendMessage({ action, ...payload }).catch(() => {});
}

// Envía el texto acumulado a /api/analyze y reenvía la sugerencia al panel
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

  // Notificar al panel que estamos procesando
  sendToPanel('PANEL_STATUS', { text: 'Analizando...' });

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
      sendToPanel('PANEL_ERROR', { text: `Error del servidor (${response.status})` });
      return;
    }

    const result = await response.json();

    // Guardar la última sugerencia para recuperarla si el panel se abre tarde
    await chrome.storage.session.set({ lastSuggestion: result });

    // Reenviar sugerencia al side panel
    sendToPanel('NEW_SUGGESTION', { result });

    // Incrementar contador de sugerencias si hay señal detectada (Sesión 6)
    if (result.signal_detected) {
      const { suggestionsCount } = await chrome.storage.session.get('suggestionsCount');
      await chrome.storage.session.set({ suggestionsCount: (suggestionsCount ?? 0) + 1 });
    }

    // Actualizar el buffer de contexto con la frase procesada
    const updatedContext = [...contextBuffer, text].slice(-3);
    await chrome.storage.session.set({ contextBuffer: updatedContext });
  } catch (err) {
    console.error('[Confident] Error al llamar a /api/analyze:', err.message);
    sendToPanel('PANEL_ERROR', { text: '¿Está ejecutándose npm run dev?' });
  }
}

// ─────────────────────────────────────────────────────────────
// INICIAR SESIÓN DE CAPTURA
// ─────────────────────────────────────────────────────────────

async function handleStartSession(tabId, profile) {
  // 1. Obtener streamId (funciona desde Service Worker en MV3)
  const streamId = await getTabStreamId(tabId);

  // 2. Crear (o reutilizar) el offscreen document
  await createOffscreenDocument();

  // 3. Guardar estado de sesión (y resetear buffers de contexto)
  await chrome.storage.session.set({
    sessionActive: true,
    profile,
    sessionStartTime: Date.now(), // Sesión 6
    pendingText: '',
    contextBuffer: [],
    lastProfile: profile,
    suggestionsCount: 0, // Sesión 6
    sessionTranscript: '', // Sesión 6
  });

  // 4. Enviar streamId + config al offscreen document para que inicie el pipeline
  await chrome.runtime.sendMessage({
    action: 'START_AUDIO',
    streamId,
    profile,
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

  // Obtener datos de la sesión para enviar email (Sesión 6)
  const sessionData = await chrome.storage.session.get([
    'participantEmails',
    'sessionTranscript',
    'profile',
    'sessionStartTime',
    'suggestionsCount'
  ]);

  const emails = sessionData.participantEmails ?? [];
  const transcript = sessionData.sessionTranscript ?? '';
  const profile = sessionData.profile ?? 'candidato';
  const startTime = sessionData.sessionStartTime ?? Date.now();
  const suggestionsCount = sessionData.suggestionsCount ?? 0;

  // Si hay emails y transcripción, enviar email
  if (emails.length > 0 && transcript.length > 0) {
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);

    try {
      const response = await fetch('http://localhost:3000/api/send-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emails,
          profile,
          transcriptText: transcript,
          suggestionsCount,
          duration: durationMinutes
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Confident] ✅ Email enviado a', data.recipients, 'destinatarios');
      } else {
        console.error('[Confident] Error al enviar email:', response.status);
      }
    } catch (err) {
      console.error('[Confident] Error al llamar /api/send-transcript:', err);
      // No bloquear el cierre de sesión si falla el email
    }
  }

  await chrome.storage.session.set({
    sessionActive: false,
    deepgramConnected: false,
    sessionTranscript: '', // Limpiar transcripción
    participantEmails: [], // Limpiar emails
    suggestionsCount: 0
  });

  // Notificar al side panel que la sesión ha terminado
  chrome.runtime.sendMessage({ action: 'SESSION_STOPPED' }).catch(() => {});
}
