package teleco.parcial.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import teleco.parcial.modelo.Usuario;
import teleco.parcial.repositorio.UsuarioRepo;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario agregarUsuario(Usuario usuario) {

        // Validar correo único
        if (usuarioRepo.findByCorreo(usuario.getCorreo()) != null) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Encriptar clave
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));

        // Rol por defecto si no lo envían
        if (usuario.getRol() == null) {
            usuario.setRol("RESIDENTE");
        }

        return usuarioRepo.save(usuario);
    }

    public Usuario obtenerUsuario(Integer id) {
        return usuarioRepo.findById(id).orElse(null);
    }

    public List<Usuario> obtenerUsuarios() {
        return usuarioRepo.findAll();
    }

    public Usuario actualizarUsuario(Usuario usuario) {

        Usuario existente = usuarioRepo.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existente.setNombre(usuario.getNombre());
        existente.setCorreo(usuario.getCorreo());

        // Si se envía una nueva clave → re-encriptarla
        if (usuario.getClave() != null && !usuario.getClave().isBlank()) {
            existente.setClave(passwordEncoder.encode(usuario.getClave()));
        }

        existente.setRol(usuario.getRol());
        existente.setPropiedadId(usuario.getPropiedadId());

        return usuarioRepo.save(existente);
    }

    public void eliminarUsuario(Integer id) {
        usuarioRepo.deleteById(id);
    }

    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepo.findByCorreo(correo);
    }
}

