# 🚀 GUÍA DE COMPILACIÓN Y VERIFICACIÓN - HU-12

## 📋 Requisitos Previos

```bash
# Verificar que tengas instalado:
docker --version         # Docker 20.10+
docker-compose --version # Docker Compose 2.0+
java -version           # OpenJDK 21
mvn -version            # Maven 3.9+
git --version           # Git 2.0+
```

---

## 🛠️ COMPILACIÓN LOCAL (Desarrollo)

### Paso 1: Compilar notification-service

```bash
cd "c:\Users\klmxl\OneDrive\Escritorio\Documentos\proyecto telematica\notification-service"

# Compilar
mvn clean package -DskipTests

# Salida esperada:
# [INFO] Building notification-service 0.0.1-SNAPSHOT
# [INFO] --------
# [INFO] BUILD SUCCESS
# [INFO] Total time: X.XXX s
# [INFO] Finished at: 2025-11-28...
```

### Paso 2: Compilar MaintenanceService

```bash
cd "c:\Users\klmxl\OneDrive\Escritorio\Documentos\proyecto telematica\MaintenanceService"

# Compilar
mvn clean package -DskipTests

# Salida esperada:
# [INFO] Building MaintenanceService 0.0.1-SNAPSHOT
# [INFO] --------
# [INFO] BUILD SUCCESS
```

### Paso 3: Verificar JARs generados

```bash
# notification-service
ls -la notification-service/src/main/resources/application.properties
ls -la notification-service/target/notification-service-0.0.1-SNAPSHOT.jar

# MaintenanceService
ls -la MaintenanceService/src/main/resources/application.properties
ls -la MaintenanceService/target/MaintenanceService-0.0.1-SNAPSHOT.jar
```

---

## 🐳 COMPILACIÓN CON DOCKER

### Paso 1: Build de imágenes Docker

```bash
cd "c:\Users\klmxl\OneDrive\Escritorio\Documentos\proyecto telematica"

# Construir imágenes (toma 3-5 minutos)
docker-compose build

# Salida esperada:
# [+] Building 45.3s (20/20) FINISHED
# => notification-service:latest
# => maintenance-service:latest
# => [...]
```

### Paso 2: Verificar imágenes creadas

```bash
docker images | grep -E "notification|maintenance"

# Salida esperada:
# notification-service      latest    xxx    xxx MB    X minutes ago
# maintenance-service       latest    yyy    yyy MB    X minutes ago
```

---

## ▶️ EJECUCIÓN

### Opción A: Docker Compose (RECOMENDADO)

```bash
cd "c:\Users\klmxl\OneDrive\Escritorio\Documentos\proyecto telematica"

# Iniciar todos los servicios
docker-compose up

# Salida esperada:
# notification-service  | 2025-11-28 10:00:00.000  INFO [...] Tomcat started on port(s): 8090
# maintenance-service   | 2025-11-28 10:00:02.000  INFO [...] Tomcat started on port(s): 8083
# mailhog               | [API] Listening on 0.0.0.0:1025
# mailhog               | [HTTP] Listening on 0.0.0.0:8025

# En modo background:
docker-compose up -d

# Ver logs
docker-compose logs -f notification-service
docker-compose logs -f maintenance-service
```

### Opción B: Ejecución Local (sin Docker)

```bash
# Terminal 1: notification-service
cd notification-service
java -jar target/notification-service-0.0.1-SNAPSHOT.jar

# Terminal 2: MaintenanceService
cd MaintenanceService
java -jar target/MaintenanceService-0.0.1-SNAPSHOT.jar

# Terminal 3: mailhog (si lo tienes instalado)
mailhog
```

---

## ✅ VERIFICACIÓN DE SERVICIOS

### 1. Verificar que los servicios están arriba

```bash
# Check notification-service
curl -s http://localhost:8090/actuator/health | jq .

# Expected:
# {
#   "status": "UP"
# }

# Check maintenance-service
curl -s http://localhost:8083/actuator/health | jq .

# Expected:
# {
#   "status": "UP"
# }
```

