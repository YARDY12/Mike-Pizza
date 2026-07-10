package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.dto.PedidoKitchenDto;
import com.example.mikespizzaspring.model.Pedido;
import com.example.mikespizzaspring.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
    public ResponseEntity<PedidoKitchenDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPedidoConDetalles(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Autowired
    private com.example.mikespizzaspring.repository.UsuarioRepository usuarioRepository;

    private Long getUsuarioId(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) return 1L;
        String name = authentication.getName();
        try { return Long.valueOf(name); } catch (Exception e) {
            var maybe = usuarioRepository.findByEmail(name);
            return maybe.map(u -> u.getIdUsuario()).orElse(1L);
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<com.example.mikespizzaspring.dto.CheckoutResponse> checkout(@RequestBody com.example.mikespizzaspring.dto.CheckoutRequest req, org.springframework.security.core.Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        Pedido pedido = pedidoService.createPedidoFromCarrito(usuarioId, req);
        String pagoUrl = "/api/pagos/simular"; // client should POST {pedidoId} to simulate payment
        return ResponseEntity.ok(new com.example.mikespizzaspring.dto.CheckoutResponse(pedido.getIdPedido(), pagoUrl));
    }
}
