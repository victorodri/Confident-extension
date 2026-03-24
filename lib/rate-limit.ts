/**
 * Rate Limiting Implementation
 *
 * VULN-005 Fix: Protege APIs públicas de:
 * - DoS attacks
 * - Cost spikes (Claude API)
 * - Resource exhaustion
 *
 * Implementación: Sliding window en memoria
 * Producción: Migrar a Upstash Redis para multi-instancia
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo de requests por ventana
}

interface RequestLog {
  count: number;
  resetTime: number;
}

// Store en memoria (limitación: no funciona en multi-instancia)
// TODO: Migrar a Upstash Redis cuando escale a múltiples instancias
const store = new Map<string, RequestLog>();

// Limpieza automática cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Genera identificador único para rate limiting
 * Usa combinación de IP + anonymous_id para mejor tracking
 */
function getIdentifier(request: NextRequest, anonymousId?: string): string {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  return anonymousId ? `${ip}:${anonymousId}` : ip;
}

/**
 * Rate limiter middleware
 *
 * @param config - Configuración de límites
 * @returns NextResponse con status 429 si excede límite, null si OK
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  anonymousId?: string
): Promise<NextResponse | null> {
  const identifier = getIdentifier(request, anonymousId);
  const now = Date.now();

  let requestLog = store.get(identifier);

  // Primera request o ventana expirada
  if (!requestLog || now > requestLog.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + config.interval
    });

    return null; // OK
  }

  // Incrementar contador
  requestLog.count++;

  // Verificar límite
  if (requestLog.count > config.maxRequests) {
    const resetInSeconds = Math.ceil((requestLog.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${resetInSeconds} seconds.`,
        retry_after: resetInSeconds
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(requestLog.resetTime / 1000).toString(),
          'Retry-After': resetInSeconds.toString()
        }
      }
    );
  }

  // Request permitida
  store.set(identifier, requestLog);
  return null; // OK
}

/**
 * Añade headers de rate limit a response exitosa
 */
export function addRateLimitHeaders(
  response: NextResponse,
  config: RateLimitConfig,
  identifier: string
): NextResponse {
  const requestLog = store.get(identifier);

  if (requestLog) {
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, config.maxRequests - requestLog.count).toString()
    );
    response.headers.set(
      'X-RateLimit-Reset',
      Math.ceil(requestLog.resetTime / 1000).toString()
    );
  }

  return response;
}

// Configuraciones por endpoint
export const RATE_LIMITS = {
  // Alta frecuencia - transcripciones en tiempo real
  TRANSCRIPTIONS: {
    interval: 60 * 1000, // 1 minuto
    maxRequests: 60 // 1 request/segundo promedio
  },

  // Alta frecuencia - sugerencias en tiempo real
  SUGGESTIONS: {
    interval: 60 * 1000,
    maxRequests: 60
  },

  // Media frecuencia - análisis Claude (más costoso)
  ANALYZE: {
    interval: 60 * 1000,
    maxRequests: 30 // Limitar por costo Claude API
  },

  // Baja frecuencia - crear/cerrar sesiones
  SESSIONS: {
    interval: 60 * 1000,
    maxRequests: 10
  },

  // Media frecuencia - consultas de uso
  USAGE: {
    interval: 60 * 1000,
    maxRequests: 20
  },

  // Muy baja frecuencia - emails
  SEND_EMAIL: {
    interval: 60 * 1000,
    maxRequests: 5
  }
} as const;
