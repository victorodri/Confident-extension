#!/bin/bash

# Test Deepgram API con curl
# Esto verifica si la API key funciona para streaming

echo "🧪 Test Deepgram API Key"
echo "========================"
echo ""

# Pide la API key
read -p "Pega tu API key de Deepgram: " API_KEY

if [ -z "$API_KEY" ]; then
  echo "❌ ERROR: API key vacía"
  exit 1
fi

echo ""
echo "📡 Probando API REST (GET /projects)..."
echo ""

# Test 1: API REST para verificar que la key es válida
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Token $API_KEY" \
  https://api.deepgram.com/v1/projects)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ API key válida - REST funciona"
  echo "Respuesta: $BODY" | head -c 200
  echo "..."
  echo ""
else
  echo "❌ API key inválida o sin permisos"
  echo "HTTP Code: $HTTP_CODE"
  echo "Respuesta: $BODY"
  exit 1
fi

echo ""
echo "📡 Probando STREAMING con archivo de audio..."
echo ""

# Test 2: Streaming con un archivo de audio de prueba
# Deepgram acepta POST a /v1/listen con audio
# Vamos a generar 1 segundo de silencio en PCM16

# Crear 1 segundo de silencio (16000 samples * 2 bytes = 32000 bytes de ceros)
dd if=/dev/zero bs=32000 count=1 2>/dev/null > /tmp/test-audio.raw

# Hacer streaming del audio
STREAM_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Token $API_KEY" \
  -H "Content-Type: audio/raw" \
  "https://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000" \
  --data-binary @/tmp/test-audio.raw)

STREAM_HTTP_CODE=$(echo "$STREAM_RESPONSE" | tail -n1)
STREAM_BODY=$(echo "$STREAM_RESPONSE" | head -n-1)

echo "HTTP Code: $STREAM_HTTP_CODE"

if [ "$STREAM_HTTP_CODE" = "200" ]; then
  echo "✅ STREAMING FUNCIONA - La API key tiene permisos correctos"
  echo "Respuesta: $STREAM_BODY"
  echo ""
  echo "🎯 CONCLUSIÓN: El problema es la configuración de WebSocket, NO la API key"
  echo ""
  echo "Posibles causas del error 1006 en WebSocket:"
  echo "  1. Deepgram bloquea WebSocket desde file:// o localhost sin HTTPS"
  echo "  2. CORS configurado en tu cuenta de Deepgram"
  echo "  3. Restricciones de dominio en la API key"
  echo ""
  echo "SOLUCIÓN:"
  echo "  → Ir a https://console.deepgram.com/project/keys"
  echo "  → Eliminar la API key actual"
  echo "  → Crear una NUEVA API key con:"
  echo "     - Permisos: Member o Owner"
  echo "     - SIN restricciones de dominio"
  echo "     - Todos los scopes habilitados"
else
  echo "❌ STREAMING NO FUNCIONA"
  echo "Respuesta: $STREAM_BODY"
  echo ""
  echo "🎯 CONCLUSIÓN: La API key NO tiene permisos para transcripción"
  echo ""
  echo "SOLUCIÓN:"
  echo "  1. Ir a https://console.deepgram.com/project/keys"
  echo "  2. Crear una NUEVA API key"
  echo "  3. Asegúrate de seleccionar TODOS los permisos/scopes"
  echo "  4. Especialmente: 'usage:write' y 'transcription:*'"
fi

# Limpiar
rm -f /tmp/test-audio.raw

echo ""
echo "========================"
echo "Test completado"
