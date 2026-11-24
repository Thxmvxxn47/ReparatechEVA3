package cl.reparatech.security;

import cl.reparatech.model.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final long minutes;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.minutes}") long minutes) {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.minutes = minutes;
    }

    public String issue(Usuario u) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(u.correo)
            .claim("rol", u.rol)
            .claim("tipo", "access")
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(minutes * 60)))
            .signWith(key)
            .compact();
    }

    public String subject(String token) {
        var claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        if (!"access".equals(claims.get("tipo", String.class))) throw new IllegalArgumentException(
            "No es token de acceso"
        );
        return claims.getSubject();
    }

    public String refreshToken(Usuario u) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(u.correo)
            .claim("tipo", "refresh")
            .id(UUID.randomUUID().toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(7 * 24 * 3600)))
            .signWith(key)
            .compact();
    }

    public String refreshSubject(String token) {
        var claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        if (!"refresh".equals(claims.get("tipo", String.class))) throw new IllegalArgumentException(
            "No es refresh"
        );
        return claims.getSubject();
    }
}
