package cl.reparatech.security;

import cl.reparatech.repository.UsuarioRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final UsuarioRepository usuarios;

    public JwtFilter(JwtService jwt, UsuarioRepository usuarios) {
        this.jwt = jwt;
        this.usuarios = usuarios;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
        throws ServletException, IOException
    {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String correo = jwt.subject(header.substring(7));
                usuarios.findByCorreoIgnoreCase(correo).ifPresent(u -> {
                    var auth = new UsernamePasswordAuthenticationToken(
                        u.correo,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + u.rol))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(req, res);
    }
}
