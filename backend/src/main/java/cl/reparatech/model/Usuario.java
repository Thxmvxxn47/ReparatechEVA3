package cl.reparatech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios_auth")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String correo;

    @Column(nullable = false)
    public String claveHash;

    @Column(nullable = false)
    public String rol;

    public String nombre;
    public String apellido;
    public Long clienteId;
 public Long tecnicoId;

    public Usuario() {}

    public Usuario(
        String correo,
        String claveHash,
        String rol,
        String nombre,
        String apellido,
        Long clienteId
    ) {
        this.correo = correo;
        this.claveHash = claveHash;
        this.rol = rol;
        this.nombre = nombre;
        this.apellido = apellido;
        this.clienteId = clienteId;
    }
}
