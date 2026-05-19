package com.example.mikespizzaspring.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PromocionProductoId implements Serializable {


    @Column(name = "id_promocion")
    private Long idPromocion;

    @Column(name = "id_producto")
    private Long idProducto;

    public PromocionProductoId() {
    }

    public PromocionProductoId(Long idPromocion, Long idProducto) {
        this.idPromocion = idPromocion;
        this.idProducto = idProducto;
    }

    public Long getIdPromocion() {
        return idPromocion;
    }

    public void setIdPromocion(Long idPromocion) {
        this.idPromocion = idPromocion;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PromocionProductoId)) return false;
        PromocionProductoId that = (PromocionProductoId) o;
        return Objects.equals(idPromocion, that.idPromocion) &&
                Objects.equals(idProducto, that.idProducto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPromocion, idProducto);
    }
}
