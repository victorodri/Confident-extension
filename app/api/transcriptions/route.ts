// app/api/transcriptions/route.ts
// Endpoint para guardar transcripciones en tiempo real durante la sesión

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usar service role key para insertar sin autenticación (la extensión puede ser anónima)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    const { session_id, speaker, text, timestamp_ms, language } = body;

    if (!session_id || !text) {
      return NextResponse.json(
        { error: 'Se requieren los campos "session_id" y "text"' },
        { status: 400 }
      );
    }

    // Verificar que la sesión existe
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      console.error('[POST /api/transcriptions] Sesión no encontrada:', sessionError);
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // Insertar transcripción
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
