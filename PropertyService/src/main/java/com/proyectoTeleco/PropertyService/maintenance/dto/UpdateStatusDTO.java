package com.proyectoTeleco.PropertyService.maintenance.dto;

import com.proyectoTeleco.PropertyService.maintenance.MaintenanceStatus;

public class UpdateStatusDTO {
    private MaintenanceStatus status;

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
}
