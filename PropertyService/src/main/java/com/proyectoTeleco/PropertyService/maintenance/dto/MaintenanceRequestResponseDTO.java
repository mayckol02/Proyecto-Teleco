package com.proyectoTeleco.PropertyService.maintenance.dto;

import com.proyectoTeleco.PropertyService.maintenance.MaintenanceStatus;
import com.proyectoTeleco.PropertyService.maintenance.MaintenanceType;

import java.time.LocalDateTime;
import java.util.List;

public class MaintenanceRequestResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String propertyId;
    private MaintenanceType type;
    private String photoUrl;
    private MaintenanceStatus status;
    private String assignedTechnicianId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private List<StatusHistoryItem> history;

    public static class StatusHistoryItem {
        private MaintenanceStatus fromStatus;
        private MaintenanceStatus toStatus;
        private LocalDateTime changedAt;
        private String changedBy;
        public MaintenanceStatus getFromStatus() { return fromStatus; }
        public void setFromStatus(MaintenanceStatus fromStatus) { this.fromStatus = fromStatus; }
        public MaintenanceStatus getToStatus() { return toStatus; }
        public void setToStatus(MaintenanceStatus toStatus) { this.toStatus = toStatus; }
        public LocalDateTime getChangedAt() { return changedAt; }
        public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
        public String getChangedBy() { return changedBy; }
        public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public List<StatusHistoryItem> getHistory() { return history; }
    public void setHistory(List<StatusHistoryItem> history) { this.history = history; }
}
