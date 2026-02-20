# 🔍 Verificar configuración de Deepgram

## PASO 1: Verificar API Key

### 1.1 Ir a la página de API Keys

Ve a: **https://console.deepgram.com/project/keys**

### 1.2 Encontrar tu API key

Busca la API key que empieza con: `3e2f997dfc3b14ef857f0401872d666fa6f434de`

### 1.3 Hacer clic en los 3 puntos (⋮) a la derecha de la key

O hacer clic en la key misma para ver los detalles.

### 1.4 Buscar estas secciones:

**A) Permissions / Scopes**
- ¿Dice "All Scopes" o lista scopes específicos?
- **Esperado**: Debería decir "All Scopes" o tener TODOS los scopes marcados

**B) Allowed Domains / Domain Restrictions**
- ¿Hay algo escrito aquí?
- **Esperado**: Debería estar VACÍO o decir "All domains" o tener `*`
- **Problema**: Si dice dominios específicos como `meet.google.com` únicamente

**C) Allowed IPs / IP Restrictions**
- ¿Hay IPs listadas?
- **Esperado**: Debería estar VACÍO
- **Problema**: Si hay IPs específicas

**D) Expiration**
- ¿Tiene fecha de expiración?
- **Esperado**: "Never" o "None"

### 1.5 Qué hacer si encuentras restricciones

**Si hay restricciones de dominio:**
1. Clic en "Edit" o "Update"
2. Cambiar a "All domains" o agregar `*`
3. Guardar

**Si hay restricciones de IP:**
1. Clic en "Edit" o "Update"
2. Eliminar todas las IPs
3. Guardar

**Si no tiene "All Scopes":**
1. Eliminar esta API key
2. Crear una nueva con "All Scopes" seleccionado

---

## PASO 2: Verificar configuración del Proyecto

### 2.1 Ir a Settings del proyecto

Ve a: **https://console.deepgram.com/project/settings**

O en el menú lateral:
- Settings
- Project Settings

### 2.2 Buscar secciones de seguridad

Busca cualquiera de estas secciones (pueden tener nombres diferentes):

- **CORS Settings**
- **API Security**
- **Domain Whitelist**
- **WebSocket Settings**
- **Allowed Origins**

### 2.3 ¿Qué hacer si encuentras algo configurado?

**Si ves dominios específicos:**
- Agregar `*` (permitir todos)
- O agregar: `chrome-extension://*`
- O agregar: `file://*`

**Si ves opciones de WebSocket deshabilitadas:**
- Habilitar WebSocket API
- Habilitar Streaming API

---

## PASO 3: Tomar capturas de pantalla

Si encuentras CUALQUIER configuración en las secciones anteriores, toma una captura de pantalla y compártela.

Específicamente:
1. Captura de la página de API Keys mostrando los detalles de tu key
2. Captura de Settings del proyecto si hay algo relacionado con CORS/Dominios/WebSocket

---

## ✅ Checklist rápido

Marca con ✅ lo que verificaste:

**API Key:**
- [ ] Tiene "All Scopes" seleccionado
- [ ] NO tiene restricciones de dominio (o tiene `*`)
- [ ] NO tiene restricciones de IP
- [ ] NO tiene fecha de expiración

**Proyecto:**
- [ ] NO tiene CORS configurado (o permite todos los orígenes)
- [ ] NO tiene domain whitelist restrictiva
- [ ] WebSocket/Streaming API está habilitado

---

## 🚨 Si NO encuentras ninguna de estas opciones

Es posible que Deepgram haya cambiado la interfaz o que tu plan no tenga acceso a estas configuraciones.

En ese caso:
1. Toma una captura de pantalla de la página de API Keys
2. Toma una captura de pantalla de Settings
3. Comparte las capturas

O directamente proceder con la **solución del proxy backend** que garantiza que funcione.

---

## 🎯 Resultado esperado

Después de verificar todo:

**Si NO hay restricciones** → El problema es que Deepgram bloquea WebSocket desde `file://` y `chrome-extension://` por diseño. **Solución: Proxy backend**.

**Si SÍ hay restricciones** → Eliminarlas y probar de nuevo el test-deepgram.html.
