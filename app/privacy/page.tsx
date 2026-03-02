import Link from 'next/link';

export default function PrivacyPage() {
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
          Política de Privacidad
        </h1>
        <p className="text-slate-600 mb-8">
          Última actualización: 1 de marzo de 2026
        </p>

        <div className="prose prose-slate max-w-none">
          {/* Introducción */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Introducción
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              En Confident nos tomamos muy en serio tu privacidad. Esta Política de Privacidad explica qué datos recopilamos, cómo los usamos, dónde los almacenamos y cuáles son tus derechos.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Confident es una extensión de Chrome que actúa como asistente en tiempo real durante videollamadas de Google Meet. Cumplimos con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.
            </p>
          </section>

          {/* Qué datos recopilamos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Qué datos recopilamos
            </h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              2.1 Datos que SÍ recopilamos
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700">
              <li>
                <strong>Transcripciones de texto:</strong> Convertimos el audio de tus videollamadas en texto para mostrarte sugerencias en tiempo real. Las transcripciones se almacenan en nuestra base de datos.
              </li>
              <li>
                <strong>Sugerencias generadas:</strong> Guardamos las sugerencias que la IA te muestra durante la sesión, junto con tu feedback (👍/👎).
              </li>
              <li>
                <strong>Email:</strong> Si decides crear una cuenta con Google OAuth, guardamos tu dirección de email para identificarte.
              </li>
              <li>
                <strong>Device fingerprint (huella digital del dispositivo):</strong> Un identificador anónimo generado a partir de las características de tu navegador (NO incluye información personal). Lo usamos para el contador de sesiones gratuitas.
              </li>
              <li>
                <strong>Metadatos de sesión:</strong> Fecha/hora de inicio y fin, duración, perfil seleccionado (Candidato/Vendedor/Defensor).
              </li>
              <li>
                <strong>Datos de uso (analytics):</strong> Eventos anónimos de cómo usas la extensión (ej: "sesión iniciada", "sugerencia mostrada"). Los procesamos con Posthog EU.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              2.2 Datos que NO recopilamos
            </h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-900 font-semibold mb-2">
                ✅ Audio NUNCA almacenado
              </p>
              <p className="text-green-800 text-sm">
                El audio de tus videollamadas se procesa <strong>únicamente en tiempo real</strong> y <strong>nunca se guarda</strong> en ningún servidor. Solo guardamos el texto resultante de la transcripción.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>NO grabamos video</li>
              <li>NO accedemos a tu cámara</li>
              <li>NO leemos tus emails o archivos personales</li>
              <li>NO rastreamos tu actividad fuera de Google Meet</li>
            </ul>
          </section>

          {/* Cómo usamos tus datos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Cómo usamos tus datos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Usamos tus datos exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Mostrarte sugerencias en tiempo real</strong> durante tus videollamadas (propósito principal del servicio).
              </li>
              <li>
                <strong>Mejorar la calidad de las sugerencias</strong> mediante análisis de qué sugerencias fueron útiles (basado en tu feedback 👍/👎).
              </li>
              <li>
                <strong>Enviarte el resumen de tu sesión por email</strong> al finalizar (solo si proporcionaste tu email).
              </li>
              <li>
                <strong>Gestionar el sistema de límites freemium</strong> (5 sesiones anónimas, 15 con cuenta gratuita).
              </li>
              <li>
                <strong>Mostrar tu historial de sesiones</strong> en el dashboard (solo accesible por ti).
              </li>
              <li>
                <strong>Análisis agregados y anónimos</strong> para mejorar el producto (ej: latencia promedio, tasas de error).
              </li>
            </ul>
          </section>

          {/* Dónde almacenamos tus datos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Dónde almacenamos tus datos
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-900 font-semibold mb-2">
                🇪🇺 Datos almacenados en la Unión Europea
              </p>
              <p className="text-blue-800 text-sm">
                Todos tus datos se almacenan en <strong>Supabase (PostgreSQL)</strong> en la región de <strong>Frankfurt, Alemania</strong>, cumpliendo con el RGPD.
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed">
              No transferimos tus datos fuera de la UE excepto para el procesamiento en tiempo real con servicios de terceros (ver sección 5).
            </p>
          </section>

          {/* Terceros que procesan datos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Terceros que procesan datos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Para ofrecer el servicio, enviamos datos temporalmente a estos proveedores:
            </p>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Deepgram (Estados Unidos)
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Qué enviamos:</strong> Audio en tiempo real (streaming)<br />
                  <strong>Para qué:</strong> Transcripción de voz a texto<br />
                  <strong>Retención:</strong> NO almacenan el audio. Procesamiento en tiempo real únicamente.<br />
                  <strong>Política:</strong> <a href="https://deepgram.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">deepgram.com/privacy</a>
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Anthropic (Estados Unidos)
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Qué enviamos:</strong> Transcripciones de texto + contexto de conversación<br />
                  <strong>Para qué:</strong> Análisis con IA (Claude) para generar sugerencias<br />
                  <strong>Retención:</strong> 30 días según su política de datos empresariales.<br />
                  <strong>Política:</strong> <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">anthropic.com/privacy</a>
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Resend (Estados Unidos)
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Qué enviamos:</strong> Email + transcripción de sesión<br />
                  <strong>Para qué:</strong> Enviarte el resumen de tu sesión por correo<br />
                  <strong>Retención:</strong> Logs de emails por 30 días.<br />
                  <strong>Política:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com/legal/privacy-policy</a>
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Posthog EU (Unión Europea)
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Qué enviamos:</strong> Eventos anónimos de uso (ej: "sesión iniciada")<br />
                  <strong>Para qué:</strong> Analytics y mejora del producto<br />
                  <strong>Retención:</strong> Datos agregados y anónimos. Región EU.<br />
                  <strong>Política:</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">posthog.com/privacy</a>
                </p>
              </div>
            </div>
          </section>

          {/* Cuánto tiempo guardamos tus datos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Cuánto tiempo guardamos tus datos
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Transcripciones y sugerencias:</strong> Indefinidamente, hasta que decidas eliminarlas desde tu dashboard o solicites la eliminación de tu cuenta.
              </li>
              <li>
                <strong>Device fingerprint:</strong> Hasta que limpies los datos de la extensión en Chrome.
              </li>
              <li>
                <strong>Cuenta de usuario:</strong> Hasta que solicites la eliminación de tu cuenta.
              </li>
              <li>
                <strong>Logs de servidor:</strong> 90 días máximo (solo para debugging).
              </li>
            </ul>
          </section>

          {/* Tus derechos (RGPD) */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Tus derechos (RGPD)
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bajo el RGPD, tienes los siguientes derechos:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">
                  ✅ Derecho de Acceso
                </h4>
                <p className="text-sm text-slate-700">
                  Puedes descargar todas tus transcripciones y sugerencias desde el dashboard en cualquier momento.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  ✅ Derecho de Rectificación
                </h4>
                <p className="text-sm text-slate-700">
                  Si detectas un error en tus datos, puedes solicitar su corrección enviando un email a <a href="mailto:privacy@tryconfident.com" className="text-blue-600 hover:underline">privacy@tryconfident.com</a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  ✅ Derecho de Cancelación (Eliminación)
                </h4>
                <p className="text-sm text-slate-700">
                  Puedes eliminar sesiones individuales desde el dashboard o solicitar la eliminación completa de tu cuenta contactando a <a href="mailto:privacy@tryconfident.com" className="text-blue-600 hover:underline">privacy@tryconfident.com</a>. Eliminaremos todos tus datos en un plazo de 30 días.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  ✅ Derecho de Oposición
                </h4>
                <p className="text-sm text-slate-700">
                  Puedes oponerte al procesamiento de tus datos en cualquier momento dejando de usar el servicio.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  ✅ Derecho de Portabilidad
                </h4>
                <p className="text-sm text-slate-700">
                  Puedes exportar tus transcripciones en formato JSON desde el dashboard.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-6">
              <p className="text-purple-900 font-semibold mb-2">
                📧 Solicitudes ARCO (Acceso, Rectificación, Cancelación, Oposición)
              </p>
              <p className="text-purple-800 text-sm">
                Para ejercer cualquiera de estos derechos, envía un email a <a href="mailto:privacy@tryconfident.com" className="underline">privacy@tryconfident.com</a> con el asunto "Solicitud ARCO" y te responderemos en un plazo máximo de 30 días.
              </p>
            </div>
          </section>

          {/* Cookies y Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Cookies y Tracking
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Usamos las siguientes tecnologías de tracking:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Cookies de sesión (Supabase Auth):</strong> Para mantener tu sesión iniciada. Esenciales para el funcionamiento del servicio.
              </li>
              <li>
                <strong>Local Storage (chrome.storage):</strong> Para guardar tu device fingerprint y preferencias locales en la extensión.
              </li>
              <li>
                <strong>Posthog (Analytics):</strong> Para medir el uso del producto de forma agregada y anónima. Puedes desactivar el tracking instalando una extensión anti-tracking.
              </li>
            </ul>
          </section>

          {/* Seguridad */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              9. Seguridad de tus datos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Implementamos las siguientes medidas de seguridad:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Cifrado en tránsito:</strong> Todas las comunicaciones usan HTTPS/WSS (TLS 1.3).
              </li>
              <li>
                <strong>Cifrado en reposo:</strong> Los datos en Supabase están cifrados en disco.
              </li>
              <li>
                <strong>Row Level Security (RLS):</strong> Solo tú puedes acceder a tus propias transcripciones y sugerencias.
              </li>
              <li>
                <strong>Autenticación OAuth:</strong> No guardamos contraseñas. Usamos Google OAuth.
              </li>
              <li>
                <strong>Sin XSS:</strong> Construcción manual del DOM para evitar ataques de inyección.
              </li>
            </ul>
          </section>

          {/* Menores de edad */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              10. Menores de edad
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Confident está diseñado para adultos (18+) en contextos profesionales. No recopilamos conscientemente datos de menores de 16 años. Si detectamos que un menor ha creado una cuenta, eliminaremos sus datos inmediatamente.
            </p>
          </section>

          {/* Cambios en esta política */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              11. Cambios en esta política
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos por email (si tienes cuenta) o mediante un aviso en la extensión. La fecha de "Última actualización" al inicio del documento indica la versión vigente.
            </p>
          </section>

          {/* Contacto */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              12. Contacto
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Si tienes preguntas sobre esta Política de Privacidad o quieres ejercer tus derechos RGPD:
            </p>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-slate-900 font-semibold">
                Confident
              </p>
              <p className="text-slate-700 text-sm mt-2">
                Email: <a href="mailto:privacy@tryconfident.com" className="text-blue-600 hover:underline">privacy@tryconfident.com</a><br />
                Respuesta en: Máximo 30 días hábiles<br />
                Protección de Datos: Cumplimiento RGPD (UE)
              </p>
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
                href="/terms"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Términos de Servicio
              </Link>
              <span className="text-slate-300">|</span>
              <a
                href="mailto:privacy@tryconfident.com"
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
