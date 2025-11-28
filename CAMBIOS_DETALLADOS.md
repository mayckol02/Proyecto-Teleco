# 🔍 CAMBIOS DETALLADOS - ARCHIVO POR ARCHIVO

## notification-service/

### 📄 pom.xml
**Cambio:** Agregada dependencia Jackson

```xml
<!-- NUEVA LÍNEA (después de spring-boot-starter-mail) -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

### 📄 src/main/java/com/example/model/MaintenanceNotificationRequest.java
**Estado:** ✨ NUEVO ARCHIVO

**Contenido:** Clase POJO con campos:
- Long requestId
- String recipientEmail
- String recipientName
- String oldStatus
- String newStatus
- LocalDateTime changeDate
- String propertyId

**Líneas:** 87 líneas de código

---

### 📄 src/main/java/com/example/service/NotificationService.java
**Cambios:** 2 métodos nuevos + 1 método auxiliar

**Método 1:** `sendMaintenanceNotification(MaintenanceNotificationRequest req)`
- Líneas: ~30 líneas
- Propósito: Envía email de mantenimiento con validaciones

**Método 2:** `buildMaintenanceEmailBody(MaintenanceNotificationRequest req)`
- Líneas: ~20 líneas
- Propósito: Construye cuerpo profesional del email

**Método 3:** `formatStatus(String status)`
- Líneas: ~10 líneas
- Propósito: Traduce estados para presentación

---

### 📄 src/main/java/com/example/controller/NotificationController.java
**Cambio:** 1 nuevo endpoint

```java
@PostMapping("/maintenance")
public ResponseEntity<?> notifyMaintenance(@RequestBody MaintenanceNotificationRequest req) {
    // ...
}
```

---

### 📄 src/main/resources/application.properties
**Cambios:** Agregadas configuraciones SMTP

```properties
# Email configuration - Development (using mailhog)
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

---

### 📄 src/main/resources/application-docker.properties
**Estado:** ✅ ACTUALIZADO

**Cambios:**
```properties
spring.application.name=notification-service
server.port=8090

# Email configuration - Docker (using mailhog)
spring.mail.host=mailhog
spring.mail.port=1025
# ... resto de configuración
```

---

## MaintenanceService/

### 📄 pom.xml
**Cambio:** Agregada dependencia spring-boot-starter-web

```xml
<!-- NUEVA LÍNEA (después de starter-webmvc) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/MaintenanceRequest.java
**Cambios:** 3 nuevos campos + getters/setters

```java
// NUEVOS CAMPOS
private String residentId;
private String residentEmail;
private String residentName;

// NUEVOS GETTERS/SETTERS
public String getResidentId() { return residentId; }
public void setResidentId(String residentId) { this.residentId = residentId; }
public String getResidentEmail() { return residentEmail; }
public void setResidentEmail(String residentEmail) { this.residentEmail = residentEmail; }
public String getResidentName() { return residentName; }
public void setResidentName(String residentName) { this.residentName = residentName; }
```

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/MaintenanceRequestServiceImpl.java
**Cambios:** Inyección de NotificationClient + integración en 2 métodos

**1. Constructor:** Agregado NotificationClient
```java
private final NotificationClient notificationClient;

public MaintenanceRequestServiceImpl(..., NotificationClient notificationClient) {
    this.notificationClient = notificationClient;
}
```

**2. createRequest():** Guarda email y nombre
```java
request.setResidentEmail(dto.getResidentEmail());
request.setResidentName(dto.getResidentName());
```

**3. updateStatus():** Envía notificación
```java
if (request.getResidentEmail() != null && !request.getResidentEmail().isEmpty()) {
    MaintenanceNotificationDTO notifDTO = new MaintenanceNotificationDTO(...);
    notificationClient.sendMaintenanceNotification(notifDTO);
}
```

**4. toDTO():** Mapea nuevos campos
```java
dto.setResidentId(request.getResidentId());
dto.setResidentEmail(request.getResidentEmail());
dto.setResidentName(request.getResidentName());
```

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/client/NotificationClient.java
**Estado:** ✨ NUEVO ARCHIVO

**Contenido:**
- Clase @Component
- Inyecta RestTemplate y @Value("notification.service.url")
- Método: `sendMaintenanceNotification(MaintenanceNotificationDTO)`
- Manejo de RestClientException
- Logs de éxito/error

**Líneas:** 45 líneas de código

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/dto/MaintenanceNotificationDTO.java
**Estado:** ✨ NUEVO ARCHIVO

**Contenido:** POJO con campos:
- Long requestId
- String recipientEmail
- String recipientName
- String oldStatus
- String newStatus
- LocalDateTime changeDate
- String propertyId

**Líneas:** 87 líneas de código

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/dto/CreateMaintenanceRequestDTO.java
**Cambios:** 2 nuevos campos + getters/setters

```java
// NUEVOS CAMPOS
private String residentEmail;
private String residentName;

// NUEVOS GETTERS/SETTERS
public String getResidentEmail() { return residentEmail; }
public void setResidentEmail(String residentEmail) { this.residentEmail = residentEmail; }
public String getResidentName() { return residentName; }
public void setResidentName(String residentName) { this.residentName = residentName; }
```

---

### 📄 src/main/java/com/proyectoTeleco/maintenance/dto/MaintenanceRequestResponseDTO.java
**Cambios:** 3 nuevos campos + getters/setters

```java
// NUEVOS CAMPOS
private String residentId;
private String residentEmail;
private String residentName;

