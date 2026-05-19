package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.CategoriaProducto;
import com.example.mikespizzaspring.service.CategoriaProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias-producto")
public class CategoriaProductoController {

    @Autowired
    private CategoriaProductoService categoriaProductoService;

    @PostMapping
    public ResponseEntity<CategoriaProducto> create(@RequestBody CategoriaProducto categoria) {
        CategoriaProducto created = categoriaProductoService.save(categoria);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaProducto>> getAll() {
        return ResponseEntity.ok(categoriaProductoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaProducto> getById(@PathVariable Long id) {
        Optional<CategoriaProducto> categoria = categoriaProductoService.findById(id);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaProductoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
