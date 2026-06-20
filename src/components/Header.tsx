import { ShoppingCart, User, Menu, Pizza, ChefHat, Truck, ClipboardList, Eye } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  cart: CartItem[];
  user: UserProfile;
}

export default function Header({ activeView, onNavigate, cart, user }: HeaderProps) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-[0px_4px_20px_rgba(0,90,49,0.04)] sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        
        {/* Brand */}
        <div 
          onClick={() => {
            if (user.role === 'cliente') onNavigate('home');
            else if (user.role === 'mesero') onNavigate('waiter');
            else if (user.role === 'cocinero') onNavigate('cook');
            else if (user.role === 'repartidor') onNavigate('delivery-driver');
            else onNavigate('admin');
          }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <Pizza className="text-secondary w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-2xl font-extrabold tracking-tight text-secondary font-display">
            Mike's Oven Pizza
          </span>
        </div>

        {/* Dynamic Navigation Links based on active User Role */}
        <nav className="hidden md:flex items-center gap-8 font-display select-none">
          {user.role === 'cliente' && (
            <>
              <button 
                onClick={() => onNavigate('home')}
                className={`font-semibold py-1 transition-colors relative cursor-pointer text-xs ${
                  activeView === 'home' 
                    ? 'text-secondary border-b-2 border-primary-container' 
                    : 'text-slate-600 hover:text-secondary'
                }`}
              >
                Inicio
              </button>
              <button 
                onClick={() => onNavigate('menu')}
                className={`font-semibold py-1 transition-colors relative cursor-pointer text-xs ${
                  activeView === 'menu' || activeView === 'product-detail'
                    ? 'text-secondary border-b-2 border-primary-container' 
                    : 'text-slate-600 hover:text-secondary'
                }`}
              >
                Menú
              </button>
              <button 
                onClick={() => onNavigate('offers')}
                className={`font-semibold py-1 transition-colors relative cursor-pointer text-xs ${
                  activeView === 'offers' 
                    ? 'text-secondary border-b-2 border-primary-container' 
                    : 'text-slate-600 hover:text-secondary'
                }`}
              >
                Ofertas Especiales
              </button>
              <button 
                onClick={() => onNavigate('story')}
                className={`font-semibold py-1 transition-colors relative cursor-pointer text-xs ${
                  activeView === 'story' 
                    ? 'text-secondary border-b-2 border-primary-container' 
                    : 'text-slate-600 hover:text-secondary'
                }`}
              >
                Nuestra Historia
              </button>
            </>
          )}

          {user.role === 'mesero' && (
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary uppercase text-[10px] font-black py-1 px-3 rounded-full flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" /> MESERO SALÓN
              </span>
              <button 
                onClick={() => onNavigate('waiter')}
                className="text-slate-700 font-extrabold hover:text-secondary transition-all text-xs"
              >
                Mapa de Mesas
              </button>
            </div>
          )}

          {user.role === 'cocinero' && (
            <div className="flex items-center gap-2">
              <span className="bg-primary-container/30 text-on-primary-container uppercase text-[10px] font-black py-1 px-3 rounded-full flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 animate-pulse" /> MODO COCINERO
              </span>
              <button 
                onClick={() => onNavigate('cook')}
                className="text-slate-700 font-extrabold hover:text-secondary transition-all text-xs"
              >
                Gestión de Comandas
              </button>
            </div>
          )}

          {user.role === 'repartidor' && (
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 uppercase text-[10px] font-black py-1 px-3 rounded-full flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> REPARTIDOR
              </span>
              <button 
                onClick={() => onNavigate('delivery-driver')}
                className="text-slate-700 font-extrabold hover:text-secondary transition-all text-xs"
              >
                Panel de Despacho
              </button>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 uppercase text-[10px] font-black py-1 px-3 rounded-full flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" /> ADMINISTRADOR
              </span>
              <button 
                onClick={() => onNavigate('admin')}
                className="text-slate-700 font-extrabold hover:text-secondary transition-all text-xs ml-2"
              >
                Consola Central
              </button>
            </div>
          )}
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-4 text-secondary">
          
          {/* Cart Icon (Only relevant or active for Client) */}
          {user.role === 'cliente' && (
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-full hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5 text-secondary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile display */}
          <button 
            onClick={() => onNavigate(user.isAuthenticated ? 'profile' : 'login')}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer"
            aria-label="Perfil de usuario"
          >
            <User className="w-5 h-5 text-secondary" />
            <span className="hidden lg:inline text-xs font-semibold text-slate-800">
              {user.isAuthenticated ? user.fullName.split(' ')[0] : 'Inicia Sesión'}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}

