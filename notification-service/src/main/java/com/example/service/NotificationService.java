package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
}
