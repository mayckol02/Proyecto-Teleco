# Ejemplos de Peticiones HTTP - HU-12 Notificaciones

## 🔧 Configuración Previa

```bash
# URLs base
BASE_URL=http://localhost:8083        # MaintenanceService
NOTIFICATION_URL=http://localhost:8090 # NotificationService
MAILHOG_URL=http://localhost:8025     # Web UI para ver emails
```

---

## 📬 1. Crear Solicitud de Mantenimiento

**Endpoint:** `POST /api/requests`  
**Rol requerido:** RESIDENTE  
**Description:** Crea una nueva solicitud de mantenimiento con datos del residente

```bash
curl -X POST http://localhost:8083/api/requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: resident-001" \
  -H "X-User-Role: RESIDENTE" \
  -d '{
    "title": "Puerta del balcón rota",
    "description": "La puerta del balcón no cierra correctamente y hay corriente de aire",
    "propertyId": "APT-501",
    "type": "STRUCTURAL",
    "photoUrl": "https://example.com/photos/puerta-rota.jpg",
    "residentEmail": "juan.perez@example.com",
    "residentName": "Juan Pérez García"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "title": "Puerta del balcón rota",
  "description": "La puerta del balcón no cierra correctamente y hay corriente de aire",
  "propertyId": "APT-501",
  "type": "STRUCTURAL",
  "photoUrl": "https://example.com/photos/puerta-rota.jpg",
  "status": "PENDIENTE",
  "residentId": "resident-001",
  "residentEmail": "juan.perez@example.com",
  "residentName": "Juan Pérez García",
  "assignedTechnicianId": null,
  "createdAt": "2025-11-28T10:30:45.123456",
  "updatedAt": "2025-11-28T10:30:45.123456",
  "completedAt": null,
  "history": [
    {
      "fromStatus": null,
      "toStatus": "PENDIENTE",
      "changedAt": "2025-11-28T10:30:45.123456",
      "changedBy": "resident-001"
    }
  ]
}
```

---

## 👨‍💼 2. Admin Asigna Técnico (Transición: PENDIENTE → EN_PROGRESO)

**Endpoint:** `PUT /api/requests/{id}/assign`  
**Rol requerido:** ADMIN  
**Description:** Admin asigna un técnico a la solicitud  
**⚠️ NOTA:** Esto automáticamente cambia estado a EN_PROGRESO y envía email

```bash
curl -X PUT http://localhost:8083/api/requests/1/assign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: admin-001" \
  -H "X-User-Role: ADMIN" \
  -d '{
    "technicianId": "tech-005"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "title": "Puerta del balcón rota",
  "status": "EN_PROGRESO",
  "assignedTechnicianId": "tech-005",
  ...
  "history": [
    {
      "fromStatus": null,
      "toStatus": "PENDIENTE",
      "changedAt": "2025-11-28T10:30:45.123456",
      "changedBy": "resident-001"
    },
    {
      "fromStatus": "PENDIENTE",
      "toStatus": "EN_PROGRESO",
      "changedAt": "2025-11-28T10:35:20.654321",
      "changedBy": "admin-001"
    }
  ]
}
```

✉️ **Email enviado a:** `juan.perez@example.com`

---

## 🔧 3. Técnico Actualiza Estado (EN_PROGRESO → COMPLETADO)

**Endpoint:** `PUT /api/requests/{id}/status`  
**Rol requerido:** TECNICO o ADMIN  
**Description:** Técnico marca la solicitud como completada

```bash
curl -X PUT http://localhost:8083/api/requests/1/status \
  -H "Content-Type: application/json" \
  -H "X-User-Id: tech-005" \
  -H "X-User-Role: TECNICO" \
  -d '{
    "status": "COMPLETADO"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "status": "COMPLETADO",
  "completedAt": "2025-11-28T10:45:15.987654",
  ...
  "history": [
    {
      "fromStatus": null,
      "toStatus": "PENDIENTE",
      "changedAt": "2025-11-28T10:30:45.123456",
      "changedBy": "resident-001"
    },
    {
      "fromStatus": "PENDIENTE",
      "toStatus": "EN_PROGRESO",
      "changedAt": "2025-11-28T10:35:20.654321",
      "changedBy": "admin-001"
    },
    {
      "fromStatus": "EN_PROGRESO",
      "toStatus": "COMPLETADO",
      "changedAt": "2025-11-28T10:45:15.987654",
      "changedBy": "tech-005"
    }
  ]
}
```

✉️ **Email enviado a:** `juan.perez@example.com`

---

## 📋 4. Obtener Detalles de Solicitud

**Endpoint:** `GET /api/requests/{id}`  
**Descripción:** Recupera toda la información de una solicitud incluyendo historial

```bash
curl -X GET http://localhost:8083/api/requests/1 \
  -H "X-User-Id: resident-001" | jq .
```

---

## 📊 5. Listar Todas las Solicitudes

