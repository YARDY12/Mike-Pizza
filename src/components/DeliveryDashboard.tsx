import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, Phone, CheckCircle, Navigation, Award, Map, RefreshCw, Clock3, Sparkles, PackageCheck } from 'lucide-react';
import { ServerOrder } from '../types';

interface DeliveryDashboardProps {
  orders: ServerOrder[];
  onUpdateOrderStatus: (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => void;
}

const ORIGIN_COORDS = { lat: -9.1219701723483, lng: -78.52923568834346 };
const DELIVERY_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  '9430': { lat: -9.0895, lng: -78.5904, label: 'Gabriel Marreros' },
  'sim-delivery-ana-torres': { lat: -9.0827, lng: -78.5942, label: 'Ana Torres' },
  'sim-delivery-luis-ramirez': { lat: -9.0917, lng: -78.6005, label: 'Luis Ram�rez' },
  'sim-utp-chimbote': { lat: -9.128586417731901, lng: -78.53422938018002, label: 'UTP Sede Chimbote' },
};

export default function DeliveryDashboard({ orders, onUpdateOrderStatus }: DeliveryDashboardProps) {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{ lat?: number; lng?: number; label: string; address: string } | null>(null);

  const pendingDeliveries = orders.filter(o =>
    o.deliveryMethod === 'delivery' && (o.status === 'ready' || o.status === 'processing')
  );

  const selectedOrder = pendingDeliveries.find(order => order.id === selectedOrderId) ?? pendingDeliveries[0] ?? null;

  useEffect(() => {
    if (!pendingDeliveries.length) {
      setSelectedOrderId(null);
      return;
    }
    if (!selectedOrderId || !pendingDeliveries.some(order => order.id === selectedOrderId)) {
      setSelectedOrderId(pendingDeliveries[0].id);
    }
  }, [pendingDeliveries, selectedOrderId]);

  useEffect(() => {
    if (!selectedOrder) {
      setSelectedDestination(null);
      setRouteInfo(null);
      setMapError(null);
      setIsGeocoding(false);
      return;
    }

    const cachedDestination = DELIVERY_COORDS[String(selectedOrder.id)] ?? null;

    const computeRouteInfo = (destination: { lat: number; lng: number; label: string }) => {
      const R = 6371;
      const toRad = (value: number) => (value * Math.PI) / 180;
      const dLat = toRad(destination.lat - ORIGIN_COORDS.lat);
      const dLon = toRad(destination.lng - ORIGIN_COORDS.lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(ORIGIN_COORDS.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = Math.round((R * c) * 10) / 10;
      const duration = Math.round((distance / 30) * 60);
      return { distance, duration };
    };

    const formatAddressForEmbed = (order: ServerOrder) => {
      const parts: string[] = [];
      if (order.address?.trim()) parts.push(order.address.trim());
      if (order.district?.trim()) parts.push(order.district.trim());
      parts.push('Peru');
      return parts.join(', ');
    };

    const resolveDestination = () => {
      const destinationAddress = formatAddressForEmbed(selectedOrder);
      if (!destinationAddress.trim()) {
        setSelectedDestination(null);
        setRouteInfo(null);
        setMapError('No hay una dirección válida para este pedido.');
        return;
      }

      const destination = cachedDestination
        ? { ...cachedDestination, address: destinationAddress }
        : { label: selectedOrder.customerName || 'Destino', address: destinationAddress };

      setSelectedDestination(destination);
      setRouteInfo(cachedDestination ? computeRouteInfo(cachedDestination) : null);
      setMapError(null);
      setIsGeocoding(false);
    };

    resolveDestination();
  }, [selectedOrder]);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const buildMapSrc = () => {
    if (!selectedDestination) return '';
    const origin = `${ORIGIN_COORDS.lat},${ORIGIN_COORDS.lng}`;
    const destination = selectedDestination.lat && selectedDestination.lng
      ? `${selectedDestination.lat},${selectedDestination.lng}`
      : selectedDestination.address;

    if (googleMapsApiKey) {
      return `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(googleMapsApiKey)}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`;
    }

    const originLat = ORIGIN_COORDS.lat;
    const originLng = ORIGIN_COORDS.lng;
    const destLat = selectedDestination.lat ?? ORIGIN_COORDS.lat;
    const destLng = selectedDestination.lng ?? ORIGIN_COORDS.lng;
    const minLat = Math.min(originLat, destLat);
    const maxLat = Math.max(originLat, destLat);
    const minLng = Math.min(originLng, destLng);
    const maxLng = Math.max(originLng, destLng);
    const padding = 0.03;
    const bbox = `${minLng - padding},${minLat - padding},${maxLng + padding},${maxLat + padding}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${originLat},${originLng}`;
  };

  const mapSrc = buildMapSrc();
  const routeLink = selectedDestination
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${ORIGIN_COORDS.lat},${ORIGIN_COORDS.lng}`)}&destination=${encodeURIComponent(selectedDestination.lat && selectedDestination.lng ? `${selectedDestination.lat},${selectedDestination.lng}` : selectedDestination.address)}&travelmode=driving`
    : '';
  const effectiveMapError = !selectedDestination
    ? 'Selecciona un pedido para ver la ruta.'
    : mapError;

  const handleStartDelivery = (orderId: string) => {
    setActiveRouteId(orderId);
    setSelectedOrderId(orderId);
    onUpdateOrderStatus(orderId, 'ready');
    alert(`Ruta de entrega iniciada para la comanda #${orderId}. �Buen viaje e impecable conducci�n!`);
  };

  const handleCompleteDelivery = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'delivered');
    if (activeRouteId === orderId) {
      setActiveRouteId(null);
    }
    alert(`�Pedido #${orderId} registrado como ENTREGADO con �xito!`);
  };

  const averageEta = pendingDeliveries.length
    ? Math.round(pendingDeliveries.reduce((sum, order) => sum + (order.elapsedMinutes || 10), 0) / pendingDeliveries.length)
    : 0;

  const routeAddress = selectedOrder
    ? [selectedOrder.address, selectedOrder.district].filter(Boolean).join(', ')
    : 'Selecciona un pedido';
  const destinationCoords = selectedDestination ?? (selectedOrder ? DELIVERY_COORDS[String(selectedOrder.id)] : null);
  const formatCurrency = (value?: number) => (typeof value === 'number' ? value.toFixed(2) : '0.00');
  const formatCoordinate = (value?: number) => (typeof value === 'number' ? value.toFixed(5) : '---');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full font-sans">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Truck className="w-5 h-5 text-secondary" /> M�dulo de Delivery
          </span>
          <h1 className="text-3xl font-extrabold text-emerald-950 font-display mt-1">Panel de Delivery</h1>
          <p className="text-slate-500 font-medium text-sm">Ruta real de entrega desde Mike�s Oven Pizza en Nuevo Chimbote.</p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm text-xs font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>PILOTOS EN RUTA: {pendingDeliveries.length} PENDIENTES</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <PackageCheck className="w-4 h-4 text-secondary" /> Pendientes
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{pendingDeliveries.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <Clock3 className="w-4 h-4 text-secondary" /> ETA Promedio
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{averageEta} min</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-secondary" /> Prioridad
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">Alta</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                <Navigation className="w-5 h-5 text-secondary" /> Pedidos listos para entregar
              </h2>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans">
                {pendingDeliveries.length} en cola
              </span>
            </div>
            <div className="space-y-3 p-4">
              {pendingDeliveries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 p-6 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle className="w-10 h-10 text-emerald-500 bg-emerald-50 rounded-full p-2 mx-auto" />
                  <p className="font-bold text-sm text-slate-700 mt-2">Sin entregas por ahora</p>
                  <p className="text-xs text-slate-400 mt-1">Los pedidos aparecer�n aqu� cuando est�n listos para env�o.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {pendingDeliveries.map(order => {
                    const isSelected = selectedOrder?.id === order.id;
                    const isDelivering = activeRouteId === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedOrderId(order.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedOrderId(order.id);
                          }
                        }}
                        className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                          isSelected ? 'border-secondary bg-emerald-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-primary tracking-wider uppercase">Pedido #{order.id}</p>
                            <h3 className="font-bold text-slate-900 text-base">{order.customerName}</h3>
                            <p className="text-xs text-slate-500 mt-1">{order.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">S/ {formatCurrency(order.total)}</p>
                            <p className="text-[11px] text-slate-400">{order.elapsedMinutes + 8} min</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${order.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {order.status === 'ready' ? 'Listo' : 'En proceso'}
                          </span>
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Phone className="w-3.5 h-3.5" /> {order.phone}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleStartDelivery(order.id);
                            }}
                            disabled={isDelivering}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                              isDelivering
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-white'
                            }`}
                          >
                            <Navigation className="w-4 h-4" /> Iniciar Ruta
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCompleteDelivery(order.id);
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800"
                          >
                            <CheckCircle className="w-4 h-4" /> Entregado
                          </button>
                        </div>
                        {isGeocoding && isSelected && (
                          <p className="text-xs text-slate-400 mt-2">Geocodificando direcci�n...</p>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Mapa de Google</p>
                <h3 className="text-lg font-bold text-slate-800">Rutas desde Nuevo Chimbote</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400">Destino</p>
                <p className="text-sm font-black text-slate-900">{selectedOrder?.customerName ?? 'Sin pedido seleccionado'}</p>
              </div>
            </div>

            <div className="relative h-[520px]">
              {mapSrc ? (
                <div className="w-full h-full">
                  <iframe
                    title="Mapa de ruta"
                    src={mapSrc}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm p-6 text-center">
                  {isGeocoding
                    ? 'Generando ruta, espera un momento...'
                    : effectiveMapError
                      ? effectiveMapError
                      : 'Selecciona un pedido para ver la ruta en el mapa.'}
                </div>
              )}

              {routeInfo && (
                <div className="absolute right-4 top-4 rounded-2xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-700 max-w-sm shadow-sm">
                  <p className="font-semibold">Ruta calculada</p>
                  <p>{routeInfo.distance} km • {routeInfo.duration} min</p>
                </div>
              )}

              {routeLink && (
                <a
                  href={routeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute left-4 top-4 rounded-full bg-white/90 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-white"
                >
                  Abrir en Google Maps
                </a>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Origen</p>
                  <p className="font-black text-slate-900">Mike�s Oven Pizza</p>
                  <p className="text-xs text-slate-500">Nuevo Chimbote, Per�</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Destino</p>
                  <p className="font-black text-slate-900">{selectedOrder ? routeAddress : 'Selecciona un pedido'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Coordenadas</p>
                  <p className="font-black text-slate-900">Origen: {`${formatCoordinate(ORIGIN_COORDS.lat)}, ${formatCoordinate(ORIGIN_COORDS.lng)}`}</p>
                  <p className="text-sm text-slate-600 mt-1">Destino: {selectedOrder ? `${formatCoordinate(destinationCoords?.lat)}, ${formatCoordinate(destinationCoords?.lng)}` : '---'}</p>
                </div>
              </div>
            </div>
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
