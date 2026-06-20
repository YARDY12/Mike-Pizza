package com.example.mikespizzaspring.repository;

import java.util.List;

import com.example.mikespizzaspring.model.UsuarioRol;
import com.example.mikespizzaspring.model.UsuarioRolId;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, UsuarioRolId>{
    boolean existsByRol_Nombre(String nombre);
    List<UsuarioRol> findByRol_Nombre(String nombre);
}

