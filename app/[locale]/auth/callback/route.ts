import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // Si hay error de OAuth, loguear y redirigir
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, error_description);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error_description || error)}`, origin)
    );
  }

  // Si no hay código, redirigir a auth
  if (!code) {
    console.error('[Auth Callback] No code provided');
    return NextResponse.redirect(new URL('/auth?error=no_code', origin));
  }

  try {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[Auth Callback] Exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(exchangeError.message)}`, origin)
      );
    }

    if (!data.session) {
      console.error('[Auth Callback] No session after exchange');
      return NextResponse.redirect(new URL('/auth?error=no_session', origin));
    }

    console.log('[Auth Callback] Success! User:', data.user?.email);

    // Redirigir a página de éxito
    return NextResponse.redirect(new URL('/auth/success', origin));
  } catch (err) {
    console.error('[Auth Callback] Unexpected error:', err);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent('Unexpected error')}`, origin)
    );
  }
}
