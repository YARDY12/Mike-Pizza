package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.dto.CarritoDto;
import com.example.mikespizzaspring.dto.CartItemRequest;
import com.example.mikespizzaspring.repository.UsuarioRepository;
import com.example.mikespizzaspring.service.CarritoService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;
    private final UsuarioRepository usuarioRepository; // nuevo

    public CarritoController(CarritoService carritoService, UsuarioRepository usuarioRepository) {
        this.carritoService = carritoService;
        this.usuarioRepository = usuarioRepository;
    }

    private Long getUsuarioId(Authentication authentication) {
        if (authentication == null) return 1L;
        String name = authentication.getName();
        try {
            return Long.valueOf(name);
        } catch (Exception e) {
            var maybe = usuarioRepository.findByEmail(name);
            return maybe.map(u -> u.getIdUsuario()).orElse(1L);
        }
    }

    @GetMapping
    public ResponseEntity<CarritoDto> obtenerCarrito(Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        return ResponseEntity.ok(carritoService.obtenerOCrearCarritoDto(usuarioId));
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoDto> agregarItem(@RequestBody CartItemRequest req, Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        return ResponseEntity.ok(carritoService.agregarItemDto(usuarioId, req));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CarritoDto> actualizarCantidad(@PathVariable Long itemId, @RequestBody ActualizarCantidadRequest request, Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        if (request.getCantidad() == null || request.getCantidad() < 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(carritoService.actualizarCantidadDto(usuarioId, itemId, request.getCantidad()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoDto> eliminarItem(@PathVariable Long itemId, Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        return ResponseEntity.ok(carritoService.eliminarItemDto(usuarioId, itemId));
    }

    @DeleteMapping("/limpiar")
    public ResponseEntity<Map<String, String>> limpiarCarrito(Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        carritoService.limpiarCarritoDto(usuarioId);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Carrito vaciado exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> obtenerTotal(Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        Double total = carritoService.calcularTotal(usuarioId);
        Integer cantidad = carritoService.calcularCantidadItems(usuarioId);
        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("cantidadItems", cantidad);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cantidad")
    public ResponseEntity<Map<String, Integer>> obtenerCantidad(Authentication authentication) {
        Long usuarioId = getUsuarioId(authentication);
        Integer cantidad = carritoService.calcularCantidadItems(usuarioId);
        Map<String, Integer> response = new HashMap<>();
        response.put("cantidad", cantidad);
        return ResponseEntity.ok(response);
    }
}

class ActualizarCantidadRequest {
    private Integer cantidad;
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}