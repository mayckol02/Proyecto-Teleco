package teleco.parcial.servicio.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import teleco.parcial.modelo.Usuario;
import teleco.parcial.repositorio.UsuarioRepo;
import teleco.parcial.servicio.UsuarioService;

import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class UsuarioImpl implements UsuarioService {

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Usuario agregarUsuario(Usuario usuario) {

        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        return usuarioRepo.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        // Obtenemos el usuario existente para no sobrescribir la clave si no se cambia
        Usuario usuarioExistente = usuarioRepo.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si la clave es la misma (sin encriptar), no la actualizamos
        // Pero si se envía una nueva clave, la encriptamos
        if (usuario.getClave() != null && !usuario.getClave().isEmpty()) {
            // Aquí asumimos que la clave viene en texto plano y debe encriptarse
            // Si ya está encriptada, esto no aplica. Pero en APIs REST normalmente viene en texto plano.
            usuarioExistente.setClave(passwordEncoder.encode(usuario.getClave()));
        }

        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setCorreo(usuario.getCorreo());

        return usuarioRepo.save(usuarioExistente);
    }

    @Override
    public Set<Usuario> obtenerUsuarios() {
        return new LinkedHashSet<>(usuarioRepo.findAll());
    }

    @Override
    public Usuario obtenerUsuario(Integer id) {
        return usuarioRepo.findById(id).get();
    }

    @Override
    public void eliminarUsuario(Integer id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuarioRepo.delete(usuario);
    }

    @Override
    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepo.findByCorreo(correo);
    }

}
