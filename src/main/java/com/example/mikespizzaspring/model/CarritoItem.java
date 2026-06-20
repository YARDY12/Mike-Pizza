package com.example.mikespizzaspring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carrito_items")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrito_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Carrito carrito;

    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "tamano")
    private String tamano; // use 'tamano' internally; provide alias with unicode getter

    @Column(name = "extras")
    private String extras;

    @Column(name = "cantidad")
    private Integer cantidad = 1;

    @Column(name = "precio_unitario")
    private Double precioUnitario = 0.0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Carrito getCarrito() { return carrito; }
    public void setCarrito(Carrito carrito) { this.carrito = carrito; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public String getTamano() { return tamano; }
    public void setTamano(String tamano) { this.tamano = tamano; }

    // Unicode-named alias used by some controllers: getTamaño / setTamaño
    public String getTamaño() { return tamano; }
    public void setTamaño(String tamaño) { this.tamano = tamaño; }

    public String getExtras() { return extras; }
    public void setExtras(String extras) { this.extras = extras; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}
