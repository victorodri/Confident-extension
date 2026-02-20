# 🔧 Solución Error 1006 WebSocket Deepgram

## ❌ Problema actual

Error **1006 (cierre anormal)** al conectar WebSocket con Deepgram, **incluso con API key válida**.

**Síntoma confirmado**: Error 1006 tanto en la extensión como en HTML standalone → el problema es la **configuración de la API key**.

---

## ✅ Checklist de verificación Deepgram

### 1. Verificar configuración de API Key

Ve a: **https://console.deepgram.com/project/keys**

Verifica que tu API key tenga:

- [ ] **Role**: Member o Owner (NO "Read Only")
- [ ] **Scopes habilitados**:
  - [ ] `usage:write`
  - [ ] `usage:read`
  - [ ] `member:read`
  - [ ] `member:write`
  - [ ] O mejor: **ALL SCOPES** seleccionado
- [ ] **Sin restricciones de dominio** (o agrega `*` para permitir todos)
- [ ] **Sin restricciones de IP**
- [ ] **Expiration**: None o fecha futura

### 2. Verificar créditos

Ve a: **https://console.deepgram.com/billing**

- [ ] Tienes crédito disponible (> $0)
- [ ] Tu plan es "Pay As You Go" o superior

### 3. Crear nueva API Key (⭐ RECOMENDADO)

Si tu key actual tiene restricciones o falla:

1. **Elimina** la API key actual en console.deepgram.com
2. Crea una **nueva** con:
   - **Name**: "Confident Extension"
   - **Expiration**: None
   - **Scopes**: ✅ Select all (CRÍTICO)
   - **Tags**: (opcional)
3. **Copia** la nueva key inmediatamente
4. Actualiza en:
   - Popup de la extensión (guárdala ahí)
   - `.env.local` → `NEXT_PUBLIC_DEEPGRAM_API_KEY`

---

## 🧪 Probar API Key con curl

```bash
cd /Users/victormanuelrodriguezgutierrez/Desktop/Confident
chmod +x test-deepgram-curl.sh
./test-deepgram-curl.sh
```

Este script verifica:
1. ✅ Si la API key es válida (REST)
2. ✅ Si tiene permisos de streaming (POST audio)

---

## 🔍 Causas comunes del error 1006

### Causa 1: API key sin scopes correctos ⭐ MÁS PROBABLE
**Síntoma**: Funciona en REST pero falla en WebSocket
**Solución**: Crear nueva key con **ALL SCOPES** seleccionado

### Causa 2: Restricciones de dominio
**Síntoma**: Falla desde browser pero funciona con curl
**Solución**: Eliminar restricciones de dominio en la key

### Causa 3: Deepgram bloquea `file://` protocol
**Síntoma**: Error 1006 inmediato en test-deepgram.html
**Solución**: Probar desde `localhost` con servidor HTTP

### Causa 4: CORS configurado en proyecto
**Síntoma**: Error de CORS en consola del browser
**Solución**: Verificar CORS settings en console.deepgram.com

---

## 🚀 Solución alternativa: Proxy via backend

Si después de verificar TODO lo anterior sigue fallando, podemos usar el backend de Vercel como proxy:

### Arquitectura actual (❌ Falla):
```
Extension (browser) → WebSocket directo → Deepgram
```

### Arquitectura alternativa (✅ Funciona siempre):
```
Extension → HTTP POST → Backend Vercel → WebSocket → Deepgram
                     ↓
                  Response
```

**Ventajas:**
- ✅ No expone API key en extensión
- ✅ Funciona con cualquier configuración de Deepgram
- ✅ Permite rate limiting y analytics
- ✅ Más seguro (backend valida JWT antes de usar Deepgram)

**Desventajas:**
- ⚠️ Latencia +100-200ms (porque pasa por Vercel)
- ⚠️ Más complejo de implementar
- ⚠️ Dependencia del backend (si Vercel cae, no funciona)

---

## 📋 Próximos pasos

### PASO 1: Crear nueva API key con ALL SCOPES ⭐
1. Ir a https://console.deepgram.com/project/keys
2. Eliminar key actual
3. Crear nueva con **ALL SCOPES** seleccionado
4. Copiar y guardar

### PASO 2: Probar con curl
```bash
./test-deepgram-curl.sh
```

### PASO 3: Probar con HTML standalone
```bash
open extension/test-deepgram.html
# Pegar la NUEVA API key
# Clic en "Probar Conexión"
```

### PASO 4: Si funciona en HTML, probar en extensión
1. Recargar extensión en `chrome://extensions`
2. Ir a Google Meet
3. Abrir Side Panel de Confident
4. Iniciar sesión

### PASO 5: Si SIGUE fallando → Implementar proxy backend
Contactar a Claude para implementar la solución alternativa.

---

## 🆘 Si nada funciona

Contactar soporte de Deepgram:
- Email: support@deepgram.com
- Discord: https://discord.gg/deepgram
- Mensaje: "Error 1006 WebSocket connection from browser with valid API key and ALL SCOPES"

Incluir:
- API key (primeros 8 caracteres)
- Project ID
- Parámetros usados: `encoding=linear16&sample_rate=16000`
- Browser: Chrome + versión
- Screenshot del error en console

---

## 📝 Historial de troubleshooting

### Sesión actual
- ❌ Error 1006 con parámetros completos
- ❌ Error 1006 con configuración MINIMAL (encoding + sample_rate)
- ❌ Error 1006 en HTML standalone (descarta problema de extensión)
- ✅ Tienes crédito ($199.65)
- ✅ Permisos Member
- ❓ Scopes de la API key pendientes de verificar

**Conclusión**: El problema es la **configuración de scopes en la API key**, no el código.
