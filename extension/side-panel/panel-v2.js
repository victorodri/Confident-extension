// panel-v2.js — Confident Side Panel State Machine
// Maneja los 12 estados del diseño de Figma

import {
  createHeader,
  createButton,
  createCardSelect,
  createCardType,
  createStatusConversacion,
  createHistorial,
  createFooter,
  createPaywall,
  createErrorState
} from './components.js';

// ═══════════════════════════════════════════════════════════
// TRADUCCIONES
// ═══════════════════════════════════════════════════════════

const TRANSLATIONS = {
  es: {
    idle: {
      title: 'Abre una aplicación de videollamada para comenzar',
      platformsLabel: 'Plataformas compatibles:',
      googleMeet: 'Google Meet',
      zoom: 'Zoom',
      teams: 'Microsoft Teams'
    },
    profile: {
      title: 'Selecciona tu rol en la videollamada',
      consent: 'He informado a los participantes de que esta conversación será transcrita y he obtenido su consentimiento',
      startButton: 'Comenzar',
      endButton: 'Terminar reunión'
    },
    profiles: {
      'candidato': {
        title: 'Candidato',
        desc: 'Realizar una entrevista de trabajo'
      },
      'vendedor': {
        title: 'Vendedor',
        desc: 'Hacer prospección o llamadas comerciales'
      },
      'profesor': {
        title: 'Profesor de inglés',
        desc: 'Impartir clases de inglés'
      },
      'defensor': {
        title: 'Reunión o Defensa',
        desc: 'Realizar presentaciones o reuniones técnicas'
      }
    },
    status: {
      listening: 'Escuchando...',
      analyzing: 'Analizando información...'
    },
    history: {
      title: 'Historial',
      empty: 'No hay sugerencias todavía'
    },
    footer: {
      sessionsRemaining: 'sesiones restantes',
      sessionRemaining: 'sesión restante',
      viewPlans: 'Ver planes'
    },
    error: {
      title: 'Ha habido un error',
      message: 'Ha habido un error de sistema, por favor reintenta abrir la aplicación o contacta con soporte',
      retry: 'Reintentar',
      support: 'Contactar con soporte'
    }
  },
  en: {
    idle: {
      title: 'Open a video call app to get started',
      platformsLabel: 'Compatible platforms:',
      googleMeet: 'Google Meet',
      zoom: 'Zoom',
      teams: 'Microsoft Teams'
    },
    profile: {
      title: 'Select your role in the video call',
      consent: 'I have informed participants that this conversation will be transcribed and obtained their consent',
      startButton: 'Start',
      endButton: 'End meeting'
    },
    profiles: {
      'candidato': {
        title: 'Candidate',
        desc: 'Job interview'
      },
      'vendedor': {
        title: 'Salesperson',
        desc: 'Prospecting or sales calls'
      },
      'profesor': {
        title: 'English Teacher',
        desc: 'Teaching English classes'
      },
      'defensor': {
        title: 'Meeting or Defense',
        desc: 'Presentations or technical meetings'
      }
    },
    status: {
      listening: 'Listening...',
      analyzing: 'Analyzing information...'
    },
    history: {
      title: 'History',
      empty: 'No suggestions yet'
    },
    footer: {
      sessionsRemaining: 'sessions remaining',
      sessionRemaining: 'session remaining',
      viewPlans: 'View plans'
    },
    error: {
      title: 'An error has occurred',
      message: 'A system error has occurred, please try reopening the application or contact support',
      retry: 'Retry',
      support: 'Contact support'
    }
  }
};

// Helper function para obtener traducciones
function t(key, lang = 'es') {
  const keys = key.split('.');
  let value = TRANSLATIONS[lang];

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key; // Retornar la clave si no existe traducción
  }

  return value;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

