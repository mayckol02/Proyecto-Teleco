package unillanos.property.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unillanos.property.modelos.Conjunto;
import unillanos.property.servicios.ConjuntoService;

@RestController
@RequestMapping("/conjuntos")
@CrossOrigin(origins = "*")
public class ConjuntoController {

    @Autowired
    private ConjuntoService conjuntoService;

    @PostMapping("/")
    public ResponseEntity<Conjunto> guardarConjunto(@RequestBody Conjunto conjunto) {

        Conjunto guardado = conjuntoService.agregarConjunto(conjunto);
        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/{id}")
    public Conjunto listarConjuntoPorId(@PathVariable("id") Integer id){
        return conjuntoService.obtenerConjunto(id);
    }

    @GetMapping("/")
    public ResponseEntity<?> listarConjuntos(){
        return ResponseEntity.ok(conjuntoService.obtenerConjuntos());
    }

    @PutMapping("/")
    public Conjunto actualizarConjunto(@RequestBody Conjunto conjunto){
        return conjuntoService.actualizarConjunto(conjunto);
    }

    @DeleteMapping("/{id}")
    public void eliminarConjunto(@PathVariable("id") Integer id){
        conjuntoService.eliminarConjunto(id);
    }
}
