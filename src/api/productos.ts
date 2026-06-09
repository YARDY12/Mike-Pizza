import { api } from './http';

export interface CreateProductoPayload {
  categoriaId: number;
  nombre: string;
  descripcion?: string;
  precioPersonal: number;
  precioMediano: number;
  precioFamiliar: number;
  stock: number;
  imagen: File;
}

export const createProducto = async (payload: CreateProductoPayload): Promise<unknown> => {
  const form = new FormData();
  form.append('categoriaId', String(payload.categoriaId));
  form.append('nombre', payload.nombre);
  if (payload.descripcion && payload.descripcion.trim().length > 0) {
    form.append('descripcion', payload.descripcion);
  }
  form.append('precioPersonal', String(payload.precioPersonal));
  form.append('precioMediano', String(payload.precioMediano));
  form.append('precioFamiliar', String(payload.precioFamiliar));
  form.append('stock', String(payload.stock));
  form.append('imagen', payload.imagen);

  const res = await api.post<unknown>('productos', form);
  return res.data;
};

export const deleteProducto = async (id: string | number): Promise<void> => {
  await api.delete(`productos/${id}`);
};
