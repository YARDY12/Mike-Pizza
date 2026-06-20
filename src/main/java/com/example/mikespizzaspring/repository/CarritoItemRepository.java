package com.example.mikespizzaspring.repository;

import com.example.mikespizzaspring.model.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
}

