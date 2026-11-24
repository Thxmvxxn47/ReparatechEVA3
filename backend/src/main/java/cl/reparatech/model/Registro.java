package cl.reparatech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "registros", uniqueConstraints = @UniqueConstraint(columnNames = { "tipo", "codigo" }))
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long pk;

    @Column(nullable = false, length = 40)
    public String tipo;

    @Column(nullable = false, length = 80)
    public String codigo;

    @Lob
    @Column(nullable = false)
    public String json;

    public Registro() {}

    public Registro(String tipo, String codigo, String json) {
        this.tipo = tipo;
        this.codigo = codigo;
        this.json = json;
    }
}
