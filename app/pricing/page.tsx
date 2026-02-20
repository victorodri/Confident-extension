'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/landing/footer';
import { analytics } from '@/lib/analytics';
import Link from 'next/link';

export default function PricingPage() {
  const handlePlanClick = (plan: 'free' | 'pro') => {
    analytics.planSelected(plan);

    if (plan === 'pro') {
      // MÉTRICA PRINCIPAL MVP
      analytics.paymentCtaClicked('pro');
      alert('Plan Pro disponible en Sesión 7.\n\n¡Gracias por tu interés! Serás de los primeros en saberlo.');
    } else {
      alert('Instala la extensión (disponible en Sesión 8) para empezar gratis.');
    }
  };

  const plans = [
    {
      name: 'Gratis',
      price: '€0',
      period: 'siempre',
      description: 'Perfecto para probar Confident',
      features: [
        '5 sesiones sin registro',
        '+ 10 sesiones con cuenta Google',
        'Total: 15 sesiones',
        '3 perfiles (Candidato, Vendedor, Defensor)',
        'Sugerencias en tiempo real',
        'Transcripciones por email',
      ],
      cta: 'Empezar gratis',
      highlighted: false,
      plan: 'free' as const
    },
    {
      name: 'Pro',
      price: '€19',
      period: '/mes',
      description: 'Para quienes tienen conversaciones críticas frecuentes',
      features: [
        'Sesiones ilimitadas',
        'Todo lo de Gratis, más:',
        'Analytics de rendimiento',
        'Modo practice (próximamente)',
        'Soporte prioritario',
        'Acceso anticipado a nuevas features',
      ],
      cta: 'Empezar Pro',
      highlighted: true,
      plan: 'pro' as const
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-slate-900">
            Confident
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Volver
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Planes y precios
              </h1>
              <p className="text-lg text-slate-600">
                Empieza gratis. Actualiza cuando necesites más sesiones.
              </p>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.highlighted
                      ? 'border-purple-500 border-2 shadow-xl'
                      : 'border-slate-200'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
                      Más popular
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
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <div className="border-t pt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Preguntas frecuentes
              </h2>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    ¿Por qué 15 sesiones y no ilimitadas en el plan gratuito?
                  </h3>
                  <p className="text-slate-600">
                    Queremos que pruebes Confident sin compromiso, pero los costos de IA (Claude + Deepgram) son significativos. 15 sesiones son suficientes para validar si te sirve.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    ¿Puedo cancelar cuando quiera?
                  </h3>
                  <p className="text-slate-600">
                    Sí, sin penalización. Cancela desde tu dashboard en cualquier momento.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    ¿Qué pasa con mis datos si cancelo?
                  </h3>
                  <p className="text-slate-600">
                    Puedes eliminarlos completamente desde el dashboard o solicitarlo a hola@tryconfident.com. Cumplimos con RGPD (derecho ARCO).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    ¿Habrá plan para equipos?
                  </h3>
                  <p className="text-slate-600">
                    Sí, estamos trabajando en un plan Teams (€49/mes para 5 usuarios). Si te interesa, escríbenos a hola@tryconfident.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