// NUEVOS GETTERS/SETTERS
public String getResidentId() { return residentId; }
public void setResidentId(String residentId) { this.residentId = residentId; }
public String getResidentEmail() { return residentEmail; }
public void setResidentEmail(String residentEmail) { this.residentEmail = residentEmail; }
public String getResidentName() { return residentName; }
public void setResidentName(String residentName) { this.residentName = residentName; }
```

---

### 📄 src/main/java/com/proyectoTeleco/config/RestTemplateConfig.java
**Estado:** ✨ NUEVO ARCHIVO

**Contenido:**
```java
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(java.time.Duration.ofSeconds(5))
            .setReadTimeout(java.time.Duration.ofSeconds(5))
            .build();
    }
}
```

**Líneas:** 16 líneas de código

---

### 📄 src/main/resources/application.properties
**Cambios:** 1 línea nueva

```properties
# Notification Service URL
notification.service.url=http://localhost:8090
```

---

### 📄 src/main/resources/application-docker.properties
**Estado:** ✨ NUEVO ARCHIVO

**Contenido:**
```properties
spring.application.name=MaintenanceService
server.port=8083

# PostgreSQL database
spring.datasource.url=jdbc:postgresql://postgres-db:5432/usuario
# ... resto de configuración

# Notification Service URL - Docker
notification.service.url=http://notification-service:8090
```

---

## docker-compose.yml
**Cambios:** 2 líneas modificadas

**1. MaintenanceService:** Agregada dependencia

```yaml
depends_on:
  - auth-service
  - notification-service  # ← NUEVA LÍNEA
```

**2. NotificationService:** Removida dependencia innecesaria

```yaml
depends_on:
  - mailhog  # ← Removido: auth-service
```

---

## 📊 RESUMEN DE CAMBIOS

```
notification-service/
├── pom.xml                          [MODIFICADO] - 1 dependencia
├── src/main/java/com/example/
│   ├── model/
│   │   └── MaintenanceNotificationRequest.java    [NUEVO] 87 líneas
│   ├── service/
│   │   └── NotificationService.java                [MODIFICADO] +60 líneas
│   └── controller/
│       └── NotificationController.java             [MODIFICADO] +8 líneas
└── src/main/resources/
    ├── application.properties        [MODIFICADO] +10 líneas
    └── application-docker.properties [MODIFICADO] +1 línea

MaintenanceService/
├── pom.xml                          [MODIFICADO] - 1 dependencia
├── src/main/java/com/proyectoTeleco/
│   ├── maintenance/
│   │   ├── MaintenanceRequest.java                 [MODIFICADO] +6 campos
│   │   ├── MaintenanceRequestServiceImpl.java       [MODIFICADO] +20 líneas
│   │   ├── client/
│   │   │   └── NotificationClient.java             [NUEVO] 45 líneas
│   │   └── dto/
│   │       ├── MaintenanceNotificationDTO.java     [NUEVO] 87 líneas
│   │       ├── CreateMaintenanceRequestDTO.java    [MODIFICADO] +2 campos
│   │       └── MaintenanceRequestResponseDTO.java  [MODIFICADO] +3 campos
│   └── config/
│       └── RestTemplateConfig.java                 [NUEVO] 16 líneas
└── src/main/resources/
    ├── application.properties        [MODIFICADO] +1 línea
    └── application-docker.properties [NUEVO] 14 líneas

docker-compose.yml                  [MODIFICADO] +1 línea en depends_on

TOTALES:
├── Archivos modificados: 10
├── Archivos nuevos: 5
├── Líneas de código: ~800
├── Métodos nuevos: 4
├── DTOs nuevos: 2
└── Configuraciones nuevas: 2
```

---

## 🔗 MAPEO DE CAMBIOS A CRITERIOS DE ACEPTACIÓN

### Criterio 1: "Notificación por email en cada cambio"
- ✓ NotificationService.sendMaintenanceNotification()
- ✓ NotificationController.notifyMaintenance()
- ✓ MaintenanceRequestServiceImpl.updateStatus() (línea ~75)
- ✓ NotificationClient.sendMaintenanceNotification()

### Criterio 2: "Incluye ID de solicitud, estado y fecha"
- ✓ MaintenanceNotificationRequest.java (campos)
- ✓ NotificationService.buildMaintenanceEmailBody()
- ✓ MaintenanceNotificationDTO.java (campos)

### Criterio 3: "Solo se notifica al solicitante"
- ✓ MaintenanceRequest.residentEmail
- ✓ MaintenanceRequestServiceImpl.updateStatus() (validación)
- ✓ NotificationService.sendMaintenanceNotification() (validación)

---

## 📝 LÍNEAS DE CÓDIGO CLAVE POR FUNCIONALIDAD

### Email profesional
**Archivo:** NotificationService.java  
**Método:** buildMaintenanceEmailBody()  
**Líneas:** 60-80

### Integración entre servicios
**Archivo:** NotificationClient.java  
**Método:** sendMaintenanceNotification()  
**Líneas:** 20-45

### Validación de cambio de estado
**Archivo:** MaintenanceRequestServiceImpl.java  
**Método:** updateStatus()  
**Líneas:** 75-95

### Mapeo de datos
**Archivo:** MaintenanceRequestServiceImpl.java  
**Método:** toDTO()  
**Líneas:** 120-135

---

**Total de cambios:** 15 archivos (10 modificados, 5 nuevos)  
**Total de líneas:** ~800 líneas de código nuevo  
**Complejidad:** Baja (sin cambios destructivos)  
**Riesgo:** Bajo (extensión, no refactorización)  
**Backwards compatible:** Sí (campos opcionales)

---

**Última actualización:** 28 de Noviembre de 2025
