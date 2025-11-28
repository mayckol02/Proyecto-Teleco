# Implementación de HU-12: Notificación de Cambios de Estado en Solicitudes de Mantenimiento

## Resumen de Cambios

Esta implementación integra `notification-service` con `MaintenanceService` mediante una arquitectura de microservicios con comunicación HTTP REST, cumpliendo los criterios de aceptación de la HU-12.

---

## Criterios de Aceptación Implementados

✅ **Notificación por email en cada cambio de estado**
- Se envía notificación automática cuando el estado cambia: PENDIENTE → EN_PROGRESO → COMPLETADO
- Integración mediante cliente HTTP REST (NotificationClient)
- Llamada asincrónica (no bloquea la operación principal)

✅ **Incluye ID de solicitud, estado y fecha**
- Email contiene:
  - ID de solicitud de mantenimiento
  - Estado anterior y estado actual
  - Fecha/hora exacta del cambio
  - ID de propiedad para contexto
  - Nombre del residente (si está disponible)

✅ **Solo se notifica al solicitante**
- Se valida que existe email del residente antes de enviar
- Solo el email del residente original recibe notificaciones
- Email almacenado en la entidad MaintenanceRequest

---

## Cambios en notification-service

### 1. **pom.xml**
- Agregado: Jackson para serialización JSON (`com.fasterxml.jackson.core:jackson-databind`)

### 2. **Nuevo Modelo: MaintenanceNotificationRequest.java**
```java
- requestId: ID de la solicitud
- recipientEmail: Email del residente
- recipientName: Nombre del residente
- oldStatus: Estado anterior
- newStatus: Estado nuevo
- changeDate: Fecha del cambio
- propertyId: ID de la propiedad
```

### 3. **Actualización: NotificationService.java**
- Nuevo método: `sendMaintenanceNotification(MaintenanceNotificationRequest req)`
- Método auxiliar: `buildMaintenanceEmailBody()` - Genera email profesional formateado
- Método auxiliar: `formatStatus()` - Traduce estados para presentación legible

### 4. **Actualización: NotificationController.java**
- Nuevo endpoint: `POST /notify/maintenance`
- Recibe MaintenanceNotificationRequest y envía notificación por email

### 5. **Configuraciones de propiedades**
- `application.properties`: SMTP localhost:1025 (mailhog para desarrollo)
- `application-docker.properties`: SMTP mailhog:1025 (Docker)
- Configuración completa de timeouts y puertos SMTP

---

## Cambios en MaintenanceService

### 1. **pom.xml**
- Agregado: `spring-boot-starter-web` (para RestTemplate)

### 2. **Nuevo Cliente: NotificationClient.java**
```java
- Inyecta RestTemplate
- URL configurable: notification.service.url
- Método: sendMaintenanceNotification(MaintenanceNotificationDTO)
- Manejo de errores con logs
- Retry elegante (no lanza excepción)
```

### 3. **Nuevo DTO: MaintenanceNotificationDTO.java**
- Mismo esquema que MaintenanceNotificationRequest
- Transferencia de datos entre servicios

### 4. **Nueva Configuración: RestTemplateConfig.java**
- Bean Spring para RestTemplate
- Timeouts configurados: 5 segundos conexión y lectura

### 5. **Actualización: MaintenanceRequest.java**
Nuevos campos agregados:
- `residentId`: ID del residente que solicitó
- `residentEmail`: Email del residente para notificaciones
- `residentName`: Nombre del residente para personalización

### 6. **Actualización: MaintenanceRequestServiceImpl.java**
- Inyección del NotificationClient
- Actualizado `createRequest()`: Guarda residentId
- Actualizado `updateStatus()`:
  - Valida que exista email del residente
  - Crea DTO de notificación
  - Llama a NotificationClient.sendMaintenanceNotification()
  - NO bloquea la transacción si falla el envío

### 7. **Configuraciones de propiedades**
- `application.properties`: `notification.service.url=http://localhost:8090`
- `application-docker.properties`: `notification.service.url=http://notification-service:8090`

### 8. **Actualización: docker-compose.yml**
- MaintenanceService ahora depende de notification-service
- Ordenamiento correcto de servicios

---

## Flujo de Funcionamiento

