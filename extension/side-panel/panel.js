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

// Flag para saber si hay una tarjeta de sugerencia actualmente visible
let hasActiveSuggestion = false;

// ─────────────────────────────────────────────────────────────
// REFERENCIAS A ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────

const statusDot       = document.getElementById('statusDot');
const statusText      = document.getElementById('statusText');
// ELIMINADO: onboardingModal, onboardingForm, skipOnboarding, userDescription, userConcerns, userGoals
// Onboarding movido a /profile en dashboard
const consentState    = document.getElementById('consentState');
const consentCheckbox = document.getElementById('consentCheckbox');
const participantEmails = document.getElementById('participantEmails');
const startSessionBtn = document.getElementById('startSessionBtn');
const emptyState      = document.getElementById('emptyState');
const listeningState  = document.getElementById('listeningState');
const statusMsg       = document.getElementById('statusMsg');
const suggestionsContainer = document.getElementById('suggestionsContainer');
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
  // ELIMINADO: Onboarding movido al dashboard
  // Mostrar valor primero (sugerencias), personalización después

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

  // Sesión 21: Detección de plataforma multi-plataforma
  if (message.action === 'PLATFORM_DETECTED') {
    const { platform } = message;
    console.log('[Panel] Plataforma detectada:', platform.displayName);

    // Guardar plataforma globalmente
    window.currentPlatform = platform;

    // Actualizar indicador de plataforma en UI (si existe)
    const platformIndicator = document.querySelector('.platform-indicator');
    if (platformIndicator) {
      platformIndicator.textContent = `${platform.icon} ${platform.displayName}`;
      platformIndicator.style.color = platform.color;
    }
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

    // Mostrar botón de terminar sesión
    const endSessionWrapper = document.getElementById('endSessionWrapper');
    if (endSessionWrapper) {
      endSessionWrapper.classList.remove('hidden');
    }

    // Actualizar contador de sesiones
    updateSessionCounter();
  }
}

function setSessionInactive() {
  statusDot.classList.remove('active');
  statusText.classList.remove('active');
  statusText.textContent = 'Sin sesión activa';
  showState('empty');

  // Limpiar todas las cards
  suggestionsContainer.innerHTML = '';

  // Resetear flag de tarjeta activa
  hasActiveSuggestion = false;

  // Ocultar botón de terminar sesión
  const endSessionWrapper = document.getElementById('endSessionWrapper');
  if (endSessionWrapper) {
    endSessionWrapper.classList.add('hidden');
  }

  // Actualizar contador de sesiones
  updateSessionCounter();
}

// Muestra solo uno de los estados del panel principal
function showState(state) {
  // ELIMINADO: onboardingModal (movido a /profile en dashboard)
  consentState.classList.add('hidden');
  emptyState.classList.add('hidden');
  listeningState.classList.add('hidden');

  // Las cards de sugerencias se manejan aparte (pueden estar visibles con listening)

  if (state === 'consent')    consentState.classList.remove('hidden');
  if (state === 'empty')      emptyState.classList.remove('hidden');
  if (state === 'listening')  listeningState.classList.remove('hidden');
  if (state === 'suggestion') {
    // No hacer nada — las cards ya están en suggestionsContainer
  }
}

// ─────────────────────────────────────────────────────────────
// RENDERIZAR SUGERENCIA
// ─────────────────────────────────────────────────────────────

function renderSuggestion(result) {
  // Si no hay señal relevante
  if (!result.signal_detected || !result.suggestion) {
    // Solo mostrar estado "listening" si NO hay cards activas todavía
    if (!hasActiveSuggestion) {
      showState('listening');
      showStatusMessage('Escuchando...');
    }
    // Si ya hay cards visibles, mantenerlas — no hacer nada
    return;
  }

  // Hay una señal real → añadir/actualizar card
  hasActiveSuggestion = true;
  currentSuggestionId = Date.now();

  // Obtener cards actuales
  const existingCards = Array.from(suggestionsContainer.querySelectorAll('.suggestion-card'));

  // LÓGICA INTELIGENTE POR URGENCIA
  const urgency = result.urgency ?? 1;

  if (urgency === 3) {
    // CRÍTICO → Limpiar TODAS las cards anteriores
    console.log('[Panel] Urgencia 3 (crítico): limpiando todas las cards');
    suggestionsContainer.innerHTML = '';
  } else if (urgency === 2) {
    // IMPORTANTE → Máximo 2 cards (eliminar más antiguas si necesario)
    console.log('[Panel] Urgencia 2 (importante): máximo 2 cards');
    while (existingCards.length >= 2) {
      const oldest = existingCards.shift();
      oldest.remove();
    }
  } else {
    // INFORMATIVO → Máximo 3 cards (comportamiento actual)
    console.log('[Panel] Urgencia 1 (informativo): máximo 3 cards');
    if (existingCards.length >= 3) {
      existingCards[0].remove();
    }
  }

  // Crear nueva card
  const cardId = `card-${currentSuggestionId}`;

  // Determinar clase de urgencia y badge
  const urgencyClass = urgency === 3 ? 'urgency-critical' : urgency === 2 ? 'urgency-important' : 'urgency-info';
  const urgencyBadge = urgency === 3 ? '🔴 URGENTE' : urgency === 2 ? '🟡 IMPORTANTE' : '🟢 INFO';

  const card = document.createElement('div');
  card.className = `suggestion-card ${urgencyClass}`;
  card.dataset.urgency = urgency;
  card.dataset.cardId = cardId;
  card.innerHTML = `
    <div class="urgency-badge">${urgencyBadge}</div>
    <div class="suggestion-section">
      <p class="suggestion-main">${escapeHtml(result.suggestion)}</p>
      ${result.what_is_being_asked ? `<p class="suggestion-details">${escapeHtml(result.what_is_being_asked)}</p>` : ''}
    </div>
    <div class="feedback-row">
      <div class="feedback-buttons">
        <button class="feedback-btn" data-feedback="up" data-card-id="${cardId}" title="Fue útil">👍</button>
        <button class="feedback-btn" data-feedback="down" data-card-id="${cardId}" title="No fue útil">👎</button>
      </div>
      <div class="urgency-dots" title="Nivel de urgencia">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  `;

  // Añadir al contenedor
  suggestionsContainer.appendChild(card);

  // Event listeners para feedback
  const feedbackButtons = card.querySelectorAll('.feedback-btn');
  feedbackButtons.forEach(btn => {
    btn.addEventListener('click', handleCardFeedback);
  });

  // Ocultar estado listening si está visible
  listeningState.classList.add('hidden');

  // Añadir al historial
  addToHistory({
    id: currentSuggestionId,
    signal_type: result.signal_type,
    suggestion: result.suggestion,
    urgency,
  });
}

