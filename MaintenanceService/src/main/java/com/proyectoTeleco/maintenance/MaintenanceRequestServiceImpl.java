package com.proyectoTeleco.maintenance;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectoTeleco.maintenance.dto.CreateMaintenanceRequestDTO;
import com.proyectoTeleco.maintenance.dto.MaintenanceRequestResponseDTO;

@Service
@Transactional
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final MaintenanceStatusHistoryRepository historyRepository;
    private final NotificationClient notificationClient;

    public MaintenanceRequestServiceImpl(MaintenanceRequestRepository requestRepository, 
                                        MaintenanceStatusHistoryRepository historyRepository,
                                        NotificationClient notificationClient) {
        this.requestRepository = requestRepository;
        this.historyRepository = historyRepository;
        this.notificationClient = notificationClient;
    }

    @Override
    public MaintenanceRequestResponseDTO createRequest(CreateMaintenanceRequestDTO dto, String residentId) {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setPropertyId(dto.getPropertyId());
        request.setType(dto.getType());
        request.setPhotoUrl(dto.getPhotoUrl());
        request.setStatus(MaintenanceStatus.PENDIENTE);
        requestRepository.save(request);
        request.addHistory(new MaintenanceStatusHistory(null, MaintenanceStatus.PENDIENTE, residentId));
        MaintenanceRequest saved = requestRepository.save(request);
        
        // Enviar notificación al administrador
        notificationClient.notifyMaintenanceCreated(dto.getPropertyId(), dto.getTitle());
        
        return toDTO(saved);
    }

    @Override
    public MaintenanceRequestResponseDTO assignTechnician(Long requestId, String technicianId, String adminId) {
        MaintenanceRequest request = requestRepository.findById(requestId).orElseThrow(() -> new NoSuchElementException("Solicitud no encontrada"));
        if (request.getStatus() != MaintenanceStatus.PENDIENTE) {
            throw new IllegalStateException("Solo solicitudes en estado PENDIENTE pueden ser asignadas");
        }
        request.setAssignedTechnicianId(technicianId);
        changeStatus(request, MaintenanceStatus.EN_PROGRESO, adminId);
        MaintenanceRequest saved = requestRepository.save(request);
        
        // Enviar notificación al técnico asignado
        notificationClient.notifyTechnicianAssigned(
            technicianId + "@ejemplo.com", 
            request.getTitle(), 
            request.getPropertyId()
        );
        
        return toDTO(saved);
    }

    @Override
    public MaintenanceRequestResponseDTO updateStatus(Long requestId, MaintenanceStatus newStatus, String userId) {
        MaintenanceRequest request = requestRepository.findById(requestId).orElseThrow(() -> new NoSuchElementException("Solicitud no encontrada"));
        MaintenanceStatus current = request.getStatus();
        if (current == MaintenanceStatus.COMPLETADO) {
            throw new IllegalStateException("La solicitud ya está completada");
        }
        boolean valid = false;
        switch (current) {
            case PENDIENTE -> valid = newStatus == MaintenanceStatus.EN_PROGRESO || newStatus == MaintenanceStatus.PENDIENTE;
            case EN_PROGRESO -> valid = newStatus == MaintenanceStatus.COMPLETADO || newStatus == MaintenanceStatus.EN_PROGRESO;
            default -> valid = false;
        }
        if (!valid) {
            throw new IllegalStateException("Transición de estado inválida");
        }
        if (newStatus != current) {
            changeStatus(request, newStatus, userId);
            if (newStatus == MaintenanceStatus.COMPLETADO) {
                request.setCompletedAt(LocalDateTime.now());
                // Notificar al residente que se completó
                notificationClient.notifyMaintenanceCompleted(
                    "residente@ejemplo.com",
                    request.getTitle()
                );
            } else {
                // Notificar cambio de estado
                notificationClient.notifyStatusChanged(
                    "residente@ejemplo.com",
                    request.getTitle(),
                    current.toString(),
                    newStatus.toString()
                );
            }
        }
        return toDTO(requestRepository.save(request));
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceRequestResponseDTO getById(Long id) {
        return requestRepository.findById(id).map(this::toDTO).orElseThrow(() -> new NoSuchElementException("Solicitud no encontrada"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDTO> listAll() {
        return requestRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void changeStatus(MaintenanceRequest request, MaintenanceStatus newStatus, String userId) {
        MaintenanceStatusHistory history = new MaintenanceStatusHistory(request.getStatus(), newStatus, userId);
        request.setStatus(newStatus);
        request.addHistory(history);
        historyRepository.save(history);
    }

    private MaintenanceRequestResponseDTO toDTO(MaintenanceRequest request) {
        MaintenanceRequestResponseDTO dto = new MaintenanceRequestResponseDTO();
        dto.setId(request.getId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setPropertyId(request.getPropertyId());
        dto.setType(request.getType());
        dto.setPhotoUrl(request.getPhotoUrl());
        dto.setStatus(request.getStatus());
        dto.setAssignedTechnicianId(request.getAssignedTechnicianId());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setCompletedAt(request.getCompletedAt());
        dto.setHistory(request.getHistories().stream().map(h -> {
            MaintenanceRequestResponseDTO.StatusHistoryItem item = new MaintenanceRequestResponseDTO.StatusHistoryItem();
            item.setFromStatus(h.getFromStatus());
            item.setToStatus(h.getToStatus());
            item.setChangedAt(h.getChangedAt());
            item.setChangedBy(h.getChangedBy());
            return item;
        }).collect(Collectors.toList()));
        return dto;
    }
}
