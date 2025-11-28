package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.NotificationRequest;
import com.example.service.NotificationService;

@RestController
@RequestMapping("/notify")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> notify(@RequestBody NotificationRequest req) {
        boolean result = service.send(req);
        if (result) {
            return ResponseEntity.ok("Notification queued/sent");
        }
        return ResponseEntity.status(500).body("Failed to send notification");
    }
}
