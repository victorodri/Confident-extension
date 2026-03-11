import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      console.error('[/api/transcribe-stream] DEEPGRAM_API_KEY no configurada');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Leer audio PCM16 del body
    const audioBuffer = await request.arrayBuffer();

    if (audioBuffer.byteLength === 0) {
      console.log('[/api/transcribe-stream] Audio vacío, ignorando');
      return NextResponse.json({ transcript: '', isFinal: false });
    }

    console.log('[/api/transcribe-stream] Recibido audio:', audioBuffer.byteLength, 'bytes');

    // Enviar a Deepgram REST API (prerecorded)
    // IMPORTANTE: Especificar formato de audio raw PCM16
    const deepgramResponse = await fetch(
      'https://api.deepgram.com/v1/listen?model=nova-2&language=es&punctuate=true&diarize=false&encoding=linear16&sample_rate=16000&channels=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/raw',
        },
        body: audioBuffer,
      }
    );

    if (!deepgramResponse.ok) {
      const errorText = await deepgramResponse.text();
      console.error('[/api/transcribe-stream] Deepgram error:', deepgramResponse.status, errorText);
      return NextResponse.json({ error: 'Deepgram error' }, { status: 500 });
    }

    const deepgramData = await deepgramResponse.json();
    const transcript = deepgramData.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    console.log('[/api/transcribe-stream] Transcripción:', transcript.substring(0, 100));

    return NextResponse.json({
      transcript,
      isFinal: true,
    });
  } catch (error) {
    console.error('[/api/transcribe-stream] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
