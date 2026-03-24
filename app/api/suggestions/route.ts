// app/api/suggestions/route.ts
// Endpoint para guardar sugerencias en tiempo real durante la sesión

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuggestionSchema, validateSchema, createValidationErrorResponse } from '@/lib/validation';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Cliente con ANON key (respeta RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // SECURITY: Validar input con Zod
    const validation = validateSchema(createSuggestionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        createValidationErrorResponse(validation.errors!),
        { status: 400 }
      );
    }

    const {
      session_id,
      transcription_id,
      signal_type,
      suggestion_text,
      context_text,
      keywords,
      urgency_level,
      anonymous_id
    } = validation.data;

    // SECURITY: Rate limiting (VULN-005)
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.SUGGESTIONS, anonymous_id);
    if (rateLimitResult) {
      return rateLimitResult; // 429 Too Many Requests
    }

    // SECURITY: Verificar que la sesión existe Y pertenece al anonymous_id proporcionado
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id, suggestions_count, anonymous_id, user_id')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // SECURITY: Validar ownership de la sesión
    if (session.anonymous_id && session.anonymous_id !== anonymous_id) {
      return NextResponse.json(
        { error: 'No autorizado para acceder a esta sesión' },
        { status: 403 }
      );
    }

    // Insertar sugerencia (RLS valida automáticamente el acceso)
    const { data: suggestion, error } = await supabase
      .from('suggestions')
      .insert({
        session_id,
        transcription_id: transcription_id || null,
        question_type: signal_type,
        suggestion_text,
        context_text: context_text || null,
        keywords: keywords || [],
        urgency_level: urgency_level || 1
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/suggestions] Error al insertar:', error);
      return NextResponse.json(
        { error: 'Error al guardar sugerencia', details: error.message },
        { status: 500 }
      );
    }

    // Actualizar contador de sugerencias en la sesión
    const newCount = (session.suggestions_count || 0) + 1;
    await supabase
      .from('sessions')
      .update({ suggestions_count: newCount })
      .eq('id', session_id);

    console.log(`[POST /api/suggestions] ✅ Sugerencia guardada (total: ${newCount})`);

    return NextResponse.json({
      success: true,
      suggestion_id: suggestion.id,
      suggestions_count: newCount
    });

  } catch (err: any) {
    console.error('[POST /api/suggestions] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}
