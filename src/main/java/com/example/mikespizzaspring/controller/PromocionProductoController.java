package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.model.PromocionProducto;
import com.example.mikespizzaspring.model.PromocionProductoId;
import com.example.mikespizzaspring.service.PromocionProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/api/promociones-producto")
public class PromocionProductoController {


    @Autowired
    private PromocionProductoService promocionProductoService;

    @PostMapping
    public ResponseEntity<PromocionProducto> create(@RequestBody PromocionProducto entity) {
        PromocionProducto created = promocionProductoService.save(entity);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<PromocionProducto>> getAll() {
        return ResponseEntity.ok(promocionProductoService.findAll());
    }

    @GetMapping("/{promocionId}/{productoId}")
    public ResponseEntity<PromocionProducto> getById(@PathVariable Long promocionId, @PathVariable Long productoId) {
        PromocionProductoId id = new PromocionProductoId(promocionId, productoId);
        Optional<PromocionProducto> entity = promocionProductoService.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{promocionId}/{productoId}")
    public ResponseEntity<Void> delete(@PathVariable Long promocionId, @PathVariable Long productoId) {
        PromocionProductoId id = new PromocionProductoId(promocionId, productoId);
        promocionProductoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