const STATES = {
  IDLE: 'idle',                          // Estado 1: Sin videollamada
  PROFILE_SELECTION: 'profile_selection', // Estado 2: Selección de perfil
  PROFILE_SELECTED: 'profile_selected',   // Estado 3: Perfil seleccionado sin checkbox
  PROFILE_READY: 'profile_ready',         // Estado 4: Perfil + checkbox listo
  ERROR: 'error',                         // Estado 5: Error
  RECONNECTING: 'reconnecting',           // Estado 5b: Reintentando conexión
  LISTENING: 'listening',                 // Estado 6: Escuchando
  ANALYZING: 'analyzing',                 // Estado 7: Analizando
  PAYWALL_FREE: 'paywall_free',          // Estado 8: Paywall free
  PAYWALL_PRO: 'paywall_pro',            // Estado 9: Paywall pro
  SUGGESTIONS_3: 'suggestions_3',         // Estado 10: 3 sugerencias
  SUGGESTIONS_2: 'suggestions_2',         // Estado 11: 2 sugerencias
  SUGGESTIONS_1: 'suggestions_1'          // Estado 12: 1 sugerencia
};

const PROFILES = [
  { id: 'candidato' },
  { id: 'vendedor' },
  { id: 'profesor' },
  { id: 'defensor' }
];

// ═══════════════════════════════════════════════════════════
// STATE MACHINE CLASS
// ═══════════════════════════════════════════════════════════

class PanelStateMachine {
  constructor() {
    this.currentState = STATES.IDLE;
    this.data = {
      language: 'es',
      profile: null,
      consent: false,
      suggestions: [],
      history: [],
      sessionsRemaining: 5,
      totalSessions: 5,
      isAnonymous: true,
      isInVideoCall: false,
      errorMessage: null
    };

    // Referencias a elementos DOM
    this.elements = {
      header: document.getElementById('app-header'),
      main: document.getElementById('app-main'),
      actions: document.getElementById('app-actions'),
      footer: document.getElementById('app-footer')
    };

    // Inicializar
    this.init();
  }

  async init() {
    // Cargar datos desde storage
    await this.loadFromStorage();

    // Escuchar eventos del background
    this.setupMessageListeners();

    // Detectar si estamos en una videollamada
    await this.checkVideoCallStatus();

    // Si detectamos que estamos en videollamada, ir directo a selección de perfil
    if (this.data.isInVideoCall && this.currentState === STATES.IDLE) {
      console.log('[Panel] Videollamada detectada al iniciar, cambiando a PROFILE_SELECTION');
      this.currentState = STATES.PROFILE_SELECTION;
    }

    // Renderizar estado inicial
    this.render();
  }

