// app/api/transcriptions/route.ts
// Endpoint para guardar transcripciones en tiempo real durante la sesión

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTranscriptionSchema, validateSchema, createValidationErrorResponse } from '@/lib/validation';
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
    const validation = validateSchema(createTranscriptionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        createValidationErrorResponse(validation.errors!),
        { status: 400 }
      );
    }

    const { session_id, speaker, text, timestamp_ms, language, anonymous_id } = validation.data;

    // SECURITY: Rate limiting (VULN-005)
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.TRANSCRIPTIONS, anonymous_id);
    if (rateLimitResult) {
      return rateLimitResult; // 429 Too Many Requests
    }

    // SECURITY: Verificar que la sesión existe Y pertenece al anonymous_id proporcionado
    // Esto previene que un atacante envíe transcripciones a sesiones de otros usuarios
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id, anonymous_id, user_id')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // SECURITY: Validar ownership de la sesión
    // Para sesiones anónimas, el anonymous_id debe coincidir
    // Para sesiones autenticadas, se valida por JWT (futuro)
    if (session.anonymous_id && session.anonymous_id !== anonymous_id) {
      return NextResponse.json(
        { error: 'No autorizado para acceder a esta sesión' },
        { status: 403 }
      );
    }

    // Insertar transcripción (RLS valida automáticamente el acceso)
    const { data: transcription, error } = await supabase
      .from('transcriptions')
      .insert({
        session_id,
        speaker: speaker || 'unknown',
        text,
        timestamp_ms: timestamp_ms || 0,
        language: language || 'es'
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/transcriptions] Error al insertar:', error);
      return NextResponse.json(
        { error: 'Error al guardar transcripción', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transcription_id: transcription.id
    });

  } catch (err: any) {
    console.error('[POST /api/transcriptions] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}
