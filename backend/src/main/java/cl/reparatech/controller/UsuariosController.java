package cl.reparatech.controller;

import cl.reparatech.model.Usuario;
import cl.reparatech.repository.UsuarioRepository;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/usuarios-auth")
@PreAuthorize("hasRole('administrador')")
public class UsuariosController {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuariosController(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public record Nuevo(String nombre, String apellido, String correo, String password, String rol) {}

    public record Vista(Long id, String nombre, String apellido, String correo, String rol) {}

    private Vista vista(Usuario u) {
        return new Vista(u.id, u.nombre, u.apellido, u.correo, u.rol);
    }

    @GetMapping
    public List<Vista> all() {
        return repo
            .findAll()
            .stream()
            .filter(u -> !u.rol.equals("cliente"))
            .map(this::vista)
            .toList();
    }

    @PostMapping
    public ResponseEntity<Vista> create(@RequestBody Nuevo n) {
        if (
            n.correo() == null ||
            !n.correo().contains("@") ||
            n.password() == null ||
            n.password().length() < 8 ||
            !Set.of("administrador", "encargado", "recepcionista", "tecnico").contains(n.rol())
        ) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Datos o rol inválidos; contraseña mínima de 8 caracteres"
        );
        if (repo.findByCorreoIgnoreCase(n.correo()).isPresent()) throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "Usuario existente"
        );
        Usuario u = repo.save(
            new Usuario(
                n.correo().toLowerCase(),
                encoder.encode(n.password()),
                n.rol(),
                n.nombre(),
                n.apellido(),
                null
            )
        );
        return ResponseEntity.status(201).body(vista(u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Long id,
        org.springframework.security.core.Authentication a
    ) {
        Usuario u = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (u.correo.equalsIgnoreCase(a.getName())) throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "No puedes eliminar tu propia cuenta"
        );
        repo.delete(u);
        return ResponseEntity.noContent().build();
    }
}
