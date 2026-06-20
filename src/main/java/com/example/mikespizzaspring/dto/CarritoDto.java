package com.example.mikespizzaspring.dto;

import java.util.List;

public class CarritoDto {
    private Long id;
    private Long usuarioId;
    private List<CarritoItemDto> items;
    private Double total;
    private String actualizadoEn;

    public CarritoDto() {}

    public CarritoDto(Long id, Long usuarioId, List<CarritoItemDto> items, Double total, String actualizadoEn) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.items = items;
        this.total = total;
        this.actualizadoEn = actualizadoEn;
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public List<CarritoItemDto> getItems() { return items; }
    public Double getTotal() { return total; }
    public String getActualizadoEn() { return actualizadoEn; }

    public void setId(Long id) { this.id = id; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public void setItems(List<CarritoItemDto> items) { this.items = items; }
    public void setTotal(Double total) { this.total = total; }
    public void setActualizadoEn(String actualizadoEn) { this.actualizadoEn = actualizadoEn; }
}
