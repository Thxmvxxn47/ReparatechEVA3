package cl.reparatech.repository;

import cl.reparatech.model.Registro;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByTipo(String tipo);
    Optional<Registro> findByTipoAndCodigo(String tipo, String codigo);
    long countByTipo(String tipo);
}
