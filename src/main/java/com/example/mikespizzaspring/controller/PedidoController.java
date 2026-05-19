package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.Pedido;
import com.example.mikespizzaspring.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {


    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody Pedido pedido) {
        Pedido created = pedidoService.save(pedido);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> getAll() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getById(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.findById(id);
        return pedido.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
