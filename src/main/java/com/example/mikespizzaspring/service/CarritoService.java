package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.dto.CarritoDto;
import com.example.mikespizzaspring.dto.CarritoItemDto;
import com.example.mikespizzaspring.dto.CartItemRequest;
import com.example.mikespizzaspring.model.Carrito;
import com.example.mikespizzaspring.model.CarritoItem;
import com.example.mikespizzaspring.model.Producto;
import com.example.mikespizzaspring.model.ProductoPrecio;
import com.example.mikespizzaspring.model.TamanoPizza;
import com.example.mikespizzaspring.repository.CarritoItemRepository;
import com.example.mikespizzaspring.repository.CarritoRepository;
import com.example.mikespizzaspring.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;

    public CarritoService(CarritoRepository carritoRepository, CarritoItemRepository carritoItemRepository, ProductoRepository productoRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.productoRepository = productoRepository;
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
                .map(i -> {
                    Producto producto = i.getProductoId() == null ? null : productoRepository.findById(i.getProductoId()).orElse(null);
                    String nombreProducto = producto == null ? null : producto.getNombre();
                    return new CarritoItemDto(i.getId(), i.getProductoId(), nombreProducto, i.getTamano(), i.getExtras(), i.getCantidad(), i.getPrecioUnitario());
                })
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
        if (req == null || req.getProductoId() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "productoId es obligatorio");
        }
        if (req.getCantidad() == null || req.getCantidad() <= 0) {
            throw new ResponseStatusException(BAD_REQUEST, "La cantidad debe ser mayor a cero");
        }

        Producto producto = productoRepository.findById(req.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Producto no encontrado"));

        CarritoItem item = new CarritoItem();
        item.setProductoId(producto.getIdProducto());
        item.setTamano(req.getTamano());
        item.setExtras(req.getExtras());
        item.setCantidad(req.getCantidad());
        item.setPrecioUnitario(calcularPrecioUnitario(producto, req.getTamano()).doubleValue());

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
        Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Producto no encontrado"));

        if (item.getCantidad() == null || item.getCantidad() <= 0) {
            throw new ResponseStatusException(BAD_REQUEST, "La cantidad debe ser mayor a cero");
        }

        item.setPrecioUnitario(calcularPrecioUnitario(producto, item.getTamano()).doubleValue());

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

        validarStockCarrito(carrito, producto.getIdProducto(), producto.getStock());

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

    private BigDecimal calcularPrecioUnitario(Producto producto, String tamano) {
        if (producto == null) {
            throw new ResponseStatusException(NOT_FOUND, "Producto no encontrado");
        }

        TamanoPizza tamanoPizza = parseTamano(tamano);
        if (tamanoPizza != null && producto.getPrecios() != null && !producto.getPrecios().isEmpty()) {
            for (ProductoPrecio precio : producto.getPrecios()) {
                if (tamanoPizza.equals(precio.getTamano()) && precio.getPrecio() != null) {
                    return precio.getPrecio();
                }
            }
        }

        if (producto.getPrecio() != null) {
            return producto.getPrecio();
        }

        throw new ResponseStatusException(BAD_REQUEST, "El producto no tiene precio configurado");
    }

    private TamanoPizza parseTamano(String tamano) {
        if (tamano == null || tamano.isBlank()) {
            return TamanoPizza.UNICO;
        }

        try {
            return TamanoPizza.valueOf(tamano.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return TamanoPizza.UNICO;
        }
    }

    private void validarStockCarrito(Carrito carrito, Long productoId, Integer stockDisponible) {
        if (carrito == null || productoId == null) {
            return;
        }

        int cantidadSolicitada = carrito.getItems().stream()
                .filter(i -> productoId.equals(i.getProductoId()))
                .mapToInt(CarritoItem::getCantidad)
                .sum();

        if (stockDisponible == null) {
            stockDisponible = 0;
        }

        if (cantidadSolicitada > stockDisponible) {
            throw new ResponseStatusException(BAD_REQUEST, "Stock insuficiente para el producto seleccionado");
        }
    }
}