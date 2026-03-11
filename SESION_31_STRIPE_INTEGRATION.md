# Sesión 31 — Integración Stripe + 3 Planes de Pricing

**Fecha**: Marzo 11, 2026
**Estado**: EN PROGRESO (95% completado)
**Objetivo**: Implementar sistema completo de pricing con 3 planes + integración Stripe

---

## ✅ COMPLETADO

### 1. Schema de Base de Datos
- ✅ **Migración SQL creada**: `supabase/migrations/add_stripe_integration.sql`
  - Actualizado constraint de `profiles.plan` para incluir 'diamond'
  - Añadidas columnas Stripe en profiles: `stripe_customer_id`, `subscription_status`, `current_period_end`
  - Tabla `stripe_customers` creada
  - Tabla `stripe_subscriptions` creada
  - RLS policies configuradas
  - Triggers automáticos para sincronizar subscriptions → profiles
  - Function `handle_subscription_canceled()` para downgrade automático

### 2. Constantes y Configuración
- ✅ **lib/constants.ts** actualizado:
  ```typescript
  LIMITS = {
    ANONYMOUS_SESSIONS: 5,
    FREE_SESSIONS: 15,
    PRO_SESSIONS: 50,
    DIAMOND_SESSIONS: Infinity
  }

  PRICING = {
    PRO_MONTHLY_PRICE: 500,  // 5€
    DIAMOND_MONTHLY_PRICE: 1500  // 15€
  }
  ```

### 3. Variables de Entorno
- ✅ **.env.example** actualizado con:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
  - `NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`

### 4. Cliente Stripe
- ✅ **lib/stripe.ts** creado con:
  - Cliente Stripe inicializado
  - `getOrCreateStripeCustomer()` → Crear/recuperar customer
  - `createCheckoutSession()` → Crear sesión de pago
  - `getUserSubscription()` → Obtener suscripción activa
  - `cancelSubscription()` → Cancelar al final del período
  - `reactivateSubscription()` → Reactivar suscripción

### 5. API Endpoints
- ✅ **app/api/stripe/create-checkout-session/route.ts** creado:
  - POST endpoint para crear checkout sessions
  - Validación de autenticación
  - Validación de plan (pro/diamond)
  - Prevención de duplicados (ya tiene el plan)
  - Retorna URL de Stripe Checkout

- ✅ **app/api/stripe/webhook/route.ts** creado:
  - Procesa eventos de Stripe con verificación de firma
  - `checkout.session.completed` → Crear suscripción
  - `customer.subscription.updated` → Actualizar suscripción
  - `customer.subscription.deleted` → Downgrade a free
  - `invoice.payment_failed` → Marcar como past_due

### 6. Pricing Page Actualizada
- ✅ **app/[locale]/pricing/page.tsx** actualizado:
  - 3 cards de planes (Free/Pro/Diamond)
  - Integración con `/api/stripe/create-checkout-session`
  - Manejo de estados de loading y errores
  - Redirección a Stripe Checkout
  - Redirección a auth para plan Free

### 7. Traducciones Actualizadas
- ✅ **messages/es.json** actualizado:
  - Traducciones completas para 3 planes
  - Badges, características, CTAs
  - FAQ actualizado con nuevo modelo de precios

- ✅ **messages/en.json** actualizado:
  - Traducciones en inglés para 3 planes
  - Estructura idéntica a versión española

### 8. Paywalls de Extensión Actualizados
- ✅ **extension/side-panel/panel.js** actualizado:
  - Soft paywall: 5 sesiones anónimas → 15 con registro
  - Hard paywall: 15 sesiones free → Pro (€5) o Diamond (€15)
  - CTAs actualizados con nuevos precios
  - Mensajes en ES/EN

### 9. Dashboard con Upgrade
- ✅ **app/[locale]/dashboard/page.tsx** actualizado:
  - Badge visual del plan actual (Free/Pro/Diamond)
  - Botón "Actualizar a Pro" para usuarios Free
  - Botón "Gestionar suscripción" para Pro/Diamond
  - Gradientes distintivos por plan
  - Contador de sesiones con lógica para 3 planes

- ✅ **app/api/usage/route.ts** actualizado:
  - Importa LIMITS desde lib/constants.ts
  - Maneja correctamente los 3 planes
  - Diamond = ilimitado (remaining: null)
  - Pro = 50 sesiones/mes
  - Free = 15 sesiones

