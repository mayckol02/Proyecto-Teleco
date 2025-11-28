package teleco.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import teleco.auth.config.JwtUtil;
import teleco.auth.dto.LoginRequest;
import teleco.auth.dto.UsuarioDTO;
import teleco.auth.service.LoginService;

import java.util.Map;

@RestController
@RequestMapping("/auth/login")
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        UsuarioDTO usuario = loginService.validarUsuario(
                loginRequest.getCorreo(),
                loginRequest.getClave()
        );

        if (usuario == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("mensaje", "Credenciales inválidas"));
        }

        String token = jwtUtil.generarToken(
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.getId()
        );

        return ResponseEntity.ok(
                Map.of(
                        "mensaje", "Login exitoso",
                        "token", token,
                        "rol", usuario.getRol(),
                        "id", usuario.getId(),
                        "correo", usuario.getCorreo()
                )
        );
    }
}
