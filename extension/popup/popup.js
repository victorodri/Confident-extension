// popup.js — Lógica del popup de Confident
// Sesión 1: selector de perfil + API key + botón iniciar/detener

// ─────────────────────────────────────────────────────────────
// ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────

const profileBtns = document.querySelectorAll('.profile-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const openPanelBtn = document.getElementById('open-panel-btn');
const deepgramKeyInput = document.getElementById('deepgram-key');
const errorMsg = document.getElementById('error-msg');
const notInMeet = document.getElementById('not-in-meet');
const sessionStatus = document.getElementById('session-status');
const statusText = document.getElementById('status-text');

// ─────────────────────────────────────────────────────────────
// ESTADO LOCAL
// ─────────────────────────────────────────────────────────────

let selectedProfile = null;
let currentTabId = null;

// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await checkIfInMeet();
  await restoreState();
  setupEventListeners();
});

// ─────────────────────────────────────────────────────────────
// VERIFICAR SI EL TAB ACTIVO ES GOOGLE MEET
// ─────────────────────────────────────────────────────────────

async function checkIfInMeet() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url?.includes('meet.google.com')) {
      showElement(notInMeet);
      startBtn.disabled = true;
      return;
    }

    currentTabId = tab.id;
    hideElement(notInMeet);
  } catch (err) {
    showError('Error al detectar el tab: ' + err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// RESTAURAR ESTADO PREVIO (perfil, key, sesión activa)
// ─────────────────────────────────────────────────────────────

async function restoreState() {
  // Restaurar perfil guardado en storage.local
  const { savedProfile } = await chrome.storage.local.get('savedProfile');
  if (savedProfile) {
    selectProfile(savedProfile);
  }

  // Restaurar API key guardada en storage.local
  const { deepgramKey } = await chrome.storage.local.get('deepgramKey');
  if (deepgramKey) {
    deepgramKeyInput.value = deepgramKey;
  }

  // Verificar si hay sesión activa
  const { sessionActive } = await chrome.storage.session.get('sessionActive');
  if (sessionActive) {
    setSessionActiveUI(true);
  }

  updateStartButton();
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // Selección de perfil
  profileBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectProfile(btn.dataset.profile);
    });
  });

  // Input de API key — habilitar/deshabilitar botón en tiempo real
  deepgramKeyInput.addEventListener('input', () => {
    updateStartButton();
  });

  // Botón INICIAR — este es el user gesture que Chrome necesita para tabCapture
  startBtn.addEventListener('click', handleStartClick);

  // Botón DETENER
  stopBtn.addEventListener('click', handleStopClick);

  // Botón ABRIR PANEL
  openPanelBtn.addEventListener('click', openSidePanel);
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

  updateStartButton();
}

// ─────────────────────────────────────────────────────────────
// LÓGICA DEL BOTÓN INICIAR
// ─────────────────────────────────────────────────────────────

async function handleStartClick() {
  hideError();

  const deepgramKey = deepgramKeyInput.value.trim();
  if (!deepgramKey) {
    showError('Necesitas una Deepgram API key para iniciar.');
    return;
  }

  if (!selectedProfile) {
    showError('Selecciona un perfil antes de iniciar.');
    return;
  }

  if (!currentTabId) {
    showError('No se detectó un tab de Google Meet activo.');
    return;
  }

  // Guardar key para no tener que reintroducirla (storage.local)
  await chrome.storage.local.set({ deepgramKey });

  startBtn.disabled = true;
  startBtn.textContent = 'Iniciando...';

  try {
    // Enviar mensaje al background.js con el tabId y el perfil
    // IMPORTANTE: este clic ES el user gesture que Chrome requiere para tabCapture
    const response = await chrome.runtime.sendMessage({
      action: 'START_SESSION',
      tabId: currentTabId,
      profile: selectedProfile,
      deepgramKey: deepgramKey,
    });

    if (response?.ok) {
      setSessionActiveUI(true);
      // Abrir el side panel automáticamente al iniciar — este clic ya es un user gesture
      openSidePanel();
    } else {
      throw new Error(response?.error || 'Error desconocido en background.js');
    }
  } catch (err) {
    showError('Error al iniciar: ' + err.message);
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar sesión';
  }
}

// ─────────────────────────────────────────────────────────────
// LÓGICA DEL BOTÓN DETENER
// ─────────────────────────────────────────────────────────────

async function handleStopClick() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'STOP_SESSION' });
    if (response?.ok) {
      setSessionActiveUI(false);
    }
  } catch (err) {
    showError('Error al detener: ' + err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// ACTUALIZAR ESTADO VISUAL DE BOTÓN INICIAR
// ─────────────────────────────────────────────────────────────

function updateStartButton() {
  const hasKey = deepgramKeyInput.value.trim().length > 0;
  const hasProfile = !!selectedProfile;
  const inMeet = !!currentTabId;
  startBtn.disabled = !(hasKey && hasProfile && inMeet);
}

// ─────────────────────────────────────────────────────────────
// INTERFAZ: SESIÓN ACTIVA / INACTIVA
// ─────────────────────────────────────────────────────────────

function setSessionActiveUI(active) {
  if (active) {
    showElement(sessionStatus);
    showElement(stopBtn);
    showElement(openPanelBtn);
    hideElement(startBtn);
    statusText.textContent = `Sesión activa · ${selectedProfile || ''}`;
  } else {
    hideElement(sessionStatus);
    hideElement(stopBtn);
    hideElement(openPanelBtn);
    showElement(startBtn);
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar sesión';
    updateStartButton();
  }
}

// ─────────────────────────────────────────────────────────────
// ABRIR SIDE PANEL
// ─────────────────────────────────────────────────────────────

function openSidePanel() {
  if (!currentTabId) return;
  // chrome.sidePanel.open requiere user gesture — se llama desde un click
  chrome.sidePanel.open({ tabId: currentTabId }).catch(() => {
    // Fallback: si falla, no hacer nada (el usuario puede abrir el panel manualmente)
  });
}

// ─────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────

function showError(msg) {
  errorMsg.textContent = msg;
  showElement(errorMsg);
}

function hideError() {
  hideElement(errorMsg);
}

function showElement(el) {
  el.classList.remove('hidden');
}

function hideElement(el) {
  el.classList.add('hidden');
}
