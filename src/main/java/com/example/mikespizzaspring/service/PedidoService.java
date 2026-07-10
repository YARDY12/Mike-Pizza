package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.Pedido;
import com.example.mikespizzaspring.model.Producto;
import com.example.mikespizzaspring.repository.PedidoRepository;
import com.example.mikespizzaspring.repository.PedidoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import com.example.mikespizzaspring.model.Usuario;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoDetalleRepository pedidoDetalleRepository;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private com.example.mikespizzaspring.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private com.example.mikespizzaspring.repository.DireccionRepository direccionRepository;

    @Autowired
    private com.example.mikespizzaspring.repository.ProductoRepository productoRepository;

    @Autowired
    private com.example.mikespizzaspring.repository.RepartoRepository repartoRepository;

    @Autowired
    private com.example.mikespizzaspring.repository.UsuarioRolRepository usuarioRolRepository;

    public Pedido save(Pedido pedido) {
        Pedido saved = pedidoRepository.save(pedido);

        // If this saved pedido represents a finalized order (not a cart), remove any existing cart for the same user
        if (saved.getEstado() != null && !"CARRITO".equalsIgnoreCase(saved.getEstado())) {
            Long clienteId = saved.getCliente() != null ? saved.getCliente().getIdUsuario() : null;
            if (clienteId != null) {
                Optional<Pedido> maybeCart = pedidoRepository.findByCliente_IdUsuarioAndEstado(clienteId, "CARRITO");
                if (maybeCart.isPresent()) {
                    Pedido cart = maybeCart.get();
                    if (!cart.getIdPedido().equals(saved.getIdPedido())) {
                        // delete cart details first to avoid FK constraint
                        pedidoDetalleRepository.deleteByPedido_IdPedido(cart.getIdPedido());
                        pedidoRepository.deleteById(cart.getIdPedido());
                    }
                }
            }
        }

        return saved;
    }

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    public void delete(Long id) {
        // delete details first
        pedidoDetalleRepository.deleteByPedido_IdPedido(id);
        pedidoRepository.deleteById(id);
    }

    public Optional<Pedido> findCartByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByCliente_IdUsuarioAndEstado(usuarioId, "CARRITO");
    }

    public Pedido createCartForUsuarioIfAbsent(Usuario usuario) {
        if (usuario == null || usuario.getIdUsuario() == null) {
            throw new IllegalArgumentException("Usuario invalido para crear carrito");
        }
        Optional<Pedido> existing = findCartByUsuarioId(usuario.getIdUsuario());
        if (existing.isPresent()) {
            return existing.get();
        }
        Pedido cart = new Pedido();
        cart.setCodigo("CART-" + usuario.getIdUsuario() + "-" + System.currentTimeMillis());
        cart.setCliente(usuario);
        cart.setTipoEntrega("");
        cart.setSubtotal(BigDecimal.ZERO);
        cart.setDescuento(BigDecimal.ZERO);
        cart.setCostoEnvio(BigDecimal.ZERO);
        cart.setTotal(BigDecimal.ZERO);
        cart.setEstado("CARRITO");
        cart.setMetodoPago("");
        // saveAndFlush to ensure immediate INSERT within transaction
        Pedido saved = pedidoRepository.saveAndFlush(cart);
        return saved;
    }

    // Create a Pedido (order) from the user's Carrito. Returns the created Pedido.
    @Transactional
    public Pedido createPedidoFromCarrito(Long usuarioId, com.example.mikespizzaspring.dto.CheckoutRequest req) {
        // fetch carrito
        // Since this service class is in the same package, we'll use field injection added below. Use carritoService to get carrito.
        // get carrito
        var carritoOpt = carritoService.obtenerCarritoPorUsuario(usuarioId);
        if (carritoOpt.isEmpty()) {
            throw new IllegalArgumentException("Carrito vacio o no encontrado");
        }
        var carrito = carritoOpt.get();
        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("Carrito vacio");
        }

        var cliente = usuarioRepository.findById(usuarioId).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCodigo("PED-" + usuarioId + "-" + System.currentTimeMillis());
        pedido.setCliente(cliente);
        pedido.setTipoEntrega(req.getTipoEntrega() == null ? "" : req.getTipoEntrega());

        if (req.getDireccion() != null && "DELIVERY".equalsIgnoreCase(pedido.getTipoEntrega())) {
            var dr = req.getDireccion();
            com.example.mikespizzaspring.model.Direccion d = new com.example.mikespizzaspring.model.Direccion();
            d.setAlias(dr.getAlias());
            d.setCalle(dr.getCalle());
            d.setNumero(dr.getNumero());
            d.setReferencia(dr.getReferencia());
            d.setDistrito(dr.getDistrito());
            d.setCiudad(dr.getCiudad());
            if (dr.getLat() != null) d.setLat(new java.math.BigDecimal(dr.getLat().toString()));
            if (dr.getLng() != null) d.setLng(new java.math.BigDecimal(dr.getLng().toString()));
            d.setUsuario(cliente);
            direccionRepository.save(d);
            pedido.setDireccion(d);
        }

        java.math.BigDecimal subtotal = java.math.BigDecimal.ZERO;
        for (var it : carrito.getItems()) {
            java.math.BigDecimal price = java.math.BigDecimal.valueOf(it.getPrecioUnitario());
            java.math.BigDecimal q = java.math.BigDecimal.valueOf(it.getCantidad());
            subtotal = subtotal.add(price.multiply(q));
        }
        pedido.setSubtotal(subtotal);
        pedido.setDescuento(java.math.BigDecimal.ZERO);
        java.math.BigDecimal costoEnvio = java.math.BigDecimal.ZERO;
        if ("DELIVERY".equalsIgnoreCase(pedido.getTipoEntrega())) {
            costoEnvio = java.math.BigDecimal.valueOf(5.00); // flat delivery fee example
        }
        pedido.setCostoEnvio(costoEnvio);
        pedido.setTotal(subtotal.add(costoEnvio));
        pedido.setEstado("PENDIENTE_PAGO");
        pedido.setMetodoPago(req.getMetodoPago() == null ? "SIMULADO" : req.getMetodoPago());

        Pedido saved = pedidoRepository.save(pedido);

        // create detalles
        for (var it : carrito.getItems()) {
            com.example.mikespizzaspring.model.PedidoDetalle pd = new com.example.mikespizzaspring.model.PedidoDetalle();
            pd.setPedido(saved);
            var producto = productoRepository.findById(it.getProductoId()).orElse(null);
            if (producto == null) {
                throw new ResponseStatusException(BAD_REQUEST, "Producto no encontrado en carrito: id " + it.getProductoId());
            }
            pd.setProducto(producto);
            pd.setCantidad(it.getCantidad());
            pd.setPrecioUnitario(java.math.BigDecimal.valueOf(it.getPrecioUnitario()));
            pd.setSubtotal(pd.getPrecioUnitario().multiply(java.math.BigDecimal.valueOf(it.getCantidad())));
            pedidoDetalleRepository.save(pd);
        }

        return saved;
    }

    @Transactional
    public Pedido confirmarPagoSimulado(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido no encontrado"));

        if ("PAGADO".equalsIgnoreCase(pedido.getEstado())) {
            return pedido;
        }

        var detalles = pedidoDetalleRepository.findByPedido_IdPedido(pedido.getIdPedido());
        if (detalles == null || detalles.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "El pedido no tiene productos asociados");
        }

        Map<Long, Integer> cantidadesPorProducto = new HashMap<>();
        for (var detalle : detalles) {
            if (detalle.getProducto() == null || detalle.getProducto().getIdProducto() == null) {
                throw new ResponseStatusException(BAD_REQUEST, "Producto inválido en el detalle del pedido");
            }
            cantidadesPorProducto.merge(detalle.getProducto().getIdProducto(), detalle.getCantidad(), Integer::sum);
        }

        for (Map.Entry<Long, Integer> entry : cantidadesPorProducto.entrySet()) {
            Producto producto = productoRepository.findByIdForUpdate(entry.getKey())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Producto no encontrado"));

            Integer stockActual = producto.getStock() == null ? 0 : producto.getStock();
            if (stockActual < entry.getValue()) {
                throw new ResponseStatusException(BAD_REQUEST, "Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(stockActual - entry.getValue());
            productoRepository.save(producto);
        }

        pedido.setMetodoPago("SIMULADO");
        pedido.setEstado("PAGADO");
        Pedido saved = pedidoRepository.save(pedido);

        Long clienteId = saved.getCliente() != null ? saved.getCliente().getIdUsuario() : null;
        if (clienteId != null) {
            carritoService.limpiarCarrito(clienteId);
        }

        return saved;
    }

    public com.example.mikespizzaspring.dto.PedidoKitchenDto obtenerPedidoConDetalles(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido no encontrado"));
        return buildKitchenDto(pedido);
    }

    // Return list of orders in given state mapped to kitchen DTO
    public java.util.List<com.example.mikespizzaspring.dto.PedidoKitchenDto> obtenerPedidosPorEstado(String estado) {
        var pedidos = pedidoRepository.findByEstado(estado == null ? "PAGADO" : estado);
        java.util.List<com.example.mikespizzaspring.dto.PedidoKitchenDto> out = new java.util.ArrayList<>();
        for (var p : pedidos) {
            out.add(buildKitchenDto(p));
        }
        return out;
    }

    // Mark prepared by kitchen
    public com.example.mikespizzaspring.dto.PedidoKitchenDto markPedidoPreparado(Long pedidoId, String accion) {
        var pedido = pedidoRepository.findById(pedidoId).orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
        if ("LISTO_ENTREGA".equalsIgnoreCase(accion)) {
            pedido.setEstado("LISTO_PARA_REPARTO");
            // create reparto placeholder
            com.example.mikespizzaspring.model.Reparto r = new com.example.mikespizzaspring.model.Reparto();
            r.setPedido(pedido);
            r.setEstado("PENDIENTE_ASIGNACION");
            repartoRepository.save(r);
        } else {
            pedido.setEstado("LISTO_PARA_RECOJO");
        }
        pedidoRepository.save(pedido);
        return buildKitchenDto(pedido);
    }

    private com.example.mikespizzaspring.dto.PedidoKitchenDto buildKitchenDto(Pedido pedido) {
        var detalles = pedidoDetalleRepository.findByPedido_IdPedido(pedido.getIdPedido());
        java.util.List<com.example.mikespizzaspring.dto.PedidoDetalleDto> items = new java.util.ArrayList<>();
        for (var d : detalles) {
            var prod = d.getProducto() != null ? productoRepository.findById(d.getProducto().getIdProducto()).orElse(null) : null;
            String nombre = prod == null ? null : prod.getNombre();
            items.add(new com.example.mikespizzaspring.dto.PedidoDetalleDto(
                    d.getIdPedidoDetalle(),
                    d.getProducto() != null ? d.getProducto().getIdProducto() : null,
                    nombre,
                    d.getCantidad(),
                    d.getPrecioUnitario(),
                    d.getSubtotal()));
        }

        com.example.mikespizzaspring.dto.DireccionRequest dir = null;
        if (pedido.getDireccion() != null) {
            dir = new com.example.mikespizzaspring.dto.DireccionRequest();
            dir.setAlias(pedido.getDireccion().getAlias());
            dir.setCalle(pedido.getDireccion().getCalle());
            dir.setNumero(pedido.getDireccion().getNumero());
            dir.setReferencia(pedido.getDireccion().getReferencia());
            dir.setDistrito(pedido.getDireccion().getDistrito());
            dir.setCiudad(pedido.getDireccion().getCiudad());
            dir.setLat(pedido.getDireccion().getLat());
            dir.setLng(pedido.getDireccion().getLng());
        }

        String clienteNombre = pedido.getCliente() != null ? pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido() : null;
        String clienteTelefono = pedido.getCliente() != null ? pedido.getCliente().getTelefono() : null;
        return new com.example.mikespizzaspring.dto.PedidoKitchenDto(
                pedido.getIdPedido(),
                pedido.getCodigo(),
                pedido.getTipoEntrega(),
                pedido.getEstado(),
                clienteNombre,
                clienteTelefono,
                dir,
                pedido.getSubtotal(),
                pedido.getCostoEnvio(),
                pedido.getTotal(),
                pedido.getFechaCreacion(),
                items);
    }
}
