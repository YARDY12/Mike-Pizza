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
  telefono?: string;
  roles?: string[];
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface RegisterResponse {
  token?: string;
  idUsuario?: number;
  email?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  roles?: string[];
}

const normalizeApiEndpoint = (value: string) => value.replace(/^\/+/, '');

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const endpoint = normalizeApiEndpoint(import.meta.env.VITE_LOGIN_ENDPOINT || 'auth/login');
  console.debug('[Auth] login request', { endpoint, payload });
  const res = await api.post<LoginResponse>(endpoint, payload);
  console.debug('[Auth] login response', { endpoint, response: res.data });
  return res.data;
};

export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const endpoint = normalizeApiEndpoint(import.meta.env.VITE_REGISTER_ENDPOINT || 'auth/registro-cliente');
  console.debug('[Auth] register request', { endpoint, payload });
  const res = await api.post<RegisterResponse>(endpoint, payload);
  console.debug('[Auth] register response', { endpoint, response: res.data });
  return res.data;
};
