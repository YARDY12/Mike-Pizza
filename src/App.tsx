import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import ProductDetailView from './components/ProductDetailView';
import OffersView from './components/OffersView';
import StoryView from './components/StoryView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import CartView from './components/CartView';

// Import newly created modular role components
import CheckoutView from './components/CheckoutView';
import CoverageView from './components/CoverageView';
import TrackOrderView from './components/TrackOrderView';
import WaiterDashboard from './components/WaiterDashboard';
import CookDashboard from './components/CookDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfileView from './components/ProfileView';

import { CartItem, MenuItem, UserProfile, ServerOrder, TableState, PizzaCustomization } from './types';
import { INITIAL_MENU_ITEMS } from './data';
import { fetchMenuItems } from './api/menu';
import { tokenStorage } from './api/tokenStorage';
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidadItem,
  eliminarDelCarrito,
  vaciarCarrito,
  Carrito as BackendCarrito,
  CarritoItem as BackendCarritoItem,
} from './api/carrito';
import { checkoutPedido, CheckoutRequest } from './api/pedidos';
import { listarPedidosCocina, marcarPedidoPreparado, PedidoKitchenDto } from './api/cocina';

const USER_STORAGE_KEY = 'mop_user';

const loadStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    // If there's no persisted user, nothing to restore
    if (!raw) return null;

    // Ensure we have a token before restoring an authenticated session
    const token = tokenStorage.get();
    if (!token) {
      console.log('[App] no token found, skipping stored user restore');
      return null;
    }

    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed || typeof parsed !== 'object') return null;
    console.log('[App] restored stored user', parsed);
    return parsed;
  } catch (error) {
    console.error('[App] failed to restore user from storage', error);
    return null;
  }
};

const saveStoredUser = (user: UserProfile) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  console.log('[App] saved user to storage', user);
};

const getStoredUserPhone = (email: string, fallbackPhone?: string): string | undefined => {
  if (fallbackPhone) return fallbackPhone;
  const stored = loadStoredUser();
  if (stored?.email === email && stored.phone) {
    console.log('[App] recovered phone from stored user for', email, stored.phone);
    return stored.phone;
  }
  return undefined;
};

const resolveImage = (image?: string) => {
  if (image && image.trim()) return image;
  return 'https://via.placeholder.com/96?text=Sin+imagen';
};

const resolveItemName = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return 'Producto sin nombre';
};

const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

const SIMULATED_COOK_ORDER_ID = '9430';
const SIMULATED_COOK_ORDER: ServerOrder = {
  id: SIMULATED_COOK_ORDER_ID,
  customerName: 'Gabriel Marreros',
  phone: '+51 912 000 123',
  address: 'Avenida La Mar 1234',
  district: 'San Isidro',
  total: 35.80,
  status: 'requested',
  elapsedMinutes: 2,
  deliveryMethod: 'delivery',
  isSimulated: true,
  items: [
    {
      cartId: 'sim-gabriel-1',
      id: 'pizza-hawaiana',
      name: 'Pizza Hawaiana',
      price: 15.90,
      quantity: 1,
      image: 'https://via.placeholder.com/96?text=Hawaiana',
    },
    {
      cartId: 'sim-gabriel-2',
      id: 'pizza-americana',
      name: 'Pizza Americana',
      price: 14.90,
      quantity: 1,
      image: 'https://via.placeholder.com/96?text=Americana',
    },
    {
      cartId: 'sim-gabriel-3',
      id: 'inka-cola',
      name: 'Inka Cola 500ml',
      price: 5.00,
      quantity: 1,
      image: 'https://via.placeholder.com/96?text=Inka+Cola',
    },
  ],
};

