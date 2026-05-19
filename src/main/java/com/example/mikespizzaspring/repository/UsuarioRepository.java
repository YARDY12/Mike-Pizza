package com.example.mikespizzaspring.repository;


import com.example.mikespizzaspring.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
}
