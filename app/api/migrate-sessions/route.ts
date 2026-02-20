import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * POST /api/migrate-sessions
 *
 * Migra las sesiones anónimas de un device fingerprint a un usuario autenticado.
 * Se llama después de que un usuario se registra/loguea por primera vez.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anonymous_id } = body;

    if (!anonymous_id) {
      return NextResponse.json({ error: 'Missing anonymous_id' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log(`[migrate-sessions] Migrando sesiones de ${anonymous_id.substring(0, 20)}... a usuario ${user.id}`);

    // 1. Verificar si ya existen sesiones anónimas con este fingerprint
    const { data: anonymousSessions, error: fetchError } = await supabase
      .from('usage_sessions')
      .select('*')
      .eq('anonymous_id', anonymous_id)
      .is('user_id', null);

    if (fetchError) {
      console.error('[migrate-sessions] Error fetching anonymous sessions:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const sessionsToMigrate = anonymousSessions?.length || 0;

    if (sessionsToMigrate === 0) {
      console.log('[migrate-sessions] No hay sesiones anónimas que migrar');
      return NextResponse.json({ ok: true, migrated: 0 });
    }

    // 2. Migrar sesiones: actualizar user_id y borrar anonymous_id
    const { error: updateError } = await supabase
      .from('usage_sessions')
      .update({
        user_id: user.id,
        anonymous_id: null
      })
      .eq('anonymous_id', anonymous_id)
      .is('user_id', null);

    if (updateError) {
      console.error('[migrate-sessions] Error updating sessions:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Actualizar el contador total_sessions del usuario
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        total_sessions: sessionsToMigrate
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('[migrate-sessions] Error updating profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    console.log(`[migrate-sessions] ✅ Migradas ${sessionsToMigrate} sesiones anónimas al usuario ${user.id}`);

    return NextResponse.json({
      ok: true,
      migrated: sessionsToMigrate,
      message: `${sessionsToMigrate} sesiones migradas exitosamente`
    });

  } catch (err) {
    console.error('[/api/migrate-sessions] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
