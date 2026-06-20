import { api } from './http';

export interface BackendUsuario {
  idUsuario?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  roles?: string[];
  activo?: boolean;
}

const normalizeUsuario = (raw: unknown): BackendUsuario | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;

  const email = typeof item.email === 'string' ? item.email.trim() : '';
  if (!email) return null;

  const nombre = typeof item.nombre === 'string' ? item.nombre.trim() : '';
  const apellido = typeof item.apellido === 'string' ? item.apellido.trim() : '';
  const roles = Array.isArray(item.roles) ? item.roles.filter(role => typeof role === 'string') as string[] : [];

  return {
    idUsuario: typeof item.idUsuario === 'number' ? item.idUsuario : undefined,
    nombre,
    apellido,
    email,
    telefono: typeof item.telefono === 'string' ? item.telefono.trim() : undefined,
    roles,
    activo: typeof item.activo === 'boolean' ? item.activo : undefined,
  };
};

const resolveRole = (roles: string[] | undefined): string => {
  if (!roles?.length) return 'cliente';
  const upper = roles.map(r => r.toUpperCase());
  if (upper.includes('ADMIN') || upper.includes('ROLE_ADMIN')) return 'admin';
  if (upper.includes('MESERO') || upper.includes('WAITER')) return 'mesero';
  if (upper.includes('COCINA') || upper.includes('COCINERO') || upper.includes('COOK')) return 'cocinero';
  if (upper.includes('REPARTIDOR') || upper.includes('DELIVERY')) return 'repartidor';
  return 'cliente';
};

export interface AdminUser {
  id?: number | string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'cliente' | 'mesero' | 'cocinero' | 'repartidor' | 'admin';
  active?: boolean;
}

export const fetchUsuarios = async (): Promise<AdminUser[]> => {
  const res = await api.get<unknown>('usuarios');
  const data = res.data as unknown;
  const array = Array.isArray(data)
    ? data
    : (data as any)?.content ?? (data as any)?.data ?? [];

  if (!Array.isArray(array)) return [];

  return array
    .map(normalizeUsuario)
    .filter((item): item is BackendUsuario => item !== null)
    .map(usuario => ({
        id: usuario.idUsuario ?? usuario.email,
        fullName: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || usuario.email || '',
        email: usuario.email ?? '',
        phone: usuario.telefono ?? undefined,
        role: resolveRole(usuario.roles) as AdminUser['role'],
        active: usuario.activo,
      }));
};
