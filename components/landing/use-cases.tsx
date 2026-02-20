import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function UseCases() {
  const cases = [
    {
      icon: '🎓',
      title: 'Candidatos',
      subtitle: 'Entrevistas de trabajo',
      description: 'Detecta preguntas behavioral y te sugiere estructurar con STAR. Maneja preguntas técnicas, salariales y motivacionales con confianza.',
      signals: ['Preguntas STAR', 'Técnicas', 'Salariales', 'Motivacionales'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💼',
      title: 'Vendedores',
      subtitle: 'Llamadas comerciales',
      description: 'Identifica objeciones de precio, necesidad y confianza. Detecta señales de compra y te indica cuándo cerrar.',
      signals: ['Objeciones', 'Señales de compra', 'Momentos de cierre', 'Descubrimiento'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🛡️',
      title: 'Defensores',
      subtitle: 'Presentaciones estratégicas',
      description: 'Descompone preguntas complejas multi-parte. Te ayuda a estructurar respuestas defendiendo asunciones con datos.',
      signals: ['Preguntas complejas', 'Cuestionamientos', 'Solicitud de datos', 'Riesgos'],
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Tres perfiles especializados
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cada uno con un prompt de Claude optimizado para ese contexto específico
          </p>
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
                <p className="text-slate-600 mb-4">
                  {useCase.description}
                </p>

                {/* Signals */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Detecta:</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.signals.map((signal) => (
                      <span
                        key={signal}
                        className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
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
