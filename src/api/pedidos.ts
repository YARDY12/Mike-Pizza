import { api } from './http';

export interface DireccionRequest {
  alias?: string;
  calle?: string;
  numero?: string;
  referencia?: string;
  distrito?: string;
  ciudad?: string;
  lat?: number;
  lng?: number;
}

export interface CheckoutRequest {
  tipoEntrega: 'DELIVERY' | 'RECOGER' | 'PICKUP';
  direccion?: DireccionRequest;
  metodoPago: string;
}

export interface CheckoutResponse {
  pedidoId: string | number;
  pagoUrl?: string;
  estado?: string;
}

export const checkoutPedido = async (payload: CheckoutRequest, usuarioId?: number): Promise<CheckoutResponse> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.post<CheckoutResponse>('pedidos/checkout', payload, config);
  return res.data;
};

export interface PedidoDetalleFull {
  id: string;
  customerName: string;
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
  items: Array<{ id: string; nombre: string; cantidad: number; precioUnitario: number }>;
  total: number;
  estado: string;
}

export const obtenerPedidoPorId = async (pedidoId: number | string): Promise<PedidoDetalleFull> => {
  const res = await api.get<PedidoDetalleFull>(`pedidos/${pedidoId}`);
  return res.data;
};