const SIMULATED_DELIVERY_ORDERS: ServerOrder[] = [
  {
    id: 'sim-utp-chimbote',
    customerName: 'Gabriel Marreros',
    phone: '+51 970 405 891',
    address: 'UTP Sede Chimbote, Nuevo Chimbote',
    district: 'Nuevo Chimbote',
    total: 53.70,
    status: 'ready',
    elapsedMinutes: 12,
    deliveryMethod: 'delivery',
    isSimulated: true,
    items: [
      {
        cartId: 'sim-utp-1',
        id: 'pizza-margherita',
        name: 'Pizza Margherita',
        price: 32.00,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Margherita',
      },
      {
        cartId: 'sim-utp-2',
        id: 'coca-cola',
        name: 'Coca Cola 500ml',
        price: 8.50,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Coca+Cola',
      },
      {
        cartId: 'sim-utp-3',
        id: 'pan-de-ajo',
        name: 'Pan de Ajo Rústico',
        price: 10.00,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Pan+de+Ajo',
      },
    ],
  },
  {
    id: '9430',
    customerName: 'Gabriel Marreros',
    phone: '+51 912 000 123',
    address: 'Avenida La Mar 1234, San Isidro',
    district: 'San Isidro',
    total: 35.80,
    status: 'ready',
    elapsedMinutes: 5,
    deliveryMethod: 'delivery',
    isSimulated: true,
    items: [
      {
        cartId: 'sim-gabriel-1',
        id: 'pizza-hawaiana',
        name: 'Pizza Hawaiana',
        price: 15.90,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Hawaiana',
      },
      {
        cartId: 'sim-gabriel-2',
        id: 'pizza-americana',
        name: 'Pizza Americana',
        price: 14.90,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Americana',
      },
      {
        cartId: 'sim-gabriel-3',
        id: 'inka-cola',
        name: 'Gaseosa Inka Cola 500ml',
        price: 5.00,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Inka+Cola',
      },
    ],
  },
  {
    id: 'sim-delivery-ana-torres',
    customerName: 'Ana Torres',
    phone: '+51 987 654 321',
    address: 'Au. Panamericana N, Nuevo Chimbote 02710',
    district: 'Surco',
    total: 48.50,
    status: 'processing',
    elapsedMinutes: 8,
    deliveryMethod: 'delivery',
    isSimulated: true,
    items: [
      {
        cartId: 'sim-delivery-ana-1',
        id: 'pizza-margherita',
        name: 'Pizza Margherita',
        price: 32.00,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Margherita',
      },
      {
        cartId: 'sim-delivery-ana-2',
        id: 'coca-cola',
        name: 'Coca Cola 500ml',
        price: 8.50,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Coca+Cola',
      },
    ],
  },
  {
    id: 'sim-delivery-luis-ramirez',
    customerName: 'Luis Ramírez',
    phone: '+51 998 112 233',
    address: 'Jr. Las Flores 789, San Juan',
    district: 'Chimbote',
    total: 29.90,
    status: 'ready',
    elapsedMinutes: 3,
    deliveryMethod: 'delivery',
    isSimulated: true,
    items: [
      {
        cartId: 'sim-delivery-luis-1',
        id: 'pizza-pepperoni',
        name: 'Pizza Pepperoni',
        price: 24.90,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Pepperoni',
      },
      {
        cartId: 'sim-delivery-luis-2',
        id: 'agua',
        name: 'Agua Mineral',
        price: 5.00,
        quantity: 1,
        image: 'https://via.placeholder.com/96?text=Agua',
      },
    ],
  },
];

const mapPedidoToServerOrder = (pedido: PedidoKitchenDto): ServerOrder => ({
  id: String(pedido.idPedido ?? pedido.codigo ?? `pedido-${Date.now()}`),
  customerName: pedido.clienteNombre,
  phone: pedido.telefono,
  address: [pedido.direccion?.calle, pedido.direccion?.numero].filter(Boolean).join(' '),
  district: pedido.direccion?.distrito,
  total: typeof pedido.total === 'number' ? pedido.total : pedido.items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0),
  status: pedido.estado?.toLowerCase() === 'solicitado' || pedido.estado?.toLowerCase() === 'pagado' || pedido.estado?.toLowerCase() === 'pendiente_pago' ? 'requested'
    : pedido.estado?.toLowerCase() === 'en proceso' || pedido.estado?.toLowerCase() === 'processing' ? 'processing'
    : pedido.estado?.toLowerCase() === 'listo' || pedido.estado?.toLowerCase() === 'ready' || pedido.estado?.toLowerCase() === 'listo_para_reparto' || pedido.estado?.toLowerCase() === 'listo_para_recojo' ? 'ready'
    : pedido.estado?.toLowerCase() === 'entregado' || pedido.estado?.toLowerCase() === 'delivered' ? 'delivered'
    : 'requested',
  elapsedMinutes: 0,
  deliveryMethod: pedido.tipoEntrega === 'DELIVERY' ? 'delivery' : 'pickup',
  items: pedido.items.map((item, index) => ({
    cartId: `pedido-${pedido.idPedido}-${index}`,
    id: String(item.productoId ?? item.idPedidoDetalle ?? index),
    name: resolveItemName(item.nombreProducto, item.nombre, `Producto ${index + 1}`),
    price: item.precioUnitario,
    quantity: item.cantidad,
    image: resolveImage(undefined),
  })),
  paymentUrl: pedido.pagoUrl,
});

