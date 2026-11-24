package cl.reparatech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sesiones_refresh")
public class SesionRefresh {

    @Id
    @Column(length = 128)
    public String hash;

    public String correo;

    public SesionRefresh() {}

    public SesionRefresh(String hash, String correo) {
        this.hash = hash;
        this.correo = correo;
    }
}
