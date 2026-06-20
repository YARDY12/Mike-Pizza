package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.PedidoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoDetalleRepository extends JpaRepository<PedidoDetalle, Long> {
    void deleteByPedido_IdPedido(Long idPedido);
    List<PedidoDetalle> findByPedido_IdPedido(Long idPedido);
}
