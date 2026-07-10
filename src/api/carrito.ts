import { api } from './http';

export interface CarritoItem {
  id?: number;
  productoId: number | string;
  nombreProducto?: string;
  tamano?: string;
  cantidad: number;
  precioUnitario?: number;
  extras?: string;
  nombre?: string;
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
export const obtenerCarrito = async (usuarioId?: number): Promise<Carrito> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.get<Carrito>('carrito', config);
  return res.data;
};

/**
 * Agregar un item al carrito
 */
export const agregarAlCarrito = async (item: CarritoItem, usuarioId?: number): Promise<Carrito> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.post<Carrito>('carrito/items', item, config);
  return res.data;
};

/**
 * Actualizar cantidad de un item en el carrito
 */
export const actualizarCantidadItem = async (itemId: number, cantidad: number, usuarioId?: number): Promise<Carrito> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.put<Carrito>(`carrito/items/${itemId}`, { cantidad }, config);
  return res.data;
};

/**
 * Eliminar un item del carrito
 */
export const eliminarDelCarrito = async (itemId: number, usuarioId?: number): Promise<Carrito> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.delete<Carrito>(`carrito/items/${itemId}`, config);
  return res.data;
};

/**
 * Vaciar todo el carrito
 */
export const vaciarCarrito = async (usuarioId?: number): Promise<void> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  await api.delete('carrito/limpiar', config);
};

/**
 * Obtener el total del carrito
 */
export const obtenerTotal = async (usuarioId?: number): Promise<{ total: number }> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.get<{ total: number }>('carrito/total', config);
  return res.data;
};

/**
 * Obtener la cantidad de items en el carrito
 */
export const obtenerCantidadItems = async (usuarioId?: number): Promise<{ cantidad: number }> => {
  const config = usuarioId != null ? { params: { usuarioId } } : undefined;
  const res = await api.get<{ cantidad: number }>('carrito/cantidad', config);
  return res.data;
};
