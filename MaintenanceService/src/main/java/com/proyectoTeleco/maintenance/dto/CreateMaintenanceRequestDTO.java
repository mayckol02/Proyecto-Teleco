package com.proyectoTeleco.maintenance.dto;

import com.proyectoTeleco.maintenance.MaintenanceType;

public class CreateMaintenanceRequestDTO {
    private String title;
    private String description;
    private String propertyId;
    private MaintenanceType type;
    private String photoUrl;
    private String residentEmail;
    private String residentName;

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
    public String getResidentEmail() { return residentEmail; }
    public void setResidentEmail(String residentEmail) { this.residentEmail = residentEmail; }
    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }
}
