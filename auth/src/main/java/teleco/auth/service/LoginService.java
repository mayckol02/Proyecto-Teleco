package teleco.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import teleco.auth.modelo.Usuario;

import java.util.Arrays;
import java.util.Map;

@Service
public class LoginService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean verificarLogin(String correo, String clave) {
        try {
            String url = "http://parcial-service:8081/usuario/";
            Map[] usuarios = restTemplate.getForObject(url, Map[].class);

            if (usuarios != null) {
                for (Map usuario : usuarios) {
                    if (correo.equals(usuario.get("correo"))) {
                        String claveEncriptada = (String) usuario.get("clave");
                        return passwordEncoder.matches(clave, claveEncriptada);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error conectando al microservicio de usuarios: " + e.getMessage());
        }
        return false;
    }
}