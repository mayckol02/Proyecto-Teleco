# 📊 Diagramas de Secuencia - HU-12 Notificaciones

## Diagrama 1: Crear Solicitud de Mantenimiento

```
┌──────────┐                    ┌─────────────────┐
│ Residente│                    │ MaintenanceService
└────┬─────┘                    └────────┬────────┘
     │                                   │
     │ 1. POST /api/requests             │
     │─────────────────────────────────→ │
     │ (residentEmail, residentName)     │
     │                                   │
     │                    ┌──────────────────────────┐
     │                    │ Guardar MaintenanceRequest
     │                    │ con datos del residente │
     │                    └──────────────────────────┘
     │                                   │
     │ 2. 200 OK (ResponseDTO)           │
     │ ← ───────────────────────────────│
     │ (id, status=PENDIENTE)            │
     │                                   │

✅ El email NO se envía en creación (solo datos iniciales)
```

---

## Diagrama 2: Admin Asigna Técnico (PENDIENTE → EN_PROGRESO)

```
┌───────┐               ┌─────────────────┐              ┌────────────────┐
│ Admin │               │ Maintenance Srv │              │ Notification Srv
└───┬───┘               └────────┬────────┘              └────────┬───────┘
    │                           │                                  │
    │ 1. PUT /api/requests/1/assign
    │ (technicianId)            │                                  │
    │ ─────────────────────────→ │                                  │
    │                           │                                  │
    │                ┌──────────────────────────┐                  │
    │                │ Validar transición Estado│                  │
    │                │ PENDIENTE → EN_PROGRESO  │                  │
    │                └──────────────────────────┘                  │
    │                           │                                  │
    │                ┌──────────────────────────┐                  │
    │                │ Actualizar BD            │                  │
    │                │ - status = EN_PROGRESO   │                  │
    │                │ - assignedTechnicianId   │                  │
    │                │ - Crear historial        │                  │
    │                └──────────────────────────┘                  │
    │                           │                                  │
    │                ┌──────────────────────────┐                  │
    │                │ Crear notificación DTO  │                  │
    │                │ - requestId: 1           │                  │
    │                │ - recipient: juan@...   │                  │
    │                │ - oldStatus: PENDIENTE   │                  │
    │                │ - newStatus: EN_PROGRESO │                  │
    │                │ - changeDate: now()      │                  │
    │                └──────────────────────────┘                  │
    │                           │                                  │
    │                           │ 2. POST /notify/maintenance      │
    │                           │────────────────────────────────→ │
    │                           │ (MaintenanceNotificationRequest) │
    │                           │                                  │
    │                           │    ┌────────────────────────┐    │
    │                           │    │ Construir email:       │    │
    │                           │    │ - Validar datos        │    │
    │                           │    │ - Formatear body       │    │
    │                           │    │ - Asunto profesional   │    │
    │                           │    └────────────────────────┘    │
    │                           │                                  │
    │                           │    ┌────────────────────────┐    │
    │                           │    │ Enviar via SMTP:       │    │
    │                           │    │ → mailhog:1025 (dev)   │    │
    │                           │    │ → real SMTP (prod)     │    │
    │                           │    └────────────────────────┘    │
    │                           │                                  │
    │                           │ 3. 200 OK                        │
    │                           │←────────────────────────────────│
    │                           │ (success: true)                  │
    │                           │                                  │
    │ 4. 200 OK (ResponseDTO)   │                                  │
    │← ─────────────────────────│                                  │
    │ (status: EN_PROGRESO)     │                                  │
    │                           │                                  │

✉️ Email enviado a: juan.perez@example.com
   Asunto: "Notificación de cambio de estado - Solicitud #1"
   Contenido: PENDIENTE → EN_PROGRESO
```

---

## Diagrama 3: Técnico Marca Completado (EN_PROGRESO → COMPLETADO)

