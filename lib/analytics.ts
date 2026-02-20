// lib/analytics.ts
// Posthog analytics wrapper con eventos tipados

import posthog from 'posthog-js';

// Tipos de eventos
export type AnalyticsEvent =
  // Landing page
  | 'page_view'
  | 'cta_clicked'
  | 'plan_selected'
  | 'install_extension_clicked'

  // Extensión
  | 'extension_installed'
  | 'session_started'
  | 'session_stopped'
  | 'suggestion_shown'
  | 'suggestion_rated'

  // Funnel freemium
  | 'paywall_soft_shown'
  | 'paywall_soft_converted'
  | 'paywall_hard_shown'
  | 'payment_cta_clicked'; // ← MÉTRICA PRINCIPAL MVP

// Props de eventos
export interface EventProperties {
  // Session events
  profile?: 'candidato' | 'vendedor' | 'defensor';
  session_number?: number;
  is_anonymous?: boolean;

  // Suggestion events
  signal_type?: string;
  urgency_level?: 1 | 2 | 3;
  helpful?: boolean;

  // CTA events
  location?: 'hero' | 'pricing' | 'navbar' | 'footer';
  plan_selected?: 'free' | 'pro';

  // Metadata
  [key: string]: any;
}

/**
 * Inicializar Posthog
 * Solo se llama una vez en el cliente
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    console.warn('Posthog not initialized: missing API key or host');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,

    // Privacy-first settings
    persistence: 'localStorage+cookie',
    autocapture: false, // Solo eventos manuales
    capture_pageview: false, // Capturamos manualmente
    capture_pageleave: true,

    // Performance
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug();
      }
    }
  });
}

/**
 * Capturar evento
 */
export function captureEvent(
  eventName: AnalyticsEvent,
  properties?: EventProperties
) {
  if (typeof window === 'undefined') return;

  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
}

/**
 * Identificar usuario
 * Llamar después de auth exitoso
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  posthog.identify(userId, traits);
}

/**
 * Reset (logout)
 */
export function resetAnalytics() {
  if (typeof window === 'undefined') return;

  posthog.reset();
}

/**
 * Page view
 * Llamar en cada navegación
 */
export function capturePageView(pageName?: string) {
  if (typeof window === 'undefined') return;

  posthog.capture('$pageview', {
    page_name: pageName || document.title,
    url: window.location.href
  });
}

// Eventos específicos (helpers)

export const analytics = {
  // Landing
  ctaClicked: (location: 'hero' | 'pricing' | 'navbar' | 'footer', plan?: 'free' | 'pro') => {
    captureEvent('cta_clicked', { location, plan_selected: plan });
  },

  planSelected: (plan: 'free' | 'pro') => {
    captureEvent('plan_selected', { plan_selected: plan });
  },

  // Extension
  sessionStarted: (profile: string, sessionNumber: number, isAnonymous: boolean) => {
    captureEvent('session_started', {
      profile: profile as any,
      session_number: sessionNumber,
      is_anonymous: isAnonymous
    });
  },

  suggestionShown: (profile: string, signalType: string, urgency: number) => {
    captureEvent('suggestion_shown', {
      profile: profile as any,
      signal_type: signalType,
      urgency_level: urgency as any
    });
  },

  suggestionRated: (helpful: boolean, signalType: string) => {
    captureEvent('suggestion_rated', {
      helpful,
      signal_type: signalType
    });
  },

  // Funnel
  paywallSoftShown: (sessionCount: number) => {
    captureEvent('paywall_soft_shown', { session_count: sessionCount });
  },

  paywallSoftConverted: () => {
    captureEvent('paywall_soft_converted');
  },

  paywallHardShown: (sessionCount: number) => {
    captureEvent('paywall_hard_shown', { session_count: sessionCount });
  },

  // MÉTRICA PRINCIPAL MVP
  paymentCtaClicked: (planSelected: 'pro') => {
    captureEvent('payment_cta_clicked', { plan_selected: planSelected });
  }
};