// Helper para escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handler para feedback de cards individuales
function handleCardFeedback(event) {
  const btn = event.currentTarget;
  const cardId = btn.dataset.cardId;
  const feedback = btn.dataset.feedback;
  const card = document.querySelector(`[data-card-id="${cardId}"]`);

  if (!card) return;

  // Limpiar feedback previo de esta card
  const allBtns = card.querySelectorAll('.feedback-btn');
  allBtns.forEach(b => {
    b.classList.remove('selected-up', 'selected-down');
  });

  // Marcar el seleccionado
  if (feedback === 'up') {
    btn.classList.add('selected-up');
  } else {
    btn.classList.add('selected-down');
  }

  // TODO: Enviar feedback al backend si es necesario
  LOG.log(`[Panel] Feedback ${feedback} para card ${cardId}`);
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

// Funciones de feedback antiguas eliminadas — ahora se maneja en handleCardFeedback

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
// TERMINAR SESIÓN Y VER RESULTADOS
// ─────────────────────────────────────────────────────────────

async function handleEndSession() {
  // Obtener sessionId del storage
  const { sessionId } = await chrome.storage.session.get('sessionId');

  // Enviar mensaje al background para detener la sesión
  chrome.runtime.sendMessage({
    action: 'STOP_SESSION'
  });

  // Abrir dashboard con session_id en URL para auto-selección
  let dashboardUrl = CONFIG.ENDPOINTS.DASHBOARD;
  if (sessionId) {
    dashboardUrl += `?session=${sessionId}`;
  }

  await chrome.tabs.create({ url: dashboardUrl });

  // Cerrar el panel lateral
  window.close();
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // ELIMINADO: Event listeners de onboarding movidos al dashboard

  // Checkbox de consentimiento
  consentCheckbox.addEventListener('change', () => {
    startSessionBtn.disabled = !consentCheckbox.checked;
  });

  // Botón iniciar sesión desde panel
  startSessionBtn.addEventListener('click', handleStartSession);

  // Botón terminar sesión
  const endSessionBtn = document.getElementById('endSessionBtn');
  if (endSessionBtn) {
    endSessionBtn.addEventListener('click', handleEndSession);
  }

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
    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
    if (!anonymous_id) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    // Llamar a /api/usage
    const response = await fetch(`${CONFIG.ENDPOINTS.USAGE}?anonymous_id=${anonymous_id}`);
    if (!response.ok) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    const data = await response.json();
    const { user_type, remaining } = data;

    let showCounter = false;

    // Limpiar contenido previo
    counterFooterText.textContent = '';

    // Solo mostrar si quedan ≤3 sesiones o es anónimo con cualquier número
    if (user_type === 'pro') {
      // Pro ilimitado - no mostrar contador
      showCounter = false;
    } else if (user_type === 'anonymous') {
      // Anónimo - siempre mostrar con link a registro
      const text = `${remaining} ${remaining === 1 ? 'sesión gratuita' : 'sesiones gratuitas'}. `;
      const textNode = document.createTextNode(text);

      const link = document.createElement('a');
      link.href = `${CONFIG.ENDPOINTS.AUTH}?reason=limit_soft`;
      link.target = '_blank';
      link.textContent = 'Regístrate';

      const moreText = document.createTextNode(' para 10 más');

      counterFooterText.appendChild(textNode);
      counterFooterText.appendChild(link);
      counterFooterText.appendChild(moreText);

      showCounter = true;
    } else if (user_type === 'free') {
      // Free - solo mostrar si quedan ≤3
      if (remaining <= 3 && remaining > 0) {
        const text = `${remaining} ${remaining === 1 ? 'sesión' : 'sesiones'} restantes. `;
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = 'Ver planes Pro';

        counterFooterText.appendChild(textNode);
        counterFooterText.appendChild(link);

        showCounter = true;
      } else if (remaining === 0) {
        const text = 'Límite alcanzado. ';
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = 'Ver planes Pro';

        counterFooterText.appendChild(textNode);
        counterFooterText.appendChild(link);

        showCounter = true;
      }
    }

    if (showCounter) {
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
