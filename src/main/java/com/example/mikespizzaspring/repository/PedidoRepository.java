package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByCliente_IdUsuarioAndEstado(Long idUsuario, String estado);
    java.util.List<Pedido> findByEstado(String estado);
}
