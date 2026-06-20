package com.example.mikespizzaspring.dto;

import java.math.BigDecimal;

public class PedidoDetalleDto {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    public PedidoDetalleDto() {}
    public PedidoDetalleDto(Long id, Long productoId, String nombreProducto, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
        this.id = id; this.productoId = productoId; this.nombreProducto = nombreProducto; this.cantidad = cantidad; this.precioUnitario = precioUnitario; this.subtotal = subtotal;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}