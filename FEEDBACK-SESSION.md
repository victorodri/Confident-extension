# FEEDBACK SESSION — Issues y Prioridades

Fecha: Febrero 2026
Estado: En proceso

---

## 🔴 CRÍTICO — Bugs que impiden funcionamiento

### 1. Contador de sesiones no funciona correctamente
**Problema:** Usuario ha iniciado 3 sesiones pero sigue mostrando "Quedan 5 sesiones"

**Investigación necesaria:**
- ✅ Verificar si `/api/usage` está devolviendo datos correctos
- ✅ Verificar si `/api/session` POST está registrando correctamente
- ✅ Verificar trigger de Supabase que incrementa `total_sessions`
- ✅ Verificar que `anonymous_id` (device fingerprint) no está cambiando entre sesiones

**Coste:** 🟢 BAJO (1 hora) — probablemente un bug en la lógica

**Prioridad:** 1️⃣ PRIMERO

---

### 2. Emails no se envían (Resend no configurado)
**Problema:** El endpoint `/api/send-transcript` existe pero no hay API key de Resend en `.env.local`

**Tareas:**
- ✅ Verificar si existe `RESEND_API_KEY` en `.env.local`
- ✅ Si no existe, crear cuenta Resend y obtener API key
- ✅ Verificar dominio `tryconfident.com` o usar dominio de desarrollo
- ✅ Testear envío de email con curl

**Coste:** 🟢 BAJO (30 min) — solo configuración

**Prioridad:** 2️⃣ SEGUNDO

---

### 3. Flujo de login roto (después de OAuth no pasa nada)
**Problema:** Usuario hace login con Google → magic link → vuelve a pedir magic link

**Investigación:**
- ✅ Verificar `/app/auth/callback/route.ts` — ¿redirige correctamente?
- ✅ Verificar si el JWT se guarda en cookies correctamente
- ✅ Crear página de éxito `/app/auth/success/page.tsx` con mensaje de "10 sesiones añadidas"

**Coste:** 🟡 MEDIO (1.5 horas) — requiere debugging + nueva página

**Prioridad:** 3️⃣ TERCERO

---

## 🟡 IMPORTANTE — Mejoras UX

### 4. Contador debe ser más discreto
**Problema:** El contador es muy prominente y puede desalentar uso

**Solución:**
- Moverlo al panel lateral derecho (en lugar del popup)
- Tipografía pequeña, color gris suave
- Texto: "X sesiones restantes • [Regístrate aquí](link) para más"
- Solo mostrar cuando quedan ≤3 sesiones o cuando es anónimo

**Coste:** 🟢 BAJO (45 min) — solo CSS + mover elemento

**Prioridad:** 4️⃣ CUARTO

---

### 5. Pedir email en primera instalación
**Problema:** Flujo actual no pide email del usuario que instala la extensión

**Solución propuesta:**
```
FLUJO NUEVO (Primera instalación):
1. Instalar extensión → Abrir popup
2. Pantalla bienvenida: "Bienvenido a Confident"
3. Input: "Email (opcional) para recibir transcripciones"
4. Botón: "Continuar"
5. [FLUJO ACTUAL] Selector de perfil → Consentimiento → Iniciar
```

**Cambios técnicos:**
- Detectar primera instalación con `chrome.runtime.onInstalled`
- Guardar flag `hasCompletedOnboarding` en `storage.local`
- Crear pantalla de onboarding en popup
- Guardar email del usuario en `storage.local.userEmail`
- Usar ese email para enviar transcripciones (además de emails de participantes)

**Coste:** 🟡 MEDIO (2 horas) — nuevo flujo de onboarding

**Prioridad:** 5️⃣ QUINTO

---

### 6. Página de éxito después de login
**Problema:** Después de login con Google no hay feedback visual

**Solución:**
- Crear `/app/auth/success/page.tsx`
- Mensaje: "✅ ¡Cuenta creada con éxito! Se han añadido 10 sesiones a tu plan."
- CTA: "Volver a Google Meet" (cierra tab automáticamente después de 3s)
- Mostrar contador actualizado

**Coste:** 🟢 BAJO (1 hora) — página simple

**Prioridad:** 6️⃣ SEXTO (se hace junto con punto 3)

---

## 🎨 DISEÑO — Rediseño completo UI

### 7. Rediseñar popup y panel lateral (estilo Apple)
**Requisitos:**
- Fondo blanco (no oscuro)
- Tipografía SF Pro o sistema
- Espaciado generoso (16-24px padding)
- Bordes redondeados suaves (12-16px)
- Sombras sutiles (blur suave, opacity baja)
- Colores de acento: azul SF (#007AFF) o violeta suave
- Iconos SF Symbols style
- Sensación premium y minimalista

**Archivos a modificar:**
- `extension/popup/popup.css` — tema completo
- `extension/popup/popup.html` — estructura si es necesario
- `extension/side-panel/panel.css` — tema completo
- `extension/side-panel/panel.html` — estructura si es necesario

**Coste:** 🔴 ALTO (4-6 horas) — rediseño completo de 2 interfaces

**Prioridad:** 7️⃣ SÉPTIMO (después de bugs críticos)

---

### 8. Dashboard básico (estructura vacía)
**Requisitos:**
- Crear `/app/dashboard/page.tsx`
- Estructura con tabs/secciones: Sesiones | Aprendizajes | Configuración
- Por ahora vacío con mensajes "Próximamente"
- Auth required (verificar JWT)

**Coste:** 🟡 MEDIO (2 horas) — estructura + auth

**Prioridad:** 8️⃣ OCTAVO

---

## 🧹 LIMPIEZA

### 9. Borrar carpeta docs (ya migrado a Notion)
**Tarea:** `rm -rf docs/`

**Coste:** ⚡ TRIVIAL (5 segundos)

**Prioridad:** 9️⃣ ÚLTIMO

---

## 📊 ESTIMACIÓN TOTAL

| Fase | Tareas | Tiempo estimado |
|------|--------|-----------------|
| **CRÍTICO** | 1, 2, 3 | ~3 horas |
| **UX** | 4, 5, 6 | ~4 horas |
| **DISEÑO** | 7, 8 | ~6-8 horas |
| **LIMPIEZA** | 9 | 5 segundos |
| **TOTAL** | | **~13-15 horas** |

---

## 🎯 PLAN DE EJECUCIÓN

### Día 1 - Arreglar bugs críticos (3h)
1. ✅ Investigar contador de sesiones
2. ✅ Configurar Resend
3. ✅ Arreglar flujo login + página éxito
4. ✅ Commit cuando todo funcione

### Día 2 - Mejoras UX (4h)
5. ✅ Contador discreto
6. ✅ Onboarding con email
7. ✅ Commit cuando todo funcione

### Día 3 - Rediseño UI (6-8h)
8. ✅ Rediseño popup estilo Apple
9. ✅ Rediseño panel lateral
10. ✅ Dashboard básico
11. ✅ Borrar carpeta docs
12. ✅ Commit final

---

## 🔄 PRÓXIMOS PASOS

1. Empezar con **CRÍTICO #1** (contador de sesiones)
2. Verificar funcionamiento antes de pasar al siguiente
3. No avanzar hasta que cada punto funcione correctamente
