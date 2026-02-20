import { createClient } from '@/lib/supabase-server';
import { LIMITS } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymous_id = searchParams.get('anonymous_id');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Usuario autenticado

      // 🔄 MIGRACIÓN AUTOMÁTICA: Si el usuario tiene sesiones anónimas con este fingerprint, migrarlas
      if (anonymous_id) {
        const { data: anonymousSessions } = await supabase
          .from('usage_sessions')
          .select('id')
          .eq('anonymous_id', anonymous_id)
          .is('user_id', null);

        if (anonymousSessions && anonymousSessions.length > 0) {
          console.log(`[/api/usage] Migrando ${anonymousSessions.length} sesiones anónimas del fingerprint ${anonymous_id.substring(0, 20)}... al usuario ${user.id}`);

          // Migrar sesiones
          await supabase
            .from('usage_sessions')
            .update({ user_id: user.id, anonymous_id: null })
            .eq('anonymous_id', anonymous_id)
            .is('user_id', null);

          // Actualizar contador del perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_sessions')
            .eq('id', user.id)
            .single();

          const currentSessions = profile?.total_sessions || 0;
          await supabase
            .from('profiles')
            .update({ total_sessions: currentSessions + anonymousSessions.length })
            .eq('id', user.id);

          console.log(`[/api/usage] ✅ Migración completada: ${anonymousSessions.length} sesiones`);
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, total_sessions')
        .eq('id', user.id)
        .single();

      const plan = profile?.plan || 'free';
      const total = profile?.total_sessions || 0;
      const limit = plan === 'pro' ? LIMITS.PRO_SESSIONS : LIMITS.FREE_SESSIONS;

      return NextResponse.json({
        user_type: plan,
        session_count: total,
        limit,
        remaining: limit - total
      });
    } else if (anonymous_id) {
      // Usuario anónimo
      const { count } = await supabase
        .from('usage_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('anonymous_id', anonymous_id);

      return NextResponse.json({
        user_type: 'anonymous',
        session_count: count || 0,
        limit: LIMITS.ANONYMOUS_SESSIONS,
        remaining: LIMITS.ANONYMOUS_SESSIONS - (count || 0)
      });
    } else {
      return NextResponse.json({ error: 'Missing anonymous_id' }, { status: 400 });
    }
  } catch (err) {
    console.error('[/api/usage] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
