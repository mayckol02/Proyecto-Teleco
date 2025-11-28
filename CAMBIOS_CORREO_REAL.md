# ✅ RESUMEN DE CAMBIOS - CORREO REAL

## 🎯 Cambios Realizados

Se ha actualizado la configuración para enviar **correos reales** en lugar de simulación con mailhog.

---

## 📝 Archivos Modificados

### 1️⃣ RestTemplateConfig.java

**Archivo:** `MaintenanceService/src/main/java/com/proyectoTeleco/config/RestTemplateConfig.java`

**Cambio:** Simplificado para usar `SimpleClientHttpRequestFactory` en lugar de `RestTemplateBuilder`

**Antes:**
```java
@Bean
public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
}
```

**Después:**
```java
@Bean
public RestTemplate restTemplate() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(5000); // 5 segundos
    factory.setReadTimeout(5000);    // 5 segundos
    return new RestTemplate(factory);
}
```

**Razón:** Evitar dependencia en `RestTemplateBuilder` que requiere imports adicionales

---

### 2️⃣ notification-service/application.properties

**Archivo:** `notification-service/src/main/resources/application.properties`

**Cambios:** Reemplazar configuración mailhog por SMTP real

**Antes:**
```properties
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
```

**Después:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:tu-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:tu-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

**Razón:** Usar proveedor SMTP real (Gmail) con variables de entorno

---

### 3️⃣ notification-service/application-docker.properties

**Archivo:** `notification-service/src/main/resources/application-docker.properties`

**Cambios:** Reemplazar configuración mailhog por SMTP real

**Antes:**
```properties
spring.mail.host=mailhog
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
```

**Después:**
```properties
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
mail.from=${MAIL_FROM:noreply@telematica.local}
```

---

### 4️⃣ MaintenanceService/application.properties

**Archivo:** `MaintenanceService/src/main/resources/application.properties`

**Cambios:** Agregar configuración SMTP real

**Agregado:**
```properties
# Email Configuration - Correo Real (Gmail, SendGrid, etc.)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
mail.from=noreply@telematica.local
```

---

### 5️⃣ MaintenanceService/application-docker.properties

**Archivo:** `MaintenanceService/src/main/resources/application-docker.properties`

**Cambios:** Agregar configuración SMTP real

**Agregado:**
```properties
# Email Configuration - Docker (Correo Real)
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
mail.from=${MAIL_FROM:noreply@telematica.local}
```

---

## 🚀 CÓMO USAR

### Paso 1: Obtener credenciales

#### Para Gmail:
1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona "Mail" y "Windows Computer"
3. Copia la contraseña de 16 caracteres

#### Para SendGrid:
1. Regístrate en https://sendgrid.com
2. Crea una API Key en Settings → API Keys
3. Copia la API Key

### Paso 2: Configurar variables de entorno

**Windows PowerShell:**
```powershell
$env:MAIL_USERNAME="tu-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

**Linux/Mac:**
```bash
export MAIL_USERNAME="tu-email@gmail.com"
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

### Paso 3: Ejecutar servicios

```bash
# Ir a MaintenanceService
cd MaintenanceService
mvn spring-boot:run

# En otra terminal, ir a notification-service
cd notification-service
mvn spring-boot:run
```

### Paso 4: Probar

```bash
# Crear solicitud
curl -X POST http://localhost:8083/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Prueba",
    "propertyId": "001",
    "residentEmail": "recipient@example.com",
    "residentName": "Juan Pérez"
  }'

# Cambiar estado (envía email)
curl -X PATCH http://localhost:8083/api/maintenance/1/status \
  -H "Content-Type: application/json" \
  -d '{"newStatus": "EN_PROGRESO"}'
```

**Resultado esperado:** Email real en la bandeja de `recipient@example.com`

---

## 📊 Comparativa

| Aspecto | Antes (mailhog) | Después (SMTP real) |
|---------|-----------------|-------------------|
| Correo enviado | Simulado | Real |
| Destinatario | Solo local | Cualquiera |
| Verificación | Ver en Web UI | Bandeja de correo |
| Producción | ❌ NO | ✅ SÍ |
| Desarrollo | ✅ Fácil | ✅ Fácil |

---

## ⚠️ IMPORTANTE

### Seguridad
- ✅ **DO:** Usar variables de entorno
- ❌ **DON'T:** Guardar credenciales en código

### Fallo en envío
- El NotificationClient captura excepciones y **NO bloquea** la operación
- Si falla el email, la solicitud se crea igualmente
- Ver logs para diagnosticar problemas

---

## 📖 Documentación Completa

Ver archivo: **CONFIGURACION_CORREO_REAL.md**

Contiene:
- Todas las opciones de proveedores SMTP
- Guías detalladas por proveedor
- Solución de problemas
- Comparativa de precios

---

**Última actualización:** 28 de Noviembre de 2025
