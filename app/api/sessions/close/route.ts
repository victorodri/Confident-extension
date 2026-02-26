// app/api/sessions/close/route.ts
// Endpoint para cerrar sesión y generar resumen IA

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { anthropic, getSessionSummaryPrompt, SESSION_SUMMARY_SCHEMA, type UserProfile } from '@/lib/claude';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SessionSummary {
  executive_summary: string;
  key_points: string[];
  recommendations: string[];
  learnings: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'Se requiere el campo "session_id"' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Obtener sesión de Supabase
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      console.error('[Close Session] Error al obtener sesión:', sessionError);
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // 2. Obtener todas las transcripciones de la sesión
    const { data: transcriptions, error: transError } = await supabase
      .from('transcriptions')
      .select('text, speaker, timestamp_ms, created_at')
      .eq('session_id', session_id)
      .order('timestamp_ms', { ascending: true });

    if (transError) {
      console.error('[Close Session] Error al obtener transcripciones:', transError);
      return NextResponse.json(
        { error: 'Error al obtener transcripciones' },
        { status: 500 }
      );
    }

    const transcriptText = (transcriptions || [])
      .map(t => `[${t.speaker}] ${t.text}`)
      .join('\n');

    // 3. Generar resumen con Claude (solo si hay contenido)
    let summary: SessionSummary | null = null;

    if (transcriptText.trim().length > 50) {
      try {
        const profile = session.profile as UserProfile;
        const systemPrompt = getSessionSummaryPrompt(profile);

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Transcripción completa de la conversación:\n\n${transcriptText}`
            }
          ],
          tool_choice: {
            type: 'tool',
            name: 'generate_summary'
          },
          tools: [
            {
              name: 'generate_summary',
              description: 'Generate a structured summary of the session',
              input_schema: SESSION_SUMMARY_SCHEMA
            }
          ]
        });

        const toolUse = response.content.find(block => block.type === 'tool_use');
        if (toolUse && toolUse.type === 'tool_use') {
          summary = toolUse.input as SessionSummary;
        }

        console.log('[Close Session] ✅ Resumen generado con Claude');
      } catch (claudeError: any) {
        console.error('[Close Session] Error al generar resumen con Claude:', claudeError.message);
        // No fallar si Claude falla — continuar sin resumen
      }
    } else {
      console.log('[Close Session] Transcripción muy corta, no se genera resumen');
    }

    // 4. Actualizar sesión con status='completed' y calcular duración
    const endedAt = new Date();
    const startedAt = new Date(session.started_at);
    const durationSeconds = Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);

    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        status: 'completed',
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        summary: summary || null // Guardar resumen IA en JSONB
      })
      .eq('id', session_id);

    if (updateError) {
      console.error('[Close Session] Error al actualizar sesión:', updateError);
      // No retornar error — continuar con el flujo
    }

    // 5. Enviar email con resumen (si hay participantes)
    const participantEmails = session.participants_emails || [];

    if (participantEmails.length > 0 && transcriptText.trim().length > 0) {
      try {
        await sendSummaryEmail({
          to: participantEmails,
          profile: session.profile as UserProfile,
          sessionId: session_id,
          transcriptText,
          summary,
          suggestionsCount: session.suggestions_count || 0,
          durationMinutes: Math.round(durationSeconds / 60)
        });
        console.log('[Close Session] ✅ Email con resumen enviado');
      } catch (emailError: any) {
        console.error('[Close Session] Error al enviar email:', emailError.message);
        // No fallar si el email falla
      }
    }

    // 6. Retornar resumen al cliente
    return NextResponse.json({
      success: true,
      session_id,
      summary,
      duration_seconds: durationSeconds
    });

  } catch (err: any) {
    console.error('[Close Session] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: err.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Helper para enviar email con resumen
// ─────────────────────────────────────────────────────────────

interface EmailParams {
  to: string[];
  profile: UserProfile;
  sessionId: string;
  transcriptText: string;
  summary: SessionSummary | null;
  suggestionsCount: number;
  durationMinutes: number;
}

async function sendSummaryEmail(params: EmailParams) {
  const { to, profile, sessionId, transcriptText, summary, suggestionsCount, durationMinutes } = params;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hola@tryconfident.com';

  const profileEmoji = profile === 'candidato' ? '🎓' : profile === 'vendedor' ? '💼' : '🛡️';
  const profileName = profile === 'candidato' ? 'Candidato' : profile === 'vendedor' ? 'Vendedor' : 'Defensor';

  // Template HTML con o sin resumen
  const html = summary ? buildEmailWithSummary(params, profileEmoji, profileName, appUrl, fromEmail) : buildSimpleEmail(params, profileEmoji, profileName, appUrl, fromEmail);

  const { data, error } = await resend.emails.send({
    from: `Confident <${fromEmail}>`,
    to,
    subject: `🎯 Resumen de tu sesión ${profile === 'candidato' ? 'de entrevista' : profile === 'vendedor' ? 'comercial' : 'técnica'}`,
    html,
  });

  if (error) {
    throw new Error(`Error al enviar email: ${error.message}`);
  }

  return data;
}

function buildEmailWithSummary(params: EmailParams, profileEmoji: string, profileName: string, appUrl: string, fromEmail: string): string {
  const { summary, suggestionsCount, durationMinutes, transcriptText, sessionId } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .content { background: #ffffff; padding: 30px 20px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 20px; font-weight: 600; color: #667eea; margin-bottom: 15px; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; background: #f9fafb; padding: 20px; border-radius: 8px; }
    .stat { text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .summary-box { background: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 15px 0; border-radius: 4px; }
    .key-point { background: white; border: 1px solid #e5e7eb; padding: 12px; margin: 8px 0; border-radius: 6px; }
    .recommendation { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 12px; margin: 8px 0; border-radius: 4px; }
    .transcript { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; max-height: 300px; overflow-y: auto; font-size: 13px; }
    details { margin: 20px 0; }
    summary { cursor: pointer; font-weight: 600; color: #667eea; padding: 10px; background: #f9fafb; border-radius: 6px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; font-size: 12px; color: #6b7280; }
    ul, ol { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${profileEmoji} Confident — Resumen de tu sesión</h1>
      <p>Perfil: ${profileName}</p>
    </div>

    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${suggestionsCount}</div>
          <div class="stat-label">Sugerencias</div>
        </div>
        <div class="stat">
          <div class="stat-value">${durationMinutes}</div>
          <div class="stat-label">Minutos</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📊 Resumen Ejecutivo</div>
        <div class="summary-box">
          ${summary!.executive_summary.replace(/\n/g, '<br>')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">🎯 Puntos Clave</div>
        ${summary!.key_points.map(point => `<div class="key-point">• ${point}</div>`).join('')}
      </div>

      <div class="section">
        <div class="section-title">💡 Recomendaciones</div>
        <ol>
          ${summary!.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ol>
      </div>

      <div class="section">
        <div class="section-title">📈 Aprendizajes</div>
        <div class="summary-box">
          ${summary!.learnings.replace(/\n/g, '<br>')}
        </div>
      </div>

      <details>
        <summary>📝 Ver transcripción completa</summary>
        <div class="transcript">
          ${transcriptText.replace(/\n/g, '<br>')}
        </div>
      </details>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${appUrl}/dashboard" class="button">Ver en Dashboard</a>
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
}

function buildSimpleEmail(params: EmailParams, profileEmoji: string, profileName: string, appUrl: string, fromEmail: string): string {
  const { suggestionsCount, durationMinutes, transcriptText, sessionId } = params;

  return `
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${profileEmoji} Confident — Transcripción de tu sesión</h1>
      <p>Perfil: ${profileName}</p>
    </div>

    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${suggestionsCount || 0}</div>
          <div class="stat-label">Sugerencias</div>
        </div>
        <div class="stat">
          <div class="stat-value">${durationMinutes || 0}</div>
          <div class="stat-label">Minutos</div>
        </div>
      </div>

      <h2>📝 Transcripción completa</h2>
      <div class="transcript">
        ${transcriptText.replace(/\n/g, '<br>')}
      </div>

      <div style="text-align: center;">
        <a href="${appUrl}/dashboard" class="button">Ver en Dashboard</a>
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
}
