-- Migration: Add Stripe Integration + Diamond Plan
-- Date: 2026-03-11
-- Description: Add Diamond plan, Stripe tables, and subscription management

-- ==========================================
-- 1. UPDATE PROFILES TABLE
-- ==========================================

-- Drop old constraint and add new one with 'diamond'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'pro', 'diamond'));

-- Add Stripe customer ID column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add subscription status column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT
  CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', NULL));

-- Add current period end
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- ==========================================
-- 2. CREATE STRIPE_CUSTOMERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. CREATE STRIPE_SUBSCRIPTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('pro', 'diamond')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid')) NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. RLS POLICIES FOR STRIPE TABLES
-- ==========================================

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies: STRIPE_CUSTOMERS
CREATE POLICY "Users can read own stripe customer"
  ON public.stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

-- Policies: STRIPE_SUBSCRIPTIONS
CREATE POLICY "Users can read own stripe subscriptions"
  ON public.stripe_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ==========================================
-- 5. INDEXES FOR OPTIMIZATION
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id
  ON public.stripe_customers(user_id);

CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id
  ON public.stripe_customers(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id
  ON public.stripe_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_stripe_id
  ON public.stripe_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status
  ON public.stripe_subscriptions(status);

-- ==========================================
-- 6. FUNCTION TO SYNC SUBSCRIPTION TO PROFILE
-- ==========================================

CREATE OR REPLACE FUNCTION public.sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile with subscription data
  UPDATE public.profiles
  SET
    plan = NEW.plan,
    subscription_status = NEW.status,
    current_period_end = NEW.current_period_end,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. TRIGGER TO AUTO-SYNC SUBSCRIPTIONS
-- ==========================================

DROP TRIGGER IF EXISTS on_subscription_updated ON public.stripe_subscriptions;

CREATE TRIGGER on_subscription_updated
  AFTER INSERT OR UPDATE ON public.stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_subscription_to_profile();

-- ==========================================
-- 8. FUNCTION TO HANDLE SUBSCRIPTION CANCELLATION
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_subscription_canceled()
RETURNS TRIGGER AS $$
BEGIN
  -- If subscription is canceled and period ended, downgrade to free
  IF NEW.status = 'canceled' AND NEW.current_period_end < NOW() THEN
    UPDATE public.profiles
    SET
      plan = 'free',
      subscription_status = 'canceled',
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. TRIGGER FOR CANCELLATION
-- ==========================================

DROP TRIGGER IF EXISTS on_subscription_canceled ON public.stripe_subscriptions;

CREATE TRIGGER on_subscription_canceled
  AFTER UPDATE ON public.stripe_subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'canceled' OR NEW.cancel_at_period_end = TRUE)
  EXECUTE FUNCTION public.handle_subscription_canceled();

-- ==========================================
-- MIGRATION COMPLETE
-- ==========================================
