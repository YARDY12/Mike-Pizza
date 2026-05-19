package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Rol;
import com.example.mikespizzaspring.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @PostMapping
    public ResponseEntity<Rol> create(@RequestBody Rol rol) {
        Rol created = rolService.save(rol);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Rol>> getAll() {
        return ResponseEntity.ok(rolService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rol> getById(@PathVariable Long id) {
        Optional<Rol> rol = rolService.findById(id);
        return rol.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
