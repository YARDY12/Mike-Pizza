package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Reparto;
import com.example.mikespizzaspring.service.RepartoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/repartos")
public class RepartoController {


    @Autowired
    private RepartoService repartoService;

    @PostMapping
    public ResponseEntity<Reparto> create(@RequestBody Reparto reparto) {
        Reparto created = repartoService.save(reparto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Reparto>> getAll() {
        return ResponseEntity.ok(repartoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reparto> getById(@PathVariable Long id) {
        Optional<Reparto> reparto = repartoService.findById(id);
        return reparto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repartoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
