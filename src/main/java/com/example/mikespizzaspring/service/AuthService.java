package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.config.SecurityConfig;
import com.example.mikespizzaspring.dto.AuthRequest;
import com.example.mikespizzaspring.dto.AuthResponse;
import com.example.mikespizzaspring.dto.CrearEmpleadoRequest;
import com.example.mikespizzaspring.dto.RegistroAdminRequest;
import com.example.mikespizzaspring.dto.RegistroClienteRequest;
import com.example.mikespizzaspring.model.Rol;
import com.example.mikespizzaspring.model.Usuario;
import com.example.mikespizzaspring.model.UsuarioRol;
import com.example.mikespizzaspring.model.UsuarioRolId;
import com.example.mikespizzaspring.repository.RolRepository;
import com.example.mikespizzaspring.repository.UsuarioRepository;
import com.example.mikespizzaspring.repository.UsuarioRolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Set<String> ROLES_EMPLEADO = Set.of("COCINA", "MESERO", "REPARTIDOR");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRolRepository usuarioRolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityConfig securityConfig;


    @Transactional
    public AuthResponse login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciales invalidas");
        }

        Set<String> roles = usuario.getUsuarioRoles().stream()
                .map(usuarioRol -> usuarioRol.getRol().getNombre())
                .collect(Collectors.toSet());

        String token = securityConfig.generateToken(usuario.getEmail(), roles);


        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setIdUsuario(usuario.getIdUsuario());
        response.setEmail(usuario.getEmail());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setRoles(roles);
        return response;
    }

    @Transactional
    public Usuario registrarCliente(RegistroClienteRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        Rol rol = obtenerOCrearRol("CLIENTE");
        crearUsuarioRol(usuarioGuardado, rol);

        return usuarioGuardado;
    }

    @Transactional
    public Usuario registrarAdmin(RegistroAdminRequest request) {
        if (usuarioRolRepository.existsByRol_Nombre("ADMIN")) {
            throw new IllegalStateException("Ya existe un usuario ADMIN");
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        Rol rol = obtenerOCrearRol("ADMIN");
        crearUsuarioRol(usuarioGuardado, rol);

        return usuarioGuardado;
    }

    @Transactional
    public Usuario crearEmpleado(CrearEmpleadoRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }

        String rolSolicitado = request.getRol() == null ? "" : request.getRol().trim().toUpperCase();
        if (!ROLES_EMPLEADO.contains(rolSolicitado)) {
            throw new IllegalArgumentException("Rol de empleado invalido");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        Rol rol = obtenerOCrearRol(rolSolicitado);
        crearUsuarioRol(usuarioGuardado, rol);

        return usuarioGuardado;
    }

    @Transactional
    public Usuario crearAdmin(RegistroAdminRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        Rol rol = obtenerOCrearRol("ADMIN");
        crearUsuarioRol(usuarioGuardado, rol);

        return usuarioGuardado;
    }

    private Rol obtenerOCrearRol(String nombre) {
        return rolRepository.findByNombre(nombre)
                .orElseGet(() -> rolRepository.save(new Rol(nombre)));
    }

    private void crearUsuarioRol(Usuario usuario, Rol rol) {
        boolean existe = usuario.getUsuarioRoles().stream()
                .anyMatch(usuarioRol -> usuarioRol.getRol() != null
                        && rol.getNombre().equals(usuarioRol.getRol().getNombre()));
        if (existe) {
            return;
        }

        UsuarioRolId id = new UsuarioRolId();
        id.setIdUsuario(usuario.getIdUsuario());
        id.setIdRol(rol.getIdRol());

        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setId(id);
        usuarioRol.setUsuario(usuario);
        usuarioRol.setRol(rol);

        usuario.getUsuarioRoles().add(usuarioRol);
    }
}
