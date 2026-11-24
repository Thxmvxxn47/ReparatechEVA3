package cl.reparatech.config;

import cl.reparatech.model.*;
import cl.reparatech.repository.*;
import cl.reparatech.service.RegistroService;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import java.io.InputStream;
import java.util.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedConfig {

    @Bean
    CommandLineRunner cargar(
        RegistroRepository registros,
        UsuarioRepository users,
        PasswordEncoder encoder,
        ObjectMapper mapper
    ) {
        return args -> {
            try (InputStream in = getClass().getResourceAsStream("/seed.json")) {
                JsonNode seed = mapper.readTree(in);
                for (String tipo : RegistroService.TIPOS) {
                    if (registros.countByTipo(tipo) > 0) continue;
                    for (JsonNode node : seed.path(tipo)) {
                        ObjectNode o = (ObjectNode) node.deepCopy();
                        o.remove("password");
                        String id = o.path("id").asText();
                        registros.save(new Registro(tipo, id, mapper.writeValueAsString(o)));
                    }
                }
            }
            for (Cuenta cuenta : CUENTAS) {
             Usuario usuario = users.findByCorreoIgnoreCase(cuenta.correo()).orElseGet(() ->
              new Usuario(cuenta.correo(), encoder.encode(cuenta.password()), cuenta.rol(),
               cuenta.nombre(), cuenta.apellido(), cuenta.clienteId()));
             if (usuario.id == null || (cuenta.tecnicoId() != null && usuario.tecnicoId == null
                 && cuenta.rol().equals(usuario.rol))) {
              usuario.tecnicoId = cuenta.tecnicoId();
              users.save(usuario);
             }
            }
        };
    }

    private record Cuenta(String correo, String password, String rol, String nombre,
                          String apellido, Long clienteId, Long tecnicoId) {}
    private static final List<Cuenta> CUENTAS = List.of(
     new Cuenta("encargado@reparatech.cl", "1234", "encargado", "Thomas", "Marin", null, null),
     new Cuenta("admin@reparatech.cl", "1234", "administrador", "Maximiliano", "Navarrete", null, null),
     new Cuenta("recepcion@reparatech.cl", "1234", "recepcionista", "Dafne", "Vargas", null, null),
     new Cuenta("tecnico@reparatech.cl", "1234", "tecnico", "Darliette", "Loncopán", null, 1L),
     new Cuenta("victor.gutierrez@reparatech.cl", "1234", "tecnico", "Victor", "Gutierrez", null, 2L),
     new Cuenta("carlos.ramirez@reparatech.cl", "1234", "tecnico", "Carlos", "Ramirez", null, 3L),
     new Cuenta("mizahel.huaman@reparatech.cl", "1234", "tecnico", "Mizahel", "Huaman", null, 4L),
     new Cuenta("sebastian.covarrubias@reparatech.cl", "1234", "tecnico", "Sebastian", "Covarrubias", null, 5L),
     new Cuenta("matias.estobar@reparatech.cl", "1234", "tecnico", "Matias", "Estobar", null, 6L),
     new Cuenta("rodrigo.chacon@reparatech.cl", "1234", "cliente", "Rodrigo", "Chacon", 1L, null)
    );
}
