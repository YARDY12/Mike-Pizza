import axios, { AxiosHeaders } from 'axios';
import { tokenStorage } from './tokenStorage';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }

  console.debug('[API] request', {
    method: config.method,
    url: `${config.baseURL ?? ''}${config.url ?? ''}`,
    data: config.data,
    headers: config.headers instanceof AxiosHeaders ? config.headers.toJSON() : config.headers,
  });

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('[API] response error', {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
      headers: error?.response?.headers,
    });
    if (error?.response?.status === 401) {
      tokenStorage.clear();
    }
    return Promise.reject(error);
  },
);
