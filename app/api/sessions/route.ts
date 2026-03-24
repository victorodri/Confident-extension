import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createSessionSchema, validateSchema, createValidationErrorResponse } from '@/lib/validation';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * POST /api/sessions
 * Crea una nueva sesión
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // SECURITY: Validar input con Zod
    const validation = validateSchema(createSessionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        createValidationErrorResponse(validation.errors!),
        { status: 400 }
      );
    }

    const { anonymous_id, profile, consent_confirmed, participants_emails } = validation.data;

    // SECURITY: Rate limiting (VULN-005)
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.SESSIONS, anonymous_id);
    if (rateLimitResult) {
      return rateLimitResult; // 429 Too Many Requests
    }

    const supabase = await createClient();

    // Obtener usuario si está autenticado (opcional)
    const { data: { user } } = await supabase.auth.getUser();

    // Crear sesión en la tabla sessions
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user?.id || null,
        anonymous_id: !user ? anonymous_id : null,
        profile,
        consent_confirmed: consent_confirmed || false,
        participants_emails: participants_emails || [],
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/sessions] Error al crear sesión:', error);
      return NextResponse.json(
        { error: 'Error al crear sesión', details: error.message },
        { status: 500 }
      );
    }

    console.log('[POST /api/sessions] ✅ Sesión creada:', session.id);

    return NextResponse.json({
      success: true,
      session_id: session.id,
      profile: session.profile
    });

  } catch (err: any) {
    console.error('[POST /api/sessions] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions
 * Obtiene todas las sesiones del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Rate limiting (VULN-005) - sin anonymous_id para autenticados
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.SESSIONS);
    if (rateLimitResult) {
      return rateLimitResult; // 429 Too Many Requests
    }

    const supabase = await createClient();

    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Obtener sesiones del usuario con conteo de transcripciones y sugerencias
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id,
        profile,
        status,
        started_at,
        ended_at,
        duration_seconds,
        suggestions_count,
        transcriptions (count),
        suggestions (count)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('[GET /api/sessions] Supabase error:', error);
      return NextResponse.json(
        { error: 'Error al obtener sesiones' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('[GET /api/sessions] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
