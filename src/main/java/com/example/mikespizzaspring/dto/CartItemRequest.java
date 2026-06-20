package com.example.mikespizzaspring.dto;

public class CartItemRequest {
    private Long productoId;
    private String tamano;
    private String extras;
    private Integer cantidad;
    private Double precioUnitario;

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public String getTamano() { return tamano; }
    public void setTamano(String tamano) { this.tamano = tamano; }

    public String getExtras() { return extras; }
    public void setExtras(String extras) { this.extras = extras; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}

