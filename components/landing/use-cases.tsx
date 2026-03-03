import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

export async function UseCases() {
  const t = await getTranslations('landing.useCases');

  const cases = [
    {
      icon: '🎓',
      title: t('candidateTitle'),
      subtitle: t('candidateTitle'),
      description: t('candidateDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💼',
      title: t('salesTitle'),
      subtitle: t('salesTitle'),
      description: t('salesDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🛡️',
      title: t('defenderTitle'),
      subtitle: t('defenderTitle'),
      description: t('defenderDesc'),
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((useCase) => (
            <Card key={useCase.title} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                {/* Icon + gradient */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {useCase.icon}
                </div>

                <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                <CardDescription className="text-base">{useCase.subtitle}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-slate-600">
                  {useCase.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            ¿No encajas en ningún perfil? Cuéntanos tu caso de uso
          </p>
          <a
            href="mailto:hola@tryconfident.com"
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            hola@tryconfident.com
          </a>
        </div>
      </div>
    </section>
  );
}
