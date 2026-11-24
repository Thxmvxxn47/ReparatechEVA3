package cl.reparatech.controller;

import cl.reparatech.model.*;
import cl.reparatech.repository.*;
import cl.reparatech.security.JwtService;
import cl.reparatech.service.RegistroService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final SesionRefreshRepository sesiones;
    private final RegistroService registros;
    private final boolean secure;

    public AuthController(
        UsuarioRepository repo,
        PasswordEncoder encoder,
        JwtService jwt,
        SesionRefreshRepository sesiones,
        RegistroService registros,
        @Value("${app.cookie.secure:false}") boolean secure
    ) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
        this.sesiones = sesiones;
        this.registros = registros;
        this.secure = secure;
    }

    public record Credentials(String correo, String password) {}

    private String hash(String token) {
        try {
            byte[] h = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(h);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private void cookie(HttpServletResponse response, String token, int seconds) {
        ResponseCookie c = ResponseCookie.from("rt_refresh", token)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/api/auth")
            .maxAge(seconds)
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, c.toString());
    }

    private Map<String, Object> response(Usuario u) {
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", u.id);
        user.put("correo", u.correo);
        user.put("rol", u.rol);
        user.put("nombre", u.nombre);
        user.put("apellido", u.apellido);
        user.put("clienteId", u.clienteId);
        return Map.of("token", jwt.issue(u), "usuario", user);
    }

    private Map<String, Object> start(Usuario u, HttpServletResponse res) {
        String t = jwt.refreshToken(u);
        sesiones.save(new SesionRefresh(hash(t), u.correo));
        cookie(res, t, 604800);
        return response(u);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Credentials c, HttpServletResponse res) {
        Usuario u = repo
            .findByCorreoIgnoreCase(c.correo() == null ? "" : c.correo())
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas")
            );
        if (
            c.password() == null || !encoder.matches(c.password(), u.claveHash)
        ) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        return start(u, res);
    }

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registro(
        @RequestBody Map<String, Object> body,
        HttpServletResponse res
    ) {
        String correo = String.valueOf(body.getOrDefault("correo", "")).trim().toLowerCase(),
            pass = String.valueOf(body.getOrDefault("password", ""));
        if (
            !correo.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$") || pass.length() < 8
        ) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Correo inválido o contraseña menor a 8 caracteres"
        );
        if (repo.findByCorreoIgnoreCase(correo).isPresent()) throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "Correo existente"
        );
        ObjectNode c = com.fasterxml.jackson.databind.json.JsonMapper.builder().build().createObjectNode();
        for (String key : List.of("nombre", "apellido", "correo", "telefono", "direccion"))
            c.put(key, String.valueOf(body.getOrDefault(key, "")));
        ObjectNode nuevo = registros.create("clientes", c);
        Long clienteId = Long.valueOf(nuevo.path("id").asText());
        Usuario u = repo.save(
            new Usuario(
                correo,
                encoder.encode(pass),
                "cliente",
                c.path("nombre").asText(),
                c.path("apellido").asText(),
                clienteId
            )
        );
        return ResponseEntity.status(201).body(start(u, res));
    }

    private String readCookie(HttpServletRequest req) {
        if (req.getCookies() != null) for (Cookie c : req.getCookies())
            if (c.getName().equals("rt_refresh")) return c.getValue();
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sin sesión");
    }

    @PostMapping("/refresh")
    public Map<String, Object> refresh(HttpServletRequest req, HttpServletResponse res) {
        String token = readCookie(req);
        String correo;
        try {
            correo = jwt.refreshSubject(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión vencida");
        }
        var session = sesiones
            .findById(hash(token))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión revocada"));
        sesiones.delete(session);
        Usuario u = repo
            .findByCorreoIgnoreCase(correo)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return start(u, res);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest req, HttpServletResponse res) {
        try {
            sesiones.deleteById(hash(readCookie(req)));
        } catch (Exception ignored) {}
        cookie(res, "", 0);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/perfil")
    public Map<String, Object> perfil(@RequestBody Map<String, String> datos, Authentication auth) {
        Usuario u = repo.findByCorreoIgnoreCase(auth.getName()).orElseThrow();
        if (datos.containsKey("nombre")) u.nombre = datos.get("nombre").strip();
        if (datos.containsKey("apellido")) u.apellido = datos.get("apellido").strip();
        repo.save(u);
        return Map.of("usuario", response(u).get("usuario"));
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(
        @RequestBody Map<String, String> datos,
        Authentication auth,
        HttpServletRequest req,
        HttpServletResponse res
    ) {
        Usuario u = repo.findByCorreoIgnoreCase(auth.getName()).orElseThrow();
        String actual = datos.getOrDefault("actual", ""),
            nueva = datos.getOrDefault("nueva", "");
        if (!encoder.matches(actual, u.claveHash)) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Contraseña actual incorrecta"
        );
        if (nueva.length() < 8) throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Mínimo 8 caracteres"
        );
        u.claveHash = encoder.encode(nueva);
        repo.save(u);
        try {
            sesiones.deleteById(hash(readCookie(req)));
        } catch (Exception ignored) {}
        cookie(res, "", 0);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        Usuario u = repo.findByCorreoIgnoreCase(auth.getName()).orElseThrow();
        return Map.of("usuario", response(u).get("usuario"));
    }
}
