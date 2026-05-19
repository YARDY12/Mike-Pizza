package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Producto;
import com.example.mikespizzaspring.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    public void delete(Long id) {
        productoRepository.deleteById(id);
    }
}