```
┌────────┐               ┌─────────────────┐              ┌────────────────┐
│Técnico │               │ Maintenance Srv │              │ Notification Srv
└───┬────┘               └────────┬────────┘              └────────┬───────┘
    │                            │                                 │
    │ 1. PUT /api/requests/1/status
    │ (status: COMPLETADO)       │                                 │
    │ ────────────────────────→  │                                 │
    │                            │                                 │
    │                 ┌──────────────────────────┐                 │
    │                 │ Validar transición Estado│                 │
    │                 │ EN_PROGRESO → COMPLETADO │                 │
    │                 └──────────────────────────┘                 │
    │                            │                                 │
    │                 ┌──────────────────────────┐                 │
    │                 │ Actualizar BD            │                 │
    │                 │ - status = COMPLETADO    │                 │
    │                 │ - completedAt = now()    │                 │
    │                 │ - Crear historial        │                 │
    │                 └──────────────────────────┘                 │
    │                            │                                 │
    │                 ┌──────────────────────────┐                 │
    │                 │ Validar residentEmail    │                 │
    │                 │ != null ✓                │                 │
    │                 └──────────────────────────┘                 │
    │                            │                                 │
    │                 ┌──────────────────────────┐                 │
    │                 │ Crear notificación DTO  │                 │
    │                 │ - requestId: 1           │                 │
    │                 │ - recipient: juan@...   │                 │
    │                 │ - oldStatus: EN_PROGRESO │                 │
    │                 │ - newStatus: COMPLETADO  │                 │
    │                 │ - changeDate: now()      │                 │
    │                 └──────────────────────────┘                 │
    │                            │                                 │
    │                            │ 2. POST /notify/maintenance     │
    │                            │────────────────────────────────→ │
    │                            │ (MaintenanceNotificationRequest) │
    │                            │                                 │
    │                            │    ┌────────────────────────┐   │
    │                            │    │ Enviar email           │   │
    │                            │    │ vía SMTP               │   │
    │                            │    └────────────────────────┘   │
    │                            │                                 │
    │                            │ 3. 200 OK                       │
    │                            │←────────────────────────────────│
    │                            │                                 │
    │ 4. 200 OK (ResponseDTO)    │                                 │
    │← ───────────────────────── │                                 │
    │ (status: COMPLETADO)       │                                 │
    │ (completedAt: timestamp)   │                                 │
    │                            │                                 │

✉️ Email enviado a: juan.perez@example.com
   Asunto: "Notificación de cambio de estado - Solicitud #1"
   Contenido: EN_PROGRESO → COMPLETADO
```

---

## Diagrama 4: Manejo de Error (Service No Disponible)

```
┌────────┐               ┌─────────────────┐              ┌────────────────┐
│Usuario │               │ Maintenance Srv │              │ Notification Srv
└───┬────┘               └────────┬────────┘              └────────┬───────┘
    │                            │                                 │
    │ 1. PUT /api/requests/1/status
    │                            │                                 │
    │                            │ Actualizar estado en BD ✓        │
    │                            │                                 │
    │                            │ 2. POST /notify/maintenance     │
    │                            │────────────────────────────────→ │❌
    │                            │                  (timeout/error) X
    │                            │                                  
    │                            │    ┌────────────────────────┐    
    │                            │    │ RestClientException    │    
    │                            │    │ caught                 │    
    │                            │    └────────────────────────┘    
    │                            │                                  
    │                            │ LOG: Error sending notification  
    │                            │ "Failed to send notification     
    │                            │  to service. URL: ..., Req: 1"  
    │                            │                                  
    │ 3. 200 OK (ResponseDTO)    │                                  
    │← ───────────────────────── │                                  
    │ (status: updated ✓)        │                                  
    │                            │                                  

⚠️ IMPORTANTE: La operación NO FALLA
   ✅ Estado actualizado en BD
   ❌ Email no enviado (pero se logea)
   ✓ Usuario sigue adelante
```

---

## Diagrama 5: Flujo Completo (Happy Path)

