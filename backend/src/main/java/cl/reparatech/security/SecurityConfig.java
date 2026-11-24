package cl.reparatech.security;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource cors(@Value("${app.cors.origin}") String origin) {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of(origin, "http://127.0.0.1:5173"));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-CSRF-Token"));
        c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", c);
        return src;
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity http, JwtFilter filter) throws Exception {
        return http
            .csrf(c -> c.disable())
            .cors(c -> {})
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a ->
                a
                    .requestMatchers(
                        "/api/auth/login",
                        "/api/auth/registro",
                        "/api/auth/refresh",
                        "/api/auth/logout",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/error"
                    )
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/public/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            )
            .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
