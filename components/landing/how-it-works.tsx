import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

export async function HowItWorks() {
  const t = await getTranslations('landing.howItWorks');

  const steps = [
    {
      number: '1',
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: '📥'
    },
    {
      number: '2',
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: '▶️'
    },
    {
      number: '3',
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: '💡'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.number} className="relative border-2 hover:border-purple-200 transition-all">
              <CardContent className="pt-12 pb-8 text-center">
                {/* Number badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Compatible con Chrome en desktop. Soporte para Teams y Zoom próximamente.
          </p>
        </div>
      </div>
    </section>
  );
}
