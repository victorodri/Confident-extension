import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const LIMITS = {
  ANONYMOUS_SESSIONS: 5,
  FREE_SESSIONS: 15,
  PRO_SESSIONS: Infinity
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymous_id = searchParams.get('anonymous_id');

    if (!anonymous_id) {
      return NextResponse.json({ error: 'anonymous_id required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Intentar obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();

    // Si hay usuario autenticado, obtener su perfil
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, total_sessions')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      const plan = profile.plan || 'free';
      const total = profile.total_sessions || 0;
      const limit = plan === 'pro' ? LIMITS.PRO_SESSIONS : LIMITS.FREE_SESSIONS;
      const remaining = plan === 'pro' ? Infinity : Math.max(0, limit - total);

      return NextResponse.json({
        user_type: plan,
        total_sessions: total,
        remaining,
        limit
      });
    }

    // Usuario anónimo: contar sesiones por anonymous_id
    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('anonymous_id', anonymous_id);

    const total = count || 0;
    const remaining = Math.max(0, LIMITS.ANONYMOUS_SESSIONS - total);

    return NextResponse.json({
      user_type: 'anonymous',
      total_sessions: total,
      remaining,
      limit: LIMITS.ANONYMOUS_SESSIONS
    });
  } catch (error) {
    console.error('[/api/usage] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