---

## ⏳ PENDIENTE

### 1. Configurar Stripe Dashboard
**Pasos manuales** (hacer en dashboard.stripe.com):
1. Crear producto "Confident Pro"
   - Precio: 5€/mes recurrente
   - Copiar Price ID → `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`

2. Crear producto "Confident Diamond"
   - Precio: 15€/mes recurrente
   - Copiar Price ID → `NEXT_PUBLIC_STRIPE_DIAMOND_PRICE_ID`

3. Configurar webhook:
   - URL: `https://tryconfident.com/api/stripe/webhook`
   - Eventos:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copiar signing secret → `STRIPE_WEBHOOK_SECRET`

### 2. Ejecutar Migración SQL
**Comando**:
```bash
# En Supabase Dashboard → SQL Editor
# Pegar contenido de: supabase/migrations/add_stripe_integration.sql
# Ejecutar
```

### 3. Testing End-to-End
**Checklist**:
- [ ] Crear cuenta nueva → debe tener plan 'free'
- [ ] Click en "Upgrade to Pro" → redirige a Stripe Checkout
- [ ] Completar pago en modo test → webhook procesa evento
- [ ] Verificar en profiles: plan = 'pro', subscription_status = 'active'
- [ ] Verificar en stripe_subscriptions: suscripción creada
- [ ] Iniciar 51 sesiones → debe permitir (pro limit = 50/mes)
- [ ] Cancelar suscripción → debe downgrade a free al final del período
- [ ] Pago fallido → debe marcar como past_due

---

## 📁 Archivos Creados/Modificados

### Nuevos archivos:
```
lib/stripe.ts                                      ← Cliente Stripe + funciones
app/api/stripe/create-checkout-session/route.ts   ← Endpoint checkout
app/api/stripe/webhook/route.ts                   ← Webhook handler
supabase/migrations/add_stripe_integration.sql    ← Migración SQL
SESION_31_STRIPE_INTEGRATION.md                   ← Este archivo
```

### Modificados:
```
lib/constants.ts                   ← Límites 3 planes + precios
.env.example                      ← Variables Stripe
app/[locale]/pricing/page.tsx     ← UI 3 planes + Stripe checkout
messages/es.json                  ← Traducciones 3 planes
messages/en.json                  ← Traducciones 3 planes (EN)
extension/side-panel/panel.js     ← Límites + CTAs
app/[locale]/dashboard/page.tsx   ← Badge plan + botón upgrade
app/api/usage/route.ts            ← Lógica para 3 planes
```

---

## 🎯 Próximos Pasos (Sesión 32)

1. **Configurar Stripe Dashboard** (manual, 15 min)
   - Crear productos Pro y Diamond
   - Configurar precios recurrentes
   - Configurar webhook endpoint

2. **Ejecutar migración SQL** en Supabase (1 min)
   - Copiar y ejecutar add_stripe_integration.sql

3. **Testing end-to-end** (1 hora)
   - Flujo completo Free → Pro
   - Flujo Pro → Diamond
   - Cancelación de suscripción
   - Webhook processing

4. **Documentar en PROGRESS.md**

**Tiempo estimado**: 1.5 horas
**Tokens estimados**: 10-15K

---

## 📊 Estado Actual

```
✅ Backend Stripe: 100% completado
✅ Base de datos: 100% completado
✅ API endpoints: 100% completado
✅ UI Pricing: 100% completado
✅ Traducciones: 100% completado
✅ Paywalls extensión: 100% completado
✅ Dashboard upgrade: 100% completado
⏳ Configuración Stripe: 0% (manual)
⏳ Migración SQL: 0% (manual)
⏳ Testing: 0% completado

PROGRESO TOTAL: 95%
```

---

## 🔧 Comandos Útiles

### Instalar Stripe SDK (si no está)
```bash
npm install stripe @stripe/stripe-js
```

### Test webhook localmente
```bash
# Instalar Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks a local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### Verificar migración aplicada
```sql
-- En Supabase SQL Editor
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('stripe_customer_id', 'subscription_status', 'current_period_end');
```

---

**Última actualización**: Marzo 11, 2026 - 10:22 AM
**Siguiente sesión**: Configuración manual + Testing
