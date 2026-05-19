package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Reparto;
import com.example.mikespizzaspring.repository.RepartoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RepartoService {


    @Autowired
    private RepartoRepository repartoRepository;

    public Reparto save(Reparto reparto) {
        return repartoRepository.save(reparto);
    }

    public List<Reparto> findAll() {
        return repartoRepository.findAll();
    }

    public Optional<Reparto> findById(Long id) {
        return repartoRepository.findById(id);
    }

    public void delete(Long id) {
        repartoRepository.deleteById(id);
    }
}
