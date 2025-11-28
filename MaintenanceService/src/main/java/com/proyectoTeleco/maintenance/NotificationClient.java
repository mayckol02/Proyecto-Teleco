package com.proyectoTeleco.maintenance;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationClient {
    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestTemplate restTemplate;
    private final String notificationServiceUrl;

    public NotificationClient(RestTemplate restTemplate,
                             @Value("${notification.service.url:http://notification-service:8090}") String notificationServiceUrl) {
        this.restTemplate = restTemplate;
        this.notificationServiceUrl = notificationServiceUrl;
    }

    public void sendNotification(String recipient, String message, String channel) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("recipient", recipient);
            request.put("message", message);
            request.put("channel", channel);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

            restTemplate.postForObject(notificationServiceUrl + "/notify", entity, String.class);
            log.info("Notificación enviada a: {}", recipient);
        } catch (Exception e) {
            log.error("Error al enviar notificación a {}: {}", recipient, e.getMessage());
            // No lanzar excepción para que no falle el proceso principal
        }
    }

    public void notifyMaintenanceCreated(String propertyId, String title) {
        String message = String.format(
            "Nueva solicitud de mantenimiento creada:\n" +
            "Título: %s\n" +
            "Propiedad: %s\n\n" +
            "Por favor, revise y asigne un técnico.",
            title, propertyId
        );
        sendNotification("admin@ejemplo.com", message, "email");
    }

    public void notifyTechnicianAssigned(String technicianEmail, String title, String propertyId) {
        String message = String.format(
            "Se le ha asignado una nueva solicitud de mantenimiento:\n" +
            "Título: %s\n" +
            "Propiedad: %s\n\n" +
            "Por favor, proceda con la atención correspondiente.",
            title, propertyId
        );
        sendNotification(technicianEmail, message, "email");
    }

    public void notifyStatusChanged(String residentEmail, String title, String oldStatus, String newStatus) {
        String message = String.format(
            "Actualización de su solicitud de mantenimiento:\n" +
            "Título: %s\n" +
            "Estado anterior: %s\n" +
            "Nuevo estado: %s",
            title, oldStatus, newStatus
        );
        sendNotification(residentEmail, message, "email");
    }

    public void notifyMaintenanceCompleted(String residentEmail, String title) {
        String message = String.format(
            "Su solicitud de mantenimiento ha sido completada:\n" +
            "Título: %s\n\n" +
            "Gracias por utilizar nuestro servicio.",
            title
        );
        sendNotification(residentEmail, message, "email");
    }
}
