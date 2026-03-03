'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function TermsPage() {
  const t = useTranslations('terms');
  const c = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold text-slate-900">
            {c('appName')}
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {c('backToHome')}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-slate-600 mb-8">
          {t('lastUpdated')}
        </p>

        <div className="prose prose-slate max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section1.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section1.p1')}
            </p>
            <p className="text-slate-700 leading-relaxed">
              {t('section1.p2')}
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section2.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section2.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section2.item1')}</li>
              <li>{t('section2.item2')}</li>
              <li>{t('section2.item3')}</li>
              <li>{t('section2.item4')}</li>
              <li>{t('section2.item5')}</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-900 font-semibold mb-2">
                {t('section2.banner.title')}
              </p>
              <p className="text-yellow-800 text-sm">
                {t('section2.banner.text')}
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section3.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section3.technical.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section3.technical.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section3.technical.item1')}</li>
              <li>{t('section3.technical.item2')}</li>
              <li>{t('section3.technical.item3')}</li>
              <li>{t('section3.technical.item4')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section3.age.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              {t('section3.age.text')}
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section3.consent.title')}
            </h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-2">
                {t('section3.consent.banner.title')}
              </p>
              <p className="text-red-800 text-sm mb-2">
                {t('section3.consent.banner.p1')}
              </p>
              <p className="text-red-800 text-sm">
                {t('section3.consent.banner.p2')}
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section4.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section4.anonymous.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section4.anonymous.item1')}</li>
              <li>{t('section4.anonymous.item2')}</li>
              <li>{t('section4.anonymous.item3')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section4.free.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section4.free.item1')}</li>
              <li>{t('section4.free.item2')}</li>
              <li>{t('section4.free.item3')}</li>
              <li>{t('section4.free.item4')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section4.pro.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>{t('section4.pro.item1')}</li>
              <li>{t('section4.pro.item2')}</li>
              <li>{t('section4.pro.item3')}</li>
            </ul>
            <p className="text-sm text-slate-600 italic">
              {t('section4.pro.note')}
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section5.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section5.acceptable.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section5.acceptable.item1')}</li>
              <li>{t('section5.acceptable.item2')}</li>
              <li>{t('section5.acceptable.item3')}</li>
              <li>{t('section5.acceptable.item4')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section5.unacceptable.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li className="text-red-700">
                <strong>{t('section5.unacceptable.item1')}</strong>
              </li>
              <li>{t('section5.unacceptable.item2')}</li>
              <li>{t('section5.unacceptable.item3')}</li>
              <li>{t('section5.unacceptable.item4')}</li>
              <li>{t('section5.unacceptable.item5')}</li>
              <li>{t('section5.unacceptable.item6')}</li>
              <li>{t('section5.unacceptable.item7')}</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
              <p className="text-orange-900 font-semibold mb-2">
                {t('section5.banner.title')}
              </p>
              <p className="text-orange-800 text-sm">
                {t('section5.banner.text')}
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section6.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section6.yourContent.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section6.yourContent.text')}
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section6.ourContent.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section6.ourContent.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section6.ourContent.item1')}</li>
              <li>{t('section6.ourContent.item2')}</li>
              <li>{t('section6.ourContent.item3')}</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section7.title')}
            </h2>

            <div className="bg-slate-100 border-l-4 border-slate-500 p-4 mb-4">
              <p className="text-slate-900 font-semibold mb-2">
                {t('section7.banner.title')}
              </p>
              <p className="text-slate-700 text-sm">
                {t('section7.banner.text')}
              </p>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section7.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section7.item1')}</li>
              <li>{t('section7.item2')}</li>
              <li>{t('section7.item3')}</li>
              <li>{t('section7.item4')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section7.exclusion.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section7.exclusion.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section7.exclusion.item1')}</li>
              <li>{t('section7.exclusion.item2')}</li>
              <li>{t('section7.exclusion.item3')}</li>
              <li>{t('section7.exclusion.item4')}</li>
              <li>{t('section7.exclusion.item5')}</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-2">
                {t('section7.note.title')}
              </p>
              <p className="text-blue-800 text-sm">
                {t('section7.note.text')}
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section8.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section8.byYou.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section8.byYou.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>{t('section8.byYou.item1')}</li>
              <li>{t('section8.byYou.item2')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section8.byUs.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section8.byUs.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section8.byUs.item1')}</li>
              <li>{t('section8.byUs.item2')}</li>
              <li>{t('section8.byUs.item3')}</li>
              <li>{t('section8.byUs.item4')}</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section9.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section9.service.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              {t('section9.service.text')}
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section9.terms.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section9.terms.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section9.terms.item1')}</li>
              <li>{t('section9.terms.item2')}</li>
              <li>{t('section9.terms.item3')}</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              {t('section9.terms.outro')}
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section10.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section10.p1')}
            </p>
            <p className="text-slate-700 leading-relaxed">
              {t('section10.p2')}
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section11.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section11.complete.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section11.complete.text')}
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section11.severability.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section11.severability.text')}
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section11.noWaiver.title')}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {t('section11.noWaiver.text')}
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section12.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section12.intro')}
            </p>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-slate-900 font-semibold">
                {t('section12.company')}
              </p>
              <p className="text-slate-700 text-sm mt-2">
                {t('section12.email')} <a href="mailto:legal@tryconfident.com" className="text-blue-600 hover:underline">legal@tryconfident.com</a><br />
                {t('section12.support')} <a href="mailto:hola@tryconfident.com" className="text-blue-600 hover:underline">hola@tryconfident.com</a><br />
                {t('section12.responseTime')} {t('section12.responseTimeText')}
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="mb-12">
            <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                {t('acceptance.title')}
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>{t('acceptance.item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>{t('acceptance.item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>{t('acceptance.item3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>{t('acceptance.item4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">5.</span>
                  <span>{t('acceptance.item5')}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href={`/${locale}`}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {c('backToHome')}
            </Link>
            <div className="flex gap-4 text-sm">
              <Link
                href={`/${locale}/privacy`}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {c('privacy')}
              </Link>
              <span className="text-slate-300">|</span>
              <a
                href="mailto:legal@tryconfident.com"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {c('contact')}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
