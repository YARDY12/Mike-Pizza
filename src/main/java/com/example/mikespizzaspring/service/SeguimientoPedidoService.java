package com.example.mikespizzaspring.service;

import com.example.mikespizzaspring.model.SeguimientoPedido;
import com.example.mikespizzaspring.repository.SeguimientoPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeguimientoPedidoService {

    @Autowired
    private SeguimientoPedidoRepository seguimientoPedidoRepository;

    public SeguimientoPedido save(SeguimientoPedido entity) {
        return seguimientoPedidoRepository.save(entity);
    }

    public List<SeguimientoPedido> findAll() {
        return seguimientoPedidoRepository.findAll();
    }

    public Optional<SeguimientoPedido> findById(Long id) {
        return seguimientoPedidoRepository.findById(id);
    }

    public void delete(Long id) {
        seguimientoPedidoRepository.deleteById(id);
    }
}