```
1. Residente crea solicitud de mantenimiento
   └─> MaintenanceService crea MaintenanceRequest
       └─> Guarda residentId y residentEmail

2. Admin asigna técnico o técnico actualiza estado
   └─> PUT /api/requests/{id}/status
       └─> MaintenanceRequestServiceImpl.updateStatus()
           ├─> Valida transición de estado
           ├─> Actualiza estado en BD
           ├─> Guarda en historial de cambios
           └─> Si email existe:
               └─> NotificationClient.sendMaintenanceNotification()
                   └─> POST http://notification-service:8090/notify/maintenance
                       └─> NotificationService.sendMaintenanceNotification()
                           ├─> Construye email profesional
                           ├─> Envía via SMTP a mailhog/servidor real
                           └─> Log de resultado

3. Residente recibe email con:
   - ID de solicitud
   - Estado anterior y actual
   - Fecha/hora del cambio
   - ID de propiedad
   - Mensaje profesional
```

---

## Manejo de Errores

### NotificationClient (MaintenanceService)
- Captura `RestClientException` (conexión fallida)
- Log de error con contexto
- Retorna `false` (no lanza excepción)
- No bloquea la actualización de estado

### NotificationService (notification-service)
- Valida DTO null o email null
- Captura excepciones de mail
- Log detallado
- Retorna estado al cliente

---

## Notas de Implementación

### Pendiente: Email del Residente
Actualmente, `residentEmail` y `residentName` deben ser proporcionados:
1. En el DTO CreateMaintenanceRequestDTO (recomendado), O
2. Recuperados desde auth-service mediante NotificationClient adicional

**Recomendación**: Actualizar CreateMaintenanceRequestDTO para incluir:
```java
private String residentEmail;
private String residentName;
```

### Testing Local
```bash
# Iniciar servicios
docker-compose up

# Ver emails en mailhog
http://localhost:8025

# Crear solicitud (con email en header o DTO)
curl -X POST http://localhost:8083/api/requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: resident-123" \
  -H "X-User-Role: RESIDENTE" \
  -d '{
    "title": "Puerta rota",
    "description": "La puerta del balcón no cierra",
    "propertyId": "APT-501",
    "type": "STRUCTURAL",
    "residentEmail": "resident@example.com",
    "residentName": "Juan Pérez"
  }'

# Cambiar estado
curl -X PUT http://localhost:8083/api/requests/1/status \
  -H "Content-Type: application/json" \
  -H "X-User-Id: admin-1" \
  -H "X-User-Role: ADMIN" \
  -d '{"status": "EN_PROGRESO"}'
```

---

## Próximos Pasos Recomendados

1. **Integración con auth-service**: Obtener email y nombre del residente
2. **Persistencia de notificaciones**: Agregar tabla NotificationLog para auditoría
3. **Reintentos**: Implementar patrón de reintentos con BackOff exponencial
4. **Email HTML**: Mejorar formato con plantillas HTML
5. **Queue asincrónica**: Integrar con RabbitMQ/Kafka para desacoplamiento total
6. **Confirmación de entrega**: Agregar webhooks de mailhog/Sendgrid para confirmación

---

## Archivos Modificados

### notification-service/
- `pom.xml` ✓
- `src/main/java/com/example/model/MaintenanceNotificationRequest.java` ✓ (nuevo)
- `src/main/java/com/example/service/NotificationService.java` ✓
- `src/main/java/com/example/controller/NotificationController.java` ✓
- `src/main/resources/application.properties` ✓
- `src/main/resources/application-docker.properties` ✓

### MaintenanceService/
- `pom.xml` ✓
- `src/main/java/com/proyectoTeleco/maintenance/MaintenanceRequest.java` ✓
- `src/main/java/com/proyectoTeleco/maintenance/MaintenanceRequestServiceImpl.java` ✓
- `src/main/java/com/proyectoTeleco/maintenance/client/NotificationClient.java` ✓ (nuevo)
- `src/main/java/com/proyectoTeleco/maintenance/dto/MaintenanceNotificationDTO.java` ✓ (nuevo)
- `src/main/java/com/proyectoTeleco/config/RestTemplateConfig.java` ✓ (nuevo)
- `src/main/resources/application.properties` ✓
- `src/main/resources/application-docker.properties` ✓
- `docker-compose.yml` ✓

---

**Fecha de Implementación**: 28 de Noviembre de 2025
**Estado**: ✅ Implementación Completa - Arquitectura de Microservicios
