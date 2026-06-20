package com.example.mikespizzaspring.dto;

public class CheckoutRequest {
    private String tipoEntrega; // DELIVERY or RECOGER
    private DireccionRequest direccion;
    private String metodoPago; // e.g., SIMULADO

    public String getTipoEntrega() {
        return tipoEntrega;
    }

    public void setTipoEntrega(String tipoEntrega) {
        this.tipoEntrega = tipoEntrega;
    }

    public DireccionRequest getDireccion() {
        return direccion;
    }

    public void setDireccion(DireccionRequest direccion) {
        this.direccion = direccion;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
