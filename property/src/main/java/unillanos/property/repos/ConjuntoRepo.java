package unillanos.property.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import unillanos.property.modelos.Conjunto;

public interface ConjuntoRepo extends JpaRepository<Conjunto, Integer> {
}
