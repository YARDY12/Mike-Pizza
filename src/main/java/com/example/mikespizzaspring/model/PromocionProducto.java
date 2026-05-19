package com.example.mikespizzaspring.model;

import jakarta.persistence.*;


@Entity
@Table(name = "promocion_producto")
public class PromocionProducto {

    @EmbeddedId
    private PromocionProductoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPromocion")
    @JoinColumn(name = "id_promocion", nullable = false)
    private Promocion promocion;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProducto")
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    public PromocionProductoId getId() {
        return id;
    }

    public void setId(PromocionProductoId id) {
        this.id = id;
    }

    public Promocion getPromocion() {
        return promocion;
    }

    public void setPromocion(Promocion promocion) {
        this.promocion = promocion;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
