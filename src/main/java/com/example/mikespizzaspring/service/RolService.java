package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Rol;
import com.example.mikespizzaspring.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public Rol save(Rol rol) {
        return rolRepository.save(rol);
    }

    public List<Rol> findAll() {
        return rolRepository.findAll();
    }

    public Optional<Rol> findById(Long id) {
        return rolRepository.findById(id);
    }

    public void delete(Long id) {
        rolRepository.deleteById(id);
    }
}
