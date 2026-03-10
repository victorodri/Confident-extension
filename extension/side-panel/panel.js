// panel.js — Side Panel de Confident
// Integra selección de perfil + sugerencias en tiempo real
// SESIÓN 30: Integración popup → side panel

// ─────────────────────────────────────────────────────────────
// IDIOMA ACTUAL (por defecto: español)
// ─────────────────────────────────────────────────────────────

let currentLanguage = 'es';

// Traducciones manuales (español e inglés)
const translations = {
  es: {
    tagline: 'Tu confidente en cada conversación',
    sessionActive: 'Sesión activa',
    selectProfile: 'Selecciona tu perfil',
    profileCandidate: 'Candidato',
    profileCandidateDesc: 'Entrevistas de trabajo',
    profileSales: 'Vendedor',
    profileSalesDesc: 'Llamadas comerciales',
    profileDefender: 'Defensor',
    profileDefenderDesc: 'Reuniones técnicas',
    consentLabel: 'He informado a los participantes de que esta conversación será transcrita y he obtenido su consentimiento.',
    participantEmailsLabel: 'Emails de participantes (opcional)',
    participantEmailsHint: 'Se enviará transcripción al finalizar',
    participantEmailsPlaceholder: 'email1@ejemplo.com, email2@ejemplo.com',
    requestMicButton: '🎤 Permitir acceso al micrófono',
    startButton: 'Iniciar sesión',
    stopButton: 'Detener sesión',
    notInPlatform: '⚠️ Abre una videollamada en:',
    platformGoogleMeet: '🎥 Google Meet',
    platformTeams: '💼 Microsoft Teams',
    platformZoom: '📹 Zoom',
    errorNoProfile: 'Selecciona un perfil antes de iniciar',
    errorGeneric: 'Error al procesar la solicitud',
    processing: 'Procesando...',
    listening: 'Escuchando...',
    sessionHistory: 'Historial de sesión',
    sessionInactive: 'Sin sesión activa',
    statusActive: 'Activo',
    sessionCounter: 'sesiones gratuitas',
    sessionCounterRegister: 'Regístrate para 10 más',
    sessionCounterUpgrade: 'Ver planes Pro',
    sessionCounterRemaining: 'sesiones restantes',
    sessionCounterLimitReached: 'Límite alcanzado',
    emptyTitle: 'Listo para ayudarte',
    emptyDesc: 'Selecciona tu perfil para comenzar',
    endSessionButton: 'He terminado esta reunión',
    viewDashboard: 'Ver resumen y transcripción en Dashboard',
    // Paywall suave (UX Research + Growth Hacker)
    paywallSoftTitle: '¡Has usado tus 5 sesiones gratuitas! 🎉',
    paywallSoftDesc: 'Confident te ha ayudado en tus conversaciones. Regístrate gratis y obtén 10 sesiones más.',
    paywallSoftBenefit1: '✓ 10 sesiones adicionales gratis',
    paywallSoftBenefit2: '✓ Historial de sesiones guardado',
    paywallSoftBenefit3: '✓ Transcripciones por email',
    paywallSoftCta: 'Registrarme gratis',
    paywallSoftDismiss: 'Quizás después',
    // Paywall duro (usuario registrado, límite alcanzado)
    paywallHardTitle: 'Has alcanzado el límite del plan gratuito',
    paywallHardDesc: 'Para seguir usando Confident en tus conversaciones, actualiza a un plan Pro.',
    paywallHardBenefit1: '✓ Sesiones ilimitadas',
    paywallHardBenefit2: '✓ Análisis avanzado con IA',
    paywallHardBenefit3: '✓ Soporte prioritario',
    paywallHardCta: 'Ver planes Pro',
    paywallHardContact: 'Contactar soporte'
  },
  en: {
    tagline: 'Your confident in every conversation',
    sessionActive: 'Active session',
    selectProfile: 'Select your profile',
    profileCandidate: 'Candidate',
    profileCandidateDesc: 'Job interviews',
    profileSales: 'Salesperson',
    profileSalesDesc: 'Sales calls',
    profileDefender: 'Defender',
    profileDefenderDesc: 'Technical meetings',
    consentLabel: 'I have informed participants that this conversation will be transcribed and obtained their consent.',
    participantEmailsLabel: 'Participant emails (optional)',
    participantEmailsHint: 'Transcript will be sent at the end',
    participantEmailsPlaceholder: 'email1@example.com, email2@example.com',
    requestMicButton: '🎤 Allow microphone access',
    startButton: 'Start session',
    stopButton: 'Stop session',
    notInPlatform: '⚠️ Open a video call on:',
    platformGoogleMeet: '🎥 Google Meet',
    platformTeams: '💼 Microsoft Teams',
    platformZoom: '📹 Zoom',
    errorNoProfile: 'Select a profile before starting',
    errorGeneric: 'Error processing request',
    processing: 'Processing...',
    listening: 'Listening...',
    sessionHistory: 'Session history',
    sessionInactive: 'No active session',
    statusActive: 'Active',
    sessionCounter: 'free sessions',
    sessionCounterRegister: 'Sign up for 10 more',
    sessionCounterUpgrade: 'View Pro plans',
    sessionCounterRemaining: 'sessions remaining',
    sessionCounterLimitReached: 'Limit reached',
    emptyTitle: 'Ready to help',
    emptyDesc: 'Select your profile to get started',
    endSessionButton: "I've finished this meeting",
    viewDashboard: 'View summary and transcript in Dashboard',
    // Soft paywall (UX Research + Growth Hacker)
    paywallSoftTitle: 'You\'ve used your 5 free sessions! 🎉',
    paywallSoftDesc: 'Confident has helped you in your conversations. Sign up for free and get 10 more sessions.',
    paywallSoftBenefit1: '✓ 10 additional free sessions',
    paywallSoftBenefit2: '✓ Saved session history',
    paywallSoftBenefit3: '✓ Transcripts via email',
    paywallSoftCta: 'Sign up for free',
    paywallSoftDismiss: 'Maybe later',
    // Hard paywall (registered user, limit reached)
    paywallHardTitle: 'You\'ve reached the free plan limit',
    paywallHardDesc: 'To continue using Confident in your conversations, upgrade to a Pro plan.',
    paywallHardBenefit1: '✓ Unlimited sessions',
    paywallHardBenefit2: '✓ Advanced AI analysis',
    paywallHardBenefit3: '✓ Priority support',
    paywallHardCta: 'View Pro plans',
    paywallHardContact: 'Contact support'
  }
};

