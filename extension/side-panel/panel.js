// panel.js — Side Panel de Confident
// Recibe sugerencias de background.js y actualiza la UI en tiempo real.
// La sesión se gestiona desde popup.js — el panel solo muestra el estado.

// ─────────────────────────────────────────────────────────────
// ESTADO LOCAL
// ─────────────────────────────────────────────────────────────

// ID de la sugerencia activa (para asociar el feedback)
let currentSuggestionId = null;

// Historial de la sesión actual (máx. 20 entradas)
const history = [];

// ─────────────────────────────────────────────────────────────
// REFERENCIAS A ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────

const statusDot       = document.getElementById('statusDot');
const statusText      = document.getElementById('statusText');
const emptyState      = document.getElementById('emptyState');
const listeningState  = document.getElementById('listeningState');
const suggestionCard  = document.getElementById('suggestionCard');
const contextSection  = document.getElementById('contextSection');
const contextText     = document.getElementById('contextText');
const suggestionText  = document.getElementById('suggestionText');
const keywordsSection = document.getElementById('keywordsSection');
const keywordsList    = document.getElementById('keywordsList');
const thumbsUp        = document.getElementById('thumbsUp');
const thumbsDown      = document.getElementById('thumbsDown');
const historyToggle   = document.getElementById('historyToggle');
const historyArrow    = document.getElementById('historyArrow');
const historyList     = document.getElementById('historyList');
const historyCount    = document.getElementById('historyCount');

// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  restoreSessionState();
  setupEventListeners();
});

// Comprueba si hay sesión activa al abrir el panel
async function restoreSessionState() {
  const data = await chrome.storage.session.get(['sessionActive', 'profile']);
  if (data.sessionActive) {
    setSessionActive(true, data.profile);
  } else {
    setSessionInactive();
  }
}

// ─────────────────────────────────────────────────────────────
// LISTENER DE MENSAJES DESDE BACKGROUND
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'NEW_SUGGESTION') {
    renderSuggestion(message.result);
    return false;
  }

  if (message.action === 'SESSION_STARTED') {
    setSessionActive(true, message.profile);
    return false;
  }

  if (message.action === 'SESSION_STOPPED') {
    setSessionInactive();
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// GESTIÓN DE ESTADOS DE LA UI
// ─────────────────────────────────────────────────────────────

function setSessionActive(active, profile) {
  if (active) {
    statusDot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = profileLabel(profile) + ' — Activo';
    showState('listening');
  }
}

function setSessionInactive() {
  statusDot.classList.remove('active');
  statusText.classList.remove('active');
  statusText.textContent = 'Sin sesión activa';
  showState('empty');
  clearFeedback();
}

// Muestra solo uno de los tres estados del panel principal
function showState(state) {
  emptyState.classList.add('hidden');
  listeningState.classList.add('hidden');
  suggestionCard.classList.add('hidden');

  if (state === 'empty')      emptyState.classList.remove('hidden');
  if (state === 'listening')  listeningState.classList.remove('hidden');
  if (state === 'suggestion') suggestionCard.classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────
// RENDERIZAR SUGERENCIA
// ─────────────────────────────────────────────────────────────

function renderSuggestion(result) {
  // Si no hay señal relevante, volver al estado de escucha sin tocar el historial
  if (!result.signal_detected || !result.suggestion) {
    showState('listening');
    return;
  }

  // Generar ID único para esta sugerencia
  currentSuggestionId = Date.now();
  clearFeedback();

  // Urgencia (1-3) → data-urgency para CSS
  const urgency = result.urgency ?? 1;
  suggestionCard.dataset.urgency = urgency;

  // Sección "Qué te preguntan" (solo si viene rellena)
  if (result.what_is_being_asked) {
    // Usar textContent para prevenir XSS — nunca innerHTML con datos externos
    contextText.textContent = result.what_is_being_asked;
    contextSection.classList.remove('hidden');
  } else {
    contextSection.classList.add('hidden');
  }

  // Sugerencia principal
  suggestionText.textContent = result.suggestion;

  // Keywords
  if (result.keywords && result.keywords.length > 0) {
    keywordsList.innerHTML = '';
    result.keywords.forEach((kw) => {
      const tag = document.createElement('span');
      tag.className = 'keyword-tag';
      tag.textContent = kw;
      keywordsList.appendChild(tag);
    });
    keywordsSection.classList.remove('hidden');
  } else {
    keywordsSection.classList.add('hidden');
  }

  // Mostrar la tarjeta
  showState('suggestion');

  // Añadir al historial
  addToHistory({
    id: currentSuggestionId,
    signal_type: result.signal_type,
    suggestion: result.suggestion,
    urgency,
  });
}

// ─────────────────────────────────────────────────────────────
// HISTORIAL
// ─────────────────────────────────────────────────────────────

function addToHistory(entry) {
  // Insertar al principio (más reciente arriba)
  history.unshift(entry);

  // Limitar a 20 entradas
  if (history.length > 20) history.pop();

  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';

  history.forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const typeEl = document.createElement('div');
    typeEl.className = 'history-item-type';
    typeEl.textContent = entry.signal_type ?? 'señal';

    const textEl = document.createElement('div');
    textEl.className = 'history-item-text';
    textEl.textContent = entry.suggestion;

    li.appendChild(typeEl);
    li.appendChild(textEl);
    historyList.appendChild(li);
  });

  // Actualizar contador
  if (history.length > 0) {
    historyCount.textContent = history.length;
    historyCount.classList.remove('hidden');
  } else {
    historyCount.classList.add('hidden');
  }
}

// ─────────────────────────────────────────────────────────────
// FEEDBACK (thumbs up / down)
// ─────────────────────────────────────────────────────────────

function clearFeedback() {
  thumbsUp.classList.remove('selected-up');
  thumbsDown.classList.remove('selected-down');
}

function handleFeedback(helpful) {
  clearFeedback();
  if (helpful) {
    thumbsUp.classList.add('selected-up');
  } else {
    thumbsDown.classList.add('selected-down');
  }

  // Guardar en storage para futura integración con Supabase (Sesión 4)
  chrome.storage.session.get(['profile']).then((data) => {
    chrome.storage.local.get(['feedbackLog']).then((local) => {
      const log = local.feedbackLog ?? [];
      log.push({
        id: currentSuggestionId,
        helpful,
        profile: data.profile,
        ts: Date.now(),
      });
      // Limitar a 50 entradas locales
      if (log.length > 50) log.shift();
      chrome.storage.local.set({ feedbackLog: log });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // Feedback
  thumbsUp.addEventListener('click', () => handleFeedback(true));
  thumbsDown.addEventListener('click', () => handleFeedback(false));

  // Toggle historial
  historyToggle.addEventListener('click', () => {
    const isOpen = !historyList.classList.contains('hidden');
    historyList.classList.toggle('hidden', isOpen);
    historyArrow.classList.toggle('open', !isOpen);
  });
}

// ─────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────

function profileLabel(profile) {
  const labels = {
    candidato: 'Candidato',
    vendedor: 'Vendedor',
    defensor: 'Defensor',
  };
  return labels[profile] ?? profile ?? 'Sesión';
}
