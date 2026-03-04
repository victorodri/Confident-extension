# Testing Session 28 — Multi-plataforma e Idioma Completo

> **Objetivo**: Verificar que Confident funciona correctamente en las 3 plataformas (Google Meet, Teams, Zoom) y en los 2 idiomas (ES/EN) antes de publicación en Chrome Web Store.

---

## 📋 Testing Checklist Completo

### Fase 1: Preparación del entorno

- [ ] **Backend Next.js** corriendo en localhost:3000
- [ ] **Extensión** cargada en Chrome (versión 0.1.0-dev)
- [ ] **Variables de entorno** configuradas:
  - [ ] ANTHROPIC_API_KEY (Claude)
  - [ ] NEXT_PUBLIC_DEEPGRAM_API_KEY (Deepgram)
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] **Base de datos Supabase** conectada y accesible
- [ ] **Navegador Chrome** actualizado (versión 120+)

---

## 🎯 Fase 2: Testing Multi-plataforma

### Test 2.1: Google Meet (Plataforma principal)

**URL de prueba**: https://meet.google.com/new

#### Captura de audio
- [ ] Crear nueva reunión en Google Meet
- [ ] Abrir popup de extensión
- [ ] Verificar mensaje: "Detectado Google Meet"
- [ ] Seleccionar perfil (Candidato)
- [ ] Clic "Iniciar sesión"
- [ ] Verificar checkbox consentimiento aparece
- [ ] Marcar checkbox y clic "Iniciar sesión" en panel
- [ ] Verificar indicador "Candidato — Activo" en panel
- [ ] Verificar indicador "Sesión activa" en popup

#### Transcripción
- [ ] Hablar al micrófono: "Hola, estoy probando Confident"
- [ ] Verificar que la transcripción aparece en consola (background.js)
- [ ] Esperar 3-5 segundos
- [ ] Verificar que aparece mensaje "Analizando..." en panel

#### Sugerencias IA
- [ ] Decir una pregunta behavioral: "¿Cuál es tu mayor debilidad?"
- [ ] Esperar respuesta de Claude (máx 5 segundos)
- [ ] Verificar que aparece card de sugerencia en panel
- [ ] Verificar que la sugerencia tiene:
  - [ ] Texto principal (suggestion)
  - [ ] Contexto (what_is_being_asked)
  - [ ] Badge de urgencia (🟢/🟡/🔴)
  - [ ] Botones de feedback (👍/👎)

#### Finalización
- [ ] Clic botón "He terminado esta reunión"
- [ ] Verificar que se abre dashboard con sesión seleccionada
- [ ] Verificar que la sesión aparece en historial
- [ ] Verificar que las transcripciones se guardaron
- [ ] Verificar que las sugerencias se guardaron

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 2.2: Microsoft Teams

**URL de prueba**: https://teams.microsoft.com/

#### Detección de plataforma
- [ ] Abrir Microsoft Teams
- [ ] Unirse a una reunión o crear reunión de prueba
- [ ] Abrir popup de extensión
- [ ] Verificar mensaje: "Detectado Microsoft Teams"
- [ ] Verificar icono correcto: 💼

#### Captura de audio
- [ ] Seleccionar perfil (Vendedor)
- [ ] Iniciar sesión
- [ ] Verificar que el audio se captura correctamente
- [ ] Hablar: "Esta es una prueba en Microsoft Teams"
- [ ] Verificar transcripción en consola

#### Sugerencias específicas de Vendedor
- [ ] Decir: "El precio me parece muy alto"
- [ ] Verificar que aparece sugerencia de objeción de precio
- [ ] Verificar que el tono es consultivo (mentor de ventas)
- [ ] Verificar que menciona técnicas de manejo de objeciones

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 2.3: Zoom

**URL de prueba**: https://zoom.us/

#### Detección de plataforma
- [ ] Abrir Zoom en navegador (no app desktop)
- [ ] Unirse a reunión de prueba
- [ ] Abrir popup de extensión
- [ ] Verificar mensaje: "Detectado Zoom"
- [ ] Verificar icono correcto: 📹

#### Captura de audio
- [ ] Seleccionar perfil (Defensor)
- [ ] Iniciar sesión
- [ ] Hablar: "Necesito defender mi propuesta de arquitectura"
- [ ] Verificar que el audio se captura correctamente

#### Sugerencias específicas de Defensor
- [ ] Decir: "¿Por qué no elegiste la opción B?"
- [ ] Verificar que aparece sugerencia de "assumption_challenge"
- [ ] Verificar que descompone la pregunta (qué se pregunta realmente)
- [ ] Verificar tono: asesor estratégico

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

## 🌐 Fase 3: Testing Multi-idioma

### Test 3.1: Interfaz en Español (ES)

#### Popup
- [ ] Abrir popup
- [ ] Verificar selector de idioma en "🇪🇸 Español"
- [ ] Verificar textos:
  - [ ] "Tu confidente en cada conversación"
  - [ ] "Selecciona tu perfil"
  - [ ] "Candidato" / "Vendedor" / "Defensor"
  - [ ] "Iniciar sesión"

