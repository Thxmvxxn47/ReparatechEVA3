package cl.reparatech.service;

import cl.reparatech.model.*;
import cl.reparatech.repository.*;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistroService {

    public static final Set<String> TIPOS = Set.of(
        "clientes",
        "tecnicos",
        "servicios",
        "dispositivos",
        "categorias",
        "repuestos",
        "ordenes",
        "blogs"
    );
    private final RegistroRepository repo;
    private final ObjectMapper mapper;

    public RegistroService(RegistroRepository repo, ObjectMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public void validarTipo(String tipo) {
        if (!TIPOS.contains(tipo)) throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Recurso inexistente"
        );
    }

    public ObjectNode parse(Registro r) {
        try {
            return (ObjectNode) mapper.readTree(r.json);
        } catch (Exception e) {
            throw new IllegalStateException("Registro corrupto", e);
        }
    }

    public List<ObjectNode> all(String tipo) {
        validarTipo(tipo);
        return repo.findByTipo(tipo).stream().map(this::parse).toList();
    }

    public ObjectNode one(String tipo, String id) {
        validarTipo(tipo);
        return parse(
            repo
                .findByTipoAndCodigo(tipo, id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No encontrado"))
        );
    }

    private void check(String tipo, ObjectNode n) {
        if (tipo.equals("ordenes")) {
            String estado = n.path("estado").asText("Recibido");
            if (
                !List.of(
                    "Recibido",
                    "En diagnóstico",
                    "En reparación",
                    "Listo para retirar",
                    "Cancelado"
                ).contains(estado)
            ) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de orden inválido");
            if (
                n.path("clienteId").isMissingNode() || n.path("clienteId").asInt() <= 0
            ) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta clienteId");
        }
        if (
            tipo.equals("ordenes") &&
            !repo.findByTipoAndCodigo("clientes", n.path("clienteId").asText()).isPresent()
        ) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente inexistente");
        if (
            tipo.equals("ordenes") &&
            !n.path("tecnicoId").isMissingNode() &&
            n.path("tecnicoId").asInt() > 0 &&
            !repo.findByTipoAndCodigo("tecnicos", n.path("tecnicoId").asText()).isPresent()
        ) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Técnico inexistente");
        if (tipo.equals("repuestos") && n.path("stock").asInt(0) < 0) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Stock negativo"
        );
    }

    @Transactional
    public ObjectNode save(String tipo, String id, ObjectNode body, boolean creating) {
        validarTipo(tipo);
        ObjectNode n = body.deepCopy();
        n.put("id", id);
        check(tipo, n);
        Optional<Registro> old = repo.findByTipoAndCodigo(tipo, id);
        if (creating && old.isPresent()) throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "Código existente"
        );
        if (!creating && old.isEmpty()) throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "No encontrado"
        );
        try {
            Registro r = old.orElseGet(() -> new Registro(tipo, id, "{}"));
            r.json = mapper.writeValueAsString(n);
            repo.save(r);
            return n;
        } catch (com.fasterxml.jackson.core.JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "JSON inválido");
        }
    }

    @Transactional
    public ObjectNode create(String tipo, ObjectNode n) {
        String id = n.path("id").asText("");
        if (id.isBlank()) {
            long max = repo
                .findByTipo(tipo)
                .stream()
                .map(r -> r.codigo)
                .filter(v -> v.matches(".*\\d+$"))
                .mapToLong(v -> {
                    String s = v.replaceAll("^.*?(\\d+)$", "$1");
                    try {
                        return Long.parseLong(s);
                    } catch (Exception e) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
            long next = max + 1;
            id = switch (tipo) {
                case "ordenes" -> "OT-" + String.format("%03d", next);
                case "servicios" -> "SE" + String.format("%03d", next);
                case "categorias", "clientes", "tecnicos" -> String.valueOf(next);
                default -> tipo.substring(0, 2).toUpperCase() + String.format("%03d", next);
            };
        }
        return save(tipo, id, n, true);
    }

    @Transactional
    public void delete(String tipo, String id) {
        Registro r = repo
            .findByTipoAndCodigo(tipo, id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        repo.delete(r);
    }
}
