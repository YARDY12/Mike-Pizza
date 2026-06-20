import { api } from './http';

export interface DireccionRequest {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
}

export interface CheckoutRequest {
  tipoEntrega: 'DELIVERY' | 'RECOGER';
  direccion?: DireccionRequest;
  metodoPago: 'SIMULADO';
}

export interface CheckoutResponse {
  pedidoId: string;
  pagoUrl: string;
}

export const checkoutPedido = async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
  const res = await api.post<CheckoutResponse>('pedidos/checkout', payload);
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
