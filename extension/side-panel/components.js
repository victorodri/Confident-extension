// components.js — Confident Components Library
// Funciones para generar componentes HTML dinámicamente
// Basado en DESIGN_REFERENCE.md

/**
 * HEADER
 */
export function createHeader({ status = 'active', language = 'es', showStatus = true } = {}) {
  const header = document.createElement('div');
  header.className = 'header';

  // Status pill (opcional)
  if (showStatus) {
    const statusPill = document.createElement('div');
    statusPill.className = `status-pill ${status}`;

    const statusDot = document.createElement('div');
    statusDot.className = 'status-dot';
    statusDot.innerHTML = '<div class="status-dot-inner"></div><div class="status-dot-outer"></div>';

    const statusText = document.createElement('span');
    statusText.className = 'status-text';
    statusText.textContent = status === 'active' ? 'Activo' : status === 'error' ? 'Error' : 'Inactivo';

    statusPill.appendChild(statusDot);
    statusPill.appendChild(statusText);
    header.appendChild(statusPill);
  }

  // Logo
  const logo = document.createElement('div');
  logo.className = 'logo';
  const logoImg = document.createElement('img');
  logoImg.src = 'assets/logo-small-panel.png';
  logoImg.alt = 'Confident';
  logoImg.style.height = '25.594px';
  logoImg.style.width = 'auto';
  logo.appendChild(logoImg);
  header.appendChild(logo);

  // Language selector
  const languageSelector = document.createElement('div');
  languageSelector.className = 'language-selector';

  const btnES = document.createElement('button');
  btnES.className = `language-btn ${language === 'es' ? 'active' : ''}`;
  btnES.textContent = 'ES';
  btnES.onclick = () => switchLanguage('es');

  const btnEN = document.createElement('button');
  btnEN.className = `language-btn ${language === 'en' ? 'active' : ''}`;
  btnEN.textContent = 'EN';
  btnEN.onclick = () => switchLanguage('en');

  languageSelector.appendChild(btnES);
  languageSelector.appendChild(btnEN);
  header.appendChild(languageSelector);

  return header;
}

function switchLanguage(lang) {
  // Actualizar visualización de botones
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
  });

  // Persistir en chrome.storage.local
  chrome.storage.local.set({ language: lang }, () => {
    console.log('[Language] Saved language:', lang);
  });

  // Emitir evento para que el panel lo maneje
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

/**
 * BUTTON
 */
export function createButton({ text, type = 'filled', onClick, disabled = false } = {}) {
  const button = document.createElement('button');
  button.className = `btn btn-${type}`;
  button.textContent = text;
  button.disabled = disabled;

  if (onClick) {
    button.onclick = onClick;
  }

  return button;
}

/**
 * CARD SELECT (Selección de perfil)
 */
export function createCardSelect({
  title,
  description,
  selected = false,
  isCheckbox = false,
  onChange
} = {}) {
  const card = document.createElement('div');
  const cardClass = isCheckbox ? 'card-select-checkbox' : (selected ? 'card-select-selected' : 'card-select-default');
  card.className = `card-select ${cardClass}`;

  // Selector
  const selector = document.createElement('div');
  selector.className = 'selector';

  const selectorType = isCheckbox ? 'selector-checkbox' : 'selector-radio';
  const selectorEl = document.createElement('div');
  // Solo marcar si selected=true (ya no auto-marcar todos los checkboxes)
  selectorEl.className = `${selectorType} ${selected ? (isCheckbox ? 'checked' : 'selected') : ''}`;

  selector.appendChild(selectorEl);
  card.appendChild(selector);

  // Content
  const content = document.createElement('div');
  content.className = 'card-select-content';

  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'card-select-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);
  }

  if (description && !isCheckbox) {
    const descEl = document.createElement('div');
    descEl.className = 'card-select-desc';
    descEl.textContent = description;
    content.appendChild(descEl);
  }

  card.appendChild(content);

  // Click handler
  if (onChange) {
    card.style.cursor = 'pointer';
    card.onclick = () => {
      onChange(!selected);
    };
  }

  return card;
}

/**
 * CARD TYPE (Sugerencias)
 */
