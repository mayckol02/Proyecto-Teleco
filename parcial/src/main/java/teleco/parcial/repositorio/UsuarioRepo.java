package teleco.parcial.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import teleco.parcial.modelo.Usuario;

public interface UsuarioRepo extends JpaRepository<Usuario, Integer> {
    Usuario findByCorreo(String correo);
}
