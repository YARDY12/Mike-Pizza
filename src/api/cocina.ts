import { api } from './http';

export interface PedidoDetalleDto {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoKitchenDto {
  idPedido: number;
  codigo?: string;
  clienteNombre: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  estado: string;
  tipoEntrega: 'DELIVERY' | 'RECOGER';
  pagoUrl?: string;
  items: PedidoDetalleDto[];
}

export interface UpdatePedidoEstadoRequest {
  accion: 'LISTO_ENTREGA' | 'LISTO_RECOGER';
}

export const listarPedidosCocina = async (estado = 'PAGADO'): Promise<PedidoKitchenDto[]> => {
  const res = await api.get<PedidoKitchenDto[]>(`pedidos/cocina?estado=${estado}`);
  return res.data;
};

export const marcarPedidoPreparado = async (
  pedidoId: number | string,
  payload: UpdatePedidoEstadoRequest
): Promise<PedidoKitchenDto> => {
  const res = await api.post<PedidoKitchenDto>(`pedidos/cocina/${pedidoId}/marcar-preparado`, payload);
  return res.data;
};
