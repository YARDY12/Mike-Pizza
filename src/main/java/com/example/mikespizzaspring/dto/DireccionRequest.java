package com.example.mikespizzaspring.dto;

import java.math.BigDecimal;

public class DireccionRequest {
    private String alias;
    private String calle;
    private String numero;
    private String referencia;
    private String distrito;
    private String ciudad;
    private BigDecimal lat;
    private BigDecimal lng;

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public BigDecimal getLat() { return lat; }
    public void setLat(BigDecimal lat) { this.lat = lat; }
    public BigDecimal getLng() { return lng; }
    public void setLng(BigDecimal lng) { this.lng = lng; }
}