**Endpoint:** `GET /api/requests`  
**Descripción:** Lista todas las solicitudes de mantenimiento

```bash
curl -X GET http://localhost:8083/api/requests | jq .
```

---

## 📧 6. Envío Directo de Notificación (desde notification-service)

**Endpoint:** `POST /notify/maintenance`  
**Descripción:** Envía una notificación de cambio de estado (llamado automáticamente por MaintenanceService)

```bash
curl -X POST http://localhost:8090/notify/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": 1,
    "recipientEmail": "juan.perez@example.com",
    "recipientName": "Juan Pérez García",
    "oldStatus": "PENDIENTE",
    "newStatus": "EN_PROGRESO",
    "changeDate": "2025-11-28T10:35:20.654321",
    "propertyId": "APT-501"
  }' | jq .
```

**Respuesta:**
```json
{
  "message": "Maintenance notification sent"
}
```

---

## 🧪 Secuencia Completa de Test

```bash
#!/bin/bash

# 1. Crear solicitud
echo "📝 Creando solicitud..."
REQUEST=$(curl -s -X POST http://localhost:8083/api/requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: resident-001" \
  -H "X-User-Role: RESIDENTE" \
  -d '{
    "title": "Fugas de agua en cocina",
    "description": "Hay una fuga bajo el lavaplatos",
    "propertyId": "APT-203",
    "type": "PLUMBING",
    "residentEmail": "maria.garcia@example.com",
    "residentName": "María García"
  }')

ID=$(echo "$REQUEST" | jq -r '.id')
echo "✅ Solicitud creada: ID=$ID"
echo ""

# 2. Esperar un segundo
sleep 1

# 3. Cambiar a EN_PROGRESO
echo "🔧 Asignando técnico..."
curl -s -X PUT http://localhost:8083/api/requests/$ID/assign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: admin-001" \
  -H "X-User-Role: ADMIN" \
  -d '{"technicianId": "tech-010"}' > /dev/null
echo "✅ Email enviado: PENDIENTE → EN_PROGRESO"
echo ""

# 4. Esperar un segundo
sleep 1

# 5. Cambiar a COMPLETADO
echo "✔️ Marcando como completado..."
curl -s -X PUT http://localhost:8083/api/requests/$ID/status \
  -H "Content-Type: application/json" \
  -H "X-User-Id: tech-010" \
  -H "X-User-Role: TECNICO" \
  -d '{"status": "COMPLETADO"}' > /dev/null
echo "✅ Email enviado: EN_PROGRESO → COMPLETADO"
echo ""

# 6. Ver resultado final
echo "📋 Obteniendo resultado final..."
curl -s -X GET http://localhost:8083/api/requests/$ID | jq '.status, .completedAt'
echo ""

echo "════════════════════════════════════════"
echo "✨ Test completado"
echo "📧 Emails enviados a: maria.garcia@example.com"
echo "🌐 Ver en: http://localhost:8025"
```

---

## 📧 Contenido del Email Enviado

**De:** notification-service  
**Asunto:** `Notificación de cambio de estado - Solicitud #1`  
**Cuerpo:**

```
Estimado/a Juan Pérez García,

Le informamos que el estado de su solicitud de mantenimiento ha sido actualizado:

=== DETALLES DE LA SOLICITUD ===
ID de solicitud: 1
Propiedad: APT-501
Estado anterior: Pendiente
Estado actual: En Progreso
Fecha de cambio: 2025-11-28T10:35:20.654321

Si tiene alguna pregunta o inquietud, por favor contacte al administrador.

Saludos cordiales,
Sistema de Mantenimiento de Condominio
```

---

## 🔍 Verificación en Mailhog

**URL:** http://localhost:8025

1. Abre el navegador
2. Busca el email de `juan.perez@example.com`
3. Verifica que contiene:
   - ✅ ID de solicitud
   - ✅ Estado anterior
   - ✅ Estado nuevo
   - ✅ Fecha del cambio
   - ✅ ID de propiedad

---

## ⚠️ Casos de Error

### Error 1: No se envía email
```
❌ Problema: residentEmail es null
✅ Solución: Incluir "residentEmail" en CreateMaintenanceRequestDTO
```

### Error 2: Connection refused a notification-service
```
❌ Problema: notification-service no está corriendo
✅ Solución: docker-compose up
```

### Error 3: Email no llega a Mailhog
```
❌ Problema: Configuración SMTP incorrecta
✅ Solución: Verificar spring.mail.host=localhost, port=1025
```

---

## 📝 Resumen de Estados

```
PENDIENTE (inicial)
    ↓
    → EN_PROGRESO (asignación de técnico o cambio manual)
    ↓
    → COMPLETADO (técnico marca como completado)
    
Cada transición genera un email al residente
```

**Nota:** No hay rollback automático. El estado solo avanza, nunca retrocede.

---

**Última actualización:** 28 de Noviembre de 2025
