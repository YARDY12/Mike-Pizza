import { api } from './http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo?: string; // "Bearer"
  idUsuario?: number;
  email?: string;
  nombre?: string;
  apellido?: string;
  roles?: string[];
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const endpoint = import.meta.env.VITE_LOGIN_ENDPOINT || '/auth/login';
  const res = await api.post<LoginResponse>(endpoint, payload);
  return res.data;
};
