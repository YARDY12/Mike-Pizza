package com.example.mikespizzaspring.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class SecurityConfig {

    // Usa una clave secreta fija (debe tener suficiente longitud para HS512)
    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 86400000L; // 1 día en milisegundos

    // Permite que otros componentes accedan a la clave secreta
    public SecretKey getSecretKey() {
        return SECRET_KEY;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permitir cualquier localhost en cualquier puerto durante desarrollo
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public String generateToken(String username, Set<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Set<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return new HashSet<>((List<String>) claims.get("roles"));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // permitir preflight OPTIONS en cualquier ruta
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // endpoints públicos
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/registro-cliente",
                                "/api/auth/bootstrap-admin",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // reglas con authority
                        .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categorias").hasAuthority("ADMIN")
                        // resto: permitir (ajusta según necesidad)
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthorizationFilter(this), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
