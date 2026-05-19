package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.PromocionProducto;
import com.example.mikespizzaspring.model.PromocionProductoId;
import com.example.mikespizzaspring.repository.PromocionProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PromocionProductoService {



    @Autowired
    private PromocionProductoRepository promocionProductoRepository;

    public PromocionProducto save(PromocionProducto entity) {
        return promocionProductoRepository.save(entity);
    }

    public List<PromocionProducto> findAll() {
        return promocionProductoRepository.findAll();
    }

    public Optional<PromocionProducto> findById(PromocionProductoId id) {
        return promocionProductoRepository.findById(id);
    }

    public void delete(PromocionProductoId id) {
        promocionProductoRepository.deleteById(id);
    }
}
