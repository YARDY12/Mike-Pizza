package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.dto.PedidoKitchenDto;
import com.example.mikespizzaspring.dto.UpdatePedidoEstadoRequest;
import com.example.mikespizzaspring.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos/cocina")
public class CocinaController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoKitchenDto>> listarPedidos(@RequestParam(required = false) String estado) {
        return ResponseEntity.ok(pedidoService.obtenerPedidosPorEstado(estado));
    }

    @PostMapping("/{id}/marcar-preparado")
    public ResponseEntity<PedidoKitchenDto> marcarPreparado(@PathVariable Long id, @RequestBody UpdatePedidoEstadoRequest req) {
        if (req == null || req.getAccion() == null) return ResponseEntity.badRequest().build();
        var dto = pedidoService.markPedidoPreparado(id, req.getAccion());
        return ResponseEntity.ok(dto);
    }
}
