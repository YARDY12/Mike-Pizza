package com.example.mikespizzaspring.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "zona_delivery")
public class ZonaDelivery {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_zona_delivery")
    private Long idZonaDelivery;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "distrito", nullable = false, length = 100)
    private String distrito;

    @Column(name = "costo_envio", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoEnvio;

    @Column(name = "tiempo_estimado_min", nullable = false)
    private Integer tiempoEstimadoMin;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    public Long getIdZonaDelivery() {
        return idZonaDelivery;
    }

    public void setIdZonaDelivery(Long idZonaDelivery) {
        this.idZonaDelivery = idZonaDelivery;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(BigDecimal costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public Integer getTiempoEstimadoMin() {
        return tiempoEstimadoMin;
    }

    public void setTiempoEstimadoMin(Integer tiempoEstimadoMin) {
        this.tiempoEstimadoMin = tiempoEstimadoMin;
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }
}
