// Plan types
export type PlanType = 'free' | 'pro' | 'diamond';

// Session limits per plan
export const LIMITS = {
  ANONYMOUS_SESSIONS: 5,
  FREE_SESSIONS: 15,
  PRO_SESSIONS: 50,
  DIAMOND_SESSIONS: Infinity
} as const;

// Plan pricing (in EUR cents)
export const PRICING = {
  PRO_MONTHLY_PRICE: 500,  // 5€/month
  DIAMOND_MONTHLY_PRICE: 1500  // 15€/month
} as const;

// Stripe Product IDs (to be configured in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
  DIAMOND_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID || ''
} as const;
