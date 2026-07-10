package com.example.mikespizzaspring.dto;

public class CarritoItemDto {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private String tamano;
    private String extras;
    private Integer cantidad;
    private Double precioUnitario;

    public CarritoItemDto() {}

    public CarritoItemDto(Long id, Long productoId, String tamano, String extras, Integer cantidad, Double precioUnitario) {
        this.id = id;
        this.productoId = productoId;
        this.nombreProducto = null;
        this.tamano = tamano;
        this.extras = extras;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public CarritoItemDto(Long id, Long productoId, String nombreProducto, String tamano, String extras, Integer cantidad, Double precioUnitario) {
        this.id = id;
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.tamano = tamano;
        this.extras = extras;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public String getNombreProducto() { return nombreProducto; }
    public String getTamano() { return tamano; }
    public String getExtras() { return extras; }
    public Integer getCantidad() { return cantidad; }
    public Double getPrecioUnitario() { return precioUnitario; }

    public void setId(Long id) { this.id = id; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    public void setTamano(String tamano) { this.tamano = tamano; }
    public void setExtras(String extras) { this.extras = extras; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}
