import { api } from './http';

export interface CarritoItem {
  id?: number;
  productoId: number | string;
  nombre: string;
  tamaño?: string;
  cantidad: number;
  precioUnitario: number;
  extras?: string;
}

export interface Carrito {
  id: number;
  usuarioId: number;
  items: CarritoItem[];
  total: number;
  actualizadoEn: string;
}

/**
 * Obtener el carrito actual del usuario autenticado
 */
export const obtenerCarrito = async (): Promise<Carrito> => {
  const res = await api.get<Carrito>('carrito');
  return res.data;
};

/**
 * Agregar un item al carrito
 */
export const agregarAlCarrito = async (item: CarritoItem): Promise<Carrito> => {
  const res = await api.post<Carrito>('carrito/items', item);
  return res.data;
};

/**
 * Actualizar cantidad de un item en el carrito
 */
export const actualizarCantidadItem = async (itemId: number, cantidad: number): Promise<Carrito> => {
  const res = await api.put<Carrito>(`carrito/items/${itemId}`, { cantidad });
  return res.data;
};

/**
 * Eliminar un item del carrito
 */
export const eliminarDelCarrito = async (itemId: number): Promise<Carrito> => {
  const res = await api.delete<Carrito>(`carrito/items/${itemId}`);
  return res.data;
};

/**
 * Vaciar todo el carrito
 */
export const vaciarCarrito = async (): Promise<void> => {
  await api.delete('carrito/limpiar');
};

/**
 * Obtener el total del carrito
 */
export const obtenerTotal = async (): Promise<{ total: number }> => {
  const res = await api.get<{ total: number }>('carrito/total');
  return res.data;
};

/**
 * Obtener la cantidad de items en el carrito
 */
export const obtenerCantidadItems = async (): Promise<{ cantidad: number }> => {
  const res = await api.get<{ cantidad: number }>('carrito/cantidad');
  return res.data;
};
