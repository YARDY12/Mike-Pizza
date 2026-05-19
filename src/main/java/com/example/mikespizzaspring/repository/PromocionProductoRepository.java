package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.PromocionProducto;
import com.example.mikespizzaspring.model.PromocionProductoId;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PromocionProductoRepository extends JpaRepository<PromocionProducto, PromocionProductoId>{
}
