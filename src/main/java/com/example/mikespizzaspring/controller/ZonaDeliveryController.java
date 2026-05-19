package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.ZonaDelivery;
import com.example.mikespizzaspring.service.ZonaDeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/zonas-delivery")
public class ZonaDeliveryController {

    @Autowired
    private ZonaDeliveryService zonaDeliveryService;

    @PostMapping
    public ResponseEntity<ZonaDelivery> create(@RequestBody ZonaDelivery zonaDelivery) {
        ZonaDelivery created = zonaDeliveryService.save(zonaDelivery);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ZonaDelivery>> getAll() {
        return ResponseEntity.ok(zonaDeliveryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZonaDelivery> getById(@PathVariable Long id) {
        Optional<ZonaDelivery> zona = zonaDeliveryService.findById(id);
        return zona.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        zonaDeliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
