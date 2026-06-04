package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.dto.AuthRequest;
import com.example.mikespizzaspring.dto.AuthResponse;
import com.example.mikespizzaspring.dto.RegistroClienteRequest;
import com.example.mikespizzaspring.dto.RegistroAdminRequest;
import com.example.mikespizzaspring.dto.UsuarioResponse;
import com.example.mikespizzaspring.model.Usuario;
import com.example.mikespizzaspring.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    @PostMapping("/registro-cliente")
    public ResponseEntity<UsuarioResponse> registroCliente(@RequestBody RegistroClienteRequest request) {
        try {
            Usuario usuario = authService.registrarCliente(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(usuario));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    @PostMapping("/bootstrap-admin")
    public ResponseEntity<UsuarioResponse> registroAdmin(@RequestBody RegistroAdminRequest request) {
        try {
            Usuario usuario = authService.registrarAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(usuario));
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setEmail(usuario.getEmail());
        response.setTelefono(usuario.getTelefono());
        response.setActivo(usuario.getActivo());
        response.setFechaRegistro(usuario.getFechaRegistro());
        response.setRoles(usuario.getUsuarioRoles().stream()
                .map(usuarioRol -> usuarioRol.getRol().getNombre())
                .collect(Collectors.toSet()));
        return response;
    }
}