export function createCardType({
  urgency = 1, // 1=low, 2=important, 3=urgent
  urgencyLabel,
  suggestion,
  context,
  contextBadge, // "cierre" | "estructura" | "escucha"
  onFeedback
} = {}) {
  const urgencyClass = urgency === 3 ? 'urgent' : urgency === 2 ? 'important' : 'low';
  const urgencyText = urgency === 3 ? 'URGENTE' : urgency === 2 ? 'IMPORTANTE' : 'BAJA IMPORTANCIA';

  const card = document.createElement('div');
  card.className = `card-type card-type-${urgencyClass}`;

  // Border
  const border = document.createElement('div');
  border.className = 'card-type-border';
  card.appendChild(border);

  // Content
  const content = document.createElement('div');
  content.className = 'card-type-content';

  // Header
  const header = document.createElement('div');
  header.className = 'card-type-header';

  const badge = document.createElement('div');
  badge.className = 'urgency-badge';
  badge.textContent = urgencyLabel || urgencyText;
  header.appendChild(badge);

  const suggestionEl = document.createElement('div');
  suggestionEl.className = 'card-type-suggestion';
  suggestionEl.textContent = suggestion;
  header.appendChild(suggestionEl);

  content.appendChild(header);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'card-type-divider';
  content.appendChild(divider);

  // Context
  if (context) {
    const contextEl = document.createElement('div');
    contextEl.className = 'card-type-context';
    contextEl.textContent = context;
    content.appendChild(contextEl);
  }

  // Context badge
  if (contextBadge) {
    const badgeEl = document.createElement('div');
    badgeEl.className = `badge-contexto badge-${contextBadge}`;
    badgeEl.textContent = contextBadge === 'cierre' ? 'MOMENTO DE CIERRE' :
                          contextBadge === 'estructura' ? 'ESTRUCTURA TU RESPUESTA' :
                          'ESCUCHA ACTIVA';
    content.appendChild(badgeEl);
  }

  card.appendChild(content);

  return card;
}

/**
 * STATUS CONVERSACIÓN
 */
export function createStatusConversacion({ state = 'listening', language = 'es' } = {}) {
  const container = document.createElement('div');
  container.className = 'status-conversacion';

  // Spinner
  const spinner = document.createElement('div');
  spinner.className = 'status-spinner';
  spinner.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(spinner);

  // Text
  const text = document.createElement('div');
  text.className = `status-text-main ${state}`;

  // Textos según idioma
  if (state === 'listening') {
    text.textContent = language === 'es' ? 'Escuchando...' : 'Listening...';
  } else {
    text.textContent = language === 'es' ? 'Analizando conversación' : 'Analyzing conversation';
  }

  container.appendChild(text);

  return container;
}

/**
 * HISTORIAL
 */
export function createHistorial({ items = [], count = 0, expanded = false } = {}) {
  const historial = document.createElement('div');
  historial.className = 'historial';

  // Header
  const header = document.createElement('div');
  header.className = 'historial-header';

  const arrow = document.createElement('div');
  arrow.className = `historial-arrow ${expanded ? 'open' : ''}`;
  arrow.textContent = expanded ? '▼' : '▶';
  header.appendChild(arrow);

  const title = document.createElement('div');
  title.className = 'historial-title';
  title.textContent = 'Historial';
  header.appendChild(title);

  const badge = document.createElement('div');
  badge.className = 'historial-badge';
  const badgeText = document.createElement('span');
  badgeText.className = 'historial-badge-text';
  badgeText.textContent = count.toString();
  badge.appendChild(badgeText);
  header.appendChild(badge);

  header.onclick = () => {
    arrow.classList.toggle('open');
    list.classList.toggle('hidden');
  };

  historial.appendChild(header);

  // List
  const list = document.createElement('div');
  list.className = `historial-list ${expanded ? '' : 'hidden'}`;

  items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'historial-item';

    const number = document.createElement('div');
    number.className = `historial-number ${item.urgency === 3 ? 'urgent' : item.urgency === 2 ? 'important' : 'low'}`;
    number.textContent = item.urgency.toString();
    itemEl.appendChild(number);

    const text = document.createElement('div');
    text.className = 'historial-text';
    // Usar suggestion, suggestion_text o text como fallback
    text.textContent = item.suggestion || item.suggestion_text || item.text || 'Sin texto';
    itemEl.appendChild(text);

    list.appendChild(itemEl);
  });

  historial.appendChild(list);

  return historial;
}

/**
 * FOOTER
 */
export function createFooter({ sessionsRemaining, totalSessions, isAnonymous = false } = {}) {
  const footer = document.createElement('div');
  footer.className = 'footer';

  const sessionsText = document.createElement('span');
  sessionsText.className = `footer-text footer-text-sessions ${sessionsRemaining > 1 ? 'normal' : ''}`;
  sessionsText.textContent = sessionsRemaining === 1 ?
    '1 sesión restante' :
    `${sessionsRemaining} sesiones restantes.`;
  footer.appendChild(sessionsText);

  const linkText = document.createElement('span');
  linkText.className = 'footer-text footer-text-link';
  linkText.textContent = isAnonymous ?
    'Regístrate y consigue +10 sesiones' :
    'Ver planes Pro';
  linkText.onclick = () => {
    // Abrir página de pricing o registro
    window.open('https://tryconfident.vercel.app/pricing', '_blank');
  };
  footer.appendChild(linkText);

  return footer;
}

/**
 * PAYWALL (Free y Pro)
 */