// ─────────────────────────────────────────────────────────────
// HELPER: i18n
// ─────────────────────────────────────────────────────────────

function i18n(key) {
  return translations[currentLanguage]?.[key] || key;
}

function updateAllTranslations() {
  // Actualizar textos
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18n(key);
  });

  // Actualizar textos con HTML (innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = i18n(key);
  });

  // Actualizar placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = i18n(key);
  });

  // Actualizar statusText si no hay sesión activa
  if (statusText && !statusText.classList.contains('active')) {
    statusText.textContent = i18n('sessionInactive');
  }
}

async function changeLanguage(lang) {
  currentLanguage = lang;
  await chrome.storage.local.set({ user_language: lang });
  updateAllTranslations();

  // Actualizar estado de sesión activa si hay una sesión
  const data = await chrome.storage.session.get(['sessionActive', 'profile']);
  if (data.sessionActive && data.profile) {
    statusText.textContent = profileLabel(data.profile) + ' — ' + i18n('statusActive');
  }

  // Actualizar contador de sesiones si está visible
  if (!sessionCounterFooter.classList.contains('hidden')) {
    updateSessionCounter();
  }
}

// ─────────────────────────────────────────────────────────────
// ESTADO LOCAL
// ─────────────────────────────────────────────────────────────

// ID de la sugerencia activa (para asociar el feedback)
let currentSuggestionId = null;

// Historial de la sesión actual (máx. 20 entradas)
const history = [];

// Flag para saber si hay una tarjeta de sugerencia actualmente visible
let hasActiveSuggestion = false;

// Estado de selección de perfil (de popup.js)
let selectedProfile = null;
let currentTabId = null;
let micPermissionGranted = false;

// ─────────────────────────────────────────────────────────────
// REFERENCIAS A ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────

