# Testing Multi-idioma ES/EN — Sesión 24

**Fecha**: Marzo 3, 2026
**Objetivo**: Verificar que todas las páginas funcionan correctamente en español e inglés

---

## ✅ Pre-requisitos

- [x] Script SQL `FIX_COMPLETO_SESIONES.sql` ejecutado en Supabase
- [ ] Servidor Next.js corriendo en `http://localhost:3000`
- [ ] Usuario autenticado con sesiones de prueba

---

## 🌐 TEST 1: Landing Page

### ES — http://localhost:3000/es

**Hero Section**:
- [ ] Título: "Tu confidente en cada conversación importante"
- [ ] Subtítulo traducido correctamente
- [ ] Botón CTA: "Probar gratis — sin registro"
- [ ] Botón secundario: "Ver planes"

**Cómo Funciona** (3 pasos):
- [ ] Paso 1: "Instala la extensión"
- [ ] Paso 2: "Activa en Google Meet"
- [ ] Paso 3: "Recibe sugerencias en tiempo real"

**Casos de Uso** (3 perfiles):
- [ ] Candidato: "Entrevistas de trabajo" + descripción
- [ ] Vendedor: "Llamadas comerciales" + descripción
- [ ] Defensor: "Reuniones complejas" + descripción

**Footer**:
- [ ] Links: Privacidad, Términos, Contacto
- [ ] Copyright en español
- [ ] Texto "RGPD • Solo texto, no audio"

**Language Selector**:
- [ ] Badge "ES" activo (purple)
- [ ] Badge "EN" inactivo (gray)
- [ ] Click en "EN" cambia a `/en`

---

### EN — http://localhost:3000/en

**Hero Section**:
- [ ] Title: "Your confident in every important conversation"
- [ ] Subtitle translated correctly
- [ ] CTA Button: "Try free — no registration"
- [ ] Secondary button: "View plans"

**How It Works** (3 steps):
- [ ] Step 1: "Install the extension"
- [ ] Step 2: "Activate on Google Meet"
- [ ] Step 3: "Get real-time suggestions"

**Use Cases** (3 profiles):
- [ ] Candidate: "Job interviews" + description
- [ ] Seller: "Sales calls" + description
- [ ] Defender: "Complex meetings" + description

**Footer**:
- [ ] Links: Privacy, Terms, Contact
- [ ] Copyright in English
- [ ] Text "GDPR • Text only, no audio"

**Language Selector**:
- [ ] Badge "EN" active (purple)
- [ ] Badge "ES" inactive (gray)
- [ ] Click on "ES" changes to `/es`

---

## 💰 TEST 2: Pricing Page

### ES — http://localhost:3000/es/pricing

**Header**:
- [ ] Navbar: "Confident" + Language Selector + "Inicio"
- [ ] Título: "Precios"
- [ ] Subtítulo: "Elige el plan que mejor se adapte a ti"

**Planes** (3 cards):
- [ ] **Anónimo**: €0, "sin registro", features traducidos, CTA "Empezar ahora"
- [ ] **Gratis**: €0, "para siempre", badge "Recomendado", features traducidos, CTA "Crear cuenta gratis"
- [ ] **Pro**: €9.99, "al mes", badge "Próximamente", features traducidos, CTA "Unirse a lista de espera"

**FAQ** (4 preguntas):
- [ ] Q1: "¿Por qué 15 sesiones gratuitas?"
- [ ] Q2: "¿Cuándo estará disponible el plan Pro?"
- [ ] Q3: "¿Puedo usar Confident sin registro?"
- [ ] Q4: "¿Es seguro usar Confident?"

**Waitlist Modal** (al hacer clic en Pro):
- [ ] Título: "Plan Pro — Lista de espera"
- [ ] Campos: Nombre, Email
- [ ] Botones: "Cancelar", "Unirme a la lista"
- [ ] Info: "Precio estimado €9.99/mes"

**Success Screen** (después de enviar waitlist):
- [ ] Título: "¡Gracias por tu interés!"
- [ ] Subtítulo: "Te avisaremos cuando el plan Pro esté disponible"
- [ ] Info: "Mientras tanto, puedes usar el plan gratuito"
- [ ] Botones: "Crear cuenta gratuita", "Volver al inicio"

---

### EN — http://localhost:3000/en/pricing

