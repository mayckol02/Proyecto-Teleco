package com.proyectoTeleco.maintenance;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectoTeleco.maintenance.dto.AssignTechnicianDTO;
import com.proyectoTeleco.maintenance.dto.CreateMaintenanceRequestDTO;
import com.proyectoTeleco.maintenance.dto.MaintenanceRequestResponseDTO;
import com.proyectoTeleco.maintenance.dto.UpdateStatusDTO;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    // Headers simulados: X-User-Id, X-User-Role (RESIDENTE, ADMIN, TECNICO)
    @PostMapping
    public ResponseEntity<MaintenanceRequestResponseDTO> create(@RequestBody CreateMaintenanceRequestDTO dto,
                                                                @RequestHeader("X-User-Id") String userId,
                                                                @RequestHeader("X-User-Role") String role) {
        if (!"RESIDENTE".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.createRequest(dto, userId));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<MaintenanceRequestResponseDTO> assign(@PathVariable Long id,
                                                                @RequestBody AssignTechnicianDTO dto,
                                                                @RequestHeader("X-User-Id") String userId,
                                                                @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.assignTechnician(id, dto.getTechnicianId(), userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequestResponseDTO> updateStatus(@PathVariable Long id,
                                                                      @RequestBody UpdateStatusDTO dto,
                                                                      @RequestHeader("X-User-Id") String userId,
                                                                      @RequestHeader("X-User-Role") String role) {
        if (!"TECNICO".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.updateStatus(id, dto.getStatus(), userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequestResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestResponseDTO>> list() {
        return ResponseEntity.ok(service.listAll());
    }
}
