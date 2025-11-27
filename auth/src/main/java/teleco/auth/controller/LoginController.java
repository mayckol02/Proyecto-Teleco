
package teleco.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import teleco.auth.config.JwtUtil;
import teleco.auth.modelo.Usuario;
import teleco.auth.service.LoginService;
import teleco.auth.service.LoginRequest;
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
        String correo = loginRequest.getCorreo();
        String clave = loginRequest.getClave();

        boolean valido = loginService.verificarLogin(correo, clave);
        if (valido) {
            String token = jwtUtil.generarToken(correo);
            return ResponseEntity.ok(Map.of("mensaje", "Login exitoso", "token", token));
        } else {
            return ResponseEntity.status(401).body(Map.of("mensaje", "Credenciales inválidas"));
        }
    }
}