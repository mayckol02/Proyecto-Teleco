package unillanos.property.servicios.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import unillanos.property.modelos.Conjunto;
import unillanos.property.modelos.UsuarioDTO;
import unillanos.property.repos.ConjuntoRepo;
import unillanos.property.servicios.ConjuntoService;

import java.util.LinkedHashSet;
import java.util.Set;
@Service
public class ConjuntoImpl implements ConjuntoService {

    @Autowired
    private ConjuntoRepo conjuntoRepo;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public Conjunto agregarConjunto(Conjunto conjunto) {

        // Obtener request actual
        String token = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes())
                .getRequest()
                .getHeader("Authorization");

        if (token == null) {
            throw new RuntimeException("No se recibió token");
        }

        int adminId = conjunto.getAdministradorId();
        String url = "http://parcial-service:8081/usuario/" + adminId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<UsuarioDTO> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, UsuarioDTO.class);

        UsuarioDTO usuario = response.getBody();

        if (!usuario.getRol().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("El usuario NO es administrador");
        }

        return conjuntoRepo.save(conjunto);
    }
    @Override
    public Conjunto actualizarConjunto(Conjunto conjunto) {
        return conjuntoRepo.save(conjunto);
    }

    @Override
    public Set<Conjunto> obtenerConjuntos() {
        return new LinkedHashSet<>(conjuntoRepo.findAll());
    }

    @Override
    public Conjunto obtenerConjunto(Integer id) {
        return conjuntoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Conjunto no encontrado"));
    }

    @Override
    public void eliminarConjunto(Integer id) {
        conjuntoRepo.deleteById(id);
    }
}
