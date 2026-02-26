import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener sesión
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id) // Solo sus propias sesiones
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Obtener transcripciones (solo si NO hay summary, para backward compatibility)
    let transcriptions = [];
    if (!session.summary) {
      const { data: transcData } = await supabase
        .from('transcriptions')
        .select('id, speaker, text, created_at')
        .eq('session_id', sessionId)
        .order('timestamp_ms', { ascending: true });
      
      transcriptions = transcData || [];
    }

    // Obtener sugerencias (solo para stats, no mostrar en UI)
    const { data: suggestions } = await supabase
      .from('suggestions')
      .select('id, suggestion_text, context_text, keywords, urgency_level, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      session,
      transcriptions,
      suggestions: suggestions || []
    });
  } catch (error) {
    console.error('[/api/sessions/[id]] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
