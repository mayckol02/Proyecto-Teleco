package unillanos.property.modelos;

import jakarta.persistence.*;

@Entity
@Table(name = "conjuntos")
public class Conjunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String ubicacion;
    private String telefono;
    private int administradorId;

    public Conjunto(int id, String nombre, String ubicacion, String telefono, int administradorId) {
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.telefono = telefono;
        this.administradorId = administradorId;
    }

    public Conjunto() {
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAdministradorId() {
        return administradorId;
    }
    public void setAdministradorId(int administradorId) {
        this.administradorId = administradorId;
    }
}
