package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Direccion;
import com.example.mikespizzaspring.service.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @PostMapping
    public ResponseEntity<Direccion> create(@RequestBody Direccion direccion) {
        Direccion created = direccionService.save(direccion);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Direccion>> getAll() {
        return ResponseEntity.ok(direccionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Direccion> getById(@PathVariable Long id) {
        Optional<Direccion> direccion = direccionService.findById(id);
        return direccion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        direccionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