#### Panel lateral
- [ ] Abrir panel
- [ ] Verificar selector de idioma en "🇪🇸 ES"
- [ ] Verificar textos:
  - [ ] "Sin sesión activa"
  - [ ] "He informado a los participantes..."
  - [ ] "Escuchando..."
  - [ ] "He terminado esta reunión"
  - [ ] "Ver resumen y transcripción en Dashboard"

#### Dashboard web
- [ ] Navegar a http://localhost:3000/es/dashboard
- [ ] Verificar URL tiene "/es/"
- [ ] Verificar textos en español:
  - [ ] "Mis Sesiones"
  - [ ] "Plan Gratuito"
  - [ ] "sesiones completadas"
  - [ ] Botones "Ver detalles", "Ver transcripción"

#### Sugerencias de Claude en Español
- [ ] Iniciar sesión en Google Meet
- [ ] Selector de idioma: Español
- [ ] Decir pregunta: "¿Por qué quieres trabajar aquí?"
- [ ] Verificar que la sugerencia llega en ESPAÑOL:
  - [ ] Campo "suggestion" en español
  - [ ] Campo "what_is_being_asked" en español
  - [ ] Keywords en español

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 3.2: Interfaz en Inglés (EN)

#### Popup
- [ ] Abrir popup
- [ ] Cambiar selector a "🇬🇧 English"
- [ ] Verificar textos:
  - [ ] "Your confident in every conversation"
  - [ ] "Select your profile"
  - [ ] "Candidate" / "Salesperson" / "Defender"
  - [ ] "Start session"

#### Panel lateral
- [ ] Abrir panel
- [ ] Cambiar selector a "🇬🇧 EN"
- [ ] Verificar textos:
  - [ ] "No active session"
  - [ ] "I have informed participants..."
  - [ ] "Listening..."
  - [ ] "I've finished this meeting"
  - [ ] "View summary and transcript in Dashboard"

#### Dashboard web
- [ ] Navegar a http://localhost:3000/en/dashboard
- [ ] Verificar URL tiene "/en/"
- [ ] Verificar textos en inglés:
  - [ ] "My Sessions"
  - [ ] "Free Plan"
  - [ ] "sessions completed"
  - [ ] Botones "View details", "View transcript"

#### Sugerencias de Claude en Inglés
- [ ] Iniciar sesión en Google Meet
- [ ] Selector de idioma: English
- [ ] Decir pregunta: "Why do you want to work here?"
- [ ] Verificar que la sugerencia llega en INGLÉS:
  - [ ] Campo "suggestion" en inglés
  - [ ] Campo "what_is_being_asked" en inglés
  - [ ] Keywords en inglés

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 3.3: Cambio dinámico de idioma

- [ ] Iniciar sesión activa en español
- [ ] Verificar sugerencias en español
- [ ] Detener sesión
- [ ] Cambiar idioma a inglés en popup
- [ ] Iniciar nueva sesión
- [ ] Verificar sugerencias en inglés
- [ ] Verificar que chrome.storage.local guardó preferencia
- [ ] Cerrar y reabrir extensión
- [ ] Verificar que idioma se mantiene (inglés)

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

## 🧪 Fase 4: Testing Funcional Core

### Test 4.1: Flujo completo usuario anónimo

- [ ] Limpiar chrome.storage.local
- [ ] Abrir popup por primera vez
- [ ] Seleccionar perfil
- [ ] Iniciar sesión en Google Meet
- [ ] Verificar que se crea anonymous_id
- [ ] Completar sesión
- [ ] Verificar contador: "5 sesiones gratuitas"
- [ ] Verificar que sesión se guardó en Supabase con anonymous_id

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 4.2: Flujo completo usuario registrado

- [ ] Navegar a http://localhost:3000/es/login
- [ ] Iniciar sesión con Google OAuth
- [ ] Verificar redirección a /es/dashboard
- [ ] Verificar que aparece "Plan Gratuito • 15 sesiones disponibles"
- [ ] Abrir extensión en Google Meet
- [ ] Iniciar sesión
- [ ] Completar sesión
- [ ] Verificar que sesión se asoció al user_id correcto
- [ ] Verificar contador actualizado en dashboard

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 4.3: Sistema de urgencia (Smart Cards)

#### Urgencia 1 (Info - Verde)
- [ ] Generar sugerencia informativa (ej: contexto general)
- [ ] Verificar badge: "🟢 INFO"
- [ ] Verificar color verde en card
- [ ] Verificar máximo 3 cards visibles

#### Urgencia 2 (Importante - Amarillo)
- [ ] Generar sugerencia importante (ej: pregunta técnica)
- [ ] Verificar badge: "🟡 IMPORTANTE"
- [ ] Verificar color amarillo en card
- [ ] Verificar máximo 2 cards visibles (elimina más antiguas)

#### Urgencia 3 (Crítico - Rojo)
- [ ] Generar sugerencia crítica (ej: pregunta de cierre)
- [ ] Verificar badge: "🔴 URGENTE"
- [ ] Verificar color rojo en card
- [ ] Verificar que limpia TODAS las cards anteriores
- [ ] Verificar que solo 1 card visible

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

