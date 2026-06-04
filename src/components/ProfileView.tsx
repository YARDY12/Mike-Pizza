import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, LogOut, Award, Clock, ShoppingBag, 
  ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Heart, Trash2 
} from 'lucide-react';
import { UserProfile, ServerOrder } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  orders: ServerOrder[];
  onNavigate: (view: string) => void;
  onUpdateProfile: (name: string, email: string, phone?: string) => void;
  onLogout: () => void;
}

export default function ProfileView({ user, orders, onNavigate, onUpdateProfile, onLogout }: ProfileViewProps) {
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter orders that belong to this customer
  const userOrders = orders.filter(o => 
    o.customerName.toLowerCase() === user.fullName.toLowerCase() || 
    (user.email && o.customerName.toLowerCase() === user.fullName.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(fullName, email, phone);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculated loyalty specs
  const pointsEarned = 180;
  const targetPoints = 300;
  const progressPercent = (pointsEarned / targetPoints) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl w-full mx-auto px-6 py-10 font-sans text-left"
    >
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary font-display select-text">Mi Perfil</h1>
        <p className="text-slate-500 text-sm">Gestiona tus datos personales, nivel de fidelidad e historial de compras en Mike's Oven.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Badge Card & Loyalty Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card: Member Badge */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-950 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-white/10">
            {/* Ambient pattern */}
            <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -right-3 -top-3">
              <Award className="w-20 h-20 text-lime-400/10 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-1">
                <span className="bg-lime-400 text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
                  Club de Mike Elite
                </span>
                <h3 className="text-xl font-extrabold font-display pt-2 select-text">{user.fullName || 'Invitado Rápido'}</h3>
                <p className="text-slate-300 text-xs font-mono select-text">{user.email || 'id_invitado@mikes.com'}</p>
              </div>

              {/* Points status */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-bold">Puntos acumulados</span>
                  <span className="text-lime-400 font-black font-display text-lg">{pointsEarned} <span className="text-[10px] uppercase">Pts</span></span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-lime-400 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Próximo nivel (Mike Oro)</span>
                  <span>Faltan {targetPoints - pointsEarned} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Membresía</h4>
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs text-left">
                <p className="font-extrabold text-slate-800">10% OFF Vitalicio</p>
                <p className="text-slate-400 mt-0.5 leading-normal">Descuento aplicado en compras para consumo web.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-800 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-xs text-left">
                <p className="font-extrabold text-slate-800">Postre de Cumpleaños</p>
                <p className="text-slate-400 mt-0.5 leading-normal">Un delicioso volcán de chocolate gratis en tu mes.</p>
              </div>
            </div>
          </div>

          {/* Action Log out */}
          <button
            onClick={() => {
              if (confirm('¿Cerrar sesión de tu perfil?')) {
                onLogout();
              }
            }}
            className="w-full py-3.5 border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 text-rose-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión del Portal
          </button>

        </div>

        {/* Right column: Form (Edit info) & Orders Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Personal Info Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-secondary font-display flex items-center gap-2">
                <User className="w-4 h-4" /> Datos de la Cuenta
              </h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-secondary hover:text-emerald-800 font-black flex items-center gap-1 cursor-pointer"
                >
                  ✏️ Editar Datos
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-55 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-150 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> ¡Tus cambios han sido actualizados con total éxito!
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans">Nombre Completo *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans">Teléfono / Celular (Opcional)</label>
                    <input
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      value={phone}
                      placeholder="Ej: +51 987 654 321"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user.fullName);
                      setEmail(user.email);
                      setPhone(user.phone || '');
                    }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-slate-600 text-xs cursor-pointer hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-secondary text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-emerald-850"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs select-text">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Nombre Completo</span>
                  <p className="font-bold text-slate-800">{user.fullName || 'Invitado Completo'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Correo Electrónico</span>
                  <p className="font-bold text-slate-800 font-mono">{user.email || 'desconocido@mikes.com'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Teléfono Registrado</span>
                  <p className="font-bold text-slate-800">{user.phone || 'No registrado'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Canal Afiliado</span>
                  <p className="font-extrabold text-secondary flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Club Mikes Web App
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Orders Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-secondary font-display flex items-center gap-2 justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Mis Pedidos ({userOrders.length})</span>
            </h3>

            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const statusMap = {
                    requested: { text: 'En espera', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                    processing: { text: 'En horno', color: 'bg-orange-100 text-orange-850 border-orange-200' },
                    ready: { text: 'Listo para despacho', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-extrabold' },
                    delivered: { text: 'Entregado', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                  };
                  const orderStatus = statusMap[order.status] || { text: order.status, color: 'bg-slate-100' };

                  return (
                    <div 
                      key={order.id} 
                      className="p-4 border border-slate-150 rounded-xl hover:shadow-sm transition-all text-left flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-left select-text">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-800">Pedido #{order.id}</span>
                          <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-full font-bold ${orderStatus.color}`}>
                            {orderStatus.text}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans">
                          {order.deliveryMethod === 'delivery' ? `🛵 Delivery • Distrito: ${order.district || 'Miraflores'}` : 'Counter • Recojo en Tienda'}
                        </p>
                        
                        {/* Ordered items preview */}
                        <p className="text-[11px] text-slate-600 font-semibold mt-1">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none border-slate-100 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inversión Total</p>
                          <p className="text-base font-black text-secondary font-display select-text">S/ {order.total.toFixed(2)}</p>
                        </div>
                        {order.status !== 'delivered' && (
                          <button 
                            onClick={() => onNavigate('track-order')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 px-3 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm shadow-emerald-600/10"
                          >
                            Trazar <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-slate-500 text-xs font-bold">Aún no has registrado pedidos con esta cuenta.</p>
                <p className="text-slate-400 text-[10px] leading-relaxed mt-1 max-w-xs mx-auto">
                  Explora nuestra increíble carta de pizzas artesanales a la leña, añade tus favoritas y completa el checkout para estrenar tu historial.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="mt-4 px-4 py-2 bg-secondary text-white font-bold rounded-lg text-xs hover:bg-emerald-850 cursor-pointer"
                >
                  Ir al Menú de Pizzas
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
