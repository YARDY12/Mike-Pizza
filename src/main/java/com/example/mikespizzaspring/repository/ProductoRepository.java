package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductoRepository extends JpaRepository<Producto, Long>{
}
