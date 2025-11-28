package unillanos.property.servicios;

import unillanos.property.modelos.Conjunto;

import java.util.Set;

public interface ConjuntoService {

    Conjunto agregarConjunto(Conjunto conjunto);

    Conjunto actualizarConjunto(Conjunto conjunto);

    Set<Conjunto> obtenerConjuntos();

    Conjunto obtenerConjunto(Integer conjuntoId);

    void eliminarConjunto(Integer conjuntoId);
}
