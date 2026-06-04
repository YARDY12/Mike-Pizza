import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, RefreshCw, Check, Clock, Eye, AlertCircle, ChefHat } from 'lucide-react';
import { ServerOrder } from '../types';

interface CookDashboardProps {
  orders: ServerOrder[];
  onUpdateOrderStatus: (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => void;
}

export default function CookDashboard({ orders, onUpdateOrderStatus }: CookDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<ServerOrder | null>(null);

  // Categorize orders
  const requestedOrders = orders.filter(o => o.status === 'requested');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const readyOrders = orders.filter(o => o.status === 'ready' || o.status === 'delivered');

  const urgentCount = requestedOrders.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full font-sans">
      
      {/* Header and production parameters info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-100 pb-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <ChefHat className="w-5 h-5 text-secondary" /> Habilitado: Zona de Horno de Piedra
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">Gestión de Comandas</h1>
          <p className="text-slate-500 font-medium text-sm">Monitoreo y producción en tiempo real del menú artesanal.</p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 shadow-sm text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>COMANDAS URGENTES: {urgentCount}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>TIEMPO PROMEDIO: 13m</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Solicitado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Inbox className="w-4.5 h-4.5 text-slate-500" /> Solicitado
            </h2>
            <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200">{requestedOrders.length}</span>
          </div>

          <div className="space-y-4 min-h-[500px]">
            {requestedOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                <Check className="w-8 h-8 mx-auto text-emerald-500 bg-emerald-100 rounded-full p-1" />
                <p className="text-xs font-semibold mt-2">¡Todo al día!</p>
              </div>
            ) : (
              requestedOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-tertiary border-gray-150 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">ID: #{order.id}</span>
                      <h3 className="font-bold text-slate-900 font-display mt-0.5">{order.customerName}</h3>
                    </div>
                    <span className="text-tertiary text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {order.elapsedMinutes || '2'}m
                    </span>
                  </div>

                  <ul className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                    {order.items.map(item => (
                      <li key={item.cartId} className="flex gap-3">
                        <span className="font-extrabold text-secondary">{item.quantity}x</span>
                        <span className="text-slate-800">{item.name}</span>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      onUpdateOrderStatus(order.id, 'processing');
                      alert(`Comanda #${order.id} puesta EN HORNO de cocción.`);
                    }}
                    className="w-full py-3 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <ChefHat className="w-4 h-4" /> EMPEZAR A COCINAR
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: En Proceso */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-primary-container/20 px-4 py-3 rounded-xl border border-primary-container/30 shadow-sm">
            <h2 className="font-bold text-on-primary-container text-sm flex items-center gap-2">
              <RefreshCw className="w-4.5 h-4.5 text-primary animate-spin" /> En Horno / Proceso
            </h2>
            <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-primary border border-primary-container/30">{processingOrders.length}</span>
          </div>

          <div className="space-y-4 min-h-[500px]">
            {processingOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs">No hay comandas en cocción.</p>
              </div>
            ) : (
              processingOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-primary border-gray-150 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden animate-pulse"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">ID: #{order.id}</span>
                      <h3 className="font-bold text-slate-900 font-display mt-0.5">{order.customerName}</h3>
                    </div>
                    <span className="text-secondary text-xs font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {order.elapsedMinutes || '12'}m
                    </span>
                  </div>

                  <ul className="space-y-2 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100 text-xs">
                    {order.items.map(item => (
                      <li key={item.cartId} className="flex gap-3">
                        <span className="font-extrabold text-secondary">{item.quantity}x</span>
                        <span className="text-slate-800">{item.name}</span>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="text-[11px] text-slate-505 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      onUpdateOrderStatus(order.id, 'ready');
                      alert(`Comanda #${order.id} marcada como completada y colocada en barra de entrega.`);
                    }}
                    className="w-full py-3 bg-tertiary text-white hover:bg-red-700 font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Check className="w-4 h-4" /> MARCAR COMO LISTO
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Listo / Entregado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Check className="w-4.5 h-4.5 text-emerald-600" /> Listos / Completados
            </h2>
            <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200">{readyOrders.length}</span>
          </div>

          <div className="space-y-4 min-h-[500px]">
            {readyOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-300">
                <p className="text-xs">No hay comandas completadas en este turno.</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-200 opacity-70 space-y-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-450">ID: #{order.id}</span>
                      <h3 className="font-bold text-slate-900 font-display mt-0.5">{order.customerName}</h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold py-1 px-2.5 rounded-lg">
                      {order.status === 'delivered' ? 'ENTREGADO' : 'CUIDE LISTO'}
                    </span>
                  </div>

                  <ul className="text-xs text-slate-500 space-y-1 pl-1 italic">
                    {order.items.map(item => (
                      <li key={item.cartId} className="flex gap-2 line-through">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item.quantity}x {item.name}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> VER DETALLES
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Selected Order details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 relative border border-slate-100"
            >
              <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-display">Detalles de Comanda: Mesa {selectedOrder.customerName}</h3>
                  <span className="text-xs text-slate-400 mt-1 block">Código de orden: #{selectedOrder.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <ul className="space-y-2 text-xs">
                {selectedOrder.items.map(item => (
                  <li key={item.cartId} className="flex justify-between py-2 border-b border-gray-50 text-slate-700">
                    <span className="font-bold">{item.quantity}x {item.name}</span>
                    <span className="text-gray-400 font-sans">
                      {item.customization ? `${item.customization.size}` : 'Estándar'}
                    </span>
                  </li>
                ))}
              </ul>

              {selectedOrder.notes && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-slate-600 italic">
                  <span className="font-bold not-italic text-[10px] uppercase text-amber-700 block mb-1">Notas especiales del mesero:</span>
                  {selectedOrder.notes}
                </div>
              )}

              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3.5 rounded-xl text-xs mt-6 cursor-pointer"
              >
                Cerrar Panel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
