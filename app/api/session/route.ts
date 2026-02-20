import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anonymous_id, profile_type, session_number } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Insertar sesión en usage_sessions
    const { error } = await supabase
      .from('usage_sessions')
      .insert({
        user_id: user?.id || null,
        anonymous_id: !user ? anonymous_id : null,
        profile_type,
        session_number
      });

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtener plan del usuario
    let plan = 'anonymous';
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, total_sessions')
        .eq('id', user.id)
        .single();

      plan = profile?.plan || 'free';
    }

    return NextResponse.json({ ok: true, session_number, plan });
  } catch (err) {
    console.error('[/api/session] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
