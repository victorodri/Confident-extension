# Sistema Anti-Pirateo de Sesiones — Confident

## Problema inicial

Con un UUID aleatorio generado al instalar la extensión, un usuario podía:
1. Usar las 5 sesiones gratuitas
2. Desinstalar la extensión
3. Reinstalar → nuevo UUID → 5 sesiones nuevas
4. Repetir infinitamente

## Solución implementada: Device Fingerprinting

### ¿Qué es?

Un **device fingerprint** es un identificador único generado a partir de características del navegador/dispositivo que son:
- **Consistentes**: No cambian aunque se desinstale/reinstale la extensión
- **Únicas**: Diferentes para cada dispositivo/navegador
- **No almacenadas**: Se calculan en tiempo real, no dependen de cookies

### Componentes del fingerprint

El archivo `extension/device-fingerprint.js` combina estas características:

1. **User Agent** — Navegador + versión + sistema operativo
2. **Idioma** — Configuración de idioma del navegador
3. **Zona horaria** — Timezone del sistema
4. **Resolución de pantalla** — Ancho x alto x profundidad de color
5. **Hardware concurrency** — Número de cores del CPU
6. **Device memory** — RAM disponible
7. **Platform** — Sistema operativo
8. **Canvas fingerprint** — Cómo el navegador renderiza gráficos (único por GPU/driver)
9. **WebGL fingerprint** — Vendor y renderer de la tarjeta gráfica
10. **Audio context fingerprint** — Características del procesamiento de audio

Todas estas características se combinan y se genera un hash SHA-256 único de 64 caracteres.

### Ejemplo de fingerprint

```
a3f2c8d9e1b4567890abcdef1234567890abcdef1234567890abcdef12345678
```

### Persistencia

- ✅ **Persiste** aunque se desinstale/reinstale la extensión
- ✅ **Persiste** aunque se borren cookies/cache/storage
- ✅ **Persiste** aunque se recargue la extensión
- ❌ **NO persiste** si el usuario cambia de navegador (Chrome → Firefox)
- ❌ **NO persiste** si el usuario cambia de dispositivo (PC → Laptop)
- ❌ **NO persiste** si el usuario actualiza drivers de GPU (cambia WebGL fingerprint)

### Nivel de protección

| Acción del usuario | ¿Resetea el contador? |
|-------------------|----------------------|
| Desinstalar/reinstalar extensión | ❌ No |
| Borrar storage de la extensión | ❌ No |
| Borrar cookies del navegador | ❌ No |
| Borrar cache | ❌ No |
| Recargar la extensión | ❌ No |
| Usar modo incógnito | ⚠️ **Sí** (nuevo contexto de navegador) |
| Cambiar de navegador | ✅ Sí (otro dispositivo lógico) |
| Cambiar de dispositivo | ✅ Sí (legítimo) |
| Usar VPN | ❌ No (IP no se usa en fingerprint) |
| Cambiar resolución de pantalla | ⚠️ Posible (si cambia significativamente) |

## Flujo técnico

### 1. Primera instalación (usuario anónimo)

```javascript
// popup.js → restoreState()
const fingerprint = await getDeviceFingerprint();
// Resultado: "a3f2c8d9e1b4567890abcdef..."

// Se guarda en chrome.storage.local
chrome.storage.local.set({ anonymous_id: fingerprint });

// Se envía al backend en cada sesión
POST /api/session
{
  "anonymous_id": "a3f2c8d9e1b4567890abcdef...",
  "profile_type": "candidato",
  "session_number": 1
}
```

### 2. Desinstalar/reinstalar

```javascript
// popup.js → restoreState()
const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
// Resultado: undefined (storage borrado)

const fingerprint = await getDeviceFingerprint();
// Resultado: "a3f2c8d9e1b4567890abcdef..." (¡el mismo!)

// Se guarda de nuevo
chrome.storage.local.set({ anonymous_id: fingerprint });

// Backend ve el mismo fingerprint → cuenta las sesiones anteriores
GET /api/usage?anonymous_id=a3f2c8d9e1b4567890abcdef...
// Respuesta: { "session_count": 5, "limit": 5, "remaining": 0 }
```

### 3. Usuario se registra

```javascript
// Usuario inicia sesión con Google
// Backend detecta: usuario autenticado + fingerprint con sesiones anónimas

GET /api/usage?anonymous_id=a3f2c8d9e1b4567890abcdef...
// El endpoint automáticamente migra las sesiones:
// - Sesiones anónimas del fingerprint → asignadas al user_id
// - total_sessions del usuario = sesiones anónimas migradas

// Resultado:
// - Usuario tiene las 5 sesiones anónimas contadas
// - Le quedan 10 sesiones gratuitas más (15 total - 5 usadas = 10)
```

