package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.model.MaintenanceNotificationRequest;
import com.example.model.NotificationRequest;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * MVP: Envío básico de notificación. Si el canal es "email" envía un SimpleMailMessage
     * usando JavaMailSender. Para otros canales solo se simula con logs.
     */
    public boolean send(NotificationRequest req) {
        if (req == null || req.getRecipient() == null || req.getMessage() == null) {
            log.warn("Invalid notification request: {}", req);
            return false;
        }

        String channel = req.getChannel() == null ? "email" : req.getChannel();

        if ("email".equalsIgnoreCase(channel)) {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(req.getRecipient());
                msg.setSubject("Notificación del sistema");
                msg.setText(req.getMessage());
                mailSender.send(msg);
                log.info("Email sent to {}", req.getRecipient());
                return true;
            } catch (Exception ex) {
                log.error("Failed to send email to {}", req.getRecipient(), ex);
                return false;
            }
        }

        // Otros canales (sms, push) se simulan por ahora
        log.info("Simulated sending to {} via {}: {}", req.getRecipient(), channel, req.getMessage());
        return true;
    }

    /**
     * Envía notificación de cambio de estado de solicitud de mantenimiento.
     * Formato profesional con ID de solicitud, estado y fecha.
     */
    public boolean sendMaintenanceNotification(MaintenanceNotificationRequest req) {
        if (req == null || req.getRecipientEmail() == null || req.getRequestId() == null) {
            log.warn("Invalid maintenance notification request: {}", req);
            return false;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(req.getRecipientEmail());
            msg.setSubject("Notificación de cambio de estado - Solicitud #" + req.getRequestId());

            String body = buildMaintenanceEmailBody(req);
            msg.setText(body);

            mailSender.send(msg);
            log.info("Maintenance notification sent to {} for request {}", 
                    req.getRecipientEmail(), req.getRequestId());
            return true;
        } catch (Exception ex) {
            log.error("Failed to send maintenance notification email to {}", 
                    req.getRecipientEmail(), ex);
            return false;
        }
    }

    /**
     * Construye el cuerpo del email con formato profesional
     */
    private String buildMaintenanceEmailBody(MaintenanceNotificationRequest req) {
        return String.format(
                "Estimado/a %s,\n\n" +
                "Le informamos que el estado de su solicitud de mantenimiento ha sido actualizado:\n\n" +
                "=== DETALLES DE LA SOLICITUD ===\n" +
                "ID de solicitud: %d\n" +
                "Propiedad: %s\n" +
                "Estado anterior: %s\n" +
                "Estado actual: %s\n" +
                "Fecha de cambio: %s\n\n" +
                "Si tiene alguna pregunta o inquietud, por favor contacte al administrador.\n\n" +
                "Saludos cordiales,\n" +
                "Sistema de Mantenimiento de Condominio",
                req.getRecipientName() != null ? req.getRecipientName() : "Residente",
                req.getRequestId(),
                req.getPropertyId() != null ? req.getPropertyId() : "N/A",
                formatStatus(req.getOldStatus()),
                formatStatus(req.getNewStatus()),
                req.getChangeDate() != null ? req.getChangeDate().toString() : "N/A"
        );
    }

    /**
     * Formatea el estado para una mejor presentación
     */
    private String formatStatus(String status) {
        if (status == null) {
            return "N/A";
        }
        switch (status.toUpperCase()) {
            case "PENDIENTE":
                return "Pendiente";
            case "EN_PROGRESO":
                return "En Progreso";
            case "COMPLETADO":
                return "Completado";
            default:
                return status;
        }
    }
}