### 2. Verificar puertos

```bash
# Windows PowerShell
netstat -ano | findstr "8083\|8090\|1025\|8025"

# Linux/Mac
lsof -i :8083
lsof -i :8090
lsof -i :1025
lsof -i :8025
```

### 3. Verificar logs de inicio

```bash
# Docker
docker-compose logs notification-service | grep -i "started\|mail"
docker-compose logs maintenance-service | grep -i "started\|datasource"

# Local
# Busca en la terminal: "Tomcat started on port"
```

---

## 🧪 PRUEBA FUNCIONAL COMPLETA

### Método 1: Script bash

```bash
cd "c:\Users\klmxl\OneDrive\Escritorio\Documentos\proyecto telematica"
bash test_hu12.sh
```

### Método 2: Peticiones manuales

```bash
# 1. Crear solicitud
curl -X POST http://localhost:8083/api/requests \
  -H "Content-Type: application/json" \
  -H "X-User-Id: resident-001" \
  -H "X-User-Role: RESIDENTE" \
  -d '{
    "title": "Puerta rota",
    "description": "Puerta del balcón rota",
    "propertyId": "APT-501",
    "type": "STRUCTURAL",
    "residentEmail": "test@example.com",
    "residentName": "Test User"
  }' | jq '.id'

# Guardar ID (ej: 1)
REQUEST_ID=1

# 2. Cambiar estado
curl -X PUT http://localhost:8083/api/requests/$REQUEST_ID/status \
  -H "Content-Type: application/json" \
  -H "X-User-Id: admin-1" \
  -H "X-User-Role: ADMIN" \
  -d '{"status": "EN_PROGRESO"}'

# 3. Ver emails en mailhog
# Abrir: http://localhost:8025
```

### Método 3: Postman

1. Importar colección desde `EJEMPLOS_HTTP_HU12.md`
2. Setear variable: `{{base_url}} = http://localhost:8083`
3. Ejecutar requests en orden:
   - POST /api/requests
   - PUT /api/requests/{id}/status
   - GET /api/requests/{id}

---

## 📧 VERIFICAR EMAILS EN MAILHOG

### Acceso web

```
http://localhost:8025
```

### Verificación visual

1. Abre http://localhost:8025 en el navegador
2. Deberías ver 1-2 emails según cambios de estado
3. Cada email debe contener:
   - ✅ Asunto: "Notificación de cambio de estado - Solicitud #X"
   - ✅ De: Notification Service
   - ✅ Para: El email que proporcionaste
   - ✅ Cuerpo: Detalles del cambio de estado

### API REST de Mailhog

```bash
# Ver todos los emails
curl -s http://localhost:1025/api/emails | jq .

# Ver email específico
curl -s http://localhost:1025/api/emails?limit=10 | jq '.[0]'

# Limpiar emails
curl -s -X DELETE http://localhost:1025/api/emails
```

---

## 🔍 VERIFICACIÓN DE LOGS

### Logs de notification-service

```bash
docker-compose logs notification-service | grep -i -E "sent|email|notify"

# Busca mensajes como:
# "Maintenance notification sent to xxx for request 1"
# "Email sent to xxx"
# "Failed to send"
```

### Logs de MaintenanceService

```bash
docker-compose logs maintenance-service | grep -i -E "notification|status|changed"

# Busca mensajes como:
# "Transición de estado inválida" (si hay error)
# Status updates
```

### Logs completos

```bash
# Última hora
docker-compose logs --tail=100

# En tiempo real
docker-compose logs -f

# Servicio específico
docker-compose logs -f maintenance-service
```

---

## 🚨 TROUBLESHOOTING

### Problema 1: "Connection refused" en MaintenanceService → NotificationService

**Síntoma:**
```
Failed to send notification to service. URL: http://notification-service:8090
RestClientException: Connection refused
```

**Causa:** notification-service no está running  
**Solución:**
```bash
# Verificar que está corriendo
docker-compose ps

# Si no está:
docker-compose up -d notification-service

# Ver logs
docker-compose logs notification-service
```

