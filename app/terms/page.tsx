import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Confident
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Términos de Servicio
        </h1>
        <p className="text-slate-600 mb-8">
          Última actualización: 1 de marzo de 2026
        </p>

        <div className="prose prose-slate max-w-none">
          {/* Introducción */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Al instalar, acceder o usar la extensión de Chrome "Confident" (en adelante, el "Servicio"), aceptas estar legalmente vinculado por estos Términos de Servicio (en adelante, los "Términos").
            </p>
            <p className="text-slate-700 leading-relaxed">
              Si no estás de acuerdo con estos Términos, no uses el Servicio.
            </p>
          </section>

          {/* Descripción del Servicio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Confident es una extensión de Chrome que actúa como asistente en tiempo real durante videollamadas de Google Meet. El Servicio:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Captura el audio de tu videollamada (tab de Google Meet + micrófono)</li>
              <li>Convierte el audio en texto mediante transcripción automática</li>
              <li>Analiza el contexto de la conversación con inteligencia artificial (IA)</li>
              <li>Muestra sugerencias en tiempo real en un panel lateral</li>
              <li>Guarda las transcripciones y sugerencias en tu cuenta para consulta posterior</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-900 font-semibold mb-2">
                ⚠️ Importante: Confident es una herramienta de asistencia
              </p>
              <p className="text-yellow-800 text-sm">
                Las sugerencias generadas por IA son orientativas y no sustituyen tu criterio profesional. No somos responsables de las decisiones que tomes basándote en las sugerencias del Servicio.
              </p>
            </div>
          </section>

          {/* Requisitos de Uso */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Requisitos de Uso
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              3.1 Requisitos técnicos
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Para usar el Servicio necesitas:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>Navegador Google Chrome (versión 120 o superior)</li>
              <li>Conexión a internet estable</li>
              <li>Micrófono funcional</li>
              <li>Permiso de captura de audio en Chrome</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              3.2 Requisitos de edad
            </h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              Debes tener al menos 18 años para usar el Servicio. Si tienes entre 16 y 18 años, necesitas el consentimiento de tus padres o tutores legales.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              3.3 Consentimiento obligatorio
            </h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-900 font-semibold mb-2">
                🚨 CRÍTICO: Consentimiento de los participantes
              </p>
              <p className="text-red-800 text-sm mb-2">
                Antes de iniciar una sesión, <strong>DEBES informar a todos los participantes</strong> de que la conversación será transcrita y obtener su consentimiento explícito.
              </p>
              <p className="text-red-800 text-sm">
                El incumplimiento de esta obligación puede constituir una violación de las leyes de privacidad y grabación de conversaciones en tu jurisdicción. Tú eres el único responsable de obtener estos consentimientos.
              </p>
            </div>
          </section>

          {/* Planes y Límites */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Planes y Límites de Uso
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              4.1 Plan Anónimo (Gratuito)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>5 sesiones gratuitas sin necesidad de registro</li>
              <li>Transcripciones y sugerencias no se guardan permanentemente</li>
              <li>Sin acceso al dashboard ni historial</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              4.2 Plan Gratuito (Cuenta Google)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>15 sesiones con cuenta Google (incluye las 5 anónimas)</li>
              <li>Acceso al dashboard con historial de sesiones</li>
              <li>Transcripciones y sugerencias guardadas permanentemente</li>
              <li>Email automático con resumen al finalizar cada sesión</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              4.3 Plan Pro (Pago)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>Sesiones ilimitadas</li>
              <li>Prioridad en mejoras y nuevas funcionalidades</li>
              <li>Soporte prioritario</li>
            </ul>
            <p className="text-sm text-slate-600 italic">
              Nota: El Plan Pro actualmente está en lista de espera. Los precios y términos de pago se comunicarán antes de la activación.
            </p>
          </section>

          {/* Uso Aceptable */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Uso Aceptable
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              5.1 Puedes usar el Servicio para:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>Asistencia en entrevistas de trabajo (como candidato)</li>
              <li>Apoyo en llamadas comerciales y ventas</li>
              <li>Ayuda en presentaciones y defensas de proyectos</li>
              <li>Cualquier otro uso profesional legítimo donde tengas consentimiento de los participantes</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              5.2 NO puedes usar el Servicio para:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li className="text-red-700">
                <strong>Grabar conversaciones sin consentimiento</strong> de todos los participantes
              </li>
              <li>Transcribir contenido ilegal, ofensivo o que viole derechos de terceros</li>
              <li>Compartir o vender las transcripciones de otras personas sin su permiso</li>
              <li>Hacer ingeniería inversa, modificar o intentar hackear el Servicio</li>
              <li>Usar el Servicio para competir directamente con nosotros</li>
              <li>Sobrecargar o dañar la infraestructura del Servicio</li>
              <li>Evadir los límites de uso (ej: crear múltiples cuentas falsas)</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
              <p className="text-orange-900 font-semibold mb-2">
                ⚠️ Consecuencias del mal uso
              </p>
              <p className="text-orange-800 text-sm">
                Nos reservamos el derecho de suspender o cancelar tu cuenta inmediatamente si detectamos un uso inaceptable del Servicio, sin derecho a reembolso.
              </p>
            </div>
          </section>

          {/* Propiedad Intelectual */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Propiedad Intelectual
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              6.1 Tu contenido
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Tú conservas todos los derechos sobre las transcripciones de tus conversaciones. Nosotros solo las almacenamos para mostrártelas y mejorar el Servicio.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              6.2 Nuestro contenido
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Confident, su código, diseño, marca y todos los elementos del Servicio son propiedad de Confident y están protegidos por leyes de propiedad intelectual. No puedes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Copiar, modificar o distribuir el código de la extensión</li>
              <li>Usar nuestra marca ("Confident") para productos derivados</li>
              <li>Crear servicios competidores basados en nuestro código o diseño</li>
            </ul>
          </section>

          {/* Limitación de Responsabilidad */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Limitación de Responsabilidad
            </h2>

            <div className="bg-slate-100 border-l-4 border-slate-500 p-4 mb-4">
              <p className="text-slate-900 font-semibold mb-2">
                Servicio "tal cual"
              </p>
              <p className="text-slate-700 text-sm">
                El Servicio se ofrece <strong>"tal cual"</strong> y <strong>"según disponibilidad"</strong>, sin garantías de ningún tipo, expresas o implícitas.
              </p>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4">
              No garantizamos que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>El Servicio esté siempre disponible, sin interrupciones o errores</li>
              <li>Las transcripciones sean 100% precisas (pueden contener errores)</li>
              <li>Las sugerencias de IA sean siempre correctas o apropiadas</li>
              <li>El Servicio sea compatible con futuras versiones de Chrome o Google Meet</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              7.1 Exclusión de daños
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              En la máxima medida permitida por la ley, Confident no será responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso del Servicio</li>
              <li>Pérdida de oportunidades laborales, ventas o proyectos por seguir sugerencias incorrectas</li>
              <li>Problemas legales derivados de grabar sin consentimiento</li>
              <li>Pérdida de datos por fallos técnicos</li>
              <li>Daños a tu reputación profesional</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-2">
                💡 Usa tu criterio profesional
              </p>
              <p className="text-blue-800 text-sm">
                Confident es una <strong>herramienta de apoyo</strong>, no un sustituto de tu experiencia y criterio. Revisa siempre las sugerencias antes de actuar.
              </p>
            </div>
          </section>

          {/* Cancelación y Terminación */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Cancelación y Terminación
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              8.1 Por tu parte
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Puedes cancelar tu cuenta en cualquier momento:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
              <li>Desinstalando la extensión de Chrome</li>
              <li>Solicitando la eliminación de tu cuenta a <a href="mailto:privacy@tryconfident.com" className="text-blue-600 hover:underline">privacy@tryconfident.com</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              8.2 Por nuestra parte
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Podemos suspender o cancelar tu cuenta si:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Violas estos Términos de Servicio</li>
              <li>Detectamos uso fraudulento o abusivo</li>
              <li>Es requerido por ley</li>
              <li>Decidimos discontinuar el Servicio (con 30 días de aviso previo)</li>
            </ul>
          </section>

          {/* Modificaciones del Servicio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              9. Modificaciones del Servicio y Términos
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              9.1 Modificaciones del Servicio
            </h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio (o cualquier parte de él) en cualquier momento, con o sin previo aviso.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              9.2 Modificaciones de estos Términos
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Podemos actualizar estos Términos ocasionalmente. Te notificaremos de cambios significativos mediante:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Email (si tienes cuenta)</li>
              <li>Aviso en la extensión</li>
              <li>Actualización de la fecha "Última actualización" al inicio del documento</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              El uso continuado del Servicio después de los cambios constituye tu aceptación de los nuevos Términos.
            </p>
          </section>

          {/* Ley Aplicable */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              10. Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Estos Términos se rigen por las leyes de España y de la Unión Europea (RGPD).
            </p>
            <p className="text-slate-700 leading-relaxed">
              Cualquier disputa derivada de estos Términos se resolverá en los tribunales de Madrid, España, salvo que las leyes de protección al consumidor de tu país establezcan otra jurisdicción obligatoria.
            </p>
          </section>

          {/* Disposiciones Generales */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              11. Disposiciones Generales
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              11.1 Acuerdo completo
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Estos Términos, junto con nuestra <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</Link>, constituyen el acuerdo completo entre tú y Confident.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              11.2 Separabilidad
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Si alguna disposición de estos Términos es considerada inválida o inaplicable, las demás disposiciones continuarán en pleno vigor.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              11.3 No renuncia
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Nuestra falta de ejercicio de cualquier derecho bajo estos Términos no constituye una renuncia a ese derecho.
            </p>
          </section>

          {/* Contacto */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              12. Contacto
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Si tienes preguntas sobre estos Términos de Servicio:
            </p>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-slate-900 font-semibold">
                Confident
              </p>
              <p className="text-slate-700 text-sm mt-2">
                Email: <a href="mailto:legal@tryconfident.com" className="text-blue-600 hover:underline">legal@tryconfident.com</a><br />
                Soporte: <a href="mailto:hola@tryconfident.com" className="text-blue-600 hover:underline">hola@tryconfident.com</a><br />
                Respuesta en: Máximo 5 días hábiles
              </p>
            </div>
          </section>

          {/* Aceptación Final */}
          <section className="mb-12">
            <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                ✅ Al usar Confident, confirmas que:
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Has leído y comprendido estos Términos de Servicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Tienes al menos 18 años o el consentimiento de tus padres/tutores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Obtendrás el consentimiento de todos los participantes antes de transcribir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Usarás el Servicio de manera responsable y legal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">5.</span>
                  <span>Aceptas las limitaciones de responsabilidad descritas arriba</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Volver al inicio
            </Link>
            <div className="flex gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Política de Privacidad
              </Link>
              <span className="text-slate-300">|</span>
              <a
                href="mailto:legal@tryconfident.com"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