// Header (compartido)
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// Vista 1: Selección de perfil
const profileSelectionView = document.getElementById('profileSelectionView');
const profileBtns = document.querySelectorAll('.profile-btn');
const notInPlatform = document.getElementById('notInPlatform');
const requestMicBtn = document.getElementById('requestMicBtn');
const consentSectionInitial = document.getElementById('consentSectionInitial');
const consentCheckboxInitial = document.getElementById('consentCheckboxInitial');
const emailsSectionInitial = document.getElementById('emailsSectionInitial');
const participantEmailsInitial = document.getElementById('participantEmailsInitial');
const startBtnInitial = document.getElementById('startBtnInitial');
const errorMsgInitial = document.getElementById('errorMsgInitial');
const sessionCounterFooterInitial = document.getElementById('sessionCounterFooterInitial');
const counterFooterTextInitial = document.getElementById('counterFooterTextInitial');

// Vista 2: Sesión activa
const activeSessionView = document.getElementById('activeSessionView');
const emptyState = document.getElementById('emptyState');
const listeningState = document.getElementById('listeningState');
const statusMsg = document.getElementById('statusMsg');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const historyToggle = document.getElementById('historyToggle');
const historyArrow = document.getElementById('historyArrow');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const sessionCounterFooter = document.getElementById('sessionCounterFooter');
const counterFooterText = document.getElementById('counterFooterText');

// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar idioma guardado (por defecto: español)
  const { user_language } = await chrome.storage.local.get('user_language');
  currentLanguage = user_language || 'es';

  // Actualizar selector de idioma
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.value = currentLanguage;
    languageSelector.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }

  // Inicializar traducciones
  updateAllTranslations();

  await restoreSessionState();
  setupEventListeners();
});

// Comprueba si hay sesión activa al abrir el panel
async function restoreSessionState() {
  const data = await chrome.storage.session.get(['sessionActive', 'profile', 'lastSuggestion']);

  if (data.sessionActive) {
    // Hay sesión activa → mostrar vista 2
    showActiveSessionView();
    setSessionActive(true, data.profile);

    // Recuperar la última sugerencia si el panel se abrió después de que llegara
    if (data.lastSuggestion) {
      renderSuggestion(data.lastSuggestion);
    }
  } else {
    // No hay sesión → mostrar vista 1 (selección de perfil)
    await showProfileSelectionView();
  }
}

// ─────────────────────────────────────────────────────────────
// GESTIÓN DE VISTAS
// ─────────────────────────────────────────────────────────────

async function showProfileSelectionView() {
  profileSelectionView.classList.remove('hidden');
  activeSessionView.classList.add('hidden');

  // Generar device fingerprint si no existe
  const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
  if (!anonymous_id) {
    LOG.log('[Panel] Generando device fingerprint...');
    const fingerprint = await getDeviceFingerprint();
    await chrome.storage.local.set({ anonymous_id: fingerprint });
    LOG.log('[Panel] Device fingerprint generado:', fingerprint.substring(0, 20) + '...');
  }

  // Restaurar perfil guardado
  const { savedProfile } = await chrome.storage.local.get('savedProfile');
  if (savedProfile) {
    selectProfile(savedProfile);
  }

  // Verificar plataforma soportada
  await checkIfInPlatform();

  // Verificar permisos de micrófono
  await checkMicPermission();

  // Actualizar contador de sesiones
  await updateSessionCounterInitial();
}

function showActiveSessionView() {
  profileSelectionView.classList.add('hidden');
  activeSessionView.classList.remove('hidden');

  // Actualizar contador de sesiones
  updateSessionCounter();
}

// ─────────────────────────────────────────────────────────────
// VERIFICAR PLATAFORMA SOPORTADA
// ─────────────────────────────────────────────────────────────

