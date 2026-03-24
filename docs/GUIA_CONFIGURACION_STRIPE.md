# 🔧 Guía de Configuración Stripe - Paso a Paso

**Fecha**: Marzo 11, 2026
**Tiempo estimado**: 20 minutos

---

## 📋 Pre-requisitos

- [ ] Cuenta de Stripe creada
- [ ] Acceso a Stripe Dashboard (https://dashboard.stripe.com)
- [ ] Acceso a Supabase Dashboard
- [ ] Acceso a Vercel Dashboard

---

## Paso 1: Ejecutar Migración SQL en Supabase (2 minutos)

### 1.1 Abrir Supabase Dashboard
```
https://supabase.com/dashboard
```

### 1.2 Ir a SQL Editor
- Panel izquierdo → "SQL Editor"
- Click en "New query"

### 1.3 Copiar y ejecutar migración
1. Abrir archivo local: `supabase/migrations/add_stripe_integration.sql`
2. Copiar TODO el contenido
3. Pegar en el editor SQL de Supabase
4. Click en "Run" (esquina inferior derecha)
5. ✅ Debe mostrar "Success. No rows returned"

### 1.4 Verificar que se aplicó correctamente
Ejecutar esta query para verificar:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('stripe_customer_id', 'subscription_status', 'current_period_end');
```

Debe retornar 3 filas con esas columnas.

---

## Paso 2: Crear Productos en Stripe Dashboard (5 minutos)

### 2.1 Abrir Stripe Dashboard
```
https://dashboard.stripe.com/products
```

### 2.2 Crear Producto "Confident Pro"

1. Click en **"+ Add product"**
2. Rellenar:
   - **Name**: `Confident Pro`
   - **Description**: `50 sesiones al mes con análisis IA avanzado`
   - **Pricing model**: `Standard pricing`
   - **Price**: `5.00 EUR`
   - **Billing period**: `Monthly`
   - **Payment type**: `Recurring`
3. Click en **"Add product"**

### 2.3 Copiar Price ID del Plan Pro

Una vez creado el producto:
1. En la página del producto, buscar la sección **"Pricing"**
2. Verás algo como: `price_1ABC123...` (empieza con `price_`)
3. **Click en el botón de copiar** (icono clipboard)
4. ✅ **Pegarlo en `.env.local`**:
   ```bash
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1ABC123...
   ```

### 2.4 Crear Producto "Confident Diamond"

Repetir el mismo proceso:
1. Click en **"+ Add product"**
2. Rellenar:
   - **Name**: `Confident Diamond`
   - **Description**: `Sesiones ilimitadas con soporte 24/7`
   - **Pricing model**: `Standard pricing`
   - **Price**: `15.00 EUR`
   - **Billing period**: `Monthly`
   - **Payment type**: `Recurring`
3. Click en **"Add product"**

### 2.5 Copiar Price ID del Plan Diamond

1. Copiar el **Price ID** (empieza con `price_`)
2. ✅ **Pegarlo en `.env.local`**:
   ```bash
   NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID=price_1XYZ789...
   ```

---

## Paso 3: Configurar Webhook en Stripe (5 minutos)

### 3.1 Ir a Webhooks
```
https://dashboard.stripe.com/webhooks
```

### 3.2 Crear Endpoint

1. Click en **"+ Add endpoint"**
2. En **"Endpoint URL"** pegar:
   ```
   https://tryconfident.vercel.app/api/stripe/webhook
   ```

### 3.3 Seleccionar Eventos

En la sección **"Select events to listen to"**, añadir estos 5 eventos:

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

3. Click en **"Add endpoint"**

### 3.4 Copiar Webhook Secret

Una vez creado el webhook:
1. En la página del webhook, buscar la sección **"Signing secret"**
2. Click en **"Reveal"** (o "Click to reveal")
3. Verás algo como: `whsec_ABC123...` (empieza con `whsec_`)
4. Click en **copiar**
5. ✅ **Pegarlo en `.env.local`**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_ABC123...
   ```

---

## Paso 4: Configurar Variables en Vercel (5 minutos)

### 4.1 Abrir Vercel Dashboard
```
https://vercel.com/dashboard
```

### 4.2 Ir a tu proyecto "Confident"
- Click en el proyecto
- Ir a **"Settings"** (tab superior)
- Ir a **"Environment Variables"** (menú izquierdo)

### 4.3 Añadir las 3 variables

Click en **"Add"** para cada una:

**Variable 1**:
- **Key**: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- **Value**: `price_1ABC123...` (el que copiaste antes)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2**:
- **Key**: `NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID`
- **Value**: `price_1XYZ789...` (el que copiaste antes)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

**Variable 3**:
- **Key**: `STRIPE_WEBHOOK_SECRET`
- **Value**: `whsec_ABC123...` (el que copiaste antes)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 4.4 Redeploy

**IMPORTANTE**: Después de añadir variables, debes hacer redeploy:
1. Ir a **"Deployments"** (tab superior)
2. En el último deployment, click en los 3 puntos (⋮)
3. Click en **"Redeploy"**
4. ✅ Esperar a que termine el deploy (~1-2 minutos)

---

## Paso 5: Verificar Configuración Local (1 minuto)

Tu archivo `.env.local` ahora debe tener estas 3 variables con valores reales:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1ABC123...
NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID=price_1XYZ789...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...
```

---

## Paso 6: Testing de Configuración (2 minutos)

### 6.1 Test Webhook

En Stripe Dashboard → Webhooks → tu endpoint:
1. Click en **"Send test webhook"**
2. Seleccionar evento: `checkout.session.completed`
3. Click en **"Send test webhook"**
4. ✅ Debe mostrar "200 OK" en la respuesta

Si falla con "404" o "502":
- Verificar que la URL del webhook es correcta
- Verificar que el deploy de Vercel terminó

### 6.2 Test en Desarrollo Local

```bash
# Terminal 1: Levantar servidor local
npm run dev

# Terminal 2: Verificar que las variables están cargadas
curl http://localhost:3000/api/stripe/webhook
# Debe responder con error 400 (esperado, necesita firma de Stripe)
```

---

## ✅ Checklist Final

Antes de hacer testing end-to-end, verifica:

- [ ] Migración SQL ejecutada en Supabase
- [ ] Producto "Confident Pro" creado (€5/mes)
- [ ] Producto "Confident Diamond" creado (€15/mes)
- [ ] Price IDs copiados a `.env.local`
- [ ] Webhook endpoint creado con URL correcta
- [ ] Webhook secret copiado a `.env.local`
- [ ] Variables añadidas en Vercel Dashboard
- [ ] Redeploy de Vercel completado
- [ ] Test webhook enviado con éxito (200 OK)

---

## 🎯 Próximo Paso

Una vez completado todo el checklist, continuar con:
**Testing End-to-End del flujo de pago**

Ver: `SESION_31_STRIPE_INTEGRATION.md` → Sección "Testing End-to-End"

---

## 🆘 Troubleshooting

### Error: "Invalid Price ID"
- Verificar que copiaste el Price ID completo (debe empezar con `price_`)
- Verificar que no hay espacios al principio/final
- Verificar que está en el entorno correcto (test vs live)

### Error: Webhook devuelve 404
- Verificar URL del webhook: `https://tryconfident.vercel.app/api/stripe/webhook`
- Verificar que el archivo `app/api/stripe/webhook/route.ts` existe
- Verificar último deploy de Vercel

### Error: Webhook devuelve 400 (signature verification failed)
- Verificar que `STRIPE_WEBHOOK_SECRET` está configurado correctamente
- Verificar que copiaste el secret del webhook correcto (no de otro webhook)

---

**¿Dudas?** Revisa la documentación oficial de Stripe:
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing
