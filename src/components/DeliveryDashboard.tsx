import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, Phone, CheckCircle, Navigation, Award, Map, RefreshCw } from 'lucide-react';
import { ServerOrder } from '../types';

interface DeliveryDashboardProps {
  orders: ServerOrder[];
  onUpdateOrderStatus: (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => void;
}

export default function DeliveryDashboard({ orders, onUpdateOrderStatus }: DeliveryDashboardProps) {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  // Ready/Delivering orders
  const pendingDeliveries = orders.filter(o => 
    o.deliveryMethod === 'delivery' && (o.status === 'ready' || o.status === 'processing')
  );

  const handleStartDelivery = (orderId: string) => {
    setActiveRouteId(orderId);
    // Move order to ready (on-the-way stage)
    onUpdateOrderStatus(orderId, 'ready');
    alert(`Ruta de entrega iniciada para la comanda #${orderId}. ¡Buen viaje e impecable conducción!`);
  };

  const handleCompleteDelivery = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'delivered');
    if (activeRouteId === orderId) {
      setActiveRouteId(null);
    }
    alert(`¡Pedido #${orderId} registrado como ENTREGADO con éxito!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full font-sans">
      
      {/* Header Panel */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Truck className="w-5 h-5 text-secondary" /> Módulo de Distribución Activo
          </span>
          <h1 className="text-3xl font-extrabold text-emerald-950 font-display mt-1">Panel de Delivery</h1>
          <p className="text-slate-500 font-medium text-sm">Gestión rápida de rutas y entregas a domicilio de Mike's Oven.</p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm text-xs font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>PILOTOS EN RUTA: {pendingDeliveries.length} PENDIENTES</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Orders list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
              <Navigation className="w-5 h-5 text-secondary" /> Listos para Entrega
            </h2>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans">
              {pendingDeliveries.length} En cola
            </span>
          </div>

          <div className="space-y-4">
            {pendingDeliveries.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-slate-400 p-6 shadow-sm">
                <CheckCircle className="w-10 h-10 text-emerald-500 bg-emerald-50 rounded-full p-2 mx-auto" />
                <p className="font-bold text-sm text-slate-700 mt-2">¡Completamente al día!</p>
                <p className="text-xs text-slate-400 mt-1 leading-normal">No hay pizzas listas esperando delivery en este momento. Las comandas siguen en horno.</p>
              </div>
            ) : (
              <AnimatePresence>
                {pendingDeliveries.map(order => {
                  const isDelivering = activeRouteId === order.id;
                  
                  return (
                    <motion.div 
                      key={order.id}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95, opacity: 0, x: -100 }}
                      className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all ${
                        isDelivering ? 'ring-2 ring-secondary' : 'hover:border-slate-350'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-primary tracking-wider uppercase block mb-1">
                            Pedido #{order.id}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base">{order.customerName}</h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-slate-900 font-display text-base">S/ {order.total.toFixed(2)}</span>
                          <span className="text-[11px] text-gray-400 italic">Pre-pago QR</span>
                        </div>
                      </div>

                      {/* address phone details */}
                      <div className="space-y-3.5 border-b border-gray-50 pb-4 mb-4 text-xs font-sans text-slate-600">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="text-primary w-4.5 h-4.5 shrink-0 mt-0.5" />
                          <span>{order.address || 'Calle de la Huizache 452, Col. Del Valle'}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="text-primary w-4.5 h-4.5 shrink-0" />
                          <span className="font-semibold">{order.phone || '+51 987 654 321'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleStartDelivery(order.id)}
                          disabled={isDelivering}
                          className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                            isDelivering 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                              : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-white'
                          }`}
                        >
                          <Navigation className="w-4 h-4" /> Iniciar Ruta
                        </button>
                        
                        <button 
                          onClick={() => handleCompleteDelivery(order.id)}
                          className="border-2 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer active:scale-95"
                        >
                          <CheckCircle className="w-4 h-4" /> Entregado
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Column: Routing Map Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col h-[550px]">
          <div className="flex-grow bg-slate-100 relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvlfgwwhamWbP3YlUtEjkA2bn9fr-SeQsOr2xBTTOAWG2mq4wjQcTqvnW9dnlafYS6rgiitvYqqgq_CPFDezHrCJ9ADQ4ILt4X35CUfz7EWi5t4vFbVjzyeHaIgsGXeJqJFGZPDrxYRpSRMDEjsdEmaryjOfRDVqKi2Wq5R50CMH8K-7Q3erB4UV9yhEfIKfRiV-b3ch9uNAu_zu6RoqOsJTi-d56ofVAeUMyIa_3-s22k1_U-n6O3KZX9TehT-g7UOyBjiRXiAk8" 
              alt="Plano GPS"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Simulated overlays markers on map */}
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center pointer-events-none">
              <div className="w-8 h-8 bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse border border-white">
                <StoreIcon className="w-4 h-4" />
              </div>
              <span className="mt-1 bg-white px-2 py-0.5 border border-slate-100 rounded shadow-sm text-[9px] font-black text-emerald-950 uppercase">Tienda</span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center pointer-events-none">
              <div className="w-8 h-8 bg-lime-500 text-white rounded-full flex items-center justify-center shadow-lg border border-white">
                <MapPin className="w-4 h-4 fill-white text-secondary" />
              </div>
              <span className="mt-1 bg-white px-2 py-0.5 border border-slate-100 rounded shadow-sm text-[9px] font-bold text-slate-800">Ricardo Gareca</span>
            </div>

            {/* Path SVG trace over the map preview */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 600 450">
              <path 
                d="M170 110 Q 300 180 430 250" 
                stroke="#536500" 
                strokeDasharray="6 6" 
                strokeWidth="3.5" 
                className="opacity-55"
              ></path>
            </svg>
          </div>

          {/* Bottom float route stats dashboard card */}
          <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Ruta Recomendada</span>
                <span className="text-secondary font-extrabold text-sm mt-0.5">Av. Larco &rsaquo; Miraflores</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col font-display text-sm text-slate-850">
                <span className="text-[10px] uppercase font-bold text-gray-400">Tiempo Est.</span>
                <span className="font-extrabold mt-0.5">18 min</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col font-display text-sm text-slate-850">
                <span className="text-[10px] uppercase font-bold text-gray-400">Distancia</span>
                <span className="font-extrabold mt-0.5">3.4 km</span>
              </div>
            </div>

            <button 
              onClick={() => alert('Waze/Google Maps: Vinculando coordenadas GPS al móvil en segundo plano...')} 
              className="bg-emerald-950 text-white font-bold text-xs py-2.5 px-5 rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Map className="w-4 h-4" /> Abrir Ruta GPS
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
    </svg>
  );
}
