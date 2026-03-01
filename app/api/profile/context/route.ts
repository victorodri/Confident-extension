import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/profile/context
 * Guarda el contexto del usuario (onboarding personalizado)
 * Acepta tanto formato nuevo (JWT auth) como formato legacy (anonymous_id)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Intentar obtener usuario autenticado (formato nuevo - desde /profile)
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Usuario autenticado → actualizar su perfil
      // El body puede ser directamente el contexto o tener estructura legacy
      const context = body.context || body;

      const { error } = await supabase
        .from('profiles')
        .update({
          user_context: context,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('[/api/profile/context] Error updating profile:', error);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, user_type: 'authenticated' });
    }

    // Formato legacy: usuario anónimo con anonymous_id
    const { anonymous_id, context } = body;

    if (!anonymous_id || !context) {
      return NextResponse.json(
        { error: 'Missing anonymous_id or context, or not authenticated' },
        { status: 400 }
      );
    }

    // Usuario anónimo → buscar o crear perfil
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('anonymous_id', anonymous_id)
      .single();

    if (existingProfile) {
      // Actualizar perfil anónimo existente
      const { error } = await supabase
        .from('profiles')
        .update({
          user_context: context,
          updated_at: new Date().toISOString()
        })
        .eq('anonymous_id', anonymous_id);

      if (error) {
        console.error('[/api/profile/context] Error updating anonymous profile:', error);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
    } else {
      // Crear nuevo perfil anónimo
      const { error } = await supabase
        .from('profiles')
        .insert({
          anonymous_id,
          user_context: context,
          plan: 'free'
        });

      if (error) {
        console.error('[/api/profile/context] Error creating anonymous profile:', error);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, user_type: 'anonymous' });

  } catch (error) {
    console.error('[/api/profile/context] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profile/context
 * Obtiene el contexto del usuario
 * Soporta tanto formato nuevo (JWT auth) como legacy (anonymous_id query param)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymous_id = searchParams.get('anonymous_id');
    const supabase = await createClient();

    // Intentar obtener usuario autenticado (formato nuevo - desde /profile)
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Usuario autenticado → obtener su perfil
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_context')
        .eq('id', user.id)
        .single();

      if (error) {
        return NextResponse.json({ user_context: null });
      }

      return NextResponse.json({
        user_context: profile?.user_context || null,
        user_type: 'authenticated'
      });
    }

    // Formato legacy: usuario anónimo con anonymous_id
    if (!anonymous_id) {
      return NextResponse.json(
        { error: 'Missing anonymous_id or not authenticated' },
        { status: 400 }
      );
    }

    // Usuario anónimo → buscar por anonymous_id
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_context')
      .eq('anonymous_id', anonymous_id)
      .single();

    if (error) {
      return NextResponse.json({ context: null, user_type: 'anonymous' });
    }

    return NextResponse.json({
      context: profile?.user_context || null,
      user_type: 'anonymous'
    });

  } catch (error) {
    console.error('[/api/profile/context] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
