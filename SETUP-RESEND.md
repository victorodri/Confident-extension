# Setup Resend — Confident

## 🔴 ACCIÓN REQUERIDA — Configurar Resend para emails

Los emails de transcripción **NO se están enviando** porque falta configurar Resend.

---

## Paso 1: Crear cuenta en Resend

1. **Ir a https://resend.com**
2. **Sign Up** (gratis - 3,000 emails/mes)
3. **Verificar email**

---

## Paso 2: Obtener API Key

1. En dashboard de Resend → **API Keys** (menú izquierdo)
2. **Create API Key**
3. Nombre: `Confident MVP`
4. Permiso: `Full Access`
5. **Copiar la clave** (empieza con `re_...`)

---

## Paso 3: Configurar dominio (TEMPORAL - desarrollo)

Para MVP puedes usar **dominio de desarrollo de Resend**:

- Resend te da `onboarding@resend.dev` para testing
- Este dominio tiene límite de 100 emails/día
- Solo puedes enviar a TU propio email verificado

### Verificar tu email personal:

1. En Resend Dashboard → **Domains** → **onboarding@resend.dev**
2. Ir a **Recipients**
3. Agregar tu email personal → verificar con el link que te envían

---

## Paso 4: Agregar variables al .env.local

Abre `/Confident/.env.local` y agrega/actualiza:

```bash
# Resend (email transaccional) — PRIVADA
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Para desarrollo usa el dominio de onboarding
RESEND_FROM_EMAIL=onboarding@resend.dev

# (O usa tu email verificado como remitente)
# RESEND_FROM_EMAIL=tuemail@example.com
```

---

## Paso 5: Reiniciar servidor Next.js

```bash
# En la terminal donde corre el servidor
Ctrl+C  # detener

npm run dev  # volver a iniciar
```

---

## Paso 6: Testear envío de email

### Opción A: Desde extensión

1. Instala/recarga extensión
2. Abre Google Meet
3. Configura perfil + checkbox + **AGREGA TU EMAIL** en el campo de participantes
4. Inicia sesión → habla algo → detén sesión
5. Verifica tu bandeja de entrada (puede tardar ~30s)

### Opción B: Desde terminal (test rápido)

```bash
curl -X POST http://localhost:3000/api/send-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["tuemail@example.com"],
    "profile": "candidato",
    "transcriptText": "Esta es una prueba de transcripción.\nSegunda línea de prueba.",
    "suggestionsCount": 5,
    "duration": 12
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "emailId": "re_...",
  "recipients": 1
}
```

---

## ✅ Verificación

Si el email NO llega:

1. **Revisa logs del servidor** (`npm run dev`)
   - Buscar `[Send Transcript] ✅ Email enviado`
   - Si hay error, leer el mensaje

2. **Verifica la API key**
   - Debe empezar con `re_`
   - No debe tener espacios
   - Debe estar en `.env.local` (NO en `.env.example`)

3. **Verifica el dominio remitente**
   - Si usas `onboarding@resend.dev` → el email destino DEBE estar verificado en Resend
   - Ir a Resend → Domains → onboarding@resend.dev → Recipients
   - Agregar y verificar tu email

4. **Revisa spam**
   - Los emails de desarrollo suelen caer en spam

---

## 🚀 Producción (después del MVP)

Para producción necesitarás:

1. **Dominio propio verificado** (tryconfident.com)
   - Resend → Add Domain → `tryconfident.com`
   - Agregar registros DNS (SPF, DKIM, DMARC)

2. **Actualizar `.env.local`:**
   ```bash
   RESEND_FROM_EMAIL=hola@tryconfident.com
   ```

3. **Plan de pago** (si > 3K emails/mes)

---

## 📧 Template del email

El email actual incluye:

- ✅ Header con gradiente violeta
- ✅ Stats (sugerencias + duración)
- ✅ Transcripción completa formateada
- ✅ Banner RGPD con advertencia
- ✅ Botones: "Ver en Dashboard" + "Eliminar datos (ARCO)"
- ✅ Footer con contacto

Ver código completo en: `app/api/send-transcript/route.ts`
