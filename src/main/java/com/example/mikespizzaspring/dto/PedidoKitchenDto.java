package com.example.mikespizzaspring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoKitchenDto {
    private Long idPedido;
    private String codigo;
    private String tipoEntrega;
    private String estado;
    private String clienteNombre;
    private String clienteTelefono;
    private DireccionRequest direccion;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal total;
    private LocalDateTime fechaCreacion;
    private List<PedidoDetalleDto> items;

    public PedidoKitchenDto() {}

    public PedidoKitchenDto(Long idPedido, String codigo, String tipoEntrega, String estado, String clienteNombre, String clienteTelefono, DireccionRequest direccion, BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal total, LocalDateTime fechaCreacion, List<PedidoDetalleDto> items) {
        this.idPedido = idPedido; this.codigo = codigo; this.tipoEntrega = tipoEntrega; this.estado = estado; this.clienteNombre = clienteNombre; this.clienteTelefono = clienteTelefono; this.direccion = direccion; this.subtotal = subtotal; this.costoEnvio = costoEnvio; this.total = total; this.fechaCreacion = fechaCreacion; this.items = items;
    }

    public Long getIdPedido() { return idPedido; }
    public void setIdPedido(Long idPedido) { this.idPedido = idPedido; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    public String getClienteTelefono() { return clienteTelefono; }
    public void setClienteTelefono(String clienteTelefono) { this.clienteTelefono = clienteTelefono; }
    public DireccionRequest getDireccion() { return direccion; }
    public void setDireccion(DireccionRequest direccion) { this.direccion = direccion; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(BigDecimal costoEnvio) { this.costoEnvio = costoEnvio; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public List<PedidoDetalleDto> getItems() { return items; }
    public void setItems(List<PedidoDetalleDto> items) { this.items = items; }
}