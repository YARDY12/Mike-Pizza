package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.PedidoDetalle;
import com.example.mikespizzaspring.repository.PedidoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoDetalleService {

    @Autowired
    private PedidoDetalleRepository pedidoDetalleRepository;

    public PedidoDetalle save(PedidoDetalle detalle) {
        return pedidoDetalleRepository.save(detalle);
    }

    public List<PedidoDetalle> findAll() {
        return pedidoDetalleRepository.findAll();
    }

    public Optional<PedidoDetalle> findById(Long id) {
        return pedidoDetalleRepository.findById(id);
    }

    public void delete(Long id) {
        pedidoDetalleRepository.deleteById(id);
    }
}
