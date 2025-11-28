package com.proyectoTeleco.PropertyService.maintenance;

import com.proyectoTeleco.PropertyService.maintenance.dto.CreateMaintenanceRequestDTO;
import com.proyectoTeleco.PropertyService.maintenance.dto.MaintenanceRequestResponseDTO;

public interface MaintenanceRequestService {
    MaintenanceRequestResponseDTO createRequest(CreateMaintenanceRequestDTO dto, String residentId);
    MaintenanceRequestResponseDTO assignTechnician(Long requestId, String technicianId, String adminId);
    MaintenanceRequestResponseDTO updateStatus(Long requestId, MaintenanceStatus newStatus, String userId);
    MaintenanceRequestResponseDTO getById(Long id);
    java.util.List<MaintenanceRequestResponseDTO> listAll();
}
