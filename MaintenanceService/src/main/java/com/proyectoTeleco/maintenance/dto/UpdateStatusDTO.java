package com.proyectoTeleco.maintenance.dto;

import com.proyectoTeleco.maintenance.MaintenanceStatus;

public class UpdateStatusDTO {
    private MaintenanceStatus status;

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
}
