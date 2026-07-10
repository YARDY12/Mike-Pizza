export interface PizzaCustomization {
  size: 'Personal' | 'Mediana' | 'Familiar';
  crust: 'Masa Madre Clásica' | 'Integral' | 'Sin Gluten';
  toppings: string[];
}

export type UserRole = 'cliente' | 'mesero' | 'cocinero' | 'repartidor' | 'admin';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  // Categories come from backend data and can be normalized in the UI.
  category: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  cartId: string; // unique cart identifier (e.g. combined string or serial/uuid)
  id: string; // base menu item ID
  backendItemId?: number; // backend carrito item ID when persisted
  name: string;
  price: number; // calculated item unit price with customization modifiers
  image: string;
  quantity: number;
  customization?: PizzaCustomization;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
}

export interface UserProfile {
  backendUserId?: number;
  fullName: string;
  email: string;
  phone?: string;
  isAuthenticated: boolean;
  role: UserRole;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  igv: number;
  deliveryFee: number;
  promoDiscount: number;
  total: number;
}

export interface TableState {
  id: number;
  status: 'free' | 'occupied';
  items: CartItem[];
  notes?: string;
  dinersCount: number;
}

export interface ServerOrder {
  id: string;
  customerName: string;
  phone?: string;
  address?: string;
  district?: string;
  items: CartItem[];
  total: number;
  status: 'requested' | 'processing' | 'ready' | 'delivered';
  elapsedMinutes: number;
  deliveryMethod: 'delivery' | 'pickup';
  paymentUrl?: string;
  tableId?: number;
  notes?: string;
  isSimulated?: boolean;
}
