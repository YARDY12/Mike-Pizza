package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Promocion;
import com.example.mikespizzaspring.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/promociones")
public class PromocionController {


    @Autowired
    private PromocionService promocionService;

    @PostMapping
    public ResponseEntity<Promocion> create(@RequestBody Promocion promocion) {
        Promocion created = promocionService.save(promocion);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Promocion>> getAll() {
        return ResponseEntity.ok(promocionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promocion> getById(@PathVariable Long id) {
        Optional<Promocion> promo = promocionService.findById(id);
        return promo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        promocionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
