package com.example.mikespizzaspring.repository;


import com.example.mikespizzaspring.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PedidoRepository extends JpaRepository<Pedido, Long>{
}
