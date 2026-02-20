'use client';

import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';

export function Hero() {
  const handleInstallClick = () => {
    analytics.ctaClicked('hero');
    // TODO: En Sesión 8 - link a Chrome Web Store
    alert('Extensión disponible en Sesión 8 (Chrome Web Store)');
  };

  const handleHowItWorksClick = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          5 sesiones gratis — sin registro
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Tu confidente en cada
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            conversación importante
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
          IA que te sugiere <strong>qué decir ahora mismo</strong> durante videollamadas en Google Meet
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            onClick={handleInstallClick}
            className="text-lg px-8 py-6 h-auto"
          >
            Probar gratis — sin registro
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleHowItWorksClick}
            className="text-lg px-8 py-6 h-auto"
          >
            Ver cómo funciona ↓
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Sin tarjeta de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>RGPD • Solo texto, no audio</span>
          </div>
        </div>
      </div>
    </section>
  );
}
