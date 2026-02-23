// popup.js — Lógica del popup de Confident
// Sesión 1: selector de perfil + API key + botón iniciar/detener

// ─────────────────────────────────────────────────────────────
// ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────

const profileBtns = document.querySelectorAll('.profile-btn');
const requestMicBtn = document.getElementById('request-mic-btn');
const consentSection = document.getElementById('consent-section');
const consentCheckbox = document.getElementById('consent-checkbox');
const emailsSection = document.getElementById('emails-section');
const participantEmailsInput = document.getElementById('participant-emails');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const openPanelBtn = document.getElementById('open-panel-btn');
const errorMsg = document.getElementById('error-msg');
const notInMeet = document.getElementById('not-in-meet');
const sessionStatus = document.getElementById('session-status');
const statusText = document.getElementById('status-text');

let micPermissionGranted = false;

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
  // Generar device fingerprint único (persiste incluso si se desinstala la extensión)
  const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
  if (!anonymous_id) {
    console.log('[Popup] Generando device fingerprint...');
    const fingerprint = await getDeviceFingerprint();
    await chrome.storage.local.set({ anonymous_id: fingerprint });
    console.log('[Popup] Device fingerprint generado:', fingerprint.substring(0, 20) + '...');
  } else {
    console.log('[Popup] Device fingerprint existente:', anonymous_id.substring(0, 20) + '...');
  }

  // Restaurar perfil guardado en storage.local
  const { savedProfile } = await chrome.storage.local.get('savedProfile');
  if (savedProfile) {
    selectProfile(savedProfile);
  }

  // Verificar si hay sesión activa
  const { sessionActive } = await chrome.storage.session.get('sessionActive');
  if (sessionActive) {
    setSessionActiveUI(true);
  }

  // Verificar si ya tiene permiso de micrófono
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasAudioInput = devices.some(device => device.kind === 'audioinput' && device.label !== '');

    if (hasAudioInput) {
      // Si podemos ver las etiquetas, significa que ya tenemos permiso
      micPermissionGranted = true;
      console.log('[Popup] Permiso de micrófono ya concedido');
    }
  } catch (err) {
    console.log('[Popup] No se pudo verificar permiso de micrófono:', err);
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

  // Checkbox de consentimiento (Sesión 6)
  consentCheckbox.addEventListener('change', updateStartButton);

  // Botón SOLICITAR MICRÓFONO
  requestMicBtn.addEventListener('click', handleRequestMicClick);

  // Botón INICIAR — este es el user gesture que Chrome necesita para tabCapture
  startBtn.addEventListener('click', handleStartClick);

  // Botón DETENER
  stopBtn.addEventListener('click', handleStopClick);

  // Botón ABRIR PANEL
  openPanelBtn.addEventListener('click', openSidePanel);
}

// ─────────────────────────────────────────────────────────────
// VERIFICAR LÍMITES DE SESIONES (FREEMIUM GATE)
// ─────────────────────────────────────────────────────────────

async function checkSessionGate() {
  try {
    const { anonymous_id } = await chrome.storage.local.get('anonymous_id');

    if (!anonymous_id) {
      console.warn('[Popup] No anonymous_id found');
      return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
    }

    // Llamar a /api/usage para verificar límite
    const response = await fetch(`http://localhost:3000/api/usage?anonymous_id=${anonymous_id}`);

    if (!response.ok) {
      console.error('[Popup] Error en /api/usage:', response.status);
      // Si el servidor no está disponible, permitir sesión pero sin contador
      return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
    }

    const data = await response.json();

    if (data.error) {
      console.error('[Popup] Error en respuesta:', data.error);
      return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
    }

    const { user_type, session_count, limit, remaining } = data;

    // Sesión 6 sin cuenta → paywall suave
    if (user_type === 'anonymous' && session_count >= limit) {
      return { allowed: false, type: 'soft', remaining: 0, session_count };
    }

    // Sesión 16 con cuenta free → paywall duro
    if (user_type === 'free' && session_count >= limit) {
      return { allowed: false, type: 'hard', remaining: 0, session_count };
    }

    // Pro ilimitado o dentro de límite
    return { allowed: true, type: user_type, remaining, session_count };
  } catch (err) {
    console.error('[Popup] Error en checkSessionGate:', err);
    // En caso de error, permitir sesión (modo degradado)
    return { allowed: true, type: 'anonymous', remaining: 5, session_count: 0 };
  }
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

  // Mostrar secciones de consentimiento y emails (Sesión 6)
  showElement(consentSection);
  showElement(emailsSection);

  updateStartButton();
}

// ─────────────────────────────────────────────────────────────
// LÓGICA DEL BOTÓN INICIAR
// ─────────────────────────────────────────────────────────────

