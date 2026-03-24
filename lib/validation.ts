// lib/validation.ts
// Schemas de validación con Zod para todos los endpoints de API
// Previene inyecciones, DoS, y data corruption

import { z } from 'zod';

// ==========================================
// SCHEMAS PARA SESIONES
// ==========================================

export const createSessionSchema = z.object({
  anonymous_id: z.string().uuid().optional(),
  profile: z.enum(['candidato', 'vendedor', 'defensor', 'profesor']),
  consent_confirmed: z.boolean().optional(),
  participants_emails: z.array(z.string().email()).max(10).optional()
});

export const closeSessionSchema = z.object({
  session_id: z.string().uuid(),
  anonymous_id: z.string().uuid().optional(),
  participants_emails: z.array(z.string().email()).max(10).optional()
});

// ==========================================
// SCHEMAS PARA TRANSCRIPCIONES
// ==========================================

export const createTranscriptionSchema = z.object({
  session_id: z.string().uuid(),
  speaker: z.enum(['user', 'other', 'unknown']).optional(),
  text: z.string().min(1).max(5000), // Max 5000 caracteres por transcripción
  timestamp_ms: z.number().int().nonnegative().optional(),
  language: z.string().length(2).optional(), // ISO 639-1 (ej: 'es', 'en')
  anonymous_id: z.string().uuid().optional()
});

// ==========================================
// SCHEMAS PARA SUGERENCIAS
// ==========================================

export const createSuggestionSchema = z.object({
  session_id: z.string().uuid(),
  transcription_id: z.string().uuid().optional(),
  signal_type: z.string().max(100).optional(),
  suggestion_text: z.string().min(1).max(2000), // Max 2000 caracteres
  context_text: z.string().max(1000).optional(),
  keywords: z.array(z.string().max(100)).max(20).optional(), // Max 20 keywords
  urgency_level: z.number().int().min(1).max(3).optional(),
  anonymous_id: z.string().uuid().optional()
});

// ==========================================
// SCHEMAS PARA ANÁLISIS DE CLAUDE
// ==========================================

export const analyzeTextSchema = z.object({
  text: z.string().min(1).max(10000), // Max 10K caracteres para análisis
  profile: z.enum(['candidato', 'vendedor', 'defensor', 'profesor']),
  context: z.string().max(5000).optional(),
  anonymous_id: z.string().uuid().optional(),
  user_language: z.enum(['es', 'en']).optional()
});

// ==========================================
// SCHEMAS PARA USAGE/CONTADOR
// ==========================================

export const getUsageSchema = z.object({
  anonymous_id: z.string().uuid().optional()
});

// ==========================================
// HELPER PARA VALIDAR Y RETORNAR ERRORES
// ==========================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodIssue[];
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.issues };
  }
}

// ==========================================
// HELPER PARA RESPUESTAS DE ERROR SEGURAS
// ==========================================

export function createValidationErrorResponse(errors: z.ZodIssue[]) {
  // No exponer detalles internos en producción
  const safeErrors = errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));

  return {
    error: 'Validation failed',
    details: safeErrors
  };
}
