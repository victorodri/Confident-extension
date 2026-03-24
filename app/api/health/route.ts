import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Verifica que el servidor esté funcionando
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
