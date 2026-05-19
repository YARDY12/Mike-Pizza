package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.SeguimientoPedido;
import com.example.mikespizzaspring.service.SeguimientoPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seguimiento-pedidos")
public class SeguimientoPedidoController {


    @Autowired
    private SeguimientoPedidoService seguimientoPedidoService;

    @PostMapping
    public ResponseEntity<SeguimientoPedido> create(@RequestBody SeguimientoPedido entity) {
        SeguimientoPedido created = seguimientoPedidoService.save(entity);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<SeguimientoPedido>> getAll() {
        return ResponseEntity.ok(seguimientoPedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeguimientoPedido> getById(@PathVariable Long id) {
        Optional<SeguimientoPedido> entity = seguimientoPedidoService.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seguimientoPedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
