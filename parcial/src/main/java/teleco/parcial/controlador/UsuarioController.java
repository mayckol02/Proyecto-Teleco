package teleco.parcial.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import teleco.parcial.modelo.Usuario;
import teleco.parcial.servicio.UsuarioService;

@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/")
    public ResponseEntity<Usuario> guardarUsuario(@RequestBody Usuario usuario){
        Usuario usuarioGuardada = usuarioService.agregarUsuario(usuario);
        return ResponseEntity.ok(usuarioGuardada);
    }

    @GetMapping("/{id}")
    public Usuario listarUsuarioPorId(@PathVariable("id") Integer id){
        return usuarioService.obtenerUsuario(id);
    }


    @GetMapping("/")
    public ResponseEntity<?> listarUsuarios(){
        return ResponseEntity.ok(usuarioService.obtenerUsuarios());
    }

    @PutMapping("/")
    public Usuario actualizarUsuario(@RequestBody Usuario usuario){
        return usuarioService.actualizarUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable("id") Integer id){
        usuarioService.eliminarUsuario(id);
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> obtenerPorCorreo(@PathVariable String correo) {
        Usuario usuario = usuarioService.obtenerPorCorreo(correo);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
