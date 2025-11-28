package com.proyectoTeleco.maintenance.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import com.proyectoTeleco.maintenance.dto.MaintenanceNotificationDTO;

@Component
public class NotificationClient {
    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestTemplate restTemplate;

    @Value("${notification.service.url:http://notification-service:8090}")
    private String notificationServiceUrl;

    public NotificationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Envía una notificación de cambio de estado de mantenimiento
     * al servicio de notificaciones.
     */
    public boolean sendMaintenanceNotification(MaintenanceNotificationDTO dto) {
        try {
            String url = notificationServiceUrl + "/notify/maintenance";
            ResponseEntity<String> response = restTemplate.postForEntity(url, dto, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Maintenance notification sent successfully for request {}", dto.getRequestId());
                return true;
            } else {
                log.warn("Notification service returned status: {}", response.getStatusCode());
                return false;
            }
        } catch (RestClientException ex) {
            log.error("Failed to send notification to service. URL: {}, Request ID: {}", 
                    notificationServiceUrl, dto.getRequestId(), ex);
            return false;
        }
    }
}
