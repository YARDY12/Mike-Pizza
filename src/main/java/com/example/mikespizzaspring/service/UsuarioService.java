package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Usuario;
import com.example.mikespizzaspring.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario actualizarEmail(Long idUsuario, String nuevoEmail) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verifica si el email ya existe y pertenece a otro usuario
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(nuevoEmail);

        if (usuarioExistente.isPresent()
                && !usuarioExistente.get().getIdUsuario().equals(idUsuario)) {

            throw new RuntimeException("El correo ya está registrado");
        }

        usuario.setEmail(nuevoEmail);

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}
