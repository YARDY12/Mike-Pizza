import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Flame, MapPin, Phone, MessageSquare, Timer, ShoppingBag, HelpCircle, Truck } from 'lucide-react';
import { CartItem, ServerOrder } from '../types';

interface TrackOrderViewProps {
  order: ServerOrder | null;
  onNavigate: (view: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function TrackOrderView({ order, onNavigate, onCancelOrder }: TrackOrderViewProps) {
  // Static state if no order is passed, to ensure a beautiful out of the box client demo
  const fallbackOrder: ServerOrder = {
    id: 'MO-8821',
    customerName: 'Ricardo Gareca',
    phone: '+51 987 654 321',
    address: 'Calle de la Huizache 452, Col. Del Valle, CP 03100',
    total: 33.90,
    status: 'processing',
    elapsedMinutes: 14,
    deliveryMethod: 'delivery',
    items: [
      {
        cartId: 'fallback-item-1',
        id: 'pizza-trufada-silvestre',
        name: 'Pizza Trufada Silvestre',
        price: 24.90,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFI_j5YKmREMx5KaaKOwh3JexrtwBrORadI62-0Im0taeCz5krW0zxxKfGnUUiSowu6rhFMhynLwuuQx6bcduq6hfs5dLmotdjN8KjBkOdhc4TqEwi7UKODbPSrMgtxbM_LycvjR6CxadsaHwbpghib8oDS6TcwVHu0ziQ8NdmZsW6w2Ov6mBHzV257y_gMMgr4kLYYCKK1Mch2eQrkPARoMNTYVpNqP2IEbiiZHRDX1WLNhqyw_R8keMsp_lWq_D2_TeX9ulu8I',
        quantity: 1,
      },
      {
        cartId: 'fallback-item-2',
        id: 'kombucha-jengibre',
        name: 'Kombucha de Jengibre Orgánica',
        price: 4.50,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTJzwZigputMGW3tJzjmXxzMoAASK4zBgooPe95sslg10-OVp_Mhv3GWBpYTUL3w3SdNgMFuZd4sNtYJ9_uD2ZbUFojzkpCNC4G2kFj1nMbH9HGjiAopinxIc_al5g4QTeGfE2TuAhF5bj0fhaL1jOjLCEYByuTVL3BWWzEhhHgcwPPuPjnUnMLPOV9DPuUEftOqifyf7twi7nCgDhbLhWKUMNk7ssapTOYDw8m43z1XD1RT7L_8L12lNtxn2N6rZqVfMf5ipVQU',
        quantity: 2,
      }
    ]
  };

  const activeOrder = order || fallbackOrder;
  const [timeLeft, setTimeLeft] = useState(activeOrder.elapsedMinutes);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 1 ? prev - 1 : 0));
    }, 60000); // countdown minutes
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Determine stage percentage for the progress line
  const progressPercent = {
    requested: '10%',
    processing: '45%',
    ready: '75%',
    delivered: '100%'
  }[activeOrder.status];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full font-sans">
      
      {/* Header and Quick CTAs */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider">Seguimiento en Vivo</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
            {activeOrder.status === 'requested' && 'Confirmando tu pedido...'}
            {activeOrder.status === 'processing' && 'Horneando tu pedido artesanal...'}
            {activeOrder.status === 'ready' && '¡Pedido listo en barra!'}
            {activeOrder.status === 'delivered' && '¡Pedido recibido con éxito!'}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Pedido #{activeOrder.id} &bull; {activeOrder.deliveryMethod === 'delivery' ? 'Entrega a Domicilio' : 'Retiro en Tienda'}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => alert('Soporte Mike\'s Oven: Chat conectado con la gerencia de tienda. Llámanos al 987 654 321')} 
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors text-slate-700 font-bold text-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-secondary animate-pulse" /> Contactar Soporte
          </button>
          
          {activeOrder.status !== 'delivered' && (
            <button 
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas cancelar tu orden de Mike\'s Oven?')) {
                  onCancelOrder(activeOrder.id);
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-5 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              Cancelar Orden
            </button>
          )}
        </div>
      </section>

      {/* Progress Line (The vine metaphor) */}
      <section className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="relative w-full h-16 flex items-center justify-between">
          
          {/* Background grey bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          
          {/* Active progress bar using brand gradient */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-secondary to-primary-container -translate-y-1/2 z-10 transition-all duration-700 ease-out"
            style={{ width: progressPercent }}
          ></div>

          {/* Status Nodes */}
          {/* Node 1: Confirmado */}
          <div className="relative z-20 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
              ['requested', 'processing', 'ready', 'delivered'].includes(activeOrder.status)
                ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              <CheckCircle className="w-5 h-5 shrink-0" />
            </div>
            <span className={`text-xs font-bold mt-2 ${
              ['requested', 'processing', 'ready', 'delivered'].includes(activeOrder.status) ? 'text-secondary' : 'text-gray-400'
            }`}>Confirmado</span>
          </div>

          {/* Node 2: Preparando */}
          <div className="relative z-20 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
              ['processing', 'ready', 'delivered'].includes(activeOrder.status)
                ? 'bg-primary text-white border-primary-container' : 'bg-slate-200 text-slate-400'
            }`}>
              <Flame className={`w-6 h-6 shrink-0 ${activeOrder.status === 'processing' ? 'animate-bounce' : ''}`} />
            </div>
            <span className={`text-xs font-bold mt-2 ${
              ['processing', 'ready', 'delivered'].includes(activeOrder.status) ? 'text-secondary' : 'text-gray-400'
            }`}>En Horno</span>
          </div>

          {/* Node 3: En Camino */}
          <div className="relative z-20 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
              ['ready', 'delivered'].includes(activeOrder.status)
                ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              <Truck className="w-5 h-5 shrink-0" />
            </div>
            <span className={`text-xs font-bold mt-2 ${
              ['ready', 'delivered'].includes(activeOrder.status) ? 'text-secondary' : 'text-gray-400'
            }`}>Listo / En camino</span>
          </div>

          {/* Node 4: Entregado */}
          <div className="relative z-20 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
              activeOrder.status === 'delivered'
                ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              <ShoppingBag className="w-5 h-5 shrink-0" />
            </div>
            <span className={`text-xs font-bold mt-2 ${
              activeOrder.status === 'delivered' ? 'text-secondary' : 'text-gray-400'
            }`}>Entregado</span>
          </div>

        </div>
      </section>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column side (Map & Details) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Map screen */}
          {activeOrder.deliveryMethod === 'delivery' && (
            <div className="bg-slate-100 rounded-2xl overflow-hidden h-[450px] shadow-sm border border-slate-100 relative">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfBg3U94ZnJvO-1iSkzJY87S1rBjllko-UuL5BbujiYWrKTVh0BVPTQsQzQXGoJOkWRc3wdsO7iXl_4Naj0vD5HX4WN2W-T_Xgtovp21WfmdTiA0uRTQwdTg73tIISOdFsZErZN8-JZEodj_Nb-XyJERe16NTuhv871j4pgKdw_uUYSRaAyy0FhXX0H7y8qZrzZfOz2bDCZbdCyuaHbN_5IRG7joTfqlFK7B8ZYwO9cPSVFhoSrzN4C2uDBOKfbyszxTADrBGP4Gc" 
                alt="Mapa de ruta de entrega"
                className="w-full h-full object-cover"
              />

              {/* Floating motorizado Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-white/50 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container shrink-0 bg-slate-200">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCimMPPmtIqcOVjcNOEv3nqqSA43TW7hoPMX8wdfW7ed1dO_odvEpOIJv69ln3Xf7nG8D43KE3VDe7Rg1p9aeK0JFcn1C5QRq1IyDn1yXQz0RdJE0g7qQW1BuY2I9btQXVZHMCyIWoaZa0SYRwVUgrPSvo9hsfTVBo1mxZM4UJfzAy6fWftr-bdo9nBGwVlF8mjnb94sFy41XiG8vhX22li234CVipSRQBnXzsgF9jzsfc5ZWslMWgKlII46j-dzIUhYJb2Ah4V0PE" 
                        alt="Repartidor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950 text-sm">Marco está en camino</p>
                      <p className="text-xs text-slate-500">Repartidor certificado Mike's Oven &bull; 4.9★</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Marcando el número de Marco: 987 654 321...')} 
                    className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-display">Detalle de la Orden</h3>
            <div className="divide-y divide-slate-50">
              {activeOrder.items.map(item => (
                <div key={item.cartId} className="flex justify-between items-center py-3">
                  <div className="flex gap-4 items-center">
                    <div className="bg-slate-100 rounded-lg py-1 px-3 text-sm font-bold text-secondary">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{item.name}</p>
                      {item.customization && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.customization.size} &bull; {item.customization.crust}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-sm font-display">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column side (Summary cards) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Waiting Timer Card */}
          <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <Timer className="w-10 h-10 mb-2 animate-pulse" />
            <h4 className="font-bold uppercase tracking-wider text-[10px] opacity-75">Tiempo estimado de entrega</h4>
            <p className="text-5xl font-extrabold font-display leading-tight mt-1">
              {timeLeft > 0 ? timeLeft : '¡Listo!'}
            </p>
            <p className="text-sm font-bold mt-1">
              {timeLeft > 0 ? 'minutos restantes' : 'Su pedido ya ha sido completado.'}
            </p>
          </div>

          {/* Payment & Delivery address summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-gray-50 pb-2">Resumen de Cuenta</h3>

            <div className="space-y-2 text-xs text-slate-500 font-sans">
              <div className="flex justify-between">
                <span>Total de Productos</span>
                <span className="text-slate-900 font-semibold">S/ {(activeOrder.total - (activeOrder.deliveryMethod === 'delivery' ? 5 : 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-primary font-bold">{activeOrder.deliveryMethod === 'delivery' ? 'S/ 5.00' : 'Gratis'}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-950 pt-2 border-t border-slate-50">
                <span>Total Pagado</span>
                <span className="text-secondary font-display text-base">S/ {activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {activeOrder.paymentUrl && (
              <div className="pt-3 border-t border-slate-50">
                <p className="text-sm text-slate-700">Tu pedido fue creado correctamente. El pago ya está disponible para la confirmación del pedido.</p>
              </div>
            )}

            {!activeOrder.paymentUrl && activeOrder.status === 'requested' && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800">
                <p className="font-semibold">El pago está siendo procesado. Por favor espera...</p>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-2.5 mt-4">
              <MapPin className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-slate-900">Ubicación de Entrega</p>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{activeOrder.address || 'Recojo en tienda física de Mike\'s Oven.'}</p>
              </div>
            </div>
          </div>

          {/* Bottom notice helper */}
          <div className="bg-emerald-50/20 text-slate-800 p-4 rounded-xl border border-emerald-100 text-xs">
            <h4 className="font-bold">¿Algún inconveniente?</h4>
            <p className="text-slate-500 mt-1 leading-normal">Estamos vigilando de cerca tu pizza di fior di latte. Si tienes alergias o deseas cambios de último minuto, llámanos lo antes posible.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