### Problema 2: Email no se envía a Mailhog

**Síntoma:**
```
No emails aparecen en http://localhost:8025
```

**Causas posibles:**
1. Mailhog no está corriendo
2. Configuración SMTP incorrecta
3. NotificationService no responde

**Solución:**
```bash
# Verificar mailhog
docker-compose ps | grep mailhog

# Ver logs de mailhog
docker-compose logs mailhog

# Verificar conectividad
docker-compose exec notification-service \
  bash -c "nc -zv mailhog 1025"
```

### Problema 3: Port already in use

**Síntoma:**
```
Error: Port 8090 is already in use
```

**Solución:**
```bash
# Encontrar proceso
netstat -ano | findstr "8090"

# Detener proceso (Windows)
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
# Cambiar: 8090:8090 → 8091:8090
```

### Problema 4: MaintenanceService no conecta a BD

**Síntoma:**
```
javax.persistence.PersistenceException: No persistence provider
```

**Causa:** JPA mal configurada  
**Solución:**
```bash
# Verificar application.properties
cat MaintenanceService/src/main/resources/application.properties

# Recompilar
mvn clean package -f MaintenanceService/pom.xml -DskipTests
```

---

## 🔐 VERIFICACIÓN DE SEGURIDAD

### 1. Validar roles

```bash
# Sin rol RESIDENTE (debe fallar con 403)
curl -X POST http://localhost:8083/api/requests \
  -H "X-User-Id: user-1" \
  -H "X-User-Role: INVALID_ROLE" \
  -d '{...}'

# Esperado: 403 Forbidden
```

### 2. Headers requeridos

```bash
# Sin headers (debe fallar)
curl -X POST http://localhost:8083/api/requests \
  -H "Content-Type: application/json" \
  -d '{...}'

# Esperado: Error o request incompleto
```

---

## 📊 VERIFICACIÓN DE BASE DE DATOS

### H2 Console (MaintenanceService - desarrollo)

```
http://localhost:8083/h2-console

Driver Class: org.h2.Driver
JDBC URL: jdbc:h2:mem:maintenancedb
User Name: sa
Password: (dejar vacío)
```

### Consultas útiles

```sql
-- Ver solicitudes
SELECT * FROM MAINTENANCE_REQUEST;

-- Ver historial de cambios
SELECT * FROM MAINTENANCE_STATUS_HISTORY;

-- Ver una solicitud específica con historial
SELECT mr.*, msh.* FROM MAINTENANCE_REQUEST mr
LEFT JOIN MAINTENANCE_STATUS_HISTORY msh ON mr.id = msh.request_id
WHERE mr.id = 1
ORDER BY msh.changed_at;
```

---

## ✨ VALIDACIÓN FINAL

Crear un checklist:

- [ ] Servicios inician sin errores
- [ ] notification-service responde en puerto 8090
- [ ] MaintenanceService responde en puerto 8083
- [ ] Mailhog accesible en http://localhost:8025
- [ ] Puedo crear solicitud de mantenimiento
- [ ] Email se envía cuando cambio estado
- [ ] Email contiene info completa
- [ ] Email se envía SOLO al residente
- [ ] Logs muestran transacciones correctas
- [ ] BD tiene registros correctos

---

## 🎓 Próximas Pruebas Recomendadas

1. **Estrés:** Crear 100 solicitudes rápidamente
2. **Carga:** Cambiar estado de 50 solicitudes en paralelo
3. **Integración:** Probar con auth-service real
4. **Producción:** Cambiar SMTP a Sendgrid/AWS SES

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa `CHECKLIST_HU12.md`
2. Revisa logs: `docker-compose logs`
3. Revisa `IMPLEMENTACION_HU12.md` sección de arquitectura
4. Verifica que todos los puertos estén disponibles

---

**Última actualización:** 28 de Noviembre de 2025  
**Versión:** 1.0 - Guía Completa