const mergeKitchenOrders = (existing: ServerOrder[], incoming: ServerOrder[]): ServerOrder[] => {
  const statusPriority: Record<ServerOrder['status'], number> = {
    requested: 0,
    processing: 1,
    ready: 2,
    delivered: 3,
  };

  const merged = new Map<string, ServerOrder>();

  incoming.forEach(order => merged.set(order.id, order));

  existing.forEach(order => {
    const current = merged.get(order.id);
    if (!current) {
      merged.set(order.id, order);
      return;
    }

    const currentPriority = statusPriority[current.status] ?? 0;
    const existingPriority = statusPriority[order.status] ?? 0;

    if (existingPriority > currentPriority) {
      merged.set(order.id, order);
    }
  });

  return Array.from(merged.values());
};

const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  isAuthenticated: false,
  role: 'cliente'
};

export default function App() {
  const initialUser = loadStoredUser() ?? DEFAULT_USER_PROFILE;
  const initialView = (() => {
    if (!initialUser.isAuthenticated) return 'home';
    switch (initialUser.role) {
      case 'mesero':
        return 'waiter';
      case 'cocinero':
        return 'cook';
      case 'repartidor':
        return 'delivery-driver';
      case 'admin':
        return 'admin';
      default:
        return 'home';
    }
  })();

  // Navigation State
  const [activeView, setActiveView] = useState<string>(initialView);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Dynamic products list from data.ts
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  // Authenticated User State (restored from storage on first render)
  const [user, setUser] = useState<UserProfile>(() => loadStoredUser() ?? DEFAULT_USER_PROFILE);

  // Simple Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    console.log('[App] mounted', { user, activeView: 'home' });
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let cancelled = false;

    fetchMenuItems()
      .then((items) => {
        if (cancelled) return;
        if (items.length > 0) {
          setMenuItems(items);
        }
      })
      .catch(() => {
        if (cancelled) return;
        triggerToast('No se pudo cargar el menú del servidor. Usando catálogo local.', 'info');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Cart state - starts empty, loads from backend when customer authenticates
  const [cart, setCart] = useState<CartItem[]>([]);

  const mapBackendItemToCartItem = (item: BackendCarritoItem): CartItem => {
    const matchedMenuItem = menuItems.find(mi => mi.id === String(item.productoId));
    return {
      cartId: `backend-${item.id}`,
      backendItemId: item.id,
      id: String(item.productoId),
      name: resolveItemName(item.nombreProducto, item.nombre, matchedMenuItem?.name, `Producto ${item.productoId}`),
      price: item.precioUnitario,
      image: resolveImage(matchedMenuItem?.image),
      quantity: item.cantidad,
      customization: item.tamano ? {
        size: item.tamano as PizzaCustomization['size'],
        crust: 'Masa Madre Clásica',
        toppings: item.extras ? item.extras.split(',') : []
      } : undefined,
    };
  };

  const mapBackendCarritoToCartItems = (carrito: BackendCarrito): CartItem[] => {
    return carrito.items?.map(mapBackendItemToCartItem) ?? [];
  };

  const buildBackendItemPayload = (item: CartItem): BackendCarritoItem => {
    const numericId = Number(item.id);
    const payload: Partial<BackendCarritoItem> = {
      productoId: Number.isFinite(numericId) ? numericId : item.id,
      nombre: item.name,
      cantidad: item.quantity,
      precioUnitario: item.price,
    };

    if (item.customization?.size) payload.tamano = item.customization.size;
    if (item.customization?.toppings?.length) payload.extras = item.customization.toppings.join(',');

    return payload as BackendCarritoItem;
  };

  const loadBackendCart = async (): Promise<boolean> => {
    try {
      const carrito = await obtenerCarrito(user.backendUserId);
      setCart(mapBackendCarritoToCartItems(carrito));
      return true;
    } catch (err) {
      console.error('[App] error loading cart from backend', err);
      return false;
    }
  };

  const syncLocalCartToBackend = async (items: CartItem[]) => {
    if (!items.length) return;

    try {
      for (const item of items) {
        await agregarAlCarrito(buildBackendItemPayload(item), user.backendUserId);
      }
      await loadBackendCart();
    } catch (err) {
      console.error('[App] error syncing local cart to backend', err);
    }
  };

  // Load cart from backend when customer authenticates
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setCart([]);
      return;
    }

    if (user.isAuthenticated && user.role === 'cliente') {
      void loadBackendCart();
    } else if (!user.isAuthenticated) {
      setCart([]);
    }
  }, [user.isAuthenticated, user.role]);

  // Global Orders Ledger (Shared state across cook, driver, customer and admin dashboard)
  const [orders, setOrders] = useState<ServerOrder[]>([
    {
      id: '9421',
      customerName: 'Ricardo Gareca',
      phone: '+51 987 654 321',
      address: 'Calle del Sol 234, Miraflores',
      total: 65.00,
      status: 'requested',
      elapsedMinutes: 3,
      deliveryMethod: 'delivery',
      items: [
        {
          cartId: 'rich-1',
          id: 'margherita-rustica',
          name: 'Margherita Rústica',
          price: 53.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo',
          quantity: 1
        },
        {
          cartId: 'rich-2',
          id: 'artisan-lemonade',
          name: 'Limonada de Hierbas 500ml',
          price: 12.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTJzwZigputMGW3tJzjmXxzMoAASK4zBgooPe95sslg10-OVp_Mhv3GWBpYTUL3w3SdNgMFuZd4sNtYJ9_uD2ZbUFojzkpCNC4G2kFj1nMbH9HGjiAopinxIc_al5g4QTeGfE2TuAhF5bj0fhaL1jOjLCEYByuTVL3BWWzEhhHgcwPPuPjnUnMLPOV9DPuUEftOqifyf7twi7nCgDhbLhWKUMNk7ssapTOYDw8m43z1XD1RT7L_8L12lNtxn2N6rZqVfMf5ipVQU',
          quantity: 1
        }
      ]
    },
    SIMULATED_COOK_ORDER,
    {
      id: '8812',
      customerName: 'Maria Fernanda',
      phone: '+51 912 345 678',
      address: 'Aviación 3410, El Acero',
      total: 53.00,
      status: 'ready',
      elapsedMinutes: 15,
      deliveryMethod: 'delivery',
      items: [
        {
          cartId: 'mf-1',
          id: 'margherita-rustica',
          name: 'Margherita Rústica',
          price: 53.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo',
          quantity: 1
        }
      ]
    }
  ]);

  

  // Interactive restaurant tables for WaiterDashboard
  const [tables, setTables] = useState<TableState[]>(() => {
    const tStates = ['free', 'occupied', 'free', 'free', 'occupied', 'free', 'occupied', 'free', 'free', 'free', 'occupied', 'free', 'free', 'free', 'occupied'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      status: tStates[i] as 'free' | 'occupied',
      dinersCount: tStates[i] === 'occupied' ? 3 : 2,
      notes: tStates[i] === 'occupied' ? 'Masa muy crocante por favor' : '',
      items: tStates[i] === 'occupied' ? [
        {
          cartId: `prefilled-${i}-1`,
          id: 'margherita-rustica',
          name: 'Margherita Rústica',
          price: 53.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo',
          quantity: 1
        }
      ] : []
    }));
  });

  useEffect(() => {
    if (activeView !== 'delivery-driver') return;

    setOrders(prev => {
      const existingIds = new Set(prev.map(order => order.id));
      const missingOrders = SIMULATED_DELIVERY_ORDERS.filter(order => !existingIds.has(order.id));
      if (!missingOrders.length) return prev;
      return [...missingOrders, ...prev];
    });
  }, [activeView, orders]);

  // NOTE: Removed automatic transition for simulated cook orders.
  // The chef should manually mark simulated orders as ready via the UI.

  // Track customer checkout progress
  const [recentCheckoutOrder, setRecentCheckoutOrder] = useState<ServerOrder | null>(null);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    handleNavigate('product-detail');
  };

  // Add customized item from product screen
  const handleAddCustomizedToCart = async (
    item: MenuItem, 
    customization: {
      size: 'Personal' | 'Mediana' | 'Familiar';
      crust: 'Masa Madre Clásica' | 'Integral' | 'Sin Gluten';
      toppings: string[];
    }, 
    quantity: number,
    finalPrice: number
  ) => {
    const cartId = `${item.id}-${customization.size}-${customization.crust}-${[...customization.toppings].sort().join(',')}`;
    const newItem: CartItem = {
      cartId,
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: item.image,
      quantity,
      customization,
    };

    if (user.isAuthenticated && user.role === 'cliente') {
      try {
        const carrito = await agregarAlCarrito(buildBackendItemPayload(newItem), user.backendUserId);
        setCart(mapBackendCarritoToCartItems(carrito));
      } catch (error) {
        console.error('[App] error adding customized item to backend cart', error);
        setCart(prev => {
          const matchIndex = prev.findIndex(i => i.cartId === cartId);
          if (matchIndex > -1) {
            const updated = [...prev];
            updated[matchIndex].quantity += quantity;
            return updated;
          }
          return [...prev, newItem];
        });
      }
    } else {
      setCart(prev => {
        const matchIndex = prev.findIndex(i => i.cartId === cartId);
        if (matchIndex > -1) {
          const updated = [...prev];
          updated[matchIndex].quantity += quantity;
          return updated;
        }
        return [...prev, newItem];
      });
    }

    triggerToast(`¡Añadido: ${quantity} x ${item.name} (${customization.size})!`);
    handleNavigate('cart');
  };

  const handleAddToCart = async (item: MenuItem, size?: string) => {
    const cartId = `${item.id}-standard`;
    const newItem: CartItem = {
      cartId,
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      customization: size ? {
        size: size as any,
        crust: 'Masa Madre Clásica',
        toppings: []
      } : undefined
    };

    if (user.isAuthenticated && user.role === 'cliente') {
      try {
        const carrito = await agregarAlCarrito(buildBackendItemPayload(newItem), user.backendUserId);
        setCart(mapBackendCarritoToCartItems(carrito));
      } catch (error) {
        console.error('[App] error adding item to backend cart', error);
        setCart(prev => {
          const matchIndex = prev.findIndex(i => i.cartId === cartId);
          if (matchIndex > -1) {
            const updated = [...prev];
            updated[matchIndex].quantity += 1;
            return updated;
          }
          return [...prev, newItem];
        });
      }
    } else {
      setCart(prev => {
        const matchIndex = prev.findIndex(i => i.cartId === cartId);
        if (matchIndex > -1) {
          const updated = [...prev];
          updated[matchIndex].quantity += 1;
          return updated;
        }
        return [...prev, newItem];
      });
    }

    triggerToast(`Añadido ${item.name} al carrito.`);
  };

  const handleUpdateQuantity = async (cartId: string, quantity: number) => {
    const matched = cart.find(item => item.cartId === cartId);
    if (!matched) return;

    if (user.isAuthenticated && user.role === 'cliente' && matched.backendItemId != null) {
      try {
        const carrito = await actualizarCantidadItem(matched.backendItemId, quantity, user.backendUserId);
        setCart(mapBackendCarritoToCartItems(carrito));
      } catch (error) {
        console.error('[App] error updating backend cart item quantity', error);
        setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
      }
    } else {
      setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
    }
  };

  const handleRemoveItem = async (cartId: string) => {
    const matched = cart.find(i => i.cartId === cartId);
    if (!matched) return;

    if (user.isAuthenticated && user.role === 'cliente' && matched.backendItemId != null) {
      try {
        const carrito = await eliminarDelCarrito(matched.backendItemId, user.backendUserId);
        setCart(mapBackendCarritoToCartItems(carrito));
      } catch (error) {
        console.error('[App] error removing backend cart item', error);
        setCart(prev => prev.filter(item => item.cartId !== cartId));
      }
    } else {
      setCart(prev => prev.filter(item => item.cartId !== cartId));
    }

    triggerToast(`Eliminado ${matched.name} del carro.`, 'info');
  };

  const handleClearCart = async () => {
    if (user.isAuthenticated && user.role === 'cliente') {
      try {
        await vaciarCarrito(user.backendUserId);
        setCart([]);
      } catch (error) {
        console.error('[App] error clearing backend cart', error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  };

  const mapBackendRolesToAppRole = (roles: string[]): UserProfile['role'] => {
    const upper = roles.map(r => r.toUpperCase());
    if (upper.includes('ADMIN') || upper.includes('ROLE_ADMIN')) return 'admin';
    if (upper.includes('MESERO') || upper.includes('WAITER')) return 'mesero';
    if (upper.includes('COCINA') || upper.includes('COCINERO') || upper.includes('COOK')) return 'cocinero';
    if (upper.includes('REPARTIDOR') || upper.includes('DELIVERY')) return 'repartidor';
    return 'cliente';
  };

  const handleLoginSuccess = (payload: { fullName: string; email: string; roles: string[]; phone?: string; backendUserId?: number }) => {
    console.log('[App] handleLoginSuccess payload', payload);
    const role = mapBackendRolesToAppRole(payload.roles);
    const phone = getStoredUserPhone(payload.email, payload.phone);
    const userProfile: UserProfile = {
      backendUserId: payload.backendUserId,
      fullName: payload.fullName,
      email: payload.email,
      phone,
      isAuthenticated: true,
      role,
    };
    console.log('[App] saving user profile', userProfile);
    setUser(userProfile);
    saveStoredUser(userProfile);
    triggerToast(`¡Bienvenido al Club de Mike, ${payload.fullName}! Descuento de socio activado.`);

    if (role === 'cliente') {
      void syncLocalCartToBackend(cart);
    }

    if (role === 'admin') {
      handleNavigate('admin');
    } else if (role === 'mesero') {
      handleNavigate('waiter');
      void loadKitchenOrders();
    } else if (role === 'cocinero') {
      handleNavigate('cook');
      void loadKitchenOrders();
    } else if (role === 'repartidor') {
      handleNavigate('delivery-driver');
    } else if (cart.length > 0) {
      handleNavigate('cart');
    } else {
      handleNavigate('home');
    }
  };

  const handleRegisterSuccess = (fullName: string, email: string, phone?: string, backendUserId?: number) => {
    console.log('[App] handleRegisterSuccess values', { fullName, email, phone });
    const userProfile: UserProfile = {
      backendUserId,
      fullName,
      email,
      phone,
      isAuthenticated: true,
      role: 'cliente',
    };
    console.log('[App] saving user profile', userProfile);
    setUser(userProfile);
    saveStoredUser(userProfile);
    triggerToast(`¡Bienvenido, ${fullName}! Te has registrado con éxito.`);

    void syncLocalCartToBackend(cart);

    if (cart.length > 0) {
      handleNavigate('cart');
    } else {
      handleNavigate('home');
    }
  };

  // Role SWITCH dispatcher - Enables the user to test each view with 1 click!
  const handleRoleSwitch = (newRole: 'cliente' | 'mesero' | 'cocinero' | 'repartidor' | 'admin') => {
    setUser(prev => ({
      ...prev,
      isAuthenticated: newRole !== 'cliente',
      role: newRole,
      fullName: newRole === 'admin' 
        ? 'Chef Mike Admin' 
        : newRole === 'mesero' 
          ? 'Juan Mesero' 
          : newRole === 'cocinero' 
            ? 'Mateo Cocinero' 
            : newRole === 'repartidor' 
              ? 'Carlos Piloto' 
              : 'Socio Fundador'
    }));

    if (newRole === 'cliente') {
      handleNavigate('home');
    } else if (newRole === 'mesero') {
      handleNavigate('waiter');
      void loadKitchenOrders();
    } else if (newRole === 'cocinero') {
      handleNavigate('cook');
      void loadKitchenOrders();
    } else if (newRole === 'repartidor') {
      handleNavigate('delivery-driver');
    } else if (newRole === 'admin') {
      handleNavigate('admin');
    }

    triggerToast(`Cambiado a perfil: ${newRole.toUpperCase()}`, 'info');
  };

  const loadKitchenOrders = async () => {
    try {
      const pedidos = await listarPedidosCocina('PAGADO');
      const mapped = pedidos.map(mapPedidoToServerOrder);
      setOrders(prev => mergeKitchenOrders(prev, mapped));
    } catch (error) {
      console.error('[App] error cargando pedidos de cocina', error);
    }
  };

  useEffect(() => {
    if (user.isAuthenticated && (user.role === 'cocinero' || user.role === 'mesero')) {
      void loadKitchenOrders();
    }
  }, [user.isAuthenticated, user.role]);

  // Checkout submission handler
  const handlePlaceOrder = async (orderData: {
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    paymentMethod: 'card' | 'digital_wallet' | 'cash';
    paymentMethodDetail?: {
      cardNumber?: string;
      expiry?: string;
      cvc?: string;
    };
    lat?: number;
    lng?: number;
  }) => {
    if (orderData.deliveryMethod === 'delivery' && orderData.district === 'Ate Vitarte') {
      handleNavigate('coverage');
      return;
    }

    if (!cart.length) {
      triggerToast('Tu carrito está vacío. Agrega productos antes de pagar.', 'info');
      handleNavigate('cart');
      return;
    }

    // Map payment method from UI to backend format
    const paymentMethodMap: { [key: string]: string } = {
      'card': 'TARJETA',
      'digital_wallet': 'BILLETERA_DIGITAL',
      'cash': 'EFECTIVO',
    };

    const payload: CheckoutRequest = {
      tipoEntrega: orderData.deliveryMethod === 'delivery' ? 'DELIVERY' : 'RECOGER',
      metodoPago: paymentMethodMap[orderData.paymentMethod] || 'SIMULADO',
      direccion: orderData.deliveryMethod === 'delivery' ? {
        alias: 'Casa',
        calle: orderData.address ?? '',
        distrito: orderData.district,
        ciudad: 'Lima',
        lat: orderData.lat ?? 0,
        lng: orderData.lng ?? 0,
      } : undefined,
    };

    try {
      const response = await checkoutPedido(payload, user.backendUserId);
      const newOrder: ServerOrder = {
        id: String(response.pedidoId),
        customerName: user.fullName || 'Invitado Rápido',
        phone: user.phone || '+51 987 654 321',
        address: orderData.address || 'Calle Las Camelias 412',
        district: orderData.district || 'Miraflores',
        total: cart.reduce((tot, i) => tot + i.price * i.quantity, 0) + (orderData.deliveryMethod === 'delivery' ? 5 : 0),
        status: 'requested',
        elapsedMinutes: 0,
        deliveryMethod: orderData.deliveryMethod,
        items: [...cart],
        paymentUrl: response.pagoUrl,
      };

      if (user.isAuthenticated && user.role === 'cliente') {
        try {
          await vaciarCarrito(user.backendUserId);
        } catch (e) {
          console.warn('[App] could not clear backend cart after checkout', e);
        }
      }

      setOrders(prev => [newOrder, ...prev]);
      setRecentCheckoutOrder(newOrder);
      setCart([]);
      triggerToast(`Pedido ${response.pedidoId} creado correctamente.`, 'success');
      handleNavigate('track-order');
    } catch (error: any) {
      // Improved error logging for backend response inspection
      console.error('[App] error procesando checkout', error);
      if (error?.response) {
        console.error('[App] checkout response status:', error.response.status);
        console.error('[App] checkout response data:', error.response.data);
        const serverMsg = error.response.data?.message || error.response.data || null;
        triggerToast(serverMsg ? `Error: ${serverMsg}` : 'No se pudo completar el pago. Intenta de nuevo más tarde.', 'info');
      } else {
        triggerToast('No se pudo completar el pago. Intenta de nuevo más tarde.', 'info');
      }
    }
  };

  // Waiter triggers update
  const handleUpdateTableStatus = (tableId: number, status: 'free' | 'occupied', items: CartItem[], notes?: string, dinersCount?: number) => {
    setTables(prev => prev.map(t => t.id === tableId ? { id: tableId, status, items, notes, dinersCount: dinersCount || 2 } : t));
  };

  const handleSubmitWaiterOrder = (order: ServerOrder) => {
    setOrders(prev => [order, ...prev]);
    triggerToast(`Comanda #${order.id} enviada directamente al horno.`);
  };

  const handleMarkPedidoPreparado = async (
    orderId: string,
    accion: 'LISTO_ENTREGA' | 'LISTO_RECOGER'
  ) => {
    if (orderId === SIMULATED_COOK_ORDER_ID) {
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'ready' } : order));
      triggerToast(`Pedido simulado #${orderId} marcado como listo en la cocina.`, 'success');
      return;
    }

    try {
      const updatedPedido = await marcarPedidoPreparado(orderId, { accion });
      const mappedOrder = mapPedidoToServerOrder(updatedPedido);
      setOrders(prev => prev.map(order => (order.id === orderId ? mappedOrder : order)));
      triggerToast(`Pedido #${orderId} marcado como ${accion === 'LISTO_ENTREGA' ? 'listo para entrega' : 'listo para recoger'}.`, 'success');
    } catch (error) {
      console.error('[App] error marcando pedido preparado', error);
      triggerToast('No se pudo actualizar el estado del pedido en cocina.', 'info');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => {
    let targetOrder: ServerOrder | undefined;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        targetOrder = o;
        return { ...o, status };
      }
      return o;
    }));

    if (targetOrder?.isSimulated) {
      triggerToast(`Pedido simulado #${orderId} actualizado localmente.`, 'success');
      return;
    }

    if (status === 'processing' && targetOrder && targetOrder.status !== 'processing') {
      triggerToast(`Pedido #${orderId} movido a preparación.`, 'success');
      return;
    }

    if (status === 'ready' && targetOrder && targetOrder.status !== 'ready' && !targetOrder.isSimulated) {
      const action = targetOrder.deliveryMethod === 'delivery' ? 'LISTO_ENTREGA' : 'LISTO_RECOGER';
      await handleMarkPedidoPreparado(orderId, action);
    }
  };

  // Admin menu modifiers
  const handleAddMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [item, ...prev]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    triggerToast('Producto retirado del catálogo.');
  };

  // View Router Loader
  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'menu':
        return <MenuView onSelectItem={handleSelectItem} onAddToCart={handleAddToCart} menuItems={menuItems} />;
      case 'product-detail':
        return <ProductDetailView selectedItem={selectedItem} onNavigate={handleNavigate} onAddCustomizedToCart={handleAddCustomizedToCart} />;
      case 'offers':
        return <OffersView onAddToCart={handleAddToCart} />;
      case 'story':
        return <StoryView onNavigate={handleNavigate} />;
      case 'login':
        return <LoginView onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <RegisterView onNavigate={handleNavigate} onRegisterSuccess={handleRegisterSuccess} />;
      case 'profile':
        return (
          <ProfileView 
            user={user} 
            orders={orders} 
            onNavigate={handleNavigate} 
            onUpdateProfile={(fullName, email, phone) => {
              const updatedUser = { ...user, fullName, email, phone };
              setUser(updatedUser);
              saveStoredUser(updatedUser);
            }} 
            onLogout={() => {
              tokenStorage.clear();
              clearStoredUser();
              setUser({
                backendUserId: undefined,
                fullName: '',
                email: '',
                isAuthenticated: false,
                role: 'cliente'
              });
              triggerToast('Has cerrado sesión correctamente.', 'info');
              handleNavigate('home');
            }}
          />
        );
      case 'cart':
        return (
          <CartView 
            cart={cart} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemoveItem={handleRemoveItem} 
            onClearCart={handleClearCart}
            user={{ ...user, isAuthenticated: user.isAuthenticated }}
            onNavigate={handleNavigate}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case 'checkout':
        return (
          <CheckoutView 
            cart={cart} 
            user={user} 
            onNavigate={handleNavigate} 
            onPlaceOrder={handlePlaceOrder} 
          />
        );
      case 'coverage':
        return (
          <CoverageView 
            onNavigate={handleNavigate}
            onModifyAddress={() => handleNavigate('checkout')}
            onChangeToPickup={() => {
              // Simulates swapping address option to pick up at the kitchen counter
              triggerToast('Cambiado a recojo en tienda de Miraflores.', 'info');
              handleNavigate('checkout');
            }}
          />
        );
      case 'track-order':
        return (
          <TrackOrderView 
            order={recentCheckoutOrder} 
            onNavigate={handleNavigate}
            onCancelOrder={(id) => {
              setOrders(prev => prev.filter(o => o.id !== id));
              triggerToast('Pedido cancelado de común acuerdo.', 'info');
              handleNavigate('home');
            }}
          />
        );
      case 'waiter':
        return (
          <WaiterDashboard 
            orders={orders}
            tables={tables}
            menuItems={menuItems}
            onUpdateTableState={handleUpdateTableStatus}
            onSubmitWaiterOrder={handleSubmitWaiterOrder}
          />
        );
      case 'cook':
        return (
          <CookDashboard 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            onMarkPrepared={handleMarkPedidoPreparado}
          />
        );
      case 'delivery-driver':
        return (
          <DeliveryDashboard 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            orders={orders} 
            menuItems={menuItems} 
            onAddMenuItem={handleAddMenuItem} 
            onUpdateMenuItem={handleUpdateMenuItem} 
            onDeleteMenuItem={handleDeleteMenuItem} 
            onNavigate={handleNavigate}
          />
        );
      default:
        return <HomeView onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      
      {/* Toast Alert pop notification block */}
      {toast && (
        <div className="fixed top-24 right-5 z-[9999] bg-emerald-950 text-white border border-emerald-900 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-sans">
          <span>{toast.type === 'success' ? '✨' : 'ℹ️'}</span>
          <p className="font-extrabold">{toast.message}</p>
        </div>
      )}

      {/* Primary header layout */}
      <Header 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        cart={cart} 
        user={user} 
      />

      {/* Active viewport frame */}
      <main className="flex-grow flex flex-col bg-slate-50/50">
        <AnimatePresence mode="wait">
          {renderActiveView()}
        </AnimatePresence>
      </main>

      {/* Common Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