## Base de datos

### Tabla `usage_sessions`

```sql
id               uuid
user_id          uuid (null si anónimo, user_id si autenticado)
anonymous_id     text (fingerprint si anónimo, null si autenticado)
profile_type     text
started_at       timestamptz
session_number   integer
```

### Ejemplo de datos

**Usuario anónimo usa 3 sesiones:**
```sql
INSERT INTO usage_sessions (user_id, anonymous_id, session_number)
VALUES
  (null, 'a3f2c8d9e1b4567890abcdef...', 1),
  (null, 'a3f2c8d9e1b4567890abcdef...', 2),
  (null, 'a3f2c8d9e1b4567890abcdef...', 3);
```

**Usuario se registra → migración automática:**
```sql
UPDATE usage_sessions
SET user_id = '123e4567-e89b-12d3-a456-426614174000',
    anonymous_id = null
WHERE anonymous_id = 'a3f2c8d9e1b4567890abcdef...'
  AND user_id IS NULL;

-- Resultado:
-- user_id = 123e4567-e89b-12d3-a456-426614174000
-- anonymous_id = null
-- Las 3 sesiones ahora pertenecen al usuario autenticado
```

## Limitaciones conocidas

### 1. Modo incógnito
- Genera un fingerprint diferente
- **Solución**: Es una limitación aceptable (los usuarios avanzados pueden tener sesiones extra)
- **Mitigación futura**: Rate limiting por IP (Sesión 7)

### 2. Múltiples navegadores
- Chrome, Firefox, Edge → fingerprints diferentes
- **Solución**: Es legítimo que un usuario use múltiples navegadores
- **Mitigación**: Límite total de sesiones en el plan Pro (no ilimitado, sino 100/mes)

### 3. Cambios de hardware
- Actualizar GPU drivers puede cambiar el WebGL fingerprint
- **Solución**: Poco común, impacto mínimo

### 4. Extensions que bloquean fingerprinting
- Privacy Badger, Canvas Defender → pueden randomizar el canvas fingerprint
- **Solución**: Si el usuario usa estas extensiones, probablemente no está pirateando
- **Mitigación**: Detectar fingerprints inconsistentes (si cambia cada vez) → forzar login

## Código clave

### Generación del fingerprint
```javascript
// extension/device-fingerprint.js
async function getDeviceFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    await generateCanvasFingerprint(),
    generateWebGLFingerprint(),
    await generateAudioFingerprint()
  ];

  const fingerprint = components.join('|||');
  return await hashString(fingerprint); // SHA-256
}
```

### Uso en popup
```javascript
// extension/popup/popup.js
async function restoreState() {
  const { anonymous_id } = await chrome.storage.local.get('anonymous_id');
  if (!anonymous_id) {
    const fingerprint = await getDeviceFingerprint();
    await chrome.storage.local.set({ anonymous_id: fingerprint });
  }
}
```

### Verificación backend
```javascript
// app/api/usage/route.ts
GET /api/usage?anonymous_id=<fingerprint>

// Cuenta sesiones por fingerprint:
SELECT COUNT(*) FROM usage_sessions
WHERE anonymous_id = '<fingerprint>'
  AND user_id IS NULL;
```

## Métricas de éxito

Para validar que el sistema funciona:

1. **Tasa de conversión de paywall suave** (sesión 6)
   - Objetivo: >30% de usuarios anónimos se registran
2. **Intentos de "pirateo" detectados**
   - Métrica: Usuarios con >5 sesiones anónimas (imposible sin pirateo)
   - Objetivo: <1% de usuarios
3. **Sesiones migradas correctamente**
   - Métrica: % de usuarios registrados con sesiones previas migradas
   - Objetivo: >80%

## Próximas mejoras (post-MVP)

1. **Rate limiting por IP** — Máximo X sesiones por IP en 24h
2. **Detección de VPN/Proxy** — Bloquear IPs de VPN comerciales conocidas
3. **Behavioral analysis** — Detectar patrones sospechosos (ej: 100 sesiones en 1 día)
4. **Fingerprint inconsistency detection** — Si el fingerprint cambia cada vez → forzar login
5. **Plan Pro con límite mensual** — No ilimitado, sino 100 sesiones/mes (evita abuso)

---

**Última actualización:** Febrero 2026
**Responsable:** Victor Rodríguez
