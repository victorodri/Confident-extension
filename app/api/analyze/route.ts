import { anthropic, getSystemPrompt, SUGGESTION_SCHEMA, type UserProfile, type UserContext } from '@/lib/claude';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, profile, context, session_type, anonymous_id } = body;

    // Validar campos obligatorios
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Campo "text" obligatorio' }, { status: 400 });
    }

    const activeProfile: UserProfile =
      profile === 'candidato' || profile === 'vendedor' || profile === 'defensor'
        ? profile
        : 'candidato';

    // Obtener contexto personalizado del usuario (si existe)
    let userContext: UserContext | null = null;

    if (anonymous_id) {
      try {
        const supabase = await createClient();

        // Intentar obtener usuario autenticado primero
        const { data: { user } } = await supabase.auth.getUser();

        let profile_data;
        if (user) {
          // Usuario autenticado
          const { data } = await supabase
            .from('profiles')
            .select('user_context')
            .eq('id', user.id)
            .single();
          profile_data = data;
        } else {
          // Usuario anónimo
          const { data } = await supabase
            .from('profiles')
            .select('user_context')
            .eq('anonymous_id', anonymous_id)
            .single();
          profile_data = data;
        }

        if (profile_data?.user_context) {
          userContext = profile_data.user_context;
          console.log('[/api/analyze] User context loaded:', userContext);
        }
      } catch (err) {
        // Si falla obtener el contexto, continuar sin él
        console.log('[/api/analyze] Could not load user context:', err);
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 350,
      system: getSystemPrompt(activeProfile, userContext),
      output_config: {
        format: {
          type: 'json_schema',
          schema: SUGGESTION_SCHEMA
        }
      },
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

    // Con structured outputs, el JSON está garantizado como válido
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (err) {
    // Logging detallado para debugging
    console.error('[/api/analyze] Error completo:', err);

    if (err instanceof SyntaxError) {
      // Error de parsing JSON (no debería ocurrir con structured outputs)
      console.error('[/api/analyze] JSON inválido recibido:', err.message);
      return Response.json(
        { error: 'Respuesta inválida de la IA' },
        { status: 500 }
      );
    }

    if (err instanceof Anthropic.APIError) {
      // Error de la API de Anthropic
      console.error('[/api/analyze] Error API Anthropic:', {
        status: err.status,
        message: err.message
      });

      return Response.json(
        { error: `Error de API: ${err.message}` },
        { status: err.status ?? 500 }
      );
    }

    // Otros errores
    return Response.json(
      { error: 'Error interno al procesar la solicitud' },
      { status: 500 }
    );
  }
}
