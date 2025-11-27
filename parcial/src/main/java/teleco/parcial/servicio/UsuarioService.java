package teleco.parcial.servicio;

import teleco.parcial.modelo.Usuario;

import java.util.Set;

public interface UsuarioService {
    Usuario agregarUsuario(Usuario usuario);

    Usuario actualizarUsuario(Usuario usuario);

    Set<Usuario> obtenerUsuarios();

    Usuario obtenerUsuario(Integer id);

    void eliminarUsuario(Integer id);

    Usuario obtenerPorCorreo(String correo);

}
