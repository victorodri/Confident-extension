import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/profile/context
 * Guarda el contexto del usuario (onboarding personalizado)
 */
export async function POST(request: NextRequest) {
  try {
    const { anonymous_id, context } = await request.json();

    if (!anonymous_id || !context) {
      return NextResponse.json(
        { error: 'Missing anonymous_id or context' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Intentar obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Usuario autenticado → actualizar su perfil
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
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymous_id = searchParams.get('anonymous_id');

    if (!anonymous_id) {
      return NextResponse.json(
        { error: 'Missing anonymous_id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Intentar obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Usuario autenticado → obtener su perfil
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_context')
        .eq('id', user.id)
        .single();

      if (error) {
        return NextResponse.json({ context: null });
      }

      return NextResponse.json({
        context: profile?.user_context || null,
        user_type: 'authenticated'
      });
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