```
                         TIMELINE COMPLETO
                         
┌─ CREAR SOLICITUD ──────────────────────────────────────────────┐
│ T=0s  Residente crea solicitud                                 │
│       MaintenanceRequest guardada con datos                    │
│       Status: PENDIENTE                                        │
└────────────────────────────────────────────────────────────────┘

┌─ ASIGNAR TÉCNICO ──────────────────────────────────────────────┐
│ T=10s Admin asigna técnico                                     │
│       Status: PENDIENTE → EN_PROGRESO                          │
│       📧 EMAIL #1 enviado                                      │
│           "Tu solicitud ha sido asignada"                      │
└────────────────────────────────────────────────────────────────┘

┌─ TRABAJO EN PROGRESO ──────────────────────────────────────────┐
│ T=10s-120s Técnico trabaja en la solicitud                    │
│           Sin cambios de estado                                │
│           Sin emails                                           │
└────────────────────────────────────────────────────────────────┘

┌─ COMPLETAR TRABAJO ────────────────────────────────────────────┐
│ T=120s Técnico marca como completado                           │
│        Status: EN_PROGRESO → COMPLETADO                        │
│        completedAt = T=120s                                    │
│        📧 EMAIL #2 enviado                                     │
│            "Tu solicitud ha sido completada"                   │
└────────────────────────────────────────────────────────────────┘

RESIDENTE RECIBE:
📧 Email #1 (T≈10s): "Solicitud #1 - Pendiente → En Progreso"
📧 Email #2 (T≈120s): "Solicitud #1 - En Progreso → Completado"

BASE DE DATOS:
┌─ MaintenanceRequest ─────────────────────────────────────┐
│ id: 1                                                    │
│ status: COMPLETADO                                       │
│ residentEmail: juan.perez@example.com                   │
│ residentName: Juan Pérez                                │
│ createdAt: 2025-11-28 10:00:00                         │
│ updatedAt: 2025-11-28 10:02:00                         │
│ completedAt: 2025-11-28 10:02:00                       │
└──────────────────────────────────────────────────────────┘

┌─ MaintenanceStatusHistory (4 registros) ──────────────────┐
│ 1. null → PENDIENTE (T=0s, by: resident-123)             │
│ 2. PENDIENTE → EN_PROGRESO (T=10s, by: admin-1)          │
│ 3. (si hubo más cambios)                                 │
│ 4. EN_PROGRESO → COMPLETADO (T=120s, by: tech-5)         │
└──────────────────────────────────────────────────────────┘
```

---

## Diagrama 6: Estructura del Email Profesional

```
╔════════════════════════════════════════════════════════════════╗
║ FROM: notification-service@condominios.local                  ║
║ TO: juan.perez@example.com                                    ║
║ SUBJECT: Notificación de cambio de estado - Solicitud #1      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ Estimado/a Juan Pérez García,                                 ║
║                                                                ║
║ Le informamos que el estado de su solicitud de                ║
║ mantenimiento ha sido actualizado:                            ║
║                                                                ║
║ === DETALLES DE LA SOLICITUD ===                             ║
║ ID de solicitud: 1                                            ║
║ Propiedad: APT-501                                            ║
║ Estado anterior: Pendiente                                    ║
║ Estado actual: En Progreso                                    ║
║ Fecha de cambio: 2025-11-28T10:35:20.123456                 ║
║                                                                ║
║ Si tiene alguna pregunta o inquietud, por favor               ║
║ contacte al administrador.                                    ║
║                                                                ║
║ Saludos cordiales,                                            ║
║ Sistema de Mantenimiento de Condominio                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Diagrama 7: Arquitectura General (Visión de Servicios)

```
                    ┌──────────────┐
                    │    USUARIO   │
                    │  (Residente) │
                    └──────┬───────┘
                           │ HTTP
                           ▼
                ┌─────────────────────┐
                │  Frontend (React)   │
                └──────────┬──────────┘
                           │ HTTP/JSON
                           ▼
          ┌────────────────────────────────┐
          │   API Gateway / Load Balancer   │
          └─────────┬──────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌──────────────────┐
    │  Auth   │ │Property │ │ Maintenance      │
    │Service  │ │Service  │ │ Service ← AQUÍ   │
    │(8082)   │ │(8084)   │ │ (8083)           │
    └─────────┘ └─────────┘ │                  │
                            │ Integración ↓    │
                            └────────┬─────────┘
                                     │ HTTP REST
                                     │ POST /notify/maintenance
                                     ▼
                            ┌──────────────────┐
                            │ Notification     │
                            │ Service ← AQUÍ   │
                            │ (8090)           │
                            │                  │
                            │ ✅ Recibe call   │
                            │ ✅ Envía email   │
                            └────────┬─────────┘
                                     │ SMTP
                                     │ (localhost:1025 - dev)
                                     │ (mailhog:1025 - docker)
                                     │ (smtp.sendgrid.net - prod)
                                     ▼
                            ┌──────────────────┐
                            │ Mailhog/SMTP     │
                            │ Server           │
                            │                  │
                            │ 1025: SMTP       │
                            │ 8025: Web UI     │
                            └──────────────────┘
```

---

**Última actualización:** 28 de Noviembre de 2025  
**Estado:** Diagramas Completos - Listos para Referencia
