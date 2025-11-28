package com.proyectoTeleco.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceStatusHistoryRepository extends JpaRepository<MaintenanceStatusHistory, Long> {
}
