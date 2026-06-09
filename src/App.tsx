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

import { CartItem, MenuItem, UserProfile, ServerOrder, TableState } from './types';
import { INITIAL_MENU_ITEMS } from './data';
import { fetchMenuItems } from './api/menu';
import { tokenStorage } from './api/tokenStorage';

const USER_STORAGE_KEY = 'mop_user';

const loadStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
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

const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  isAuthenticated: false,
  role: 'cliente'
};

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<string>('home');
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

  // Pre-load Cart beautifully with sample entries matching high-res specs
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: 'default-margherita-1',
      id: 'margherita-rustica',
      name: 'Margherita Rústica',
      price: 53.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo',
      quantity: 1,
      customization: {
        size: 'Mediana',
        crust: 'Masa Madre Clásica',
        toppings: ['Extra Mozzarella de Búfala']
      }
    },
    {
      cartId: 'default-lemonade-2',
      id: 'artisan-lemonade',
      name: 'Limonada de Hierbas 500ml',
      price: 12.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTJzwZigputMGW3tJzjmXxzMoAASK4zBgooPe95sslg10-OVp_Mhv3GWBpYTUL3w3SdNgMFuZd4sNtYJ9_uD2ZbUFojzkpCNC4G2kFj1nMbH9HGjiAopinxIc_al5g4QTeGfE2TuAhF5bj0fhaL1jOjLCEYByuTVL3BWWzEhhHgcwPPuPjnUnMLPOV9DPuUEftOqifyf7twi7nCgDhbLhWKUMNk7ssapTOYDw8m43z1XD1RT7L_8L12lNtxn2N6rZqVfMf5ipVQU',
      quantity: 1,
    }
  ]);

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
    {
      id: '8812',
      customerName: 'Maria Fernanda',
      phone: '+51 912 345 678',
      address: 'Aviación 3410, San Borja',
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
  const handleAddCustomizedToCart = (
    item: MenuItem, 
    customization: {
      size: 'Personal' | 'Mediana' | 'Familiar';
      crust: 'Masa Madre Clásica' | 'Integral' | 'Sin Gluten';
      toppings: string[];
    }, 
    quantity: number,
    finalPrice: number
  ) => {
    const serializedToppings = [...customization.toppings].sort().join(',');
    const cartId = `${item.id}-${customization.size}-${customization.crust}-${serializedToppings}`;

    setCart(prev => {
      const matchIndex = prev.findIndex(i => i.cartId === cartId);
      if (matchIndex > -1) {
        const updated = [...prev];
        updated[matchIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          cartId,
          id: item.id,
          name: item.name,
          price: finalPrice,
          image: item.image,
          quantity,
          customization
        }];
      }
    });

    triggerToast(`¡Añadido: ${quantity} x ${item.name} (${customization.size})!`);
    handleNavigate('cart');
  };

  const handleAddToCart = (item: MenuItem, size?: string) => {
    const cartId = `${item.id}-standard`;
    setCart(prev => {
      const matchIndex = prev.findIndex(i => i.cartId === cartId);
      if (matchIndex > -1) {
        const updated = [...prev];
        updated[matchIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, {
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
        }];
      }
    });
    triggerToast(`Añadido ${item.name} al carrito.`);
  };

  const handleUpdateQuantity = (cartId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (cartId: string) => {
    const matched = cart.find(i => i.cartId === cartId);
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    if (matched) {
      triggerToast(`Eliminado ${matched.name} del carro.`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const mapBackendRolesToAppRole = (roles: string[]): UserProfile['role'] => {
    const upper = roles.map(r => r.toUpperCase());
    if (upper.includes('ADMIN')) return 'admin';
    if (upper.includes('MESERO') || upper.includes('WAITER')) return 'mesero';
    if (upper.includes('COCINERO') || upper.includes('COOK')) return 'cocinero';
    if (upper.includes('REPARTIDOR') || upper.includes('DELIVERY')) return 'repartidor';
    return 'cliente';
  };

  const handleLoginSuccess = (payload: { fullName: string; email: string; roles: string[]; phone?: string }) => {
    console.log('[App] handleLoginSuccess payload', payload);
    const role = mapBackendRolesToAppRole(payload.roles);
    const phone = getStoredUserPhone(payload.email, payload.phone);
    const userProfile: UserProfile = {
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
    if (cart.length > 0) {
      handleNavigate('cart');
    } else {
      handleNavigate('home');
    }
  };

  const handleRegisterSuccess = (fullName: string, email: string, phone?: string) => {
    console.log('[App] handleRegisterSuccess values', { fullName, email, phone });
    const userProfile: UserProfile = {
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
    } else if (newRole === 'cocinero') {
      handleNavigate('cook');
    } else if (newRole === 'repartidor') {
      handleNavigate('delivery-driver');
    } else if (newRole === 'admin') {
      handleNavigate('admin');
    }

    triggerToast(`Cambiado a perfil: ${newRole.toUpperCase()}`, 'info');
  };

  // Checkout submission handler
  const handlePlaceOrder = (orderData: {
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    paymentMethod: 'card' | 'digital_wallet' | 'cash';
  }) => {
    // Check if delivery district is out of range
    if (orderData.deliveryMethod === 'delivery' && orderData.district === 'Ate Vitarte') {
      // Out of delivery coverage warning view
      handleNavigate('coverage');
      return;
    }

    // Add order to database list
    const newOrder: ServerOrder = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      customerName: user.fullName || 'Invitado Rápido',
      phone: '+51 987 654 321',
      address: orderData.address || 'Calle Las Camelias 412',
      district: orderData.district || 'Miraflores',
      total: cart.reduce((tot, i) => tot + i.price * i.quantity, 0) + (orderData.deliveryMethod === 'delivery' ? 5 : 0),
      status: 'requested',
      elapsedMinutes: 0,
      deliveryMethod: orderData.deliveryMethod,
      items: [...cart]
    };

    setOrders(prev => [newOrder, ...prev]);
    setRecentCheckoutOrder(newOrder);
    setCart([]); // Clear cart
    triggerToast('¡Pedido reservado magníficamente!', 'success');
    handleNavigate('track-order');
  };

  // Waiter triggers update
  const handleUpdateTableStatus = (tableId: number, status: 'free' | 'occupied', items: CartItem[], notes?: string, dinersCount?: number) => {
    setTables(prev => prev.map(t => t.id === tableId ? { id: tableId, status, items, notes, dinersCount: dinersCount || 2 } : t));
  };

  const handleSubmitWaiterOrder = (order: ServerOrder) => {
    setOrders(prev => [order, ...prev]);
    triggerToast(`Comanda #${order.id} enviada directamente al horno.`);
  };

  // Cook / Chef updates comanda queue
  const handleUpdateOrderStatus = (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
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
            tables={tables} 
            onUpdateTableState={handleUpdateTableStatus}
            onSubmitWaiterOrder={handleSubmitWaiterOrder}
          />
        );
      case 'cook':
        return (
          <CookDashboard 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
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
          />
        );
      default:
        return <HomeView onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      
      {/* Sticky Demo Role-Selector Bar at the very top of the screen */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white font-sans text-xs px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between select-none shadow-md border-b border-white/10 shrink-0 sticky top-0 z-[60]">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="p-1 bg-lime-500 rounded text-emerald-950 font-black text-[9px] uppercase tracking-wider">MODO DEMO MULTI-ROL</span>
          <span className="text-emerald-100 font-semibold text-[11px]">Navega por las vistas de Mike's Oven haciendo clic en cada rol:</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 font-bold">
          <button 
            onClick={() => handleRoleSwitch('cliente')} 
            className={`px-3 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              user.role === 'cliente' 
                ? 'bg-lime-500 text-emerald-950 font-black scale-105 shadow-sm' 
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            🍕 Cliente
          </button>
          <button 
            onClick={() => handleRoleSwitch('mesero')} 
            className={`px-3 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              user.role === 'mesero' 
                ? 'bg-lime-500 text-emerald-950 font-black scale-105 shadow-sm' 
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            📋 Mesero
          </button>
          <button 
            onClick={() => handleRoleSwitch('cocinero')} 
            className={`px-3 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              user.role === 'cocinero' 
                ? 'bg-lime-500 text-emerald-950 font-black scale-105 shadow-sm' 
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            👨‍🍳 Cocinero
          </button>
          <button 
            onClick={() => handleRoleSwitch('repartidor')} 
            className={`px-3 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              user.role === 'repartidor' 
                ? 'bg-lime-500 text-emerald-950 font-black scale-105 shadow-sm' 
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            🛵 Repartidor
          </button>
          <button 
            onClick={() => handleRoleSwitch('admin')} 
            className={`px-3 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              user.role === 'admin' 
                ? 'bg-lime-500 text-emerald-950 font-black scale-105 shadow-sm' 
                : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            💼 Admin
          </button>
        </div>
      </div>

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
