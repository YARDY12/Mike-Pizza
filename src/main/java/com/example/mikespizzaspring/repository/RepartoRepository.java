package com.example.mikespizzaspring.repository;


import com.example.mikespizzaspring.model.Reparto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepartoRepository extends JpaRepository<Reparto, Long> {
	Optional<Reparto> findByPedido_IdPedido(Long idPedido);
}
