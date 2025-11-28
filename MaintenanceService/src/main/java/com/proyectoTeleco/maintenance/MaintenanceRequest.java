package com.proyectoTeleco.maintenance;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String description;
    private String propertyId;
    @Enumerated(EnumType.STRING)
    private MaintenanceType type;
    private String photoUrl;
    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status = MaintenanceStatus.PENDIENTE;
    private String assignedTechnicianId;
    private String residentId; // ID del residente que solicitó
    private String residentEmail; // Email del residente para notificaciones
    private String residentName; // Nombre del residente para personalizarNotificación
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MaintenanceStatusHistory> histories = new ArrayList<>();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addHistory(MaintenanceStatusHistory history) {
        histories.add(history);
        history.setRequest(this);
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPropertyId() { return propertyId; }
    public void setPropertyId(String propertyId) { this.propertyId = propertyId; }
    public MaintenanceType getType() { return type; }
    public void setType(MaintenanceType type) { this.type = type; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
    public String getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(String assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }
    public String getResidentId() { return residentId; }
    public void setResidentId(String residentId) { this.residentId = residentId; }
    public String getResidentEmail() { return residentEmail; }
    public void setResidentEmail(String residentEmail) { this.residentEmail = residentEmail; }
    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public List<MaintenanceStatusHistory> getHistories() { return histories; }
}
