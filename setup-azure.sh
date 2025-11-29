# Ejecutar con: ./setup-azure.sh

# Variables de configuración
RESOURCE_GROUP="teleco-rg"
LOCATION="eastus"
ACR_NAME="telecoregistry"
POSTGRES_SERVER="teleco-postgres"
POSTGRES_ADMIN_USER="postgres"
POSTGRES_ADMIN_PASSWORD="TuPasswordSeguro123!"
CONTAINER_APP_ENV="teleco-env"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Teleco - Azure Infrastructure Setup  ${NC}"
echo -e "${BLUE}========================================${NC}"

# Paso 1: Crear Resource Group
echo -e "\n${GREEN}[1/8] Creando Resource Group...${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Paso 2: Crear Azure Container Registry
echo -e "\n${GREEN}[2/8] Creando Azure Container Registry...${NC}"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Obtener credenciales del ACR
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

echo -e "${BLUE}ACR Username: $ACR_USERNAME${NC}"
echo -e "${BLUE}Guarda este password para GitHub Secrets: $ACR_PASSWORD${NC}"

# Paso 3: Crear PostgreSQL Flexible Server
echo -e "\n${GREEN}[3/8] Creando PostgreSQL Flexible Server...${NC}"
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_ADMIN_USER \
  --admin-password $POSTGRES_ADMIN_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --public-access 0.0.0.0-255.255.255.255

# Paso 4: Crear bases de datos
echo -e "\n${GREEN}[4/8] Creando bases de datos...${NC}"
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --database-name usuario

az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --database-name condominios

# Paso 5: Crear Container Apps Environment
echo -e "\n${GREEN}[5/8] Creando Container Apps Environment...${NC}"
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Paso 6: Crear Container Apps
echo -e "\n${GREEN}[6/8] Creando Container Apps...${NC}"

# Auth Service
az containerapp create \
  --name auth-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8082 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars "SPRING_PROFILES_ACTIVE=azure" "JWT_SECRET=S3cr3tJWTKeyDeberiaSerMasLarga123456" \
  --cpu 0.5 \
  --memory 1Gi

# Parcial Service
az containerapp create \
  --name parcial-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8081 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=azure" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://$POSTGRES_SERVER.postgres.database.azure.com:5432/usuario?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=$POSTGRES_ADMIN_USER" \
    "SPRING_DATASOURCE_PASSWORD=$POSTGRES_ADMIN_PASSWORD" \
  --cpu 0.5 \
  --memory 1Gi

# Property Service
az containerapp create \
  --name property-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8084 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=azure" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://$POSTGRES_SERVER.postgres.database.azure.com:5432/condominios?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=$POSTGRES_ADMIN_USER" \
    "SPRING_DATASOURCE_PASSWORD=$POSTGRES_ADMIN_PASSWORD" \
    "JWT_SECRET=S3cr3tJWTKeyDeberiaSerMasLarga123456" \
  --cpu 0.5 \
  --memory 1Gi

# Maintenance Service
az containerapp create \
  --name maintenance-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8083 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=azure" \
    "NOTIFICATION_SERVICE_URL=https://notification-service.internal.$CONTAINER_APP_ENV.azurecontainerapps.io" \
  --cpu 0.5 \
  --memory 1Gi

# Notification Service
az containerapp create \
  --name notification-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8090 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=azure" \
    "SPRING_MAIL_HOST=smtp.gmail.com" \
    "SPRING_MAIL_PORT=587" \
    "SPRING_MAIL_USERNAME=" \
    "SPRING_MAIL_PASSWORD=" \
  --cpu 0.5 \
  --memory 1Gi

# Paso 7: Crear Service Principal para GitHub Actions
echo -e "\n${GREEN}[7/8] Creando Service Principal para GitHub Actions...${NC}"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "teleco-github-actions" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

echo -e "${BLUE}AZURE_CREDENTIALS para GitHub Secrets:${NC}"
echo "$SP_OUTPUT"

# Paso 8: Obtener URLs de los servicios
echo -e "\n${GREEN}[8/8] Obteniendo URLs de los servicios...${NC}"

AUTH_URL=$(az containerapp show --name auth-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
PARCIAL_URL=$(az containerapp show --name parcial-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
PROPERTY_URL=$(az containerapp show --name property-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
MAINTENANCE_URL=$(az containerapp show --name maintenance-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
NOTIFICATION_URL=$(az containerapp show --name notification-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  URLs de los servicios:${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Auth Service: https://$AUTH_URL"
echo -e "Parcial Service: https://$PARCIAL_URL"
echo -e "Property Service: https://$PROPERTY_URL"
echo -e "Maintenance Service: https://$MAINTENANCE_URL"
echo -e "Notification Service: https://$NOTIFICATION_URL"

echo -e "\n${GREEN}¡Configuración completada!${NC}"
echo -e "\n${BLUE}Próximos pasos:${NC}"
echo -e "1. Agregar estos secretos en GitHub (Settings > Secrets and variables > Actions):"
echo -e "   - AZURE_CREDENTIALS (el JSON mostrado arriba)"
echo -e "   - AZURE_REGISTRY_USERNAME: $ACR_USERNAME"
echo -e "   - AZURE_REGISTRY_PASSWORD: $ACR_PASSWORD"
echo -e "   - VITE_API_AUTH_URL: https://$AUTH_URL"
echo -e "   - VITE_API_USERS_URL: https://$PARCIAL_URL"
echo -e "   - VITE_API_PROPERTY_URL: https://$PROPERTY_URL"
echo -e "   - VITE_API_MAINTENANCE_URL: https://$MAINTENANCE_URL"
echo -e "   - VITE_API_NOTIFICATION_URL: https://$NOTIFICATION_URL"
echo -e "\n2. Hacer push a main para activar los workflows de GitHub Actions"
