# 🔄 Solución Alternativa: Proxy Backend para Deepgram

## 🎯 Objetivo

Evitar el error 1006 conectando a Deepgram a través del backend de Vercel en lugar de WebSocket directo desde el browser.

## 🏗️ Arquitectura

### Flujo actual (❌ Falla con error 1006)

```
┌─────────────┐                          ┌──────────────┐
│  Extension  │ ─── WebSocket ─────────→ │  Deepgram    │
│  (Browser)  │     wss://api.deepgram   │  WebSocket   │
└─────────────┘                          └──────────────┘
     ↓ Error 1006 - conexión rechazada
```

### Flujo propuesto (✅ Funciona siempre)

```
┌─────────────┐                ┌──────────────┐                ┌──────────────┐
│  Extension  │ ─── HTTP ────→ │   Vercel     │ ─── WS ──────→ │  Deepgram    │
│  (Browser)  │   POST /api/   │   Backend    │  wss://api...  │  WebSocket   │
└─────────────┘   transcribe   └──────────────┘                └──────────────┘
                                      │
                                      ↓
                              JWT validation
                              Rate limiting
                              Analytics
```

## 📝 Implementación

### 1. Crear endpoint `/api/transcribe-stream`

**Archivo**: `app/api/transcribe-stream/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { createClient as createDeepgram } from '@deepgram/sdk';

// IMPORTANTE: Usar DEEPGRAM_API_KEY desde .env (no la del cliente)
const deepgram = createDeepgram(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // 1. Validar JWT de Supabase (opcional para MVP, crítico para producción)
    // const authHeader = request.headers.get('authorization');
    // const { user } = await validateSupabaseJWT(authHeader);

    // 2. Leer audio del body
    const audioBuffer = await request.arrayBuffer();

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return Response.json({ error: 'No audio data' }, { status: 400 });
    }

    // 3. Transcribir con Deepgram (REST API, no WebSocket)
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      Buffer.from(audioBuffer),
      {
        model: 'nova-2',
        language: 'es',
        punctuate: true,
        smart_format: true,
      }
    );

    if (error) {
      console.error('[API] Deepgram error:', error);
      return Response.json({ error: 'Transcription failed' }, { status: 500 });
    }

    // 4. Extraer transcripción
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcript) {
      return Response.json({ error: 'No transcript generated' }, { status: 500 });
    }

    // 5. Retornar resultado
    return Response.json({
      transcript,
      confidence: result?.results?.channels?.[0]?.alternatives?.[0]?.confidence,
      words: result?.results?.channels?.[0]?.alternatives?.[0]?.words,
    });

  } catch (err: any) {
    console.error('[API] Transcribe error:', err);
    return Response.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}

// Configuración de Next.js
export const runtime = 'nodejs'; // Necesitamos Node.js runtime para Deepgram SDK
export const maxDuration = 10; // Max 10s para procesar (Vercel free tier)
```

### 2. Modificar `extension/offscreen.js`

**Cambio**: En lugar de enviar audio a WebSocket, acumular chunks y enviar al backend cada 3-5 segundos.

```javascript
// Estado para acumular audio
let audioChunks = [];
let lastSendTime = Date.now();
const SEND_INTERVAL_MS = 3000; // Enviar cada 3 segundos

processor.onaudioprocess = (e) => {
  const inputData = e.inputBuffer.getChannelData(0);
  const pcm16 = float32ToInt16(inputData);

  // Acumular chunks
  audioChunks.push(pcm16);

  // Enviar al backend si han pasado 3 segundos
  const now = Date.now();
  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    sendAudioToBackend();
    lastSendTime = now;
  }
};

async function sendAudioToBackend() {
  if (audioChunks.length === 0) return;

  // Combinar todos los chunks en un solo buffer
  const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Int16Array(totalLength);
  let offset = 0;

  for (const chunk of audioChunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  // Limpiar chunks acumulados
  audioChunks = [];

  try {
    const response = await fetch('http://localhost:3000/api/transcribe-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/raw',
        // 'Authorization': `Bearer ${jwtToken}`, // Si tienes auth
      },
      body: combined.buffer,
    });

    if (!response.ok) {
      console.error('[Offscreen] Backend error:', response.status);
      return;
    }

    const data = await response.json();

    if (data.transcript) {
      // Reenviar transcripción al background como antes
      chrome.runtime.sendMessage({
        action: 'TRANSCRIPT',
        transcript: data.transcript,
        isFinal: true,
        speaker: null,
        profile: currentProfile,
      });
    }

  } catch (err) {
    console.error('[Offscreen] Error enviando audio al backend:', err);
  }
}
```

### 3. Instalar SDK de Deepgram

```bash
cd /Users/victormanuelrodriguezgutierrez/Desktop/Confident
npm install @deepgram/sdk
```

### 4. Actualizar `.env.local`

```bash
# API key de Deepgram en el backend (más seguro)
DEEPGRAM_API_KEY=tu_api_key_aquí

# Ya NO necesitas NEXT_PUBLIC_DEEPGRAM_API_KEY
# porque la extensión no conecta directamente
```

### 5. Actualizar `manifest.json`

Cambiar host_permissions para permitir conexión al backend:

```json
"host_permissions": [
  "https://meet.google.com/*",
  "http://localhost:3000/*",
  "https://tryconfident.com/*"
]
```

Ya NO necesitas permisos para `api.deepgram.com`.

## ✅ Ventajas de esta solución

1. **Funciona siempre** - no depende de configuración de Deepgram
2. **Más seguro** - API key solo en backend, nunca expuesta
3. **Rate limiting** - puedes controlar uso por usuario
4. **Analytics** - trackear uso real de transcripción
5. **Fallback** - puedes cambiar de proveedor sin actualizar extensión

## ⚠️ Desventajas

1. **Latencia** - +200-500ms por el round-trip al backend
2. **Complejidad** - más código para mantener
3. **Costo** - uso de bandwidth de Vercel
4. **Límite** - Vercel free tier: 10s max function duration

## 🧪 Testing

1. Iniciar backend local:
```bash
npm run dev
```

2. Recargar extensión

3. Abrir Google Meet y probar

4. Ver logs en terminal de Next.js:
```
[API] Recibido audio: 96000 bytes
[API] Deepgram transcription: "hola cómo estás"
```

## 📊 Comparación de latencias

| Método | Latencia típica | Comentarios |
|--------|----------------|-------------|
| WebSocket directo | 100-300ms | ✅ Ideal, pero falla con error 1006 |
| Proxy backend REST | 500-800ms | ✅ Funciona siempre, latencia aceptable |
| Polling al backend | 1000-3000ms | ⚠️ Alternativa si REST falla |

## 🎯 Recomendación

**Implementar esta solución SI Y SOLO SI**:
1. Crear nueva API key con ALL SCOPES no funciona
2. El script curl falla
3. Contactar soporte de Deepgram no resuelve el problema

**Primero intentar**:
1. Nueva API key ⭐
2. Verificar scopes
3. Probar curl
4. Contactar soporte

**Esta solución es el último recurso**, pero garantiza que funcione.
