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
const onboardingState = document.getElementById('onboardingState');
const userEmailInput  = document.getElementById('userEmailInput');
const continueOnboardingBtn = document.getElementById('continueOnboardingBtn');
const consentState    = document.getElementById('consentState');
const consentCheckbox = document.getElementById('consentCheckbox');
const participantEmails = document.getElementById('participantEmails');
const startSessionBtn = document.getElementById('startSessionBtn');
const emptyState      = document.getElementById('emptyState');
const listeningState  = document.getElementById('listeningState');
const statusMsg       = document.getElementById('statusMsg');
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
const sessionCounterFooter = document.getElementById('sessionCounterFooter');
const counterFooterText = document.getElementById('counterFooterText');

// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  restoreSessionState();
  setupEventListeners();
});

// Comprueba si hay sesión activa al abrir el panel
async function restoreSessionState() {
  // Verificar si es la primera vez (onboarding)
  const { onboarding_completed } = await chrome.storage.local.get('onboarding_completed');

  if (!onboarding_completed) {
    // Primera vez - mostrar onboarding
    showState('onboarding');
    // Actualizar contador footer si existe
    await updateSessionCounter();
    return;
  }

  const data = await chrome.storage.session.get(['sessionActive', 'profile', 'lastSuggestion', 'awaitingConsent']);

  if (data.sessionActive) {
    setSessionActive(true, data.profile);
    // Recuperar la última sugerencia si el panel se abrió después de que llegara
    if (data.lastSuggestion) {
      renderSuggestion(data.lastSuggestion);
    }
  } else if (data.awaitingConsent) {
    // Mostrar pantalla de consentimiento si el popup lo solicitó
    showState('consent');
  } else {
    setSessionInactive();
  }

  // Actualizar contador de sesiones si no hay sesión activa
  if (!data.sessionActive) {
    await updateSessionCounter();
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

  if (message.action === 'PANEL_STATUS') {
    showStatusMessage(message.text);
    return false;
  }

  if (message.action === 'PANEL_ERROR') {
    showStatusMessage(message.text, true);
    return false;
  }

  if (message.action === 'REQUEST_CONSENT') {
    // El popup solicita mostrar pantalla de consentimiento
    showState('consent');
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

// Muestra solo uno de los estados del panel principal
function showState(state) {
  onboardingState.classList.add('hidden');
  consentState.classList.add('hidden');
  emptyState.classList.add('hidden');
  listeningState.classList.add('hidden');
  suggestionCard.classList.add('hidden');

  if (state === 'onboarding') onboardingState.classList.remove('hidden');
  if (state === 'consent')    consentState.classList.remove('hidden');
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
    showStatusMessage('Sin señal por ahora');
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
// INICIO DE SESIÓN DESDE PANEL
// ─────────────────────────────────────────────────────────────

async function handleStartSession() {
  if (!consentCheckbox.checked) {
    return;
  }

  // Obtener emails de participantes (opcional)
  const emailsInput = participantEmails.value.trim();
  const emails = emailsInput
    ? emailsInput.split(',').map(e => e.trim()).filter(e => e.length > 0)
    : [];

  // Guardar emails y confirmación de consentimiento en storage
  await chrome.storage.session.set({
    consentConfirmed: true,
    participantEmails: emails,
    awaitingConsent: false
  });

  // Obtener perfil seleccionado desde el popup
  const { savedProfile } = await chrome.storage.local.get('savedProfile');

  // Enviar mensaje al background para iniciar la sesión
  chrome.runtime.sendMessage({
    action: 'START_SESSION',
    profile: savedProfile
  });

  // Cambiar a estado "escuchando"
  showState('listening');
  statusDot.classList.add('active');
  statusText.classList.add('active');
  statusText.textContent = profileLabel(savedProfile) + ' — Activo';
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // Botón continuar onboarding (primera vez)
  continueOnboardingBtn.addEventListener('click', async () => {
    const userEmail = userEmailInput.value.trim();

    // Guardar email del usuario (opcional) y marcar onboarding como completado
    await chrome.storage.local.set({
      onboarding_completed: true,
      user_email: userEmail || null
    });

    console.log('[Panel] Onboarding completado. Email del usuario:', userEmail || 'no proporcionado');

    // Mostrar estado normal (vacío)
    showState('empty');
    // Actualizar contador de sesiones
    await updateSessionCounter();
  });

  // Checkbox de consentimiento
  consentCheckbox.addEventListener('change', () => {
    startSessionBtn.disabled = !consentCheckbox.checked;
  });

  // Botón iniciar sesión desde panel
  startSessionBtn.addEventListener('click', handleStartSession);

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

// Muestra un mensaje de estado temporal debajo de "Escuchando..."
// isError=true lo pinta en rojo; se limpia automáticamente en 4 segundos
function showStatusMessage(text, isError = false) {
  if (!statusMsg) return;
  statusMsg.textContent = text;
  statusMsg.classList.remove('hidden', 'status-msg--error');
  if (isError) statusMsg.classList.add('status-msg--error');

  clearTimeout(showStatusMessage._timer);
  showStatusMessage._timer = setTimeout(() => {
    statusMsg.classList.add('hidden');
  }, 4000);
}

// ─────────────────────────────────────────────────────────────
// CONTADOR DE SESIONES (footer discreto)
// ─────────────────────────────────────────────────────────────

async function updateSessionCounter() {
  try {
    // No mostrar nada si hay sesión activa
    const { sessionActive } = await chrome.storage.session.get('sessionActive');
    if (sessionActive) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
    if (!anonymous_id) return;

    // Llamar a /api/usage
    const response = await fetch(`http://localhost:3000/api/usage?anonymous_id=${anonymous_id}`);
    if (!response.ok) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    const data = await response.json();
    const { user_type, remaining } = data;

    let message = '';
    let showCounter = false;

    // Solo mostrar si quedan ≤3 sesiones o es anónimo con cualquier número
    if (user_type === 'pro') {
      // Pro ilimitado - no mostrar contador
      showCounter = false;
    } else if (user_type === 'anonymous') {
      // Anónimo - siempre mostrar con link a registro
      message = `${remaining} ${remaining === 1 ? 'sesión gratuita' : 'sesiones gratuitas'}. <a href="http://localhost:3000/auth?reason=limit_soft" target="_blank">Regístrate</a> para 10 más`;
      showCounter = true;
    } else if (user_type === 'free') {
      // Free - solo mostrar si quedan ≤3
      if (remaining <= 3 && remaining > 0) {
        message = `${remaining} ${remaining === 1 ? 'sesión' : 'sesiones'} restantes. <a href="http://localhost:3000/pricing" target="_blank">Ver planes Pro</a>`;
        showCounter = true;
      } else if (remaining === 0) {
        message = `Límite alcanzado. <a href="http://localhost:3000/pricing" target="_blank">Ver planes Pro</a>`;
        showCounter = true;
      }
    }

    if (showCounter && message) {
      counterFooterText.innerHTML = message;
      sessionCounterFooter.classList.remove('hidden');
    } else {
      sessionCounterFooter.classList.add('hidden');
    }

  } catch (err) {
    console.error('[Panel] Error al actualizar contador:', err);
    sessionCounterFooter.classList.add('hidden');
  }
}

// Actualizar contador al cargar el panel
document.addEventListener('DOMContentLoaded', () => {
  updateSessionCounter();
});
