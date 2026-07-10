import { api } from './http';

export interface PedidoDetalleDto {
  idPedidoDetalle?: number;
  productoId?: number;
  nombreProducto?: string;
  nombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface PedidoKitchenDto {
  idPedido: number;
  codigo?: string;
  tipoEntrega?: string;
  estado: string;
  clienteNombre: string;
  telefono?: string;
  direccion?: {
    alias?: string;
    calle?: string;
    numero?: string;
    referencia?: string;
    distrito?: string;
    ciudad?: string;
    lat?: number;
    lng?: number;
  } | null;
  subtotal?: number;
  costoEnvio?: number;
  total?: number;
  fechaCreacion?: string;
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
