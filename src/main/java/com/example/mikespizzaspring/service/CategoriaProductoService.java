package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.CategoriaProducto;
import com.example.mikespizzaspring.repository.CategoriaProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaProductoService {


    @Autowired
    private CategoriaProductoRepository categoriaProductoRepository;

    public CategoriaProducto save(CategoriaProducto categoria) {
        return categoriaProductoRepository.save(categoria);
    }

    public List<CategoriaProducto> findAll() {
        return categoriaProductoRepository.findAll();
    }

    public Optional<CategoriaProducto> findById(Long id) {
        return categoriaProductoRepository.findById(id);
    }

    public void delete(Long id) {
        categoriaProductoRepository.deleteById(id);
    }
}
