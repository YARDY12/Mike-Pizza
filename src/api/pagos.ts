import { api } from './http';

export interface SimulatePaymentRequest {
  pedidoId: number;
}

export interface SimulatePaymentResponse {
  pedidoId: number;
  estado: string;
  waLink?: string;
}

export const simulatePayment = async (
  payload: SimulatePaymentRequest
): Promise<SimulatePaymentResponse> => {
  const res = await api.post<SimulatePaymentResponse>('pagos/simular', payload);
  return res.data;
};
