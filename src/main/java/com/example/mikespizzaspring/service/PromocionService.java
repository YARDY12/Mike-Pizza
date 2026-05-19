package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Promocion;
import com.example.mikespizzaspring.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromocionService {

    @Autowired
    private PromocionRepository promocionRepository;

    public Promocion save(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    public List<Promocion> findAll() {
        return promocionRepository.findAll();
    }

    public Optional<Promocion> findById(Long id) {
        return promocionRepository.findById(id);
    }

    public void delete(Long id) {
        promocionRepository.deleteById(id);
    }
}
