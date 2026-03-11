# Sesión 31 — Integración Stripe + 3 Planes de Pricing

**Fecha**: Marzo 11, 2026
**Estado**: EN PROGRESO (70% completado)
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

---

## ⏳ PENDIENTE

### 1. Actualizar Pricing Page (app/[locale]/pricing/page.tsx)
**Cambios necesarios**:
- Actualizar estructura de planes a:
  1. **Free** → "Explorador" (15 sesiones con registro, gratis)
  2. **Pro** → 50 sesiones/mes por 5€/mes
  3. **Diamond** → Sesiones ilimitadas por 15€/mes

- Modificar `handlePlanClick` para:
  ```typescript
  const handlePlanClick = async (plan: 'free' | 'pro' | 'diamond') => {
    if (plan === 'free') {
      window.location.href = `/${locale}/auth`;
    } else {
      // Crear checkout session en Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      const { url } = await response.json();
      window.location.href = url;
    }
  };
  ```

### 2. Actualizar Traducciones (messages/es.json y messages/en.json)
**Añadir en la sección `pricing`**:
```json
{
  "pricing": {
    "free": {
      "name": "Explorador",
      "price": "0€",
      "period": "/mes",
      "description": "Ideal para probar Confident",
      "features": [
        "15 sesiones gratis",
        "Requiere registro",
        "Sugerencias en tiempo real",
        "3 perfiles (Candidato/Vendedor/Defensor)",
        "Historial de sesiones",
        "Transcripciones por email"
      ],
      "cta": "Empezar gratis",
      "badge": "Popular"
    },
    "pro": {
      "name": "Pro",
      "price": "5€",
      "period": "/mes",
      "description": "Para usuarios frecuentes",
      "features": [
        "50 sesiones al mes",
        "Todo lo de Explorador",
        "Análisis IA avanzado",
        "Soporte prioritario",
        "Exportar transcripciones",
        "Sin compromiso, cancela cuando quieras"
      ],
      "cta": "Suscribirme",
      "badge": "Más elegido"
    },
    "diamond": {
      "name": "Diamond",
      "price": "15€",
      "period": "/mes",
      "description": "Para profesionales sin límites",
      "features": [
        "Sesiones ilimitadas",
        "Todo lo de Pro",
        "API access (próximamente)",
        "Integraciones personalizadas",
        "Soporte 24/7",
        "Cancela cuando quieras"
      ],
      "cta": "Suscribirme Premium",
      "badge": "Sin límites"
    }
  }
}
```

### 3. Actualizar Paywalls en Extensión
**Archivos a modificar**:
- `extension/side-panel/panel.js`
- `extension/side-panel/panel.html`

**Cambios**:
- Actualizar límites:
  - Anónimo: 5 sesiones
  - Free: 15 sesiones
  - Pro: 50 sesiones/mes
  - Diamond: ilimitado

- Actualizar CTAs del paywall:
  - Soft paywall (5/5 anónimo) → "Crear cuenta gratis (15 sesiones)"
  - Hard paywall (15/15 free) → "Actualizar a Pro (50 sesiones/mes por 5€)"

- Añadir enlace a `/pricing` en modales

### 4. Dashboard: Mostrar Plan Actual + Upgrade Button
**Archivo**: `app/[locale]/dashboard/page.tsx`

**Añadir**:
- Badge con plan actual (Free/Pro/Diamond)
- Botón "Upgrade" si es Free
- Botón "Gestionar suscripción" si es Pro/Diamond → Portal de Stripe

### 5. Configurar Stripe Dashboard
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

### 6. Ejecutar Migración SQL
**Comando**:
```bash
# En Supabase Dashboard → SQL Editor
# Pegar contenido de: supabase/migrations/add_stripe_integration.sql
# Ejecutar
```

### 7. Testing End-to-End
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
lib/constants.ts                  ← Límites 3 planes + precios
.env.example                     ← Variables Stripe
```

### Pendientes de modificar:
```
app/[locale]/pricing/page.tsx    ← UI 3 planes + Stripe checkout
messages/es.json                 ← Traducciones 3 planes
messages/en.json                 ← Traducciones 3 planes (EN)
extension/side-panel/panel.js    ← Límites + CTAs
app/[locale]/dashboard/page.tsx  ← Badge plan + botón upgrade
```

---

## 🎯 Próximos Pasos (Sesión 32)

1. **Configurar Stripe Dashboard** (manual, 15 min)
2. **Ejecutar migración SQL** en Supabase (1 min)
3. **Actualizar pricing page** con 3 cards + Stripe integration (30 min)
4. **Actualizar traducciones** ES/EN (15 min)
5. **Actualizar paywalls extensión** (30 min)
6. **Añadir badge + upgrade button en dashboard** (20 min)
7. **Testing end-to-end** (1 hora)
8. **Documentar en PROGRESS.md**

**Tiempo estimado**: 3-4 horas
**Tokens estimados**: 40-50K

---

## 📊 Estado Actual

```
✅ Backend Stripe: 100% completado
✅ Base de datos: 100% completado
✅ API endpoints: 100% completado
⏳ UI Pricing: 0% completado
⏳ Traducciones: 0% completado
⏳ Paywalls extensión: 0% completado
⏳ Dashboard upgrade: 0% completado
⏳ Testing: 0% completado

PROGRESO TOTAL: 70%
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

**Última actualización**: Marzo 11, 2026 - 11:30 AM
**Siguiente sesión**: Completar UI + Testing
