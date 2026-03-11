/**
 * Stripe Client Configuration (Server-side)
 *
 * IMPORTANTE: Este archivo solo debe usarse en el servidor.
 * NUNCA importar en componentes cliente o extensión.
 */

import Stripe from 'stripe';
import { PRICING, STRIPE_PRODUCTS } from './constants';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY no está definida en variables de entorno');
}

// Inicializar cliente Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Tipos para planes
export type StripePlan = 'pro' | 'diamond';

// Configuración de precios
export const PLAN_PRICES: Record<StripePlan, { priceId: string; amount: number; name: string }> = {
  pro: {
    priceId: STRIPE_PRODUCTS.PRO_MONTHLY,
    amount: PRICING.PRO_MONTHLY_PRICE,
    name: 'Pro'
  },
  diamond: {
    priceId: STRIPE_PRODUCTS.DIAMOND_MONTHLY,
    amount: PRICING.DIAMOND_MONTHLY_PRICE,
    name: 'Diamond'
  }
};

/**
 * Crear o recuperar un Customer de Stripe
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const { createClient } = await import('./supabase-server');
  const supabase = createClient();

  // Verificar si ya existe un customer en Supabase
  const { data: existingCustomer } = await supabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id;
  }

  // Crear nuevo customer en Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id: userId
    }
  });

  // Guardar en Supabase
  await supabase
    .from('stripe_customers')
    .insert({
      user_id: userId,
      stripe_customer_id: customer.id,
      email
    });

  return customer.id;
}

/**
 * Crear Checkout Session para un plan
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: StripePlan,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId, email);
  const planConfig = PLAN_PRICES[plan];

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      plan: plan
    },
    subscription_data: {
      metadata: {
        user_id: userId,
        plan: plan
      }
    }
  });

  if (!session.url) {
    throw new Error('No se pudo crear la sesión de checkout');
  }

  return session.url;
}

/**
 * Obtener suscripción activa de un usuario
 */
export async function getUserSubscription(userId: string) {
  const { createClient } = await import('./supabase-server');
  const supabase = createClient();

  const { data: subscription } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  return subscription;
}

/**
 * Cancelar suscripción al final del período
 */
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  });
}

/**
 * Reactivar suscripción cancelada
 */
export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  });
}
