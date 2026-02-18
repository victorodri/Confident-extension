import { anthropic, getSystemPrompt, type UserProfile } from '@/lib/claude';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, profile, context, session_type } = body;

    // Validar campos obligatorios
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Campo "text" obligatorio' }, { status: 400 });
    }

    const activeProfile: UserProfile =
      profile === 'candidato' || profile === 'vendedor' || profile === 'defensor'
        ? profile
        : 'candidato';

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 350,
      system: getSystemPrompt(activeProfile),
      messages: [
        {
          role: 'user',
          content: `Perfil activo: ${activeProfile}
Tipo de sesión: ${session_type ?? 'general'}

Contexto previo (últimas 3 frases para mantener hilo):
${context ?? '(sin contexto previo)'}

Fragmento actual a analizar:
"${text}"`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (err) {
    console.error('[/api/analyze] Error:', err);
    return Response.json(
      { error: 'Error interno al procesar la solicitud' },
      { status: 500 }
    );
  }
}