export function createPaywall({ type = 'free' } = {}) {
  const container = document.createElement('div');
  container.className = 'container-centered';

  // Icon
  const icon = document.createElement('div');
  icon.style.marginBottom = '24px';
  icon.style.width = '56px';
  icon.style.height = '56px';
  const iconImg = document.createElement('img');
  iconImg.src = type === 'free' ? 'assets/paywall-1.svg' : 'assets/paywall-2.svg';
  iconImg.alt = type === 'free' ? 'Upgrade' : 'Diamond';
  iconImg.style.width = '100%';
  iconImg.style.height = '100%';
  icon.appendChild(iconImg);
  container.appendChild(icon);

  // Title & Description
  const textContainer = document.createElement('div');
  textContainer.className = 'flex-col gap-3 text-centered';

  const title = document.createElement('div');
  title.className = 'title-main';
  title.textContent = type === 'free' ?
    'Has alcanzado el límite del plan gratuito' :
    'Has alcanzado tu límite de pro';
  textContainer.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle-main';
  subtitle.textContent = type === 'free' ?
    'Para seguir usando confident en tus conversaciones, actualiza a un plan superior' :
    'Pasa a Diamond y olvídate de contar sesiones.';
  textContainer.appendChild(subtitle);

  container.appendChild(textContainer);

  // Features
  const features = document.createElement('div');
  features.className = 'flex-col gap-2';
  features.style.width = '281px';

  const featureList = type === 'free' ? [
    'Mayor velocidad de sugerencias',
    'Exportar cada transcripción',
    'Perfiles personalizados con tu contexto',
    'Soporte prioritario'
  ] : [
    'Todo el Pro incluido',
    'Sesiones ilimitadas',
    'Análisis avanzado con la IA',
    'Soporte prioritario',
    'Nuevas funcionalidades Beta'
  ];

  featureList.forEach(feature => {
    const featureEl = document.createElement('div');
    featureEl.style.display = 'flex';
    featureEl.style.gap = '12px';
    featureEl.style.alignItems = 'center';
    featureEl.style.padding = '6px';
    featureEl.innerHTML = `
      <div style="width: 24px; height: 24px; color: ${type === 'free' ? '#16a34a' : '#3b82f6'};">✓</div>
      <div style="font-family: Lato, sans-serif; font-weight: 700; font-size: 16px; color: #062031;">${feature}</div>
    `;
    features.appendChild(featureEl);
  });

  container.appendChild(features);

  // Buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex-col gap-3';
  buttonsContainer.style.width = '317px';

  const btnPrimary = createButton({
    text: type === 'free' ? 'Ver planes' : 'Pasarme a Diamond',
    type: 'filled',
    onClick: () => window.open('https://tryconfident.vercel.app/pricing', '_blank')
  });

  const btnSecondary = createButton({
    text: 'Contactar con soporte',
    type: 'outline',
    onClick: () => window.open('mailto:hola@tryconfident.com', '_blank')
  });

  buttonsContainer.appendChild(btnPrimary);
  buttonsContainer.appendChild(btnSecondary);
  container.appendChild(buttonsContainer);

  return container;
}

/**
 * ERROR STATE
 */
export function createErrorState({ message = null, onRetry = null, language = 'es' } = {}) {
  const container = document.createElement('div');
  container.className = 'container-centered';

  // Icon
  const icon = document.createElement('div');
  icon.style.marginBottom = '24px';
  icon.style.width = '56px';
  icon.style.height = '56px';
  const iconImg = document.createElement('img');
  iconImg.src = 'assets/warning-red.svg';
  iconImg.alt = 'Error';
  iconImg.style.width = '100%';
  iconImg.style.height = '100%';
  icon.appendChild(iconImg);
  container.appendChild(icon);

  // Title & Description
  const textContainer = document.createElement('div');
  textContainer.className = 'flex-col gap-3 text-centered';

  const title = document.createElement('div');
  title.className = 'title-main';
  title.style.fontSize = '20px';
  title.textContent = language === 'es' ? 'Ha habido un error' : 'An error has occurred';
  textContainer.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle-main';
  subtitle.style.fontSize = '14px';
  subtitle.style.color = 'var(--ocean-400)';
  subtitle.textContent = message || (language === 'es'
    ? 'Ha habido un error de sistema, por favor reintenta abrir la aplicación o contacta con soporte'
    : 'A system error has occurred, please try reopening the application or contact support');
  textContainer.appendChild(subtitle);

  container.appendChild(textContainer);

  // Buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex-col gap-3';
  buttonsContainer.style.width = '100%';
  buttonsContainer.style.maxWidth = '349px';

  const btnRetry = createButton({
    text: language === 'es' ? 'Reintentar' : 'Retry',
    type: 'filled',
    onClick: () => {
      if (onRetry) {
        onRetry();
      } else {
        window.location.reload();
      }
    }
  });

  const btnSupport = createButton({
    text: language === 'es' ? 'Contactar con soporte' : 'Contact support',
    type: 'outline',
    onClick: () => window.open('mailto:hola@tryconfident.com', '_blank')
  });

  buttonsContainer.appendChild(btnRetry);
  buttonsContainer.appendChild(btnSupport);
  container.appendChild(buttonsContainer);

  return container;
}
