import { api } from './http';
import { MenuItem } from '../types';

type RawMenuItem = Record<string, unknown>;

type Category = MenuItem['category'];

const normalizeCategory = (value: unknown): Category | null => {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();
  const map: Record<string, Category> = {
    'clasicas': 'Clásicas',
    'clásicas': 'Clásicas',
    'clasica': 'Clásicas',
    'clásica': 'Clásicas',
    'classics': 'Clásicas',

    'especialidades': 'Especialidades',
    'specialties': 'Especialidades',

    'vegetarianas': 'Vegetarianas',
    'vegetarian': 'Vegetarianas',

    'complementos': 'Complementos',
    'sides': 'Complementos',

    'bebidas': 'Bebidas',
    'drinks': 'Bebidas',

    'postres': 'Postres',
    'desserts': 'Postres',
  };

  const upperEnumMap: Record<string, Category> = {
    'CLASICAS': 'Clásicas',
    'ESPECIALIDADES': 'Especialidades',
    'VEGETARIANAS': 'Vegetarianas',
    'COMPLEMENTOS': 'Complementos',
    'BEBIDAS': 'Bebidas',
    'POSTRES': 'Postres',
  };

  return map[normalized] ?? upperEnumMap[value as string] ?? null;
};

const pickBestPrice = (raw: RawMenuItem): number | null => {
  const direct = raw.precio ?? raw.price;
  if (typeof direct === 'number' && Number.isFinite(direct)) return direct;
  if (typeof direct === 'string' && Number.isFinite(Number(direct))) return Number(direct);

  const precios = raw.precios;
  if (Array.isArray(precios)) {
    const priceBySize = new Map<string, number>();
    for (const p of precios) {
      if (typeof p !== 'object' || p === null) continue;
      const size = (p as any).tamano;
      const price = (p as any).precio;
      if (typeof size === 'string' && typeof price === 'number' && Number.isFinite(price)) {
        priceBySize.set(size.toUpperCase(), price);
      }
    }

    // Our UI "base" is Mediana. Backend uses MEDIANO.
    if (priceBySize.has('MEDIANO')) return priceBySize.get('MEDIANO')!;
    if (priceBySize.has('PERSONAL')) return priceBySize.get('PERSONAL')!;
    if (priceBySize.has('FAMILIAR')) return priceBySize.get('FAMILIAR')!;

    const first = [...priceBySize.values()][0];
    return typeof first === 'number' ? first : null;
  }

  return null;
};

const mapBackendCategoryName = (raw: unknown): Category => {
  const normalized = normalizeCategory(raw);
  if (normalized) return normalized;

  // If backend sends arbitrary category names, map by keywords.
  if (typeof raw === 'string') {
    const s = raw.toLowerCase();
    if (s.includes('bebid')) return 'Bebidas';
    if (s.includes('postr') || s.includes('dulc')) return 'Postres';
    if (s.includes('comple') || s.includes('extra') || s.includes('entr')) return 'Complementos';
    if (s.includes('vege')) return 'Vegetarianas';
    if (s.includes('espec') || s.includes('gour')) return 'Especialidades';
  }

  // Safe default (keeps UI filters working)
  return 'Clásicas';
};

const normalizeMenuItem = (raw: RawMenuItem): MenuItem | null => {
  const id = (raw.id ?? raw.idProducto ?? raw.productId ?? raw.codigo ?? raw.code) as unknown;
  const name = (raw.name ?? raw.nombre ?? raw.title) as unknown;
  const description = (raw.description ?? raw.descripcion ?? raw.detalle ?? '') as unknown;
  const price = pickBestPrice(raw);
  const categoriaNombre = (raw.categoriaProducto as any)?.nombre ?? raw.category ?? raw.categoria ?? raw.tipo;
  const category = mapBackendCategoryName(categoriaNombre);
  const image = (raw.image ?? raw.imagen ?? raw.imagenUrl ?? raw.imageUrl ?? raw.urlImagen) as unknown;

  const idStr = typeof id === 'number' ? String(id) : typeof id === 'string' ? id : '';
  if (idStr.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  if (typeof image !== 'string' || image.trim().length === 0) return null;
  if (price === null || !Number.isFinite(price)) return null;

  const descStr = typeof description === 'string' ? description : '';

  const isPopular = (raw.isPopular ?? raw.popular ?? raw.destacado) as unknown;
  const isNew = (raw.isNew ?? raw.nuevo ?? raw.new) as unknown;

  return {
    id: idStr.trim(),
    name: name.trim(),
    description: descStr.trim(),
    price,
    category,
    image: image.trim(),
    isPopular: typeof isPopular === 'boolean' ? isPopular : undefined,
    isNew: typeof isNew === 'boolean' ? isNew : undefined,
  };
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const endpoint = import.meta.env.VITE_MENU_ENDPOINT || '/products';
  const res = await api.get<unknown>(endpoint);

  const data = (res.data ?? []) as unknown;
  const array = Array.isArray(data) ? data : (data as any)?.content ?? (data as any)?.data ?? [];

  if (!Array.isArray(array)) return [];

  return array
    .map((item) => (typeof item === 'object' && item !== null ? normalizeMenuItem(item as RawMenuItem) : null))
    .filter((x): x is MenuItem => Boolean(x));
};
