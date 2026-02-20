'use client';

import Link from 'next/link';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { UseCases } from '@/components/landing/use-cases';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-slate-900">
            Confident
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-sm text-slate-600 hover:text-slate-900 hidden md:block"
            >
              Cómo funciona
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Precios
            </Link>
            <Button variant="outline" size="sm" asChild>
              <a href="/auth">Iniciar sesión</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Listo para tu próxima conversación importante?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Empieza gratis. Sin tarjeta de crédito. Sin registro.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => alert('Extensión disponible en Sesión 8 (Chrome Web Store)')}
            >
              Instalar extensión →
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
