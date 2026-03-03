import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { UseCases } from '@/components/landing/use-cases';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('common');
  const tLanding = await getTranslations('landing');
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-bold text-xl text-slate-900">
            {t('appName')}
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}#how-it-works`}
              className="text-sm text-slate-600 hover:text-slate-900 hidden md:block"
            >
              {tLanding('howItWorks.title')}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {t('pricing')}
            </Link>
            <LanguageSelector />
            <Button variant="outline" size="sm" asChild>
              <a href={`/${locale}/auth`}>{t('signIn')}</a>
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
              {tLanding('hero.title')}
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              {tLanding('hero.cta')}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 h-auto"
              asChild
            >
              <a href={`/${locale}/auth`}>{t('getStarted')} →</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
