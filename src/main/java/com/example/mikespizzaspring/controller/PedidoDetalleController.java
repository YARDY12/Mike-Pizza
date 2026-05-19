package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.PedidoDetalle;
import com.example.mikespizzaspring.service.PedidoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/pedidos-detalle")
public class PedidoDetalleController {


    @Autowired
    private PedidoDetalleService pedidoDetalleService;

    @PostMapping
    public ResponseEntity<PedidoDetalle> create(@RequestBody PedidoDetalle detalle) {
        PedidoDetalle created = pedidoDetalleService.save(detalle);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<PedidoDetalle>> getAll() {
        return ResponseEntity.ok(pedidoDetalleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalle> getById(@PathVariable Long id) {
        Optional<PedidoDetalle> detalle = pedidoDetalleService.findById(id);
        return detalle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoDetalleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
