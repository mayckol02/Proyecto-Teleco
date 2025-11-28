#!/bin/bash

# ==========================================
# EJEMPLO DE FLUJO: HU-12 - Notificaciones
# ==========================================
# Este script demuestra cómo probar la integración
# de notificaciones de cambio de estado de mantenimiento

BASE_URL="http://localhost:8083"
NOTIFICATION_URL="http://localhost:8090"
MAILHOG_URL="http://localhost:8025"

echo "======================================================"
echo "PRUEBA DE INTEGRACIÓN: HU-12 NOTIFICACIONES"
echo "======================================================"
echo ""

# 1. Crear una solicitud de mantenimiento
echo "1️⃣  Creando solicitud de mantenimiento..."
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/requests" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: resident-123" \
  -H "X-User-Role: RESIDENTE" \
  -d '{
    "title": "Puerta del balcón rota",
    "description": "La puerta del balcón no cierra correctamente",
    "propertyId": "APT-501",
    "type": "STRUCTURAL",
    "photoUrl": "https://example.com/photo.jpg",
    "residentEmail": "juan.perez@email.com",
    "residentName": "Juan Pérez"
  }')

echo "Respuesta:"
echo "$RESPONSE" | jq '.'
echo ""

# Extraer ID de la solicitud
REQUEST_ID=$(echo "$RESPONSE" | jq -r '.id')
echo "✅ Solicitud creada con ID: $REQUEST_ID"
echo ""

# 2. Cambiar estado a EN_PROGRESO
echo "2️⃣  Cambiando estado a EN_PROGRESO (esto enviará notificación por email)..."
echo ""

RESPONSE=$(curl -s -X PUT "$BASE_URL/api/requests/$REQUEST_ID/status" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: admin-1" \
  -H "X-User-Role: ADMIN" \
  -d '{
    "status": "EN_PROGRESO"
  }')

echo "Respuesta:"
echo "$RESPONSE" | jq '.'
echo ""
echo "✅ Email enviado a: juan.perez@email.com"
echo ""

# 3. Cambiar estado a COMPLETADO
echo "3️⃣  Cambiando estado a COMPLETADO (esto enviará otra notificación)..."
echo ""

RESPONSE=$(curl -s -X PUT "$BASE_URL/api/requests/$REQUEST_ID/status" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: tecnico-1" \
  -H "X-User-Role: TECNICO" \
  -d '{
    "status": "COMPLETADO"
  }')

echo "Respuesta:"
echo "$RESPONSE" | jq '.'
echo ""
echo "✅ Email enviado a: juan.perez@email.com"
echo ""

# 4. Ver solicitud final
echo "4️⃣  Obteniendo solicitud final..."
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/api/requests/$REQUEST_ID" \
  -H "X-User-Id: resident-123" \
  -H "X-User-Role: RESIDENTE")

echo "Respuesta:"
echo "$RESPONSE" | jq '.'
echo ""

echo "======================================================"
echo "✅ FLUJO COMPLETADO"
echo "======================================================"
echo ""
echo "Emails enviados:"
echo "  1. PENDIENTE → EN_PROGRESO"
echo "  2. EN_PROGRESO → COMPLETADO"
echo ""
echo "📧 Para ver los emails en el navegador:"
echo "   $MAILHOG_URL"
echo ""
echo "Deberías ver 2 emails con:"
echo "  - Asunto: 'Notificación de cambio de estado - Solicitud #$REQUEST_ID'"
echo "  - Destinatario: 'juan.perez@email.com'"
echo "  - Contenido: Detalles del cambio de estado"
echo ""
