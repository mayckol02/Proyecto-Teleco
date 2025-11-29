# Guía de Despliegue en Azure con GitHub Actions

## 📋 Prerequisitos

1. **Azure CLI instalado**
   ```bash
   # Windows
   winget install -e --id Microsoft.AzureCLI
   
   # Verificar instalación
   az --version
   ```

2. **Cuenta de Azure activa**
   ```bash
   az login
   ```

3. **Repositorio en GitHub**
   - Fork o push del código a `mayckol02/Proyecto-Teleco`

---

## 🚀 Paso a Paso

### Paso 1: Ejecutar el script de configuración de Azure

```bash
# Dar permisos de ejecución (Linux/Mac)
chmod +x setup-azure.sh

# Ejecutar el script
./setup-azure.sh

# En Windows con Git Bash
bash setup-azure.sh
```

**Este script creará:**
- ✅ Resource Group: `teleco-rg`
- ✅ Container Registry: `telecoregistry`
- ✅ PostgreSQL Server: `teleco-postgres` con DBs `usuario` y `condominios`
- ✅ Container Apps Environment: `teleco-env`
- ✅ 5 Container Apps (auth, parcial, property, maintenance, notification)
- ✅ Service Principal para GitHub Actions

**⏱️ Tiempo estimado:** 15-20 minutos

---

### Paso 2: Guardar las credenciales

Al finalizar el script, guarda estos valores:

```
ACR_USERNAME: telecoregistry
ACR_PASSWORD: <password-generado>
AZURE_CREDENTIALS: <json-completo>
URLs de servicios: https://xxxxx.azurecontainerapps.io
```

---

### Paso 3: Configurar GitHub Secrets

Ve a tu repositorio en GitHub:
`https://github.com/mayckol02/Proyecto-Teleco/settings/secrets/actions`

Crea estos **Repository Secrets**:

| Secret Name | Valor |
|------------|-------|
| `AZURE_CREDENTIALS` | El JSON completo del Service Principal |
| `AZURE_REGISTRY_USERNAME` | `telecoregistry` |
| `AZURE_REGISTRY_PASSWORD` | Password del ACR |
| `VITE_API_AUTH_URL` | `https://auth-service.xxx.azurecontainerapps.io` |
| `VITE_API_USERS_URL` | `https://parcial-service.xxx.azurecontainerapps.io` |
| `VITE_API_PROPERTY_URL` | `https://property-service.xxx.azurecontainerapps.io` |
| `VITE_API_MAINTENANCE_URL` | `https://maintenance-service.xxx.azurecontainerapps.io` |
| `VITE_API_NOTIFICATION_URL` | `https://notification-service.xxx.azurecontainerapps.io` |

**Opcional para emails:**
| Secret Name | Valor |
|------------|-------|
| `SPRING_MAIL_USERNAME` | Tu email de Gmail |
| `SPRING_MAIL_PASSWORD` | App Password de Gmail |

---

### Paso 4: Desplegar el Frontend (Azure Static Web Apps)

```bash
# Crear Static Web App
az staticwebapp create \
  --name teleco-frontend \
  --resource-group teleco-rg \
  --location eastus

# Obtener el deployment token
az staticwebapp secrets list \
  --name teleco-frontend \
  --resource-group teleco-rg \
  --query properties.apiKey -o tsv
```

Agrega el token como secret en GitHub:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

### Paso 5: Actualizar las URLs del Frontend

Edita `frontend/src/services/*.ts` para usar variables de entorno:

```typescript
// Ejemplo en authService.ts
const API_URL = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8082';
```

---

### Paso 6: Push a GitHub y activar despliegue

```bash
git add .
git commit -m "feat: Add Azure deployment configuration"
git push origin main
```

Los workflows se activarán automáticamente y desplegarán:
1. ✅ Backend services (auth, parcial, property, maintenance, notification)
2. ✅ Frontend (React app)

**Monitorea el progreso en:**
`https://github.com/mayckol02/Proyecto-Teleco/actions`

---

## 🔄 Flujo de Despliegue Continuo

Cada vez que hagas push a `main`:

1. GitHub Actions detecta cambios en carpetas específicas
2. Construye la imagen Docker
3. La sube a Azure Container Registry
4. Actualiza el Container App correspondiente

**Ejemplo:** Cambio en `auth/**` → Solo redespliega `auth-service`

---

## 📊 Monitoreo y Logs

### Ver logs de un servicio:
```bash
az containerapp logs show \
  --name auth-service \
  --resource-group teleco-rg \
  --follow
```

### Ver estado de servicios:
```bash
az containerapp list \
  --resource-group teleco-rg \
  --output table
```

### Acceder a la base de datos:
```bash
az postgres flexible-server connect \
  --name teleco-postgres \
  --resource-group teleco-rg \
  --admin-user postgres \
  --admin-password TuPasswordSeguro123!
```

---

## 💰 Estimación de Costos (Mensual)

| Servicio | Costo Aproximado |
|----------|-----------------|
| Container Apps (5 apps) | ~$30-50 USD |
| PostgreSQL Flexible Server | ~$15-25 USD |
| Container Registry | ~$5 USD |
| Static Web Apps | Gratis |
| **TOTAL** | **~$50-80 USD/mes** |

---

## 🛠️ Solución de Problemas

### Error: "Image not found"
```bash
# Verificar que la imagen se subió correctamente
az acr repository list --name telecoregistry --output table
```

### Error: "Database connection refused"
```bash
# Verificar firewall de PostgreSQL
az postgres flexible-server firewall-rule create \
  --resource-group teleco-rg \
  --name teleco-postgres \
  --rule-name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

### Ver variables de entorno de un Container App:
```bash
az containerapp show \
  --name auth-service \
  --resource-group teleco-rg \
  --query properties.template.containers[0].env
```

---

## 🔒 Seguridad en Producción

Antes de lanzar a producción:

1. **Cambiar JWT_SECRET** por uno seguro de 256 bits
2. **Configurar firewall de PostgreSQL** solo para IPs de Container Apps
3. **Habilitar HTTPS** en todos los servicios (automático en Azure)
4. **Configurar CORS** solo para dominio del frontend
5. **Usar Azure Key Vault** para secretos sensibles

---

## 📚 Recursos Adicionales

- [Azure Container Apps Docs](https://learn.microsoft.com/en-us/azure/container-apps/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Azure PostgreSQL Docs](https://learn.microsoft.com/en-us/azure/postgresql/)

---

## 🎯 Próximos Pasos

1. ✅ Configurar dominio personalizado
2. ✅ Implementar Azure Application Insights (monitoreo)
3. ✅ Configurar autoscaling basado en carga
4. ✅ Implementar Azure CDN para frontend
5. ✅ Configurar backups automáticos de base de datos
