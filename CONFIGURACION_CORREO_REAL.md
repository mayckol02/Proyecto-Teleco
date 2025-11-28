# 📧 CONFIGURACIÓN DE CORREO REAL

## 🎯 Estado Actual

Los servicios están configurados para usar **SMTP real** (Gmail, Outlook, SendGrid, etc.) en lugar de simulación con mailhog.

---

## 📋 OPCIONES DE CONFIGURACIÓN

### Opción 1: Gmail (Recomendado para desarrollo)

#### Requisitos:
1. Cuenta de Gmail activa
2. Habilitar "Contraseñas de aplicación" en Google

#### Pasos:
1. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona "Mail" y "Windows Computer"
3. Google generará una contraseña de 16 caracteres
4. Guarda esa contraseña

#### Configuración:

**Variables de entorno:**
```bash
# Linux/Mac
export MAIL_USERNAME="tu-email@gmail.com"
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"  # La contraseña de 16 caracteres

# Windows PowerShell
$env:MAIL_USERNAME="tu-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

**En application.properties:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

### Opción 2: SendGrid (Recomendado para producción)

#### Requisitos:
1. Cuenta SendGrid (gratis hasta 100 emails/día)
2. API Key de SendGrid

#### Pasos:
1. Regístrate en [sendgrid.com](https://sendgrid.com)
2. Crea una API Key en Settings → API Keys
3. Copia la API Key

#### Configuración:

**Variables de entorno:**
```bash
export MAIL_HOST="smtp.sendgrid.net"
export MAIL_PORT="587"
export MAIL_USERNAME="apikey"
export MAIL_PASSWORD="SG.xxxxxxxxxxxxxxxxxxx"
```

**En application.properties:**
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=SG.xxxxxxxxxxxxxxxxxxx
```

---

### Opción 3: Outlook/Office365

#### Configuración:

```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
spring.mail.username=tu-email@outlook.com
spring.mail.password=tu-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

### Opción 4: SMTP Personalizado (Tu empresa)

```properties
spring.mail.host=smtp.tuempresa.com
spring.mail.port=587
spring.mail.username=usuario@tuempresa.com
spring.mail.password=contraseña
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🚀 EJECUCIÓN EN DESARROLLO

### Opción A: Con variables de entorno (Recomendado)

```bash
# Windows PowerShell
$env:MAIL_USERNAME="tu-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"

# Ejecutar con Maven
cd MaintenanceService
mvn spring-boot:run

# En otra terminal
cd notification-service
mvn spring-boot:run
```

### Opción B: Editar application.properties directamente

⚠️ **NO recomendado**: Expone credenciales en código

```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
```

### Opción C: Con archivo .env (usa plugin)

Requiere `spring-boot-dotenv` plugin:

```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>2.5.4</version>
</dependency>
```

Crea `.env` en raíz:
```
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

---

## 🐳 EJECUCIÓN EN DOCKER

### Con docker-compose

Actualiza `docker-compose.yml`:

```yaml
services:
  maintenance-service:
    environment:
      - MAIL_HOST=smtp.gmail.com
      - MAIL_PORT=587
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - MAIL_FROM=noreply@telematica.local

  notification-service:
    environment:
      - MAIL_HOST=smtp.gmail.com
      - MAIL_PORT=587
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - MAIL_FROM=noreply@telematica.local
```

Ejecutar:
```bash
export MAIL_USERNAME="tu-email@gmail.com"
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"

docker-compose up
```

### Con archivo .env

Crea `.env` en la raíz del proyecto:

```
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
```

Docker compose lo leerá automáticamente.

---

## ✅ VERIFICAR QUE FUNCIONA

### Test desde API

```bash
# Crear solicitud de mantenimiento
curl -X POST http://localhost:8083/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Prueba de email",
    "residentEmail": "recipient@example.com",
    "residentName": "Juan Pérez"
  }'

# Cambiar estado (esto envía el email)
curl -X PATCH http://localhost:8083/api/maintenance/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "newStatus": "EN_PROGRESO"
  }'
```

### Ver logs

**notification-service:**
```
2025-11-28 10:15:32 INFO: Enviando email a recipient@example.com
2025-11-28 10:15:33 INFO: Email enviado exitosamente
```

### Verificar en Gmail

Si usas Gmail:
1. Ve a la bandeja de "Sent" (Enviados)
2. Busca emails de "noreply@telematica.local"
3. Los emails de prueba estarán allí

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Failed to connect to SMTP server"

**Causa:** Host o puerto incorrecto  
**Solución:** 
- Verifica MAIL_HOST y MAIL_PORT
- Prueba conectar manualmente: `telnet smtp.gmail.com 587`

### Error: "535 5.7.8 Username and password not accepted"

**Causa:** Credenciales incorrectas  
**Solución:**
- Para Gmail: usa contraseña de aplicación (16 caracteres), no la contraseña normal
- Para SendGrid: username debe ser "apikey" exactamente
- Verifica que no haya espacios en las variables

### Error: "STARTTLS required but not supported"

**Causa:** STARTTLS deshabilitado en servidor  
**Solución:**
```properties
spring.mail.properties.mail.smtp.starttls.enable=false
```

### Email no enviado pero sin error

**Causa:** NotificationClient puede estar ignorando excepción  
**Solución:**
- Revisa logs de notification-service
- Verifica que residentEmail no sea null
- Confirma que el email sea válido

---

## 🔒 SEGURIDAD

### ⚠️ NO HAGAS ESTO

```java
// ❌ MALO: Credenciales en código
spring.mail.password=xxxx xxxx xxxx xxxx

// ❌ MALO: En comentario
// password = "xxxx xxxx xxxx xxxx"

// ❌ MALO: En .properties sin .gitignore
spring.mail.password=xxxx xxxx xxxx xxxx
```

### ✅ HAZLO ASÍ

```java
// ✅ BUENO: Variables de entorno
spring.mail.password=${MAIL_PASSWORD}

// ✅ BUENO: En .env (no versionado)
MAIL_PASSWORD=xxxx xxxx xxxx xxxx

// ✅ BUENO: Secretos en Kubernetes/Docker
environment:
  - MAIL_PASSWORD=${SECRET_MAIL_PASSWORD}
```

### .gitignore

Agrega a `.gitignore`:
```
.env
.env.local
application-prod.properties
```

---

## 📊 COMPARATIVA DE PROVEEDORES

| Proveedor | Gratis | Setup | Límite Diario | Mejor Para |
|-----------|--------|-------|---------------|-----------|
| Gmail | Sí | 5 min | 300 | Desarrollo |
| SendGrid | Sí (100/día) | 5 min | 100 | Producción |
| Outlook | Sí | 5 min | 300 | Microsoft |
| AWS SES | Sí (primeros 62k) | 10 min | Ilimitado | Escala |
| MailerSend | Sí (500/mes) | 5 min | 500 | Transaccional |

---

## 🎓 PRÓXIMOS PASOS

1. **Elige un proveedor** (recomendación: Gmail para dev, SendGrid para prod)
2. **Configura variables de entorno**
3. **Prueba el envío** con una solicitud de mantenimiento
4. **Monitorea logs** para verificar entrega
5. **Implementa retry logic** para fallos (próxima fase)

---

**Última actualización:** 28 de Noviembre de 2025
