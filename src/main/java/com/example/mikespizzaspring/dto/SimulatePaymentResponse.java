package com.example.mikespizzaspring.dto;

public class SimulatePaymentResponse {
    private Long pedidoId;
    private String estado;
    private String waLink;

    public SimulatePaymentResponse() {}
    public SimulatePaymentResponse(Long pedidoId, String estado, String waLink) { this.pedidoId = pedidoId; this.estado = estado; this.waLink = waLink; }
    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getWaLink() { return waLink; }
    public void setWaLink(String waLink) { this.waLink = waLink; }
}