**Header**:
- [ ] Navbar: "Confident" + Language Selector + "Home"
- [ ] Title: "Pricing"
- [ ] Subtitle: "Choose the plan that fits you best"

**Plans** (3 cards):
- [ ] **Anonymous**: €0, "no registration", features translated, CTA "Start now"
- [ ] **Free**: €0, "forever", badge "Recommended", features translated, CTA "Create free account"
- [ ] **Pro**: €9.99, "per month", badge "Coming soon", features translated, CTA "Join waitlist"

**FAQ** (4 questions):
- [ ] Q1: "Why 15 free sessions?"
- [ ] Q2: "When will the Pro plan be available?"
- [ ] Q3: "Can I use Confident without registration?"
- [ ] Q4: "Is Confident safe to use?"

**Waitlist Modal** (when clicking Pro):
- [ ] Title: "Pro Plan — Waitlist"
- [ ] Fields: Name, Email
- [ ] Buttons: "Cancel", "Join waitlist"
- [ ] Info: "Estimated price €9.99/month"

**Success Screen** (after submitting waitlist):
- [ ] Title: "Thanks for your interest!"
- [ ] Subtitle: "We'll notify you when the Pro plan is available"
- [ ] Info: "In the meantime, you can use the free plan"
- [ ] Buttons: "Create free account", "Back to home"

---

## 🔒 TEST 3: Privacy Page

### ES — http://localhost:3000/es/privacy

- [ ] Título: "Política de Privacidad"
- [ ] Última actualización con fecha
- [ ] 12 secciones traducidas:
  - [ ] 1. Introducción
  - [ ] 2. Qué datos recopilamos
  - [ ] 3. Base legal (RGPD)
  - [ ] 4. Cómo usamos tus datos
  - [ ] 5. Almacenamiento y seguridad
  - [ ] 6. Compartir datos con terceros
  - [ ] 7. Tus derechos (ARCO)
  - [ ] 8. Cookies y tecnologías
  - [ ] 9. Cambios en política
  - [ ] 10. Jurisdicción
  - [ ] 11. Menores de edad
  - [ ] 12. Contacto
- [ ] Links internos funcionan: "Términos de servicio"
- [ ] Footer con language selector

### EN — http://localhost:3000/en/privacy

- [ ] Title: "Privacy Policy"
- [ ] Last updated with date
- [ ] 12 sections translated correctly
- [ ] Internal links work: "Terms of Service"
- [ ] Footer with language selector

---

## 📄 TEST 4: Terms Page

### ES — http://localhost:3000/es/terms

- [ ] Título: "Términos de Servicio"
- [ ] Última actualización con fecha
- [ ] 12 secciones traducidas:
  - [ ] 1. Aceptación de términos
  - [ ] 2. Descripción del servicio
  - [ ] 3. Uso responsable
  - [ ] 4. Consentimiento obligatorio
  - [ ] 5. Limitación de responsabilidad
  - [ ] 6. Planes y pagos
  - [ ] 7. Propiedad intelectual
  - [ ] 8. Terminación del servicio
  - [ ] 9. Modificaciones
  - [ ] 10. Privacidad
  - [ ] 11. Jurisdicción
  - [ ] 12. Contacto
- [ ] Links internos funcionan: "Política de Privacidad"

### EN — http://localhost:3000/en/terms

- [ ] Title: "Terms of Service"
- [ ] Last updated with date
- [ ] 12 sections translated correctly
- [ ] Internal links work: "Privacy Policy"

---

## 📊 TEST 5: Dashboard (Autenticado)

### ES — http://localhost:3000/es/dashboard

**Header**:
- [ ] Logo "Confident"
- [ ] Links: "Mi Perfil", "Actualizar a Pro" (si free), "Cerrar sesión"

**User Info Card**:
- [ ] Avatar con inicial del email
- [ ] Email del usuario
- [ ] Texto: "Plan Gratuito • X sesiones completadas" (X debe ser > 0 si hay sesiones)
- [ ] Texto: "Y sesiones restantes" (Y = 15 - X para plan free)

**Historial de sesiones**:
- [ ] Título: "Historial de sesiones"
- [ ] Si hay sesiones: Lista con perfiles (Candidato/Vendedor/Defensor)
- [ ] Fecha en español: "01 mar 2026, 17:06"
- [ ] Duración: "2m 49s"
- [ ] Sugerencias: "22 sugerencias"

