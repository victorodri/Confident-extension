'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function PrivacyPage() {
  const t = useTranslations('privacy');
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
          {/* Section 1: Introduction */}
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

          {/* Section 2: What data we collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section2.title')}
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section2.yes.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700">
              <li>
                <strong>{t('section2.yes.item1.label')}</strong> {t('section2.yes.item1.text')}
              </li>
              <li>
                <strong>{t('section2.yes.item2.label')}</strong> {t('section2.yes.item2.text')}
              </li>
              <li>
                <strong>{t('section2.yes.item3.label')}</strong> {t('section2.yes.item3.text')}
              </li>
              <li>
                <strong>{t('section2.yes.item4.label')}</strong> {t('section2.yes.item4.text')}
              </li>
              <li>
                <strong>{t('section2.yes.item5.label')}</strong> {t('section2.yes.item5.text')}
              </li>
              <li>
                <strong>{t('section2.yes.item6.label')}</strong> {t('section2.yes.item6.text')}
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t('section2.no.title')}
            </h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-900 font-semibold mb-2">
                {t('section2.no.banner.title')}
              </p>
              <p className="text-green-800 text-sm">
                {t('section2.no.banner.text')}
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>{t('section2.no.item1')}</li>
              <li>{t('section2.no.item2')}</li>
              <li>{t('section2.no.item3')}</li>
              <li>{t('section2.no.item4')}</li>
            </ul>
          </section>

          {/* Section 3: How we use your data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section3.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section3.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>{t('section3.item1.label')}</strong> {t('section3.item1.text')}
              </li>
              <li>
                <strong>{t('section3.item2.label')}</strong> {t('section3.item2.text')}
              </li>
              <li>
                <strong>{t('section3.item3.label')}</strong> {t('section3.item3.text')}
              </li>
              <li>
                <strong>{t('section3.item4.label')}</strong> {t('section3.item4.text')}
              </li>
              <li>
                <strong>{t('section3.item5.label')}</strong> {t('section3.item5.text')}
              </li>
              <li>
                <strong>{t('section3.item6.label')}</strong> {t('section3.item6.text')}
              </li>
            </ul>
          </section>

          {/* Section 4: Where we store your data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section4.title')}
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-900 font-semibold mb-2">
                {t('section4.banner.title')}
              </p>
              <p className="text-blue-800 text-sm">
                {t('section4.banner.text')}
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {t('section4.text')}
            </p>
          </section>

          {/* Section 5: Third parties */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section5.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section5.intro')}
            </p>

            <div className="space-y-4">
              {/* Deepgram */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {t('section5.deepgram.name')}
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>{t('section5.deepgram.what')}</strong> {t('section5.deepgram.whatText')}<br />
                  <strong>{t('section5.deepgram.why')}</strong> {t('section5.deepgram.whyText')}<br />
                  <strong>{t('section5.deepgram.retention')}</strong> {t('section5.deepgram.retentionText')}<br />
                  <strong>{t('section5.deepgram.policy')}</strong> <a href="https://deepgram.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">deepgram.com/privacy</a>
                </p>
              </div>

              {/* Anthropic */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {t('section5.anthropic.name')}
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>{t('section5.anthropic.what')}</strong> {t('section5.anthropic.whatText')}<br />
                  <strong>{t('section5.anthropic.why')}</strong> {t('section5.anthropic.whyText')}<br />
                  <strong>{t('section5.anthropic.retention')}</strong> {t('section5.anthropic.retentionText')}<br />
                  <strong>{t('section5.anthropic.policy')}</strong> <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">anthropic.com/privacy</a>
                </p>
              </div>

              {/* Resend */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {t('section5.resend.name')}
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>{t('section5.resend.what')}</strong> {t('section5.resend.whatText')}<br />
                  <strong>{t('section5.resend.why')}</strong> {t('section5.resend.whyText')}<br />
                  <strong>{t('section5.resend.retention')}</strong> {t('section5.resend.retentionText')}<br />
                  <strong>{t('section5.resend.policy')}</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com/legal/privacy-policy</a>
                </p>
              </div>

              {/* Posthog */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {t('section5.posthog.name')}
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>{t('section5.posthog.what')}</strong> {t('section5.posthog.whatText')}<br />
                  <strong>{t('section5.posthog.why')}</strong> {t('section5.posthog.whyText')}<br />
                  <strong>{t('section5.posthog.retention')}</strong> {t('section5.posthog.retentionText')}<br />
                  <strong>{t('section5.posthog.policy')}</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">posthog.com/privacy</a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section6.title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>{t('section6.item1.label')}</strong> {t('section6.item1.text')}
              </li>
              <li>
                <strong>{t('section6.item2.label')}</strong> {t('section6.item2.text')}
              </li>
              <li>
                <strong>{t('section6.item3.label')}</strong> {t('section6.item3.text')}
              </li>
              <li>
                <strong>{t('section6.item4.label')}</strong> {t('section6.item4.text')}
              </li>
            </ul>
          </section>

          {/* Section 7: Your rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section7.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section7.intro')}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">
                  {t('section7.right1.title')}
                </h4>
                <p className="text-sm text-slate-700">
                  {t('section7.right1.text')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {t('section7.right2.title')}
                </h4>
                <p className="text-sm text-slate-700">
                  {t('section7.right2.text')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {t('section7.right3.title')}
                </h4>
                <p className="text-sm text-slate-700">
                  {t('section7.right3.text')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {t('section7.right4.title')}
                </h4>
                <p className="text-sm text-slate-700">
                  {t('section7.right4.text')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {t('section7.right5.title')}
                </h4>
                <p className="text-sm text-slate-700">
                  {t('section7.right5.text')}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-6">
              <p className="text-purple-900 font-semibold mb-2">
                {t('section7.banner.title')}
              </p>
              <p className="text-purple-800 text-sm">
                {t('section7.banner.text')}
              </p>
            </div>
          </section>

          {/* Section 8: Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section8.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section8.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>{t('section8.item1.label')}</strong> {t('section8.item1.text')}
              </li>
              <li>
                <strong>{t('section8.item2.label')}</strong> {t('section8.item2.text')}
              </li>
              <li>
                <strong>{t('section8.item3.label')}</strong> {t('section8.item3.text')}
              </li>
            </ul>
          </section>

          {/* Section 9: Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section9.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('section9.intro')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>{t('section9.item1.label')}</strong> {t('section9.item1.text')}
              </li>
              <li>
                <strong>{t('section9.item2.label')}</strong> {t('section9.item2.text')}
              </li>
              <li>
                <strong>{t('section9.item3.label')}</strong> {t('section9.item3.text')}
              </li>
              <li>
                <strong>{t('section9.item4.label')}</strong> {t('section9.item4.text')}
              </li>
              <li>
                <strong>{t('section9.item5.label')}</strong> {t('section9.item5.text')}
              </li>
            </ul>
          </section>

          {/* Section 10: Minors */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section10.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t('section10.text')}
            </p>
          </section>

          {/* Section 11: Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t('section11.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t('section11.text')}
            </p>
          </section>

          {/* Section 12: Contact */}
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
                {t('section12.email')} <a href="mailto:privacy@tryconfident.com" className="text-blue-600 hover:underline">privacy@tryconfident.com</a><br />
                {t('section12.responseTime')} {t('section12.responseTimeText')}<br />
                {t('section12.dataProtection')} {t('section12.dataProtectionText')}
              </p>
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
                href={`/${locale}/terms`}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {c('terms')}
              </Link>
              <span className="text-slate-300">|</span>
              <a
                href="mailto:privacy@tryconfident.com"
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
