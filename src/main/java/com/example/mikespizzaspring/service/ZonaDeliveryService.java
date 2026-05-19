package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.ZonaDelivery;
import com.example.mikespizzaspring.repository.ZonaDeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ZonaDeliveryService {

    @Autowired
    private ZonaDeliveryRepository zonaDeliveryRepository;

    public ZonaDelivery save(ZonaDelivery entity) {
        return zonaDeliveryRepository.save(entity);
    }

    public List<ZonaDelivery> findAll() {
        return zonaDeliveryRepository.findAll();
    }

    public Optional<ZonaDelivery> findById(Long id) {
        return zonaDeliveryRepository.findById(id);
    }

    public void delete(Long id) {
        zonaDeliveryRepository.deleteById(id);
    }
}
