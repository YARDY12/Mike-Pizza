package com.example.mikespizzaspring.dto;

public class UpdatePedidoEstadoRequest {
    private String accion; // "LISTO_ENTREGA" or "LISTO_RECOGER"
    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }
}
