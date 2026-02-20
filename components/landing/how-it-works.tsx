import { Card, CardContent } from '@/components/ui/card';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Instala la extensión',
      description: 'Un clic desde Chrome Web Store. Compatible solo con Google Meet.',
      icon: '📥'
    },
    {
      number: '2',
      title: 'Activa en Meet',
      description: 'Selecciona tu perfil (Candidato, Vendedor o Defensor) y pulsa iniciar.',
      icon: '▶️'
    },
    {
      number: '3',
      title: 'Recibe sugerencias',
      description: 'El panel lateral te muestra qué decir en <5 segundos. Solo tú lo ves.',
      icon: '💡'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            En 3 pasos simples estás listo para tu próxima conversación crítica
          </p>
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
