package com.example.mikespizzaspring.dto;

public class CheckoutResponse {
    private Long pedidoId;
    private String pagoUrl;

    public CheckoutResponse() {}
    public CheckoutResponse(Long pedidoId, String pagoUrl) { this.pedidoId = pedidoId; this.pagoUrl = pagoUrl; }
    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
    public String getPagoUrl() { return pagoUrl; }
    public void setPagoUrl(String pagoUrl) { this.pagoUrl = pagoUrl; }
}
