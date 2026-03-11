/**
 * API Route: /api/stripe/webhook
 *
 * Webhook handler para eventos de Stripe.
 * Procesa eventos de checkout, subscriptions, y customer.
 *
 * Eventos procesados:
 * - checkout.session.completed → Crear/actualizar suscripción
 * - customer.subscription.updated → Actualizar suscripción
 * - customer.subscription.deleted → Cancelar suscripción
 * - invoice.payment_failed → Marcar suscripción como past_due
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

// Disable body parsing para que Stripe pueda verificar la firma
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verificar firma del webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log('[Stripe Webhook] Event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log('[Stripe Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Checkout Session completado → crear suscripción en Supabase
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan as 'pro' | 'diamond';

  if (!userId || !plan) {
    console.error('[Webhook] Missing metadata in checkout session');
    return;
  }

  // Obtener la suscripción de Stripe
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const supabase = createClient();

  // Insertar/actualizar en stripe_subscriptions
  await supabase.from('stripe_subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    plan: plan,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString()
  });

  console.log(`[Webhook] Subscription created for user ${userId}, plan ${plan}`);
}

/**
 * Suscripción actualizada → sincronizar con Supabase
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  const plan = subscription.metadata.plan as 'pro' | 'diamond';

  if (!userId || !plan) {
    console.error('[Webhook] Missing metadata in subscription');
    return;
  }

  const supabase = createClient();

  await supabase.from('stripe_subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    plan: plan,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString()
  });

  console.log(`[Webhook] Subscription updated for user ${userId}`);
}

/**
 * Suscripción eliminada → downgrade a free
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('[Webhook] Missing user_id in subscription metadata');
    return;
  }

  const supabase = createClient();

  // Actualizar suscripción como cancelada
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  // Downgrade profile a free
  await supabase
    .from('profiles')
    .update({
      plan: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  console.log(`[Webhook] Subscription deleted, user ${userId} downgraded to free`);
}

/**
 * Pago fallido → marcar como past_due
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('[Webhook] Missing user_id in subscription metadata');
    return;
  }

  const supabase = createClient();

  // Actualizar status a past_due
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  console.log(`[Webhook] Payment failed for user ${userId}, marked as past_due`);
}
