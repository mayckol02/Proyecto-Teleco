package teleco.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import teleco.auth.dto.UsuarioDTO;

@Service
public class LoginService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String USER_SERVICE_URL = "http://parcial-service:8081/usuario/correo/";

    public UsuarioDTO validarUsuario(String correo, String clave) {

        try {
            UsuarioDTO usuario = restTemplate.getForObject(
                    USER_SERVICE_URL + correo, UsuarioDTO.class);

            if (usuario == null) return null;

            boolean passwordOk = passwordEncoder.matches(clave, usuario.getClave());

            return passwordOk ? usuario : null;

        } catch (Exception e) {
            return null;
        }
    }
}
