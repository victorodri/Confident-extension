import { NextRequest } from 'next/server';
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

// Función para crear un WAV header válido para PCM16
function createWavHeader(audioLength: number, sampleRate = 16000, numChannels = 1): Buffer {
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + audioLength, 4); // file size - 8
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // audio format (1 = PCM)
  header.writeUInt16LE(numChannels, 22); // number of channels
  header.writeUInt32LE(sampleRate, 24); // sample rate
  header.writeUInt32LE(sampleRate * numChannels * 2, 28); // byte rate
  header.writeUInt16LE(numChannels * 2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(audioLength, 40); // data size

  return header;
}

export async function POST(request: NextRequest) {
  try {
    // Leer audio del body
    const audioBuffer = await request.arrayBuffer();

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return Response.json({ error: 'No audio data' }, { status: 400 });
    }

    console.log('[API] Recibido audio:', audioBuffer.byteLength, 'bytes');

    // Crear WAV con header válido
    const pcmData = Buffer.from(audioBuffer);
    const wavHeader = createWavHeader(pcmData.length, 16000, 1);
    const wavFile = Buffer.concat([wavHeader, pcmData]);

    console.log('[API] WAV creado:', wavFile.length, 'bytes (header:', wavHeader.length, '+ data:', pcmData.length, ')');
    console.log('[API] Llamando a Deepgram...');

    // Transcribir con Deepgram REST API
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      wavFile,
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

    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();

    if (!transcript) {
      // Sin transcripción = silencio, devolver vacío sin error
      return Response.json({ transcript: '', confidence: 0 });
    }

    console.log('[API] Deepgram transcripción:', transcript);

    return Response.json({
      transcript,
      confidence: result?.results?.channels?.[0]?.alternatives?.[0]?.confidence,
    });

  } catch (err: any) {
    console.error('[API] Error:', err.message);
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 10;
