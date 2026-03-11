/**
 * API Route: /api/stripe/create-checkout-session
 *
 * Crea una Checkout Session de Stripe para un upgrade de plan.
 *
 * POST body:
 * {
 *   "plan": "pro" | "diamond"
 * }
 *
 * Retorna:
 * {
 *   "url": "https://checkout.stripe.com/..."
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createCheckoutSession, type StripePlan } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // 1. Parsear body
    const body = await request.json();
    const { plan } = body as { plan: StripePlan };

    // Validar plan
    if (!plan || !['pro', 'diamond'].includes(plan)) {
      return NextResponse.json(
        { error: 'Plan inválido. Debe ser "pro" o "diamond".' },
        { status: 400 }
      );
    }

    // 2. Verificar autenticación
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 3. Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    // 4. Validar que no tenga ya este plan
    if (profile.plan === plan) {
      return NextResponse.json(
        { error: `Ya tienes el plan ${plan}` },
        { status: 400 }
      );
    }

    // 5. Crear URLs de success/cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?upgrade=success&plan=${plan}`;
    const cancelUrl = `${baseUrl}/pricing?upgrade=canceled`;

    // 6. Crear Checkout Session en Stripe
    const checkoutUrl = await createCheckoutSession(
      user.id,
      profile.email || user.email || '',
      plan,
      successUrl,
      cancelUrl
    );

    // 7. Retornar URL
    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('[/api/stripe/create-checkout-session] Error:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de checkout' },
      { status: 500 }
    );
  }
}
