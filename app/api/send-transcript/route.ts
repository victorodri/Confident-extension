// app/api/send-transcript/route.ts
// Endpoint para enviar transcripción por email al finalizar sesión

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, sessionId, profile, transcriptText, suggestionsCount, duration } = body;

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un destinatario en el campo "to"' },
        { status: 400 }
      );
    }

    if (!transcriptText || typeof transcriptText !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere el campo "transcriptText"' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hola@tryconfident.com';

    // Crear email HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .transcript { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; max-height: 400px; overflow-y: auto; }
    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .privacy { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Confident — Transcripción de tu sesión</h1>
      <p>Perfil: ${profile === 'candidato' ? '🎓 Candidato' : profile === 'vendedor' ? '💼 Vendedor' : '🛡️ Defensor'}</p>
    </div>

    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${suggestionsCount || 0}</div>
          <div class="stat-label">Sugerencias</div>
        </div>
        <div class="stat">
          <div class="stat-value">${duration || 0}</div>
          <div class="stat-label">Minutos</div>
        </div>
      </div>

      <h2>📝 Transcripción completa</h2>
      <div class="transcript">
        ${transcriptText.replace(/\n/g, '<br>')}
      </div>

      <div class="privacy">
        ⚠️ <strong>Privacidad y RGPD:</strong> Esta transcripción está almacenada de forma segura.
        Puedes solicitar su eliminación en cualquier momento desde tu dashboard.
      </div>

      <div style="text-align: center;">
        <a href="${appUrl}/dashboard" class="button">Ver en Dashboard</a>
        <a href="${appUrl}/dashboard?session=${sessionId}" class="button" style="background: #6b7280;">Eliminar datos (ARCO)</a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Confident</strong> — Tu confidente en cada conversación importante<br>
        Solo texto, no audio • RGPD • Datos en Frankfurt (EU)
      </p>
      <p>
        ¿Preguntas? <a href="mailto:${fromEmail}">${fromEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: `Confident <${fromEmail}>`,
      to,
      subject: `🎯 Transcripción de tu sesión ${profile === 'candidato' ? 'de entrevista' : profile === 'vendedor' ? 'comercial' : 'técnica'}`,
      html,
    });

    if (error) {
      console.error('[Send Transcript] Error Resend:', error);
      return NextResponse.json(
        { error: 'Error al enviar email', details: error },
        { status: 500 }
      );
    }

    console.log('[Send Transcript] ✅ Email enviado:', data?.id);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      recipients: to.length
    });

  } catch (err: any) {
    console.error('[Send Transcript] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}
