package cl.reparatech.controller;

import cl.reparatech.repository.UsuarioRepository;
import cl.reparatech.service.RegistroService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class RegistroController {

    private void permitMutation(String tipo, Authentication auth) {
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        if (rol.equals("ROLE_administrador")) return;
        if (
            rol.equals("ROLE_encargado") &&
            Set.of("ordenes", "clientes", "tecnicos", "servicios", "categorias", "repuestos").contains(tipo)
        ) return;
        if (rol.equals("ROLE_recepcionista") && Set.of("ordenes", "clientes").contains(tipo)) return;
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acción no autorizada para este rol");
    }

    private final RegistroService s;
    private final UsuarioRepository usuarios;

    public RegistroController(RegistroService s, UsuarioRepository usuarios) {
        this.s = s;
        this.usuarios = usuarios;
    }

    @GetMapping("/public/{tipo}")
    public List<ObjectNode> publicos(@PathVariable String tipo) {
        if (
            !Set.of("servicios", "dispositivos", "categorias", "blogs").contains(tipo)
        ) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return s.all(tipo);
    }

    private boolean esTecnico(Authentication auth) {
     return auth.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_tecnico"));
    }
    private boolean asignada(ObjectNode orden, Long tecnicoId) {
     return tecnicoId != null && orden.path("tecnicoId").asLong(-1) == tecnicoId;
    }
    private Long fichaTecnica(Authentication auth) {
     return usuarios.findByCorreoIgnoreCase(auth.getName()).map(u -> u.tecnicoId).orElse(null);
    }
    @GetMapping("/{tipo}") @PreAuthorize("hasAnyRole('administrador','recepcionista','encargado','tecnico')")
    public List<ObjectNode> listar(@PathVariable String tipo, Authentication auth) {
     if (!esTecnico(auth)) return s.all(tipo);
     if (!Set.of("ordenes", "clientes", "tecnicos", "servicios").contains(tipo))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
     Long tecnicoId = fichaTecnica(auth);
     if (tipo.equals("ordenes")) return s.all(tipo).stream().filter(o -> asignada(o, tecnicoId)).toList();
     if (tipo.equals("clientes")) {
      Set<String> clientes = s.all("ordenes").stream().filter(o -> asignada(o, tecnicoId))
       .map(o -> o.path("clienteId").asText()).collect(java.util.stream.Collectors.toSet());
      return s.all(tipo).stream().filter(c -> clientes.contains(c.path("id").asText())).toList();
     }
     if (tipo.equals("tecnicos"))
      return s.all(tipo).stream().filter(t -> java.util.Objects.equals(tecnicoId, t.path("id").asLong())).toList();
     return s.all(tipo);
    }
    @GetMapping("/{tipo}/{id}") @PreAuthorize("hasAnyRole('administrador','recepcionista','encargado','tecnico')")
    public ObjectNode detalle(@PathVariable String tipo, @PathVariable String id, Authentication auth) {
     ObjectNode registro = s.one(tipo, id);
     if (esTecnico(auth) && !listar(tipo, auth).contains(registro))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
     return registro;
    }

    @PostMapping("/{tipo}")
    @PreAuthorize("hasAnyRole('administrador','recepcionista','encargado')")
    public ResponseEntity<ObjectNode> crear(
        @PathVariable String tipo,
        @RequestBody ObjectNode data,
        Authentication auth
    ) {
        permitMutation(tipo, auth);
        if (tipo.equals("ordenes") && data.path("estado").isMissingNode()) data.put("estado", "Recibido");
        return ResponseEntity.status(201).body(s.create(tipo, data));
    }

    @PutMapping("/{tipo}/{id}")
    @PreAuthorize("hasAnyRole('administrador','recepcionista','encargado')")
    public ObjectNode editar(
        @PathVariable String tipo,
        @PathVariable String id,
        @RequestBody ObjectNode data,
        Authentication auth
    ) {
        permitMutation(tipo, auth);
        return s.save(tipo, id, data, false);
    }

    @DeleteMapping("/{tipo}/{id}")
    @PreAuthorize("hasAnyRole('administrador','encargado')")
    public ResponseEntity<Void> borrar(
        @PathVariable String tipo,
        @PathVariable String id,
        Authentication auth
    ) {
        permitMutation(tipo, auth);
        s.delete(tipo, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/ordenes/{id}/estado")
    @PreAuthorize("hasAnyRole('administrador','encargado','tecnico')")
    public ObjectNode estado(
        @PathVariable String id,
        @RequestBody Map<String, String> data,
        Authentication auth
    ) {
        ObjectNode o = s.one("ordenes", id);
        if (esTecnico(auth) && !asignada(o, fichaTecnica(auth))) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        o.put("estado", data.getOrDefault("estado", ""));
        return s.save("ordenes", id, o, false);
    }

    @PatchMapping("/repuestos/{id}/stock")
    @PreAuthorize("hasAnyRole('administrador','encargado')")
    public ObjectNode stock(@PathVariable String id, @RequestBody Map<String, Integer> data) {
        ObjectNode o = s.one("repuestos", id);
        int n = o.path("stock").asInt() + data.getOrDefault("delta", 0);
        o.put("stock", n);
        return s.save("repuestos", id, o, false);
    }

    @PostMapping("/mis-ordenes")
    @PreAuthorize("hasRole('cliente')")
    public ResponseEntity<ObjectNode> crearMiOrden(@RequestBody ObjectNode data, Authentication auth) {
        var u = usuarios.findByCorreoIgnoreCase(auth.getName()).orElseThrow();
        if (u.clienteId == null) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Cliente sin ficha"
        );
        String dispositivo = data.path("dispositivo").asText("").strip();
        String falla = data.path("falla").asText("").strip();
        var servicios = data.path("servicioIds");
        if (dispositivo.isEmpty() || dispositivo.length() > 120 || falla.isEmpty() || falla.length() > 1000
            || !servicios.isArray() || servicios.isEmpty() || servicios.size() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa el equipo, la falla y los servicios");
        }
        long total = 0;
        for (var id : servicios) {
            if (!id.isTextual() || id.asText().isBlank())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Servicio inválido");
            ObjectNode servicio = s.one("servicios", id.asText());
            long precio = servicio.path("precio").asLong();
            int descuento = servicio.path("enOferta").asBoolean() ? servicio.path("descuento").asInt() : 0;
            total += Math.round(precio * (100 - descuento) / 100.0);
        }
        ObjectNode n = data.objectNode();
        n.put("dispositivo", dispositivo);
        n.put("falla", falla);
        n.put("clienteId", u.clienteId);
        n.put("estado", "Recibido");
        n.put("servicioId", servicios.get(0).asText());
        n.set("servicioIds", servicios);
        n.put("costoTotal", total);
        n.put("fechaIngreso", java.time.LocalDate.now().toString());
        n.put("prioridad", "Media");
        return ResponseEntity.status(201).body(s.create("ordenes", n));
    }

    @GetMapping("/mis-ordenes")
    @PreAuthorize("hasRole('cliente')")
    public List<ObjectNode> misOrdenes(Authentication auth) {
        var u = usuarios.findByCorreoIgnoreCase(auth.getName()).orElseThrow();
        if (u.clienteId == null) return List.of();
        return s
            .all("ordenes")
            .stream()
            .filter(o -> o.path("clienteId").asLong(-1) == u.clienteId)
            .toList();
    }

    @GetMapping("/reportes/resumen")
    @PreAuthorize("hasAnyRole('administrador','encargado')")
    public Map<String, Object> resumen() {
        List<ObjectNode> ordenes = s.all("ordenes");
        Map<String, Long> estados = new LinkedHashMap<>();
        long ingresos = 0;
        for (ObjectNode o : ordenes) {
            estados.merge(o.path("estado").asText(), 1L, Long::sum);
            if (o.path("estado").asText().equals("Listo para retirar")) ingresos += o
                .path("costoTotal")
                .asLong();
        }
        return Map.of("total", ordenes.size(), "porEstado", estados, "ingresos", ingresos);
    }
}
