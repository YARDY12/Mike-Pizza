package com.example.mikespizzaspring.controller;

import com.example.mikespizzaspring.dto.SimulatePaymentRequest;
import com.example.mikespizzaspring.dto.SimulatePaymentResponse;
import com.example.mikespizzaspring.model.Pedido;
import com.example.mikespizzaspring.model.Reparto;
import com.example.mikespizzaspring.model.UsuarioRol;
import com.example.mikespizzaspring.service.PedidoService;
import com.example.mikespizzaspring.repository.RepartoRepository;
import com.example.mikespizzaspring.repository.UsuarioRolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private RepartoRepository repartoRepository;

    @Autowired
    private UsuarioRolRepository usuarioRolRepository;

    @PostMapping("/simular")
    public ResponseEntity<SimulatePaymentResponse> simularPago(@RequestBody SimulatePaymentRequest req) {
        if (req == null || req.getPedidoId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Pedido pedido = pedidoService.findById(req.getPedidoId()).orElse(null);
        if (pedido == null) return ResponseEntity.notFound().build();

        pedido.setMetodoPago("SIMULADO");
        pedido.setEstado("PAGADO");
        pedidoService.save(pedido);

        String waLink = null;
        // if delivery, try to assign a repartidor
        if (pedido.getTipoEntrega() != null && pedido.getTipoEntrega().equalsIgnoreCase("DELIVERY")) {
            List<UsuarioRol> repartidores = usuarioRolRepository.findByRol_Nombre("REPARTIDOR");
            if (!repartidores.isEmpty()) {
                var ruser = repartidores.get(0).getUsuario();
                Reparto reparto = new Reparto();
                reparto.setPedido(pedido);
                reparto.setRepartidor(ruser);
                reparto.setEstado("ASIGNADO");
                repartoRepository.save(reparto);
            }

            // build wa.me link to contact customer
            var cliente = pedido.getCliente();
            if (cliente != null && cliente.getTelefono() != null) {
                String phone = cliente.getTelefono().replaceAll("\\D+", "");
                String text = "Hola%20soy%20el%20repartidor%20de%20Mike%20Pizza%20para%20el%20pedido%20" + (pedido.getCodigo() != null ? pedido.getCodigo() : pedido.getIdPedido());
                waLink = "https://wa.me/" + phone + "?text=" + URLEncoder.encode(text, StandardCharsets.UTF_8);
            }
        }

        return ResponseEntity.ok(new SimulatePaymentResponse(pedido.getIdPedido(), pedido.getEstado(), waLink));
    }
}