package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
	// Lock the producto row for update to avoid concurrent stock decrement races
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select p from Producto p where p.idProducto = :id")
	Optional<Producto> findByIdForUpdate(@Param("id") Long id);
}