  async loadFromStorage() {
    try {
      // Cargar idioma desde chrome.storage.local
      const localData = await chrome.storage.local.get(['language']);
      if (localData.language) this.data.language = localData.language;

      // Cargar otros datos desde chrome.storage.sync
      const stored = await chrome.storage.sync.get([
        'profile',
        'sessionsRemaining',
        'totalSessions',
        'isAnonymous'
      ]);

      if (stored.profile) this.data.profile = stored.profile;
      if (stored.sessionsRemaining !== undefined) this.data.sessionsRemaining = stored.sessionsRemaining;
      if (stored.totalSessions !== undefined) this.data.totalSessions = stored.totalSessions;
      if (stored.isAnonymous !== undefined) this.data.isAnonymous = stored.isAnonymous;

      console.log('[Panel] Loaded language:', this.data.language);
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  async saveToStorage() {
    try {
      // Guardar idioma en chrome.storage.local
      await chrome.storage.local.set({ language: this.data.language });

      // Guardar otros datos en chrome.storage.sync
      await chrome.storage.sync.set({
        profile: this.data.profile,
        sessionsRemaining: this.data.sessionsRemaining,
        totalSessions: this.data.totalSessions,
        isAnonymous: this.data.isAnonymous
      });
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  setupMessageListeners() {
    // Escuchar mensajes del background script
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      console.log('[Panel] Mensaje recibido:', message);

      switch (message.action) {
        case 'PLATFORM_DETECTED':
          // Detectó que estamos en Google Meet / Zoom / Teams
          this.data.isInVideoCall = true;
          if (this.currentState === STATES.IDLE) {
            this.setState(STATES.PROFILE_SELECTION);
          }
          break;

        case 'SESSION_STARTED':
          // Sesión iniciada con perfil seleccionado
          this.data.isInVideoCall = true;
          this.setState(STATES.LISTENING);
          break;

        case 'SESSION_STOPPED':
          // Sesión terminada
          this.data.isInVideoCall = false;
          this.data.sessionsRemaining--;
          this.saveToStorage();
          this.checkSessionLimit();
          break;

        case 'PANEL_STATUS':
          // Estado de procesamiento (ej: "Analizando...")
          if (message.text === 'Analizando...') {
            this.setState(STATES.ANALYZING);
          }
          break;

        case 'NEW_SUGGESTION':
          // Nueva sugerencia recibida desde Claude
          this.addSuggestion(message.result);
          break;

        case 'PANEL_ERROR':
          // Error ocurrido
          this.data.errorMessage = message.text || 'Error desconocido';
          this.setState(STATES.ERROR);
          break;
      }
      sendResponse({ success: true });
    });

    // Escuchar cambios de idioma
    window.addEventListener('languageChanged', (e) => {
      this.data.language = e.detail.language;
      this.saveToStorage();
      this.render();
    });
  }

  async checkVideoCallStatus() {
    try {
      // Verificar si hay una tab activa con una plataforma de videollamada
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const url = tabs[0].url || '';
        const isVideoCall = url.includes('meet.google.com') ||
                           url.includes('zoom.us') ||
                           url.includes('teams.microsoft.com');
        this.data.isInVideoCall = isVideoCall;
      }
    } catch (error) {
      console.error('Error checking video call status:', error);
    }
  }

  checkSessionLimit() {
    if (this.data.sessionsRemaining <= 0) {
      if (this.data.isAnonymous) {
        this.setState(STATES.PAYWALL_FREE);
      } else if (this.data.totalSessions <= 15) {
        this.setState(STATES.PAYWALL_FREE);
      } else {
        this.setState(STATES.PAYWALL_PRO);
      }
    }
  }

  addSuggestion(suggestion) {
    this.data.suggestions.unshift(suggestion);
    this.data.history.unshift(suggestion);

    // Mantener solo las últimas 3 sugerencias visibles
    if (this.data.suggestions.length > 3) {
      this.data.suggestions = this.data.suggestions.slice(0, 3);
    }

    // Mantener historial de hasta 20 items
    if (this.data.history.length > 20) {
      this.data.history = this.data.history.slice(0, 20);
    }

    // Actualizar estado según número de sugerencias
    if (this.data.suggestions.length >= 3) {
      this.setState(STATES.SUGGESTIONS_3);
    } else if (this.data.suggestions.length === 2) {
      this.setState(STATES.SUGGESTIONS_2);
    } else if (this.data.suggestions.length === 1) {
      this.setState(STATES.SUGGESTIONS_1);
    }
  }

  setState(newState) {
    console.log(`State transition: ${this.currentState} → ${newState}`);
    this.currentState = newState;
    this.render();
  }

  render() {
    // Limpiar contenido anterior
    this.elements.header.innerHTML = '';
    this.elements.main.innerHTML = '';
    this.elements.actions.innerHTML = '';
    this.elements.footer.innerHTML = '';

    // Renderizar según el estado actual
    switch (this.currentState) {
      case STATES.IDLE:
        this.renderIdle();
        break;
      case STATES.PROFILE_SELECTION:
        this.renderProfileSelection();
        break;
      case STATES.PROFILE_SELECTED:
        this.renderProfileSelected();
        break;
      case STATES.PROFILE_READY:
        this.renderProfileReady();
        break;
      case STATES.ERROR:
        this.renderError();
        break;
      case STATES.RECONNECTING:
        this.renderReconnecting();
        break;
      case STATES.LISTENING:
        this.renderListening();
        break;
      case STATES.ANALYZING:
        this.renderAnalyzing();
        break;
      case STATES.PAYWALL_FREE:
        this.renderPaywallFree();
        break;
      case STATES.PAYWALL_PRO:
        this.renderPaywallPro();
        break;
      case STATES.SUGGESTIONS_3:
      case STATES.SUGGESTIONS_2:
      case STATES.SUGGESTIONS_1:
        this.renderSuggestions();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER METHODS
  // ═══════════════════════════════════════════════════════════

  renderIdle() {
    // Estado 1: Sin abrir videollamada
    const header = createHeader({ status: 'inactive', language: this.data.language, showStatus: true });
    this.elements.header.appendChild(header);

    // Main content
    const container = document.createElement('div');
    container.className = 'container-centered';

    // Título
    const title = document.createElement('div');
    title.className = 'title-main text-centered';
    title.style.width = '310px';
    title.textContent = t('idle.title', this.data.language);
    container.appendChild(title);

    // Iconos de plataformas
    const platformsContainer = document.createElement('div');
    platformsContainer.style.display = 'flex';
    platformsContainer.style.flexDirection = 'row';
    platformsContainer.style.gap = '16px';

    const platforms = [
      {
        name: 'Meet',
        url: 'https://meet.google.com/',
        icon: 'assets/meet.png'
      },
      {
        name: 'Zoom',
        url: 'https://zoom.us/start/videomeeting',
        icon: 'assets/zoom.png'
      },
      {
        name: 'Teams',
        url: 'https://teams.microsoft.com/',
        icon: 'assets/teams.png'
      }
    ];

    platforms.forEach(platform => {
      // Container de cada plataforma (50x72px)
      const platformEl = document.createElement('div');
      platformEl.style.display = 'flex';
      platformEl.style.flexDirection = 'column';
      platformEl.style.alignItems = 'center';
      platformEl.style.width = '50px';
      platformEl.style.height = '72px';
      platformEl.style.gap = '8px';
      platformEl.style.cursor = 'pointer';

      // Hacer clic abre la plataforma
      platformEl.onclick = () => {
        chrome.tabs.create({ url: platform.url });
      };

      // Cuadrado del icono (50x50px)
      const iconBox = document.createElement('div');
      iconBox.style.width = '50px';
      iconBox.style.height = '50px';
      iconBox.style.background = '#ffffff';
      iconBox.style.border = '1px solid #e8e7e2';
      iconBox.style.borderRadius = '12px';
      iconBox.style.flexShrink = '0';
      iconBox.style.display = 'flex';
      iconBox.style.alignItems = 'center';
      iconBox.style.justifyContent = 'center';
      iconBox.style.transition = 'transform 0.2s, box-shadow 0.2s';

      // Icono como imagen
      const iconImg = document.createElement('img');
      iconImg.src = platform.icon;
      iconImg.alt = platform.name;
      iconImg.style.width = '32px';
      iconImg.style.height = '32px';
      iconBox.appendChild(iconImg);

      platformEl.appendChild(iconBox);

      // Efecto hover
      platformEl.onmouseenter = () => {
        iconBox.style.transform = 'translateY(-2px)';
        iconBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      };
      platformEl.onmouseleave = () => {
        iconBox.style.transform = 'translateY(0)';
        iconBox.style.boxShadow = 'none';
      };

      // Texto debajo
      const label = document.createElement('div');
      label.style.fontFamily = 'Lato, sans-serif';
      label.style.fontSize = '12px';
      label.style.lineHeight = '14px';
      label.style.color = '#062031';
      label.style.textAlign = 'center';
      label.textContent = platform.name;
      platformEl.appendChild(label);

      platformsContainer.appendChild(platformEl);
    });

    container.appendChild(platformsContainer);
    this.elements.main.appendChild(container);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderProfileSelection() {
    // Estado 2: En videollamada, selección del perfil
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content - container centrado
    const container = document.createElement('div');
    container.className = 'container-centered';

    // Título
    const title = document.createElement('div');
    title.className = 'title-main text-centered';
    title.textContent = t('profile.title', this.data.language);
    container.appendChild(title);

    // Container de cards
    const profilesContainer = document.createElement('div');
    profilesContainer.style.display = 'flex';
    profilesContainer.style.flexDirection = 'column';
    profilesContainer.style.gap = '8px';
    profilesContainer.style.width = '100%';
    profilesContainer.style.maxWidth = '395px';

    PROFILES.forEach(profile => {
      const card = createCardSelect({
        title: t(`profiles.${profile.id}.title`, this.data.language),
        description: t(`profiles.${profile.id}.desc`, this.data.language),
        selected: false,
        onChange: () => {
          this.data.profile = profile.id;
          this.setState(STATES.PROFILE_SELECTED);
        }
      });
      profilesContainer.appendChild(card);
    });

    container.appendChild(profilesContainer);
    this.elements.main.appendChild(container);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderProfileSelected() {
    // Estado 3: Perfil seleccionado, sin checkbox
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content - container centrado
    const container = document.createElement('div');
    container.className = 'container-centered';

    // Título
    const title = document.createElement('div');
    title.className = 'title-main text-centered';
    title.textContent = t('profile.title', this.data.language);
    container.appendChild(title);

    // Container de cards
    const profilesContainer = document.createElement('div');
    profilesContainer.style.display = 'flex';
    profilesContainer.style.flexDirection = 'column';
    profilesContainer.style.gap = '8px';
    profilesContainer.style.width = '100%';
    profilesContainer.style.maxWidth = '395px';

    PROFILES.forEach(profile => {
      const card = createCardSelect({
        title: t(`profiles.${profile.id}.title`, this.data.language),
        description: t(`profiles.${profile.id}.desc`, this.data.language),
        selected: this.data.profile === profile.id,
        onChange: () => {
          this.data.profile = profile.id;
          this.render();
        }
      });
      profilesContainer.appendChild(card);
    });

    container.appendChild(profilesContainer);
    this.elements.main.appendChild(container);

    // Actions: Checkbox + Botón
    const actionsContainer = document.createElement('div');
    actionsContainer.style.display = 'flex';
    actionsContainer.style.flexDirection = 'column';
    actionsContainer.style.alignItems = 'center';
    actionsContainer.style.gap = '12px';
    actionsContainer.style.padding = '12px';
    actionsContainer.style.width = '100%';
    actionsContainer.style.maxWidth = '459px';
    actionsContainer.style.boxSizing = 'border-box';

    // Checkbox de consentimiento
    const consentCard = createCardSelect({
      title: t('profile.consent', this.data.language),
      isCheckbox: true,
      selected: false,
      onChange: (checked) => {
        this.data.consent = checked;
        this.setState(STATES.PROFILE_READY);
      }
    });
    consentCard.style.maxWidth = '435px';
    actionsContainer.appendChild(consentCard);

    // Botón deshabilitado
    const btn = createButton({
      text: t('profile.startButton', this.data.language),
      type: 'filled',
      disabled: true
    });
    btn.style.width = '100%';
    btn.style.maxWidth = '435px';
    actionsContainer.appendChild(btn);

    this.elements.actions.appendChild(actionsContainer);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderProfileReady() {
    // Estado 4: Perfil + checkbox marcado, botón habilitado
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content - container centrado
    const container = document.createElement('div');
    container.className = 'container-centered';

    // Título
    const title = document.createElement('div');
    title.className = 'title-main text-centered';
    title.textContent = t('profile.title', this.data.language);
    container.appendChild(title);

    // Container de cards
    const profilesContainer = document.createElement('div');
    profilesContainer.style.display = 'flex';
    profilesContainer.style.flexDirection = 'column';
    profilesContainer.style.gap = '8px';
    profilesContainer.style.width = '100%';
    profilesContainer.style.maxWidth = '395px';

    PROFILES.forEach(profile => {
      const card = createCardSelect({
        title: t(`profiles.${profile.id}.title`, this.data.language),
        description: t(`profiles.${profile.id}.desc`, this.data.language),
        selected: this.data.profile === profile.id,
        onChange: () => {
          this.data.profile = profile.id;
          this.render();
        }
      });
      profilesContainer.appendChild(card);
    });

    container.appendChild(profilesContainer);
    this.elements.main.appendChild(container);

    // Actions: Checkbox + Botón
    const actionsContainer = document.createElement('div');
    actionsContainer.style.display = 'flex';
    actionsContainer.style.flexDirection = 'column';
    actionsContainer.style.alignItems = 'center';
    actionsContainer.style.gap = '12px';
    actionsContainer.style.padding = '12px';
    actionsContainer.style.width = '100%';
    actionsContainer.style.maxWidth = '459px';
    actionsContainer.style.boxSizing = 'border-box';

    // Checkbox de consentimiento (marcado)
    const consentCard = createCardSelect({
      title: t('profile.consent', this.data.language),
      isCheckbox: true,
      selected: true,
      onChange: (checked) => {
        this.data.consent = checked;
        if (!checked) {
          this.setState(STATES.PROFILE_SELECTED);
        }
      }
    });
    consentCard.style.maxWidth = '435px';
    actionsContainer.appendChild(consentCard);

    // Botón habilitado
    const btn = createButton({
      text: t('profile.startButton', this.data.language),
      type: 'filled',
      onClick: () => this.startSession()
    });
    btn.style.width = '100%';
    btn.style.maxWidth = '435px';
    actionsContainer.appendChild(btn);

    this.elements.actions.appendChild(actionsContainer);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderError() {
    // Estado 5: Error
    const header = createHeader({ status: 'error', language: this.data.language });
    this.elements.header.appendChild(header);

    const errorState = createErrorState({
      message: this.data.errorMessage,
      language: this.data.language,
      onRetry: () => {
        // Ir al estado de reconexión que intentará resolver el problema
        this.setState(STATES.RECONNECTING);
      }
    });
    this.elements.main.appendChild(errorState);

    // Footer (opcional según diseño)
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderReconnecting() {
    // Estado 5b: Reintentando conexión
    const header = createHeader({ status: 'inactive', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content con spinner y mensaje
    const mainContent = document.createElement('div');
    mainContent.className = 'container-centered';
    mainContent.style.padding = '48px 16px';

    // Título
    const title = document.createElement('div');
    title.className = 'title-main text-centered';
    title.textContent = this.data.language === 'es' ? 'Reintentando conexión...' : 'Retrying connection...';
    mainContent.appendChild(title);

    // Spinner (reutilizando el componente de status)
    const statusConversacion = createStatusConversacion({
      state: 'analyzing',
      language: this.data.language
    });
    mainContent.appendChild(statusConversacion);

    this.elements.main.appendChild(mainContent);

    // Intentar reconectar después de un breve delay para que se vea el spinner
    setTimeout(() => {
      this.attemptReconnection();
    }, 1500);
  }

  async attemptReconnection() {
    try {
      // Intentar verificar si estamos en una videollamada válida
      await this.checkVideoCallStatus();

      // Si llegamos aquí sin error, verificar el estado
      if (this.data.isInVideoCall) {
        // Si estamos en videollamada válida, ir a selección de perfil
        this.setState(STATES.PROFILE_SELECTION);
      } else {
        // Si no hay videollamada, ir a idle
        this.setState(STATES.IDLE);
      }
    } catch (error) {
      // Si falla la reconexión, volver a mostrar error
      console.error('Reconnection failed:', error);
      this.data.errorMessage = this.data.language === 'es'
        ? 'No se pudo restablecer la conexión. Por favor, intenta de nuevo.'
        : 'Could not restore connection. Please try again.';
      this.setState(STATES.ERROR);
    }
  }

  renderListening() {
    // Estado 6: Activo y escuchando
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content - Frame principal
    const mainContent = document.createElement('div');
    mainContent.className = 'flex-col';
    mainContent.style.width = '100%';
    mainContent.style.gap = '24px';
    mainContent.style.padding = '24px 24px 12px 24px';
    mainContent.style.boxSizing = 'border-box';

    // Estado "Escuchando..."
    const statusConversacion = createStatusConversacion({
      state: 'listening',
      language: this.data.language
    });
    mainContent.appendChild(statusConversacion);

    // Historial colapsado
    const historial = createHistorial({
      items: this.data.history,
      count: this.data.history.length,
      expanded: false
    });
    mainContent.appendChild(historial);

    // Botón terminar reunión
    const btnContainer = document.createElement('div');
    btnContainer.style.width = '100%';
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    const btn = createButton({
      text: t('profile.endButton', this.data.language),
      type: 'outline',
      onClick: () => this.endSession()
    });
    btn.style.width = '100%';
    btn.style.maxWidth = '395px';
    btnContainer.appendChild(btn);
    mainContent.appendChild(btnContainer);

    this.elements.main.appendChild(mainContent);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderAnalyzing() {
    // Estado 7: Activo y analizando
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content - Frame principal
    const mainContent = document.createElement('div');
    mainContent.className = 'flex-col';
    mainContent.style.width = '100%';
    mainContent.style.gap = '24px';
    mainContent.style.padding = '24px 24px 12px 24px';
    mainContent.style.boxSizing = 'border-box';

    // Estado "Analizando conversación"
    const statusConversacion = createStatusConversacion({
      state: 'analyzing',
      language: this.data.language
    });
    mainContent.appendChild(statusConversacion);

    // Historial colapsado
    const historial = createHistorial({
      items: this.data.history,
      count: this.data.history.length,
      expanded: false
    });
    mainContent.appendChild(historial);

    // Botón terminar reunión
    const btnContainer = document.createElement('div');
    btnContainer.style.width = '100%';
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    const btn = createButton({
      text: t('profile.endButton', this.data.language),
      type: 'outline',
      onClick: () => this.endSession()
    });
    btn.style.width = '100%';
    btn.style.maxWidth = '395px';
    btnContainer.appendChild(btn);
    mainContent.appendChild(btnContainer);

    this.elements.main.appendChild(mainContent);

    // Footer
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  renderPaywallFree() {
    // Estado 8: Paywall free
    const header = createHeader({ language: this.data.language, showStatus: false });
    this.elements.header.appendChild(header);

    const paywall = createPaywall({ type: 'free' });
    this.elements.main.appendChild(paywall);
  }

  renderPaywallPro() {
    // Estado 9: Paywall pro
    const header = createHeader({ language: this.data.language, showStatus: false });
    this.elements.header.appendChild(header);

    const paywall = createPaywall({ type: 'pro' });
    this.elements.main.appendChild(paywall);
  }

  renderSuggestions() {
    // Estados 10-12: Sugerencias (3/2/1)
    const header = createHeader({ status: 'active', language: this.data.language });
    this.elements.header.appendChild(header);

    // Main content scrollable - Frame 40 (flex-grow: 1)
    const mainScrollable = document.createElement('div');
    mainScrollable.style.flex = '1';
    mainScrollable.style.overflowY = 'auto';
    mainScrollable.style.overflowX = 'hidden';
    mainScrollable.style.display = 'flex';
    mainScrollable.style.flexDirection = 'column';
    mainScrollable.style.padding = '12px';
    mainScrollable.style.gap = '12px';

    // Limitar sugerencias a máximo 3
    const visibleSuggestions = this.data.suggestions.slice(0, 3);

    // Renderizar cards solo si tienen contenido
    visibleSuggestions.forEach(suggestion => {
      // Validar que tenga al menos suggestion text
      const suggestionText = suggestion.suggestion || suggestion.text || 'Sin sugerencia';
      const contextText = suggestion.what_is_being_asked || suggestion.context || '';

      console.log('[Panel] Renderizando card:', {
        urgency: suggestion.urgency,
        suggestion: suggestionText,
        context: contextText,
        signalType: suggestion.signal_type
      });

      const card = createCardType({
        urgency: suggestion.urgency || 1,
        suggestion: suggestionText,
        context: contextText,
        contextBadge: this.mapContextBadge(suggestion.signal_type)
      });
      mainScrollable.appendChild(card);
    });

    // Status conversacion centrado
    const statusWrapper = document.createElement('div');
    statusWrapper.style.display = 'flex';
    statusWrapper.style.justifyContent = 'center';
    statusWrapper.style.width = '100%';
    statusWrapper.style.marginTop = 'auto'; // Empujar hacia abajo si hay espacio
    const statusConversacion = createStatusConversacion({
      state: 'analyzing',
      language: this.data.language
    });
    statusWrapper.appendChild(statusConversacion);
    mainScrollable.appendChild(statusWrapper);

    this.elements.main.appendChild(mainScrollable);

    // Footer fixed - Frame 44 (HUG content)
    const footerFixed = document.createElement('div');
    footerFixed.style.display = 'flex';
    footerFixed.style.flexDirection = 'column';
    footerFixed.style.gap = '12px';
    footerFixed.style.padding = '12px';
    footerFixed.style.borderTop = '1px solid var(--dark-100)';
    footerFixed.style.background = 'var(--white)';

    // Historial colapsado
    const historial = createHistorial({
      items: this.data.history,
      count: this.data.history.length,
      expanded: false
    });
    footerFixed.appendChild(historial);

    // Botón terminar reunión
    const btn = createButton({
      text: t('profile.endButton', this.data.language),
      type: 'outline',
      onClick: () => this.endSession()
    });
    btn.style.width = '100%';
    footerFixed.appendChild(btn);

    this.elements.main.appendChild(footerFixed);

    // Footer text (sesiones)
    const footer = createFooter({
      sessionsRemaining: this.data.sessionsRemaining,
      totalSessions: this.data.totalSessions,
      isAnonymous: this.data.isAnonymous
    });
    this.elements.footer.appendChild(footer);
  }

  // ═══════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  mapContextBadge(signalType) {
    // Mapear signal_type a badge de contexto
    const mapping = {
      'buying_signal': 'cierre',
      'closing_opportunity': 'cierre',
      'objection': 'estructura',
      'complex_question': 'estructura',
      'discovery': 'escucha',
      'value_question': 'escucha'
    };
    return mapping[signalType] || 'escucha';
  }

  async startSession() {
    try {
      // 1. Verificar que el servidor está disponible
      console.log('[Panel] Verificando salud del servidor...');
      try {
        const healthResponse = await fetch(CONFIG.ENDPOINTS.HEALTH, {
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3 segundos timeout
        });

        if (!healthResponse.ok) {
          throw new Error(`Servidor respondió con status ${healthResponse.status}`);
        }

        console.log('[Panel] ✅ Servidor disponible');
      } catch (healthError) {
        console.error('[Panel] ❌ Servidor no disponible:', healthError);
        this.data.errorMessage = `No se puede conectar al servidor (${CONFIG.BASE_URL})`;
        this.setState(STATES.ERROR);
        return;
      }

      // 2. Obtener tab ID de la videollamada activa
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tabs[0]?.id;

      if (!tabId) {
        console.error('No hay tab activa');
        this.data.errorMessage = 'No se pudo detectar la pestaña activa';
        this.setState(STATES.ERROR);
        return;
      }

      // 3. Enviar mensaje al background para iniciar sesión
      const response = await chrome.runtime.sendMessage({
        action: 'START_SESSION',
        tabId: tabId,
        profile: this.data.profile
      });

      if (!response.ok) {
        throw new Error(response.error || 'Error al iniciar sesión');
      }

      console.log('[Panel] ✅ Sesión iniciada');
      this.setState(STATES.LISTENING);
    } catch (error) {
      console.error('[Panel] Error starting session:', error);
      this.data.errorMessage = error.message || 'Error desconocido al iniciar sesión';
      this.setState(STATES.ERROR);
    }
  }

  async endSession() {
    try {
      // Enviar mensaje al background para terminar sesión
      await chrome.runtime.sendMessage({ action: 'STOP_SESSION' });

      // Limpiar datos de sesión
      this.data.suggestions = [];
      this.data.history = [];
      this.saveToStorage();

      // Redirigir al dashboard (usa CONFIG para auto-detectar dev/prod)
      chrome.tabs.create({ url: CONFIG.ENDPOINTS.DASHBOARD });

      // Volver a IDLE en el panel
      this.setState(STATES.IDLE);
    } catch (error) {
      console.error('Error ending session:', error);
      this.setState(STATES.ERROR);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// INICIALIZAR
// ═══════════════════════════════════════════════════════════

// Crear instancia del state machine cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.panelStateMachine = new PanelStateMachine();
  });
} else {
  window.panelStateMachine = new PanelStateMachine();
}