async function handleRequestMicClick() {
  hideError();
  requestMicBtn.disabled = true;
  requestMicBtn.textContent = 'Solicitando permiso...';

  try {
    console.log('[Popup] Solicitando permiso de micrófono...');
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    console.log('[Popup] ✅ Permiso de micrófono concedido');

    // Detener el stream inmediatamente - solo queríamos el permiso
    micStream.getTracks().forEach(track => track.stop());

    micPermissionGranted = true;
    hideElement(requestMicBtn);
    updateStartButton();

    // Mostrar mensaje de éxito temporal
    const successMsg = document.createElement('p');
    successMsg.textContent = '✅ Micrófono permitido';
    successMsg.style.color = '#10b981';
    successMsg.style.fontSize = '14px';
    successMsg.style.marginTop = '8px';
    requestMicBtn.parentElement.appendChild(successMsg);

    setTimeout(() => successMsg.remove(), 3000);

  } catch (err) {
    console.error('[Popup] Error al solicitar micrófono:', err);
    if (err.name === 'NotAllowedError') {
      showError('Permiso denegado. Ve a chrome://extensions, busca Confident, y permite el micrófono.');
    } else {
      showError('Error: ' + err.message);
    }
    requestMicBtn.disabled = false;
    requestMicBtn.textContent = '🎤 Permitir acceso al micrófono';
  }
}

async function handleStartClick() {
  hideError();

  if (!selectedProfile) {
    showError('Selecciona un perfil antes de iniciar.');
    return;
  }

  if (!currentTabId) {
    showError('No se detectó un tab de Google Meet activo.');
    return;
  }

  if (!micPermissionGranted) {
    showError('Primero permite el acceso al micrófono.');
    showElement(requestMicBtn);
    return;
  }

  startBtn.disabled = true;
  startBtn.textContent = 'Verificando límite...';

  try {
    // 🔴 NUEVO: Verificar límites antes de iniciar
    const gateCheck = await checkSessionGate();

    if (!gateCheck.allowed) {
      // Mostrar paywall
      const url = gateCheck.type === 'soft'
        ? 'http://localhost:3000/auth?reason=limit_soft'
        : 'http://localhost:3000/pricing'; // Paywall hard → Pricing page
      chrome.tabs.create({ url });

      startBtn.disabled = false;
      startBtn.textContent = 'Iniciar sesión';
      return;
    }

    startBtn.textContent = 'Iniciando...';

    // Guardar consentimiento y emails (Sesión 6)
    const emailsInput = participantEmailsInput.value.trim();
    const emails = emailsInput
      ? emailsInput.split(',').map(e => e.trim()).filter(e => e.length > 0)
      : [];

    await chrome.storage.session.set({
      consentConfirmed: true,
      participantEmails: emails
    });

    console.log('[Popup] ✅ Consentimiento confirmado. Emails:', emails.length);

    // Enviar mensaje al background.js con el tabId y el perfil
    // IMPORTANTE: este clic ES el user gesture que Chrome requiere para tabCapture
    const response = await chrome.runtime.sendMessage({
      action: 'START_SESSION',
      tabId: currentTabId,
      profile: selectedProfile,
    });

    if (response?.ok) {
      // Registrar sesión en backend ANTES de cambiar la UI
      const { anonymous_id } = await chrome.storage.local.get('anonymous_id');

      try {
        const sessionResponse = await fetch('http://localhost:3000/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_id,
            profile_type: selectedProfile,
            session_number: gateCheck.session_count + 1
          })
        });

        if (!sessionResponse.ok) {
          console.error('[Popup] Error al registrar sesión:', sessionResponse.status);
        } else {
          const sessionData = await sessionResponse.json();
          console.log('[Popup] ✅ Sesión registrada:', sessionData);

          // Esperar 500ms para que Supabase procese el insert + trigger
          await new Promise(resolve => setTimeout(resolve, 500));

          // Actualizar contador para reflejar la nueva sesión consumida
          const updatedGate = await checkSessionGate();
          console.log('[Popup] Contador actualizado:', updatedGate);

          // Mostrar brevemente el contador actualizado ANTES de activar la sesión
          if (updatedGate.remaining !== undefined) {
            // Contador movido al panel lateral - solo loguear
            console.log(`[Popup] Sesión iniciada. Quedan ${updatedGate.remaining} sesiones`);
          }
        }
      } catch (err) {
        console.error('[Popup] Error al llamar /api/session:', err);
        // No bloquear el inicio de sesión si falla el registro
      }

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
  const hasProfile = !!selectedProfile;
  const inMeet = !!currentTabId;
  const hasMicPermission = micPermissionGranted;
  const hasConsent = consentCheckbox.checked; // Sesión 6

  // Mostrar botón de solicitar micrófono si no hay permiso
  if (!hasMicPermission && hasProfile && inMeet) {
    showElement(requestMicBtn);
    startBtn.disabled = true;
  } else {
    hideElement(requestMicBtn);
    // Ahora también requiere consentimiento marcado
    startBtn.disabled = !(hasProfile && inMeet && hasMicPermission && hasConsent);
  }
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
