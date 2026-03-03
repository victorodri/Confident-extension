import { createClient } from '@/lib/supabase-server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Asegura que un usuario autenticado tenga un perfil en la tabla profiles.
 * Si no existe, lo crea automáticamente.
 *
 * Esta función debe llamarse al inicio de cualquier API route que requiera
 * datos del perfil del usuario.
 */
export async function ensureUserProfile(userId: string, userEmail: string | undefined) {
  const supabase = await createClient();

  try {
    // Intentar obtener el perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, plan, total_sessions')
      .eq('id', userId)
      .single();

    // Si el perfil existe, devolverlo
    if (existingProfile && !fetchError) {
      console.log('[ensureUserProfile] Perfil encontrado:', existingProfile);
      return existingProfile;
    }

    // Si el perfil NO existe, crearlo
    console.log('[ensureUserProfile] Perfil NO encontrado. Creando perfil para:', userId, userEmail);

    // Contar sesiones existentes del usuario (por si ya tiene sesiones pero no perfil)
    const { count: sessionCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const totalSessions = sessionCount || 0;

    // Crear el perfil usando el service role client para bypasear RLS
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail || '',
        plan: 'free',
        total_sessions: totalSessions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('[ensureUserProfile] Error creando perfil:', insertError);
      // Si falla el INSERT, intentar hacer un UPSERT
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: userEmail || '',
          plan: 'free',
          total_sessions: totalSessions,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (upsertError) {
        console.error('[ensureUserProfile] Error en upsert:', upsertError);
        throw upsertError;
      }

      console.log('[ensureUserProfile] Perfil creado via upsert:', upsertedProfile);
      return upsertedProfile;
    }

    console.log('[ensureUserProfile] Perfil creado exitosamente:', newProfile);
    return newProfile;

  } catch (error) {
    console.error('[ensureUserProfile] Error inesperado:', error);
    throw error;
  }
}

/**
 * Wrapper para usar con el cliente de Supabase del servidor
 * que incluye el service_role_key para bypasear RLS
 */
export async function ensureUserProfileWithServiceRole(userId: string, userEmail: string | undefined) {
  // Crear cliente con service role para bypasear RLS
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');

  const supabaseServiceRole = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Intentar obtener el perfil existente
    const { data: existingProfile, error: fetchError } = await supabaseServiceRole
      .from('profiles')
      .select('id, plan, total_sessions')
      .eq('id', userId)
      .single();

    // Si el perfil existe, devolverlo
    if (existingProfile && !fetchError) {
      console.log('[ensureUserProfile] Perfil encontrado:', existingProfile);
      return existingProfile;
    }

    // Si el perfil NO existe, crearlo
    console.log('[ensureUserProfile] Perfil NO encontrado. Creando perfil para:', userId, userEmail);

    // Contar sesiones existentes del usuario
    const { count: sessionCount } = await supabaseServiceRole
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const totalSessions = sessionCount || 0;

    // Crear el perfil con service role (bypasea RLS)
    const { data: newProfile, error: insertError } = await supabaseServiceRole
      .from('profiles')
      .upsert({
        id: userId,
        email: userEmail || '',
        plan: 'free',
        total_sessions: totalSessions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (insertError) {
      console.error('[ensureUserProfile] Error creando perfil con service role:', insertError);
      throw insertError;
    }

    console.log('[ensureUserProfile] Perfil creado exitosamente con service role:', newProfile);
    return newProfile;

  } catch (error) {
    console.error('[ensureUserProfile] Error inesperado:', error);
    throw error;
  }
}