**Session Details** (al hacer clic en sesión):
- [ ] Título: "Detalles de la sesión"
- [ ] Stats cards: Duración, Sugerencias recibidas
- [ ] Resumen AI si existe

**Footer**:
- [ ] Copyright en español
- [ ] Links: Privacidad, Términos, Contacto

### EN — http://localhost:3000/en/dashboard

- [ ] Header links in English: "My Profile", "Upgrade to Pro", "Sign out"
- [ ] User info: "Free Plan • X sessions completed"
- [ ] User info: "Y sessions remaining"
- [ ] Sessions history: "Sessions history"
- [ ] Date in English format: "Mar 01, 2026, 5:06 PM"
- [ ] Duration: "2m 49s"
- [ ] Suggestions: "22 suggestions"
- [ ] Session details: "Session details"

---

## 🔄 TEST 6: Cross-Testing (Cambio de idioma)

**Test 1: Cambiar idioma desde pricing**:
- [ ] Navegar a `/es/pricing`
- [ ] Click en badge "EN"
- [ ] Verifica que cambia a `/en/pricing` (misma ruta, diferente idioma)
- [ ] Contenido se traduce correctamente

**Test 2: Cambiar idioma desde landing**:
- [ ] Navegar a `/en`
- [ ] Click en badge "ES"
- [ ] Verifica que cambia a `/es`
- [ ] Contenido se traduce correctamente

**Test 3: Refresh mantiene idioma**:
- [ ] Navegar a `/en/pricing`
- [ ] Presionar F5 (refresh)
- [ ] Verifica que sigue en `/en/pricing`

**Test 4: Browser back button**:
- [ ] Navegar: `/es` → `/es/pricing` → `/en/pricing`
- [ ] Presionar browser back button
- [ ] Verifica que vuelve a `/es/pricing`

**Test 5: Links internos preservan locale**:
- [ ] Desde `/en`, click en "Privacy"
- [ ] Verifica que va a `/en/privacy`
- [ ] Desde `/es/privacy`, click en "Términos"
- [ ] Verifica que va a `/es/terms`

---

## ✅ TEST 7: Contador de Sesiones (FIX VERIFICACIÓN)

**Usuarios nuevos (registrarse ahora)**:
- [ ] Crear nueva cuenta con Google
- [ ] Verificar que pantalla de éxito muestra "15 sesiones disponibles"
- [ ] Ir a dashboard
- [ ] Verificar que muestra "Plan Gratuito • 0 sesiones completadas"
- [ ] Verificar que muestra "15 sesiones restantes"

**Usuarios existentes** (tu cuenta actual):
- [ ] Ir a dashboard `/es/dashboard`
- [ ] Verificar que "X sesiones completadas" coincide con el número de sesiones en el historial
- [ ] Ejemplo: Si hay 4 sesiones en historial → debe mostrar "4 sesiones completadas"
- [ ] Verificar que "sesiones restantes" = 15 - X

---

## 📱 TEST 8: Responsive (Opcional)

- [ ] Landing page responsive en móvil
- [ ] Pricing page responsive en móvil
- [ ] Dashboard responsive en móvil
- [ ] Language selector accesible en móvil

---

## 🎯 RESULTADO ESPERADO

### ✅ Todos los tests pasados significa:

1. **Multi-idioma web funcionando 100%**:
   - Landing, Pricing, Privacy, Terms en ES/EN
   - Language selector funcional
   - Links preservan locale
   - Traducciones profesionales

2. **Contador de sesiones correcto**:
   - Usuarios nuevos: 15 sesiones disponibles
   - Usuarios existentes: contador refleja sesiones reales
   - Dashboard sincronizado con Supabase

3. **UX consistente**:
   - Navegación fluida entre idiomas
   - Refresh mantiene idioma
   - Browser back funciona correctamente

### ❌ Si algún test falla:

1. Documentar el error específico
2. Captura de pantalla si es visual
3. Reportar en PROGRESS.md

---

## 📊 TRACKING

**Fecha inicio**: Marzo 3, 2026
**Fecha fin**: _________

**Tests ejecutados**: __ / 80
**Tests pasados**: __ / 80
**Tests fallidos**: __ / 80

**% Completado**: ____%

---

## 📝 NOTAS DEL TESTING

[Espacio para notas, bugs encontrados, observaciones]
