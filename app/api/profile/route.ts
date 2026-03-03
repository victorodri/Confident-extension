import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { ensureUserProfileWithServiceRole } from '@/lib/ensure-profile';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Obtener usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[/api/profile] Usuario autenticado:', user.id, user.email);

    // GARANTIZAR que el perfil existe (crear si no existe)
    try {
      const profile = await ensureUserProfileWithServiceRole(user.id, user.email);

      console.log('[/api/profile] Perfil obtenido/creado:', profile);

      return NextResponse.json({
        id: profile.id,
        email: profile.email || user.email,
        plan: profile.plan || 'free',
        total_sessions: profile.total_sessions || 0
      });
    } catch (profileError) {
      console.error('[/api/profile] Error asegurando perfil:', profileError);
      return NextResponse.json({ error: 'Error creating/fetching profile' }, { status: 500 });
    }
  } catch (error) {
    console.error('[/api/profile] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
