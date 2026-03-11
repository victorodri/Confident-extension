'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/landing/footer';
import { analytics } from '@/lib/analytics';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { LanguageSelector } from '@/components/language-selector';

type PlanType = 'free' | 'pro' | 'diamond';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(false);

  const handlePlanClick = async (plan: PlanType) => {
    analytics.planSelected(plan);

    if (plan === 'free') {
      // Plan Free - redirigir a auth para crear cuenta
      window.location.href = `/${locale}/auth`;
      return;
    }

    // Planes de pago - crear checkout session en Stripe
    try {
      setLoading(true);
      analytics.paymentCtaClicked(plan);

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          // No autenticado - redirigir a login
          alert(locale === 'es'
            ? 'Necesitas crear una cuenta primero. Te redirigiremos al registro.'
            : 'You need to create an account first. We\'ll redirect you to sign up.');
          window.location.href = `/${locale}/auth`;
          return;
        }
        throw new Error(error.error || 'Error creating checkout session');
      }

      const { url } = await response.json();

      // Redirigir a Stripe Checkout
      window.location.href = url;

    } catch (error) {
      console.error('[Pricing] Error:', error);
      alert(locale === 'es'
        ? 'Error al procesar el pago. Por favor intenta de nuevo.'
        : 'Error processing payment. Please try again.');
      setLoading(false);
    }
  };

  const plans: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted: boolean;
    plan: PlanType;
    badge: string | null;
  }> = [
    {
      name: t('free.name'),
      price: t('free.price'),
      period: t('free.period'),
      description: t('free.description'),
      features: [
        t('free.features.0'),
        t('free.features.1'),
        t('free.features.2'),
        t('free.features.3'),
        t('free.features.4'),
        t('free.features.5'),
      ],
      cta: t('free.cta'),
      highlighted: false,
      plan: 'free',
      badge: t('free.badge')
    },
    {
      name: t('pro.name'),
      price: t('pro.price'),
      period: t('pro.period'),
      description: t('pro.description'),
      features: [
        t('pro.features.0'),
        t('pro.features.1'),
        t('pro.features.2'),
        t('pro.features.3'),
        t('pro.features.4'),
        t('pro.features.5'),
      ],
      cta: t('pro.cta'),
      highlighted: true,
      plan: 'pro',
      badge: t('pro.badge')
    },
    {
      name: t('diamond.name'),
      price: t('diamond.price'),
      period: t('diamond.period'),
      description: t('diamond.description'),
      features: [
        t('diamond.features.0'),
        t('diamond.features.1'),
        t('diamond.features.2'),
        t('diamond.features.3'),
        t('diamond.features.4'),
        t('diamond.features.5'),
      ],
      cta: t('diamond.cta'),
      highlighted: false,
      plan: 'diamond',
      badge: t('diamond.badge')
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-bold text-xl text-slate-900">
            {tCommon('appName')}
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href={`/${locale}`} className="text-sm text-slate-600 hover:text-slate-900">
              {t('backLink')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-slate-600">
                {t('subtitle')}
              </p>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.highlighted
                      ? 'border-purple-500 border-2 shadow-xl'
                      : 'border-slate-200'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
                      {plan.badge}
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>

                    <div className="mt-4">
                      <span className="text-5xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handlePlanClick(plan.plan)}
                      disabled={loading}
                    >
                      {loading ? (locale === 'es' ? 'Procesando...' : 'Processing...') : plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <div className="border-t pt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                {t('faqTitle')}
              </h2>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('faq.q1.question')}
                  </h3>
                  <p className="text-slate-600">
                    {t('faq.q1.answer')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('faq.q2.question')}
                  </h3>
                  <p className="text-slate-600">
                    {t('faq.q2.answer')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('faq.q3.question')}
                  </h3>
                  <p className="text-slate-600">
                    {t('faq.q3.answer')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t('faq.q4.question')}
                  </h3>
                  <p className="text-slate-600">
                    {t('faq.q4.answer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
