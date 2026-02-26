import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar email
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const isDev = process.env.NODE_ENV === 'development';

    // En desarrollo, solo enviamos notificación interna
    // En producción, enviaremos email de confirmación al usuario
    if (!isDev) {
      // Enviar email de confirmación al usuario (solo en producción)
      const { error: userEmailError } = await resend.emails.send({
        from: `Confident <${fromEmail}>`,
        to: email,
        subject: '🎯 Estás en la lista de espera de Confident Pro',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido a la lista de espera! 🎉</h1>
    </div>

    <div class="content">
      <p>Hola <strong>${name}</strong>,</p>

      <p>
        Gracias por unirte a la lista de espera de <strong>Confident Pro</strong>.
        Te avisaremos por email cuando esté disponible.
      </p>

      <h3>¿Qué incluye Confident Pro?</h3>
      <ul>
        <li>✅ <strong>Sesiones ilimitadas</strong> — Sin límites de uso</li>
        <li>✅ <strong>Analytics de rendimiento</strong> — Mejora con datos</li>
        <li>✅ <strong>Soporte prioritario</strong> — Respuesta en 24h</li>
        <li>✅ <strong>Acceso anticipado</strong> — Nuevas features antes que nadie</li>
      </ul>

      <p><strong>Precio:</strong> €19/mes (cancela cuando quieras)</p>

      <div style="text-align: center; margin: 30px 0;">
        <p>Mientras tanto, puedes seguir usando el plan gratuito:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth" class="button">
          Crear cuenta gratis (15 sesiones)
        </a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Confident</strong> — Tu confidente en cada conversación importante<br>
        ¿Preguntas? <a href="mailto:${fromEmail}">${fromEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>
        `.trim(),
      });

      if (userEmailError) {
        console.error('[Waitlist] Error enviando email al usuario:', userEmailError);
        return NextResponse.json(
          { error: 'Error al enviar email de confirmación' },
          { status: 500 }
        );
      }
    }

    // Enviar notificación interna a tu email
    try {
      await resend.emails.send({
        from: `Confident <${fromEmail}>`,
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `🎯 Nueva persona en waitlist Pro: ${name}`,
        html: `
          <h2>Nueva persona en lista de espera</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Entorno:</strong> ${isDev ? 'Desarrollo' : 'Producción'}</p>
        `,
      });
      console.log('[Waitlist] ✅ Notificación interna enviada');
    } catch (err) {
      // No bloquear si falla la notificación interna
      console.warn('[Waitlist] Error enviando notificación interna:', err);
    }

    console.log('[Waitlist] ✅ Usuario añadido:', email);

    return NextResponse.json({
      success: true,
      message: 'Te has unido a la lista de espera correctamente'
    });

  } catch (err: any) {
    console.error('[Waitlist] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}
