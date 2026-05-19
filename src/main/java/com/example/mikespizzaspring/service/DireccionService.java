package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Direccion;
import com.example.mikespizzaspring.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    public Direccion save(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    public List<Direccion> findAll() {
        return direccionRepository.findAll();
    }

    public Optional<Direccion> findById(Long id) {
        return direccionRepository.findById(id);
    }

    public void delete(Long id) {
        direccionRepository.deleteById(id);
    }
}