### Test 4.4: Perfiles especializados

#### Perfil Candidato
- [ ] Seleccionar "Candidato"
- [ ] Decir: "Háblame de un proyecto difícil que hayas liderado"
- [ ] Verificar que detecta "behavioral"
- [ ] Verificar que menciona STAR o CAR
- [ ] Verificar tono: coach de carrera

#### Perfil Vendedor
- [ ] Seleccionar "Vendedor"
- [ ] Decir: "Creo que necesito pensarlo más"
- [ ] Verificar que detecta "objection_need"
- [ ] Verificar técnicas de manejo de objeciones
- [ ] Verificar tono: mentor de ventas

#### Perfil Defensor
- [ ] Seleccionar "Defensor"
- [ ] Decir: "¿Consideraste la opción de usar microservicios?"
- [ ] Verificar que detecta "alternative_challenge"
- [ ] Verificar que explica "qué se pregunta realmente"
- [ ] Verificar tono: asesor estratégico

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

## 🔒 Fase 5: Testing Seguridad y Privacidad

### Test 5.1: Consentimiento obligatorio

- [ ] Iniciar sesión sin marcar checkbox
- [ ] Verificar que botón "Iniciar sesión" está deshabilitado
- [ ] Marcar checkbox
- [ ] Verificar que botón se habilita
- [ ] Verificar que se guarda en chrome.storage.session

**Resultado**: ✅ PASS / ❌ FAIL

---

### Test 5.2: Audio no almacenado

- [ ] Verificar en código que NO hay funciones de guardado de audio
- [ ] Verificar en Supabase que NO hay tabla de audio
- [ ] Verificar en Network tab que NO se envía audio al backend
- [ ] Verificar que solo se envía texto de transcripciones

**Resultado**: ✅ PASS / ❌ FAIL

---

### Test 5.3: RLS (Row Level Security)

- [ ] Crear 2 usuarios diferentes
- [ ] Cada uno crea 1 sesión
- [ ] Verificar que Usuario A NO puede ver sesiones de Usuario B
- [ ] Intentar acceder a sesión de otro usuario via API
- [ ] Verificar error 403 Forbidden

**Resultado**: ✅ PASS / ❌ FAIL

---

## 🚀 Fase 6: Testing Performance

### Test 6.1: Latencia de sugerencias

- [ ] Decir pregunta
- [ ] Medir tiempo hasta que aparece sugerencia
- [ ] Verificar: **<5 segundos** (objetivo)
- [ ] Repetir 5 veces y promediar

**Promedio**: _______ segundos
**Resultado**: ✅ PASS (<5s) / ❌ FAIL (>5s)

---

### Test 6.2: Uso de memoria

- [ ] Abrir chrome://extensions
- [ ] Buscar "Confident"
- [ ] Verificar uso de memoria: **<100MB** (objetivo)
- [ ] Iniciar sesión de 10 minutos
- [ ] Verificar que no hay memory leaks
- [ ] Detener sesión
- [ ] Verificar que memoria se libera

**Resultado**: ✅ PASS / ❌ FAIL
**Notas**: _____________________________________________

---

## 📊 Resultados Finales

### Resumen por fase

| Fase | Tests Totales | Pass | Fail | % Éxito |
|------|--------------|------|------|---------|
| 1. Preparación | - | - | - | - |
| 2. Multi-plataforma | 3 | ___ | ___ | ___% |
| 3. Multi-idioma | 3 | ___ | ___ | ___% |
| 4. Funcional Core | 4 | ___ | ___ | ___% |
| 5. Seguridad | 3 | ___ | ___ | ___% |
| 6. Performance | 2 | ___ | ___ | ___% |
| **TOTAL** | **15** | **___** | **___** | **___%** |

### Criterio de aprobación

- ✅ **LISTO PARA PUBLICAR**: ≥90% tests pasados (14/15)
- ⚠️ **REQUIERE FIXES**: 80-89% tests pasados (12-13/15)
- ❌ **NO PUBLICAR**: <80% tests pasados (<12/15)

---

## 🐛 Bugs encontrados

### Bug #1
**Descripción**: _____________________________________________
**Severidad**: 🔴 Crítico / 🟡 Importante / 🟢 Menor
**Pasos para reproducir**:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Fix propuesto**: _____________________________________________

---

### Bug #2
**Descripción**: _____________________________________________
**Severidad**: 🔴 Crítico / 🟡 Importante / 🟢 Menor
**Pasos para reproducir**:
1. _____________________________________________
2. _____________________________________________

**Fix propuesto**: _____________________________________________

---

## ✅ Aprobación final

**Testeado por**: _____________________________________________
**Fecha**: _____________________________________________
**Versión**: 0.1.0-dev
**Resultado final**: ✅ APROBADO / ❌ RECHAZADO

**Firma**: _____________________________________________

---

**Creado**: Marzo 3, 2026
**Última actualización**: Marzo 3, 2026
