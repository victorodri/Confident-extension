'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/landing/footer';
import { analytics } from '@/lib/analytics';
import Link from 'next/link';

export default function PricingPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistData, setWaitlistData] = useState({ name: '', email: '' });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePlanClick = (plan: 'free' | 'pro') => {
    analytics.planSelected(plan);

    if (plan === 'pro') {
      // MÉTRICA PRINCIPAL MVP
      analytics.paymentCtaClicked('pro');
      setShowWaitlist(true);
    } else {
      // Plan Free - redirigir a auth para instalar extensión
      window.location.href = '/auth';
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Conectar con endpoint de Resend para guardar en lista de espera
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waitlistData)
      });

      if (response.ok) {
        setWaitlistSubmitted(true);
        // Capturar conversión de paywall
        analytics.paywallSoftConverted();
      } else {
        alert('Error al unirse a la lista de espera. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('[Waitlist] Error:', err);
      alert('Error al enviar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const plans = [
    {
      name: 'Anónimo',
      price: '€0',
      period: 'sin registro',
      description: 'Prueba Confident sin crear cuenta',
      features: [
        '5 sesiones gratuitas',
        'Sin necesidad de crear cuenta',
        '3 perfiles disponibles',
        'Sugerencias en tiempo real',
        'Transcripciones básicas',
      ],
      cta: 'Empezar ahora',
      highlighted: false,
      plan: 'free' as const,
      badge: null
    },
    {
      name: 'Gratis',
      price: '€0',
      period: 'siempre',
      description: 'Perfecto para probar Confident',
      features: [
        '15 sesiones totales',
        '5 anónimas + 10 con Google',
        '3 perfiles (Candidato, Vendedor, Defensor)',
        'Sugerencias en tiempo real',
        'Transcripciones por email',
        'Historial de sesiones',
      ],
      cta: 'Crear cuenta gratis',
      highlighted: false,
      plan: 'free' as const,
      badge: 'Recomendado'
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
      cta: 'Unirse a lista de espera',
      highlighted: true,
      plan: 'pro' as const,
      badge: 'Próximamente'
    },
  ];

  // Modal de lista de espera
  if (showWaitlist && !waitlistSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Plan Pro — Lista de espera</CardTitle>
            <CardDescription>
              Confident Pro estará disponible pronto. Déjanos tu email y serás de los primeros en saberlo.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={waitlistData.name}
                  onChange={(e) => setWaitlistData({ ...waitlistData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={waitlistData.email}
                  onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                <p className="text-sm text-purple-800">
                  <strong>€19/mes</strong> — Sesiones ilimitadas + analytics + soporte prioritario
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowWaitlist(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Unirme a la lista'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmación de lista de espera
  if (waitlistSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">¡Estás en la lista! 🎉</CardTitle>
            <CardDescription className="text-base mt-2">
              Te avisaremos por email cuando Confident Pro esté disponible.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                Mientras tanto, puedes seguir usando el <strong>plan gratuito</strong> (15 sesiones).
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={() => window.location.href = '/auth'}
              >
                Crear cuenta gratuita
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Planes y precios
              </h1>
              <p className="text-lg text-slate-600">
                Empieza sin registro. Crea cuenta cuando necesites más sesiones.
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
