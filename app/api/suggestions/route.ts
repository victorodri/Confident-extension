// app/api/suggestions/route.ts
// Endpoint para guardar sugerencias en tiempo real durante la sesión

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
    const {
      session_id,
      transcription_id,
      signal_type,
      suggestion_text,
      context_text,
      keywords,
      urgency_level
    } = body;

    if (!session_id || !suggestion_text) {
      return NextResponse.json(
        { error: 'Se requieren los campos "session_id" y "suggestion_text"' },
        { status: 400 }
      );
    }

    // Verificar que la sesión existe
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id, suggestions_count')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      console.error('[POST /api/suggestions] Sesión no encontrada:', sessionError);
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // Insertar sugerencia
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
