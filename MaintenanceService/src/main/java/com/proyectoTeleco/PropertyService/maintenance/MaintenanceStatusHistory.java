package com.proyectoTeleco.MaintenanceService.maintenance;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MaintenanceStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private MaintenanceRequest request;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus fromStatus;
    @Enumerated(EnumType.STRING)
    private MaintenanceStatus toStatus;
    private LocalDateTime changedAt = LocalDateTime.now();
    private String changedBy; // user id or role identifier

    public MaintenanceStatusHistory() {}

    public MaintenanceStatusHistory(MaintenanceStatus fromStatus, MaintenanceStatus toStatus, String changedBy) {
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedBy = changedBy;
    }

    // Getters and setters
    public Long getId() { return id; }
    public MaintenanceRequest getRequest() { return request; }
    public void setRequest(MaintenanceRequest request) { this.request = request; }
    public MaintenanceStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(MaintenanceStatus fromStatus) { this.fromStatus = fromStatus; }
    public MaintenanceStatus getToStatus() { return toStatus; }
    public void setToStatus(MaintenanceStatus toStatus) { this.toStatus = toStatus; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
}
