import { api } from './http';

export interface CategoriaProducto {
  idCategoriaProducto: number;
  nombre: string;
  descripcion?: string;
  activa?: boolean;
}

export const fetchCategoriasProducto = async (): Promise<CategoriaProducto[]> => {
  const res = await api.get<unknown>('categorias-producto');
  const data = (res.data ?? []) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      const raw = item as Record<string, unknown>;
      const id = raw.idCategoriaProducto ?? raw.id_categoria_producto ?? raw.id;
      const nombre = raw.nombre ?? raw.name;
      return {
        idCategoriaProducto: typeof id === 'number' ? id : typeof id === 'string' && Number.isFinite(Number(id)) ? Number(id) : NaN,
        nombre: typeof nombre === 'string' ? nombre : String(nombre ?? ''),
        descripcion: typeof raw.descripcion === 'string' ? raw.descripcion : typeof raw.description === 'string' ? raw.description : undefined,
        activa: raw.activa === undefined ? true : Boolean(raw.activa),
      };
    })
    .filter((cat) => Number.isFinite(cat.idCategoriaProducto) && cat.nombre.trim().length > 0);
};