async function checkIfInPlatform() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      showElement(notInPlatform);
      startBtnInitial.disabled = true;
      return;
    }

    const supportedPlatforms = [
      'meet.google.com',
      'teams.microsoft.com',
      'zoom.us'
    ];

    const isSupported = supportedPlatforms.some(domain => tab.url.includes(domain));

    if (!isSupported) {
      showElement(notInPlatform);
      startBtnInitial.disabled = true;
      return;
    }

    currentTabId = tab.id;
    hideElement(notInPlatform);
  } catch (err) {
    showError('Error al detectar el tab: ' + err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// VERIFICAR PERMISOS DE MICRÓFONO
// ─────────────────────────────────────────────────────────────

async function checkMicPermission() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasAudioInput = devices.some(device => device.kind === 'audioinput' && device.label !== '');

    if (hasAudioInput) {
      micPermissionGranted = true;
      hideElement(requestMicBtn);
    }
  } catch (err) {
    LOG.log('[Panel] No se pudo verificar permiso de micrófono:', err);
  }

  updateStartButton();
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
// GESTIÓN DE ESTADOS DE LA UI (Vista 2)
// ─────────────────────────────────────────────────────────────

function setSessionActive(active, profile) {
  if (active) {
    statusDot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = profileLabel(profile) + ' — ' + i18n('statusActive');

    // Mostrar estado listening
    emptyState.classList.add('hidden');
    listeningState.classList.remove('hidden');

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
  statusText.textContent = i18n('sessionInactive');

  // Mostrar estado vacío
  emptyState.classList.remove('hidden');
  listeningState.classList.add('hidden');

  // Limpiar todas las cards
  suggestionsContainer.innerHTML = '';

  // Resetear flag de tarjeta activa
  hasActiveSuggestion = false;

  // Ocultar botón de terminar sesión
  const endSessionWrapper = document.getElementById('endSessionWrapper');
  if (endSessionWrapper) {
    endSessionWrapper.classList.add('hidden');
  }

  // Limpiar historial
  history.length = 0;
  renderHistory();
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
      showStatusMessage(i18n('listening'));
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
// INICIO DE SESIÓN (Vista 1 → Vista 2)
// ─────────────────────────────────────────────────────────────

async function handleStartClick() {
  hideError();

  if (!selectedProfile) {
    showError(i18n('errorNoProfile'));
    return;
  }

  if (!currentTabId) {
    showError(i18n('errorGeneric'));
    return;
  }

  if (!micPermissionGranted) {
    showError(i18n('requestMicButton'));
    showElement(requestMicBtn);
    return;
  }

  startBtnInitial.disabled = true;
  startBtnInitial.textContent = i18n('processing');

  try {
    // Verificar límites antes de iniciar
    const gateCheck = await checkSessionGate();

    if (!gateCheck.allowed) {
      // Mostrar paywall dentro del panel (UX Research + Growth Hacker)
      showPaywall(gateCheck.type);

      startBtnInitial.disabled = false;
      startBtnInitial.textContent = i18n('startButton');
      return;
    }

    // Guardar consentimiento y emails
    const emailsInput = participantEmailsInitial.value.trim();
    const emails = emailsInput
      ? emailsInput.split(',').map(e => e.trim()).filter(e => e.length > 0)
      : [];

    await chrome.storage.session.set({
      consentConfirmed: true,
      participantEmails: emails
    });

    LOG.log('[Panel] ✅ Consentimiento confirmado. Emails:', emails.length);

    // Enviar mensaje al background.js con el tabId y el perfil
    const response = await chrome.runtime.sendMessage({
      action: 'START_SESSION',
      tabId: currentTabId,
      profile: selectedProfile,
    });

    if (response?.ok) {
      // Registrar sesión en backend
      const { anonymous_id } = await chrome.storage.local.get('anonymous_id');

      try {
        LOG.log('[Panel] Creando sesión en:', `${CONFIG.BASE_URL}/api/sessions`);
        const sessionResponse = await fetch(`${CONFIG.BASE_URL}/api/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_id,
            profile: selectedProfile,
            consent_confirmed: true
          })
        });

        if (!sessionResponse.ok) {
          const errorText = await sessionResponse.text();
          LOG.error('[Panel] ❌ Error al crear sesión:', sessionResponse.status, errorText);
          throw new Error(`Error al crear sesión: ${sessionResponse.status}`);
        }

        const sessionData = await sessionResponse.json();
        LOG.log('[Panel] ✅ Sesión creada:', sessionData);

        // Guardar session_id
        if (sessionData.session_id) {
          await chrome.storage.session.set({ sessionId: sessionData.session_id });
          LOG.log('[Panel] session_id guardado:', sessionData.session_id);
        }

        // Esperar a que Supabase procese el trigger increment_session_count
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (err) {
        LOG.error('[Panel] Error al crear sesión:', err);
        // No bloquear el inicio si falla el registro
      }

      // Cambiar a vista 2 (sesión activa)
      showActiveSessionView();
      setSessionActive(true, selectedProfile);

    } else {
      throw new Error(response?.error || 'Error desconocido en background.js');
    }
  } catch (err) {
    showError('Error al iniciar: ' + err.message);
    startBtnInitial.disabled = false;
    startBtnInitial.textContent = i18n('startButton');
  }
}

// ─────────────────────────────────────────────────────────────
// TERMINAR SESIÓN (Vista 2 → Vista 1)
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

  // Volver a vista de selección de perfil
  await showProfileSelectionView();
  setSessionInactive();
}

// ─────────────────────────────────────────────────────────────
// SELECCIÓN DE PERFIL
// ─────────────────────────────────────────────────────────────

function selectProfile(profile) {
  selectedProfile = profile;

  // Actualizar clases visuales
  profileBtns.forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.profile === profile);
  });

  // Persistir selección
  chrome.storage.local.set({ savedProfile: profile });

  // Mostrar secciones de consentimiento y emails
  showElement(consentSectionInitial);
  showElement(emailsSectionInitial);

  updateStartButton();
}

// ─────────────────────────────────────────────────────────────
// SOLICITUD DE MICRÓFONO
// ─────────────────────────────────────────────────────────────

async function handleRequestMicClick() {
  hideError();
  requestMicBtn.disabled = true;
  requestMicBtn.textContent = currentLanguage === 'es' ? 'Solicitando permiso...' : 'Requesting permission...';

  try {
    LOG.log('[Panel] Solicitando permiso de micrófono...');
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    LOG.log('[Panel] ✅ Permiso de micrófono concedido');

    // Detener el stream inmediatamente
    micStream.getTracks().forEach(track => track.stop());

    micPermissionGranted = true;
    hideElement(requestMicBtn);
    updateStartButton();

    // Mensaje de éxito
    const successMsg = document.createElement('p');
    successMsg.textContent = '✅ ' + (currentLanguage === 'es' ? 'Micrófono permitido' : 'Microphone allowed');
    successMsg.style.color = '#10b981';
    successMsg.style.fontSize = '14px';
    successMsg.style.marginTop = '8px';
    requestMicBtn.parentElement.appendChild(successMsg);

    setTimeout(() => successMsg.remove(), 3000);
  } catch (err) {
    LOG.error('[Panel] Error al solicitar micrófono:', err);
    if (err.name === 'NotAllowedError') {
      showError('Permiso denegado. Ve a chrome://extensions, busca Confident, y permite el micrófono.');
    } else {
      showError('Error: ' + err.message);
    }
    requestMicBtn.disabled = false;
    requestMicBtn.textContent = i18n('requestMicButton');
  }
}

// ─────────────────────────────────────────────────────────────
// VERIFICAR LÍMITES FREEMIUM
// ─────────────────────────────────────────────────────────────

async function checkSessionGate() {
  try {
    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');

    // Obtener el access token de Supabase si el usuario está autenticado
    let accessToken = null;
    try {
      // Leer cookie de Supabase (sb-{project-ref}-auth-token)
      // Formato: {"access_token": "...", "refresh_token": "..."}
      const cookies = await chrome.cookies.getAll({
        url: 'http://localhost:3000'
      });

      const authCookie = cookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

      if (authCookie) {
        try {
          const authData = JSON.parse(decodeURIComponent(authCookie.value));
          accessToken = authData.access_token;
          LOG.log('[Panel] ✅ Access token encontrado en cookies de Supabase');
        } catch (parseErr) {
          LOG.error('[Panel] Error parseando cookie de auth:', parseErr);
        }
      } else {
        LOG.log('[Panel] No hay sesión autenticada (cookie no encontrada)');
      }
    } catch (err) {
      LOG.warn('[Panel] Error leyendo cookies:', err);
    }

    // Preparar headers con JWT si existe
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      LOG.log('[Panel] Enviando request con Authorization header');
    }

    // Si no hay token ni anonymous_id, crear anonymous_id
    if (!accessToken && !anonymous_id) {
      return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
    }

    const url = anonymous_id
      ? `${CONFIG.ENDPOINTS.USAGE}?anonymous_id=${anonymous_id}`
      : CONFIG.ENDPOINTS.USAGE;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      LOG.error('[Panel] Error en /api/usage:', response.status);
      return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
    }

    const data = await response.json();
    LOG.log('[Panel] Respuesta de /api/usage:', data);

    const { user_type, session_count, limit, remaining } = data;

    // Paywall suave
    if (user_type === 'anonymous' && session_count >= limit) {
      return { allowed: false, type: 'soft', remaining: 0, session_count };
    }

    // Paywall duro
    if (user_type === 'free' && session_count >= limit) {
      return { allowed: false, type: 'hard', remaining: 0, session_count };
    }

    return { allowed: true, type: user_type, remaining, session_count };
  } catch (err) {
    LOG.error('[Panel] Error en checkSessionGate:', err);
    return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
  }
}

// ─────────────────────────────────────────────────────────────
// MOSTRAR PAYWALL (UX Research + Growth Hacker)
// ─────────────────────────────────────────────────────────────

function showPaywall(type) {
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.id = 'paywall-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    animation: fadeIn 0.3s ease-out;
  `;

  // Crear card del paywall
  const card = document.createElement('div');
  card.style.cssText = `
    background: var(--bg-elevated);
    border-radius: var(--radius-2);
    padding: var(--space-8);
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const isSoft = type === 'soft';

  card.innerHTML = `
    <div style="text-align: center; margin-bottom: var(--space-6);">
      <div style="font-size: 48px; margin-bottom: var(--space-4);">
        ${isSoft ? '🎉' : '🚀'}
      </div>
      <h2 style="color: var(--text-primary); font-size: var(--text-2xl); font-weight: 600; margin-bottom: var(--space-3);">
        ${i18n(isSoft ? 'paywallSoftTitle' : 'paywallHardTitle')}
      </h2>
      <p style="color: var(--text-secondary); font-size: var(--text-base); line-height: 1.6;">
        ${i18n(isSoft ? 'paywallSoftDesc' : 'paywallHardDesc')}
      </p>
    </div>

    <div style="margin-bottom: var(--space-6);">
      <div style="color: var(--text-primary); font-size: var(--text-sm); margin-bottom: var(--space-2); padding: var(--space-3); background: var(--bg-subtle); border-radius: var(--radius-1);">
        ${i18n(isSoft ? 'paywallSoftBenefit1' : 'paywallHardBenefit1')}
      </div>
      <div style="color: var(--text-primary); font-size: var(--text-sm); margin-bottom: var(--space-2); padding: var(--space-3); background: var(--bg-subtle); border-radius: var(--radius-1);">
        ${i18n(isSoft ? 'paywallSoftBenefit2' : 'paywallHardBenefit2')}
      </div>
      <div style="color: var(--text-primary); font-size: var(--text-sm); padding: var(--space-3); background: var(--bg-subtle); border-radius: var(--radius-1);">
        ${i18n(isSoft ? 'paywallSoftBenefit3' : 'paywallHardBenefit3')}
      </div>
    </div>

    <button id="paywall-cta" class="btn-primary" style="width: 100%; margin-bottom: var(--space-3); background: var(--accent-primary); color: white; font-weight: 600; padding: var(--space-3) var(--space-4); border-radius: var(--radius-1); border: none; cursor: pointer; font-size: var(--text-base); transition: all 0.2s;">
      ${i18n(isSoft ? 'paywallSoftCta' : 'paywallHardCta')}
    </button>

    ${isSoft ? `
      <button id="paywall-dismiss" style="width: 100%; background: transparent; color: var(--text-secondary); font-weight: 500; padding: var(--space-2); border: none; cursor: pointer; font-size: var(--text-sm); transition: color 0.2s;">
        ${i18n('paywallSoftDismiss')}
      </button>
    ` : `
      <button id="paywall-contact" style="width: 100%; background: transparent; color: var(--text-secondary); font-weight: 500; padding: var(--space-2); border: none; cursor: pointer; font-size: var(--text-sm); transition: color 0.2s;">
        ${i18n('paywallHardContact')}
      </button>
    `}
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Animaciones CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    #paywall-cta:hover {
      background: var(--accent-hover) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }
    #paywall-dismiss:hover, #paywall-contact:hover {
      color: var(--text-primary) !important;
    }
  `;
  document.head.appendChild(style);

  // Event listeners
  const ctaBtn = document.getElementById('paywall-cta');
  const dismissBtn = document.getElementById('paywall-dismiss');
  const contactBtn = document.getElementById('paywall-contact');

  ctaBtn.addEventListener('click', () => {
    const url = isSoft
      ? `${CONFIG.ENDPOINTS.AUTH}?reason=limit_soft`
      : CONFIG.ENDPOINTS.PRICING;
    chrome.tabs.create({ url });
    overlay.remove();
  });

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      overlay.remove();
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'mailto:hola@tryconfident.com?subject=Consulta sobre planes Pro' });
      overlay.remove();
    });
  }
}

// ─────────────────────────────────────────────────────────────
// ACTUALIZAR BOTÓN INICIAR
// ─────────────────────────────────────────────────────────────

function updateStartButton() {
  const hasProfile = !!selectedProfile;
  const inPlatform = !!currentTabId;
  const hasMicPermission = micPermissionGranted;
  const hasConsent = consentCheckboxInitial.checked;

  if (!hasMicPermission && hasProfile && inPlatform) {
    showElement(requestMicBtn);
    startBtnInitial.disabled = true;
  } else {
    hideElement(requestMicBtn);
    startBtnInitial.disabled = !(hasProfile && inPlatform && hasMicPermission && hasConsent);
  }
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // Vista 1: Selección de perfil
  profileBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectProfile(btn.dataset.profile);
    });
  });

  // Checkbox de consentimiento
  consentCheckboxInitial.addEventListener('change', updateStartButton);

  // Botón solicitar micrófono
  requestMicBtn.addEventListener('click', handleRequestMicClick);

  // Botón iniciar sesión
  startBtnInitial.addEventListener('click', handleStartClick);

  // Vista 2: Sesión activa
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
    candidato: i18n('profileCandidate'),
    vendedor: i18n('profileSales'),
    defensor: i18n('profileDefender'),
  };
  return labels[profile] ?? profile ?? (currentLanguage === 'es' ? 'Sesión' : 'Session');
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
// UTILIDADES
// ─────────────────────────────────────────────────────────────

function showError(msg) {
  errorMsgInitial.textContent = msg;
  showElement(errorMsgInitial);
}

function hideError() {
  hideElement(errorMsgInitial);
}

function showElement(el) {
  if (el) el.classList.remove('hidden');
}

function hideElement(el) {
  if (el) el.classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────
// CONTADOR DE SESIONES
// ─────────────────────────────────────────────────────────────

// Contador para vista inicial (profileSelectionView)
async function updateSessionCounterInitial() {
  try {
    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
    if (!anonymous_id) {
      sessionCounterFooterInitial.classList.add('hidden');
      return;
    }

    const response = await fetch(`${CONFIG.ENDPOINTS.USAGE}?anonymous_id=${anonymous_id}`);
    if (!response.ok) {
      sessionCounterFooterInitial.classList.add('hidden');
      return;
    }

    const data = await response.json();
    const { user_type, remaining } = data;

    let showCounter = false;
    counterFooterTextInitial.textContent = '';

    if (user_type === 'pro') {
      showCounter = false;
    } else if (user_type === 'anonymous') {
      const sessionsText = remaining === 1
        ? (currentLanguage === 'es' ? 'sesión gratuita' : 'free session')
        : i18n('sessionCounter');
      const text = `${remaining} ${sessionsText}. `;
      const textNode = document.createTextNode(text);

      const link = document.createElement('a');
      link.href = `${CONFIG.ENDPOINTS.AUTH}?reason=limit_soft`;
      link.target = '_blank';
      link.textContent = i18n('sessionCounterRegister');

      counterFooterTextInitial.appendChild(textNode);
      counterFooterTextInitial.appendChild(link);

      showCounter = true;
    } else if (user_type === 'free') {
      if (remaining <= 3 && remaining > 0) {
        const sessionsText = remaining === 1
          ? (currentLanguage === 'es' ? 'sesión restante' : 'session remaining')
          : i18n('sessionCounterRemaining');
        const text = `${remaining} ${sessionsText}. `;
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = i18n('sessionCounterUpgrade');

        counterFooterTextInitial.appendChild(textNode);
        counterFooterTextInitial.appendChild(link);

        showCounter = true;
      } else if (remaining === 0) {
        // Mostrar paywall modal prominente (Growth Hacker + UX Research)
        const paywallType = user_type === 'anonymous' ? 'soft' : 'hard';
        showPaywall(paywallType);

        const text = i18n('sessionCounterLimitReached') + '. ';
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = i18n('sessionCounterUpgrade');

        counterFooterTextInitial.appendChild(textNode);
        counterFooterTextInitial.appendChild(link);

        showCounter = true;
      }
    }

    if (showCounter) {
      sessionCounterFooterInitial.classList.remove('hidden');
    } else {
      sessionCounterFooterInitial.classList.add('hidden');
    }

  } catch (err) {
    console.error('[Panel] Error al actualizar contador inicial:', err);
    sessionCounterFooterInitial.classList.add('hidden');
  }
}

// Contador para vista activa (activeSessionView)
async function updateSessionCounter() {
  try {
    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
    if (!anonymous_id) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    const response = await fetch(`${CONFIG.ENDPOINTS.USAGE}?anonymous_id=${anonymous_id}`);
    if (!response.ok) {
      sessionCounterFooter.classList.add('hidden');
      return;
    }

    const data = await response.json();
    const { user_type, remaining } = data;

    let showCounter = false;
    counterFooterText.textContent = '';

    if (user_type === 'pro') {
      showCounter = false;
    } else if (user_type === 'anonymous') {
      const sessionsText = remaining === 1
        ? (currentLanguage === 'es' ? 'sesión gratuita' : 'free session')
        : i18n('sessionCounter');
      const text = `${remaining} ${sessionsText}. `;
      const textNode = document.createTextNode(text);

      const link = document.createElement('a');
      link.href = `${CONFIG.ENDPOINTS.AUTH}?reason=limit_soft`;
      link.target = '_blank';
      link.textContent = i18n('sessionCounterRegister');

      counterFooterText.appendChild(textNode);
      counterFooterText.appendChild(link);

      showCounter = true;
    } else if (user_type === 'free') {
      if (remaining <= 3 && remaining > 0) {
        const sessionsText = remaining === 1
          ? (currentLanguage === 'es' ? 'sesión restante' : 'session remaining')
          : i18n('sessionCounterRemaining');
        const text = `${remaining} ${sessionsText}. `;
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = i18n('sessionCounterUpgrade');

        counterFooterText.appendChild(textNode);
        counterFooterText.appendChild(link);

        showCounter = true;
      } else if (remaining === 0) {
        // CRÍTICO: El usuario alcanzó el límite durante una sesión activa
        // Mostrar paywall modal prominente (Growth Hacker + UX Research)
        LOG.warn('[Panel] ⚠️ Límite alcanzado durante sesión activa, mostrando paywall');

        const paywallType = user_type === 'anonymous' ? 'soft' : 'hard';
        showPaywall(paywallType);

        // Detener la sesión actual automáticamente
        try {
          await handleStopSession();
          LOG.log('[Panel] Sesión detenida automáticamente por límite alcanzado');
        } catch (err) {
          LOG.error('[Panel] Error al detener sesión:', err);
        }

        const text = i18n('sessionCounterLimitReached') + '. ';
        const textNode = document.createTextNode(text);

        const link = document.createElement('a');
        link.href = CONFIG.ENDPOINTS.PRICING;
        link.target = '_blank';
        link.textContent = i18n('sessionCounterUpgrade');

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
