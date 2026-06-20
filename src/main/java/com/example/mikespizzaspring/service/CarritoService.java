package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.dto.CarritoDto;
import com.example.mikespizzaspring.dto.CarritoItemDto;
import com.example.mikespizzaspring.dto.CartItemRequest;
import com.example.mikespizzaspring.model.Carrito;
import com.example.mikespizzaspring.model.CarritoItem;
import com.example.mikespizzaspring.repository.CarritoItemRepository;
import com.example.mikespizzaspring.repository.CarritoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;

    public CarritoService(CarritoRepository carritoRepository, CarritoItemRepository carritoItemRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
    }

    @Transactional
    public Carrito obtenerOCrearCarrito(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Carrito carrito = new Carrito();
                    carrito.setUsuarioId(usuarioId);
                    carrito.setCreadoEn(LocalDateTime.now());
                    carrito.setActualizadoEn(LocalDateTime.now());
                    return carritoRepository.save(carrito);
                });
    }

    // Mapping helper
    private CarritoDto toDto(Carrito c) {
        List<CarritoItemDto> items = c.getItems().stream()
                .map(i -> new CarritoItemDto(i.getId(), i.getProductoId(), i.getTamano(), i.getExtras(), i.getCantidad(), i.getPrecioUnitario()))
                .collect(Collectors.toList());
        double total = items.stream().mapToDouble(it -> (it.getPrecioUnitario()==null?0.0:it.getPrecioUnitario()) * (it.getCantidad()==null?0:it.getCantidad())).sum();
        String actualizado = c.getActualizadoEn() == null ? null : c.getActualizadoEn().format(DateTimeFormatter.ISO_DATE_TIME);
        return new CarritoDto(c.getId(), c.getUsuarioId(), items, total, actualizado);
    }

    @Transactional
    public CarritoDto obtenerOCrearCarritoDto(Long usuarioId) {
        Carrito c = obtenerOCrearCarrito(usuarioId);
        return toDto(c);
    }

    @Transactional
    public CarritoDto agregarItemDto(Long usuarioId, CartItemRequest req) {
        CarritoItem item = new CarritoItem();
        item.setProductoId(req.getProductoId());
        item.setTamano(req.getTamano());
        item.setExtras(req.getExtras());
        item.setCantidad(req.getCantidad() == null ? 1 : req.getCantidad());
        item.setPrecioUnitario(req.getPrecioUnitario() == null ? 0.0 : req.getPrecioUnitario());

        Carrito carrito = agregarItem(usuarioId, item);
        return toDto(carrito);
    }

    @Transactional
    public CarritoDto actualizarCantidadDto(Long usuarioId, Long itemId, Integer cantidad) {
        Carrito c = actualizarCantidad(usuarioId, itemId, cantidad);
        return toDto(c);
    }

    @Transactional
    public CarritoDto eliminarItemDto(Long usuarioId, Long itemId) {
        Carrito c = eliminarItem(usuarioId, itemId);
        return toDto(c);
    }

    @Transactional
    public void limpiarCarritoDto(Long usuarioId) {
        limpiarCarrito(usuarioId);
    }

    // existing domain methods left intact (used by DTO wrappers)
    @Transactional
    public Carrito agregarItem(Long usuarioId, CarritoItem item) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);

        Optional<CarritoItem> existente = carrito.getItems().stream()
                .filter(i -> i.getProductoId().equals(item.getProductoId())
                        && (i.getTamano() != null ? i.getTamano().equals(item.getTamano()) : item.getTamano() == null)
                        && (i.getExtras() != null ? i.getExtras().equals(item.getExtras()) : item.getExtras() == null))
                .findFirst();

        if (existente.isPresent()) {
            existente.get().setCantidad(existente.get().getCantidad() + item.getCantidad());
        } else {
            item.setCarrito(carrito);
            carrito.getItems().add(item);
        }

        carrito.setActualizadoEn(LocalDateTime.now());
        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);

        carrito.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(i -> {
                    if (cantidad > 0) {
                        i.setCantidad(cantidad);
                    } else {
                        carrito.getItems().remove(i);
                    }
                });

        carrito.setActualizadoEn(LocalDateTime.now());
        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito eliminarItem(Long usuarioId, Long itemId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);

        carrito.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(i -> {
                    carrito.getItems().remove(i);
                    i.setCarrito(null);
                });

        carrito.setActualizadoEn(LocalDateTime.now());
        return carritoRepository.save(carrito);
    }

    @Transactional
    public void limpiarCarrito(Long usuarioId) {
        carritoRepository.findByUsuarioId(usuarioId)
                .ifPresent(carrito -> {
                    carrito.getItems().clear();
                    carrito.setActualizadoEn(LocalDateTime.now());
                    carritoRepository.save(carrito);
                });
    }

    @Transactional
    public void eliminarCarrito(Long usuarioId) {
        carritoRepository.findByUsuarioId(usuarioId)
                .ifPresent(carritoRepository::delete);
    }

    public Optional<Carrito> obtenerCarritoPorUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    public Double calcularTotal(Long usuarioId) {
        return obtenerOCrearCarrito(usuarioId)
                .getItems()
                .stream()
                .mapToDouble(item -> item.getPrecioUnitario() * item.getCantidad())
                .sum();
    }

    public Integer calcularCantidadItems(Long usuarioId) {
        return obtenerOCrearCarrito(usuarioId)
                .getItems()
                .stream()
                .mapToInt(CarritoItem::getCantidad)
                .sum();
    }
}