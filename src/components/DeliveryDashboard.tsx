import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, Phone, CheckCircle, Navigation, Award, Map, RefreshCw, Clock3, Sparkles, PackageCheck } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ServerOrder } from '../types';

interface DeliveryDashboardProps {
  orders: ServerOrder[];
  onUpdateOrderStatus: (orderId: string, status: 'requested' | 'processing' | 'ready' | 'delivered') => void;
}

// Origin set to: Av. Argentina cuadra 2, Nuevo Chimbote 02710 (geocoded via Nominatim)
const ORIGIN_COORDS = { lat: -9.1212923, lng: -78.5313757 };
const DELIVERY_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  '9430': { lat: -9.0895, lng: -78.5904, label: 'Gabriel Marreros' },
  'sim-delivery-ana-torres': { lat: -9.0827, lng: -78.5942, label: 'Ana Torres' },
  'sim-delivery-luis-ramirez': { lat: -9.0917, lng: -78.6005, label: 'Luis Ramírez' },
};


export default function DeliveryDashboard({ orders, onUpdateOrderStatus }: DeliveryDashboardProps) {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const originMarkerRef = useRef<L.CircleMarker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeCache = useRef<Record<string, { lat: number; lng: number; label: string }>>({});

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
    if (!mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [ORIGIN_COORDS.lat, ORIGIN_COORDS.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    originMarkerRef.current = L.circleMarker([ORIGIN_COORDS.lat, ORIGIN_COORDS.lng], {
      radius: 8,
      color: '#166534',
      fillColor: '#22c55e',
      fillOpacity: 1,
      weight: 2,
    }).addTo(mapRef.current).bindPopup("Mike's Oven Pizza - Nuevo Chimbote");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    async function resolveAndDraw() {
      if (!selectedOrder) {
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
          destinationMarkerRef.current = null;
        }
        if (routeLineRef.current) {
          routeLineRef.current.remove();
          routeLineRef.current = null;
        }
        setRouteInfo(null);
        setMapError(null);
        mapRef.current.setView([ORIGIN_COORDS.lat, ORIGIN_COORDS.lng], 13);
        return;
      }

      const cacheKey = `${selectedOrder.address}|${selectedOrder.district}`;

      let destination = DELIVERY_COORDS[String(selectedOrder.id)] ?? null;

      if (!destination) {
        if (geocodeCache.current[cacheKey]) {
          destination = geocodeCache.current[cacheKey];
        } else {
          try {
            setIsGeocoding(true);
            const q = `${selectedOrder.address}, ${selectedOrder.district || ''}, Nuevo Chimbote, Peru`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
            const res = await fetch(url, { headers: { 'User-Agent': 'Mike-Pizza-App/1.0' } });
            const arr = await res.json();
            if (arr && arr.length) {
              destination = { lat: Number(arr[0].lat), lng: Number(arr[0].lon), label: selectedOrder.customerName };
              geocodeCache.current[cacheKey] = destination;
            } else {
              setMapError('No se pudo geocodificar la dirección del pedido. Usando fallback si existe.');
            }
          } catch (e) {
            console.error('[DeliveryDashboard] Geocode error', e);
            setMapError('Error de geocodificación. Usando fallback si existe.');
          } finally {
            setIsGeocoding(false);
          }
        }
      }

      if (!destination) {
        // nothing to draw
        return;
      }

      // update destination marker
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng([destination.lat, destination.lng]);
        destinationMarkerRef.current.setPopupContent(destination.label);
      } else {
        destinationMarkerRef.current = L.marker([destination.lat, destination.lng], {
          icon: L.divIcon({ className: 'text-2xl', html: '📍' }),
        }).addTo(mapRef.current).bindPopup(destination.label);
      }

      // Debug info
      console.log('[DeliveryDashboard] origin coords', ORIGIN_COORDS);
      console.log('[DeliveryDashboard] destination coords', destination);

      try { mapRef.current?.invalidateSize(); } catch (e) {}
      mapRef.current?.setView([ORIGIN_COORDS.lat, ORIGIN_COORDS.lng], 13);

      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${ORIGIN_COORDS.lng},${ORIGIN_COORDS.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      console.log('[DeliveryDashboard] routeUrl', routeUrl);

      try {
        const res = await fetch(routeUrl);
        const data = await res.json();
        const route = data.routes && data.routes[0] ? data.routes[0] : null;

        if (!route || !route.geometry || !route.geometry.coordinates || route.distance === 0) {
          console.warn('[DeliveryDashboard] OSRM returned no route or zero distance, using direct line fallback');
          const coords: [number, number][] = [
            [ORIGIN_COORDS.lat, ORIGIN_COORDS.lng],
            [destination.lat, destination.lng],
          ];

          if (routeLineRef.current) routeLineRef.current.setLatLngs(coords as any);
          else routeLineRef.current = L.polyline(coords as any, { color: '#f97316', weight: 4, opacity: 0.9, dashArray: '6 6' }).addTo(mapRef.current as L.Map);

          const bounds = L.latLngBounds(coords as any);
          bounds.extend([ORIGIN_COORDS.lat, ORIGIN_COORDS.lng]);
          mapRef.current?.fitBounds(bounds, { padding: [40, 40] });

          // haversine
          const toRad = (v: number) => (v * Math.PI) / 180;
          const R = 6371;
          const dLat = toRad(destination.lat - ORIGIN_COORDS.lat);
          const dLon = toRad(destination.lng - ORIGIN_COORDS.lng);
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(ORIGIN_COORDS.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const km = Math.round(R * c * 10) / 10;
          setRouteInfo({ distance: km, duration: Math.round((km/30)*60) });
          setMapError(null);
          return;
        }

        const geo = route.geometry;
        const coords = geo.coordinates.map((point: [number, number]) => [point[1], point[0]] as [number, number]);

        if (routeLineRef.current) routeLineRef.current.setLatLngs(coords);
        else routeLineRef.current = L.polyline(coords, { color: '#16a34a', weight: 5, opacity: 0.8 }).addTo(mapRef.current as L.Map);

        const bounds = L.latLngBounds(coords);
        bounds.extend([ORIGIN_COORDS.lat, ORIGIN_COORDS.lng]);
        mapRef.current?.fitBounds(bounds, { padding: [40, 40] });

        setRouteInfo({ distance: Math.round(route.distance / 100) / 10, duration: Math.round(route.duration / 60) });
        setMapError(null);
      } catch (err) {
        console.error('[DeliveryDashboard] route fetch error', err);
        setMapError('No se pudo calcular la ruta. Mostrando línea directa como fallback.');
      }
    }

    resolveAndDraw();

    return () => { cancelled = true; };
  }, [selectedOrder]);

  const handleStartDelivery = (orderId: string) => {
    setActiveRouteId(orderId);
    setSelectedOrderId(orderId);
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

  const averageEta = pendingDeliveries.length
    ? Math.round(pendingDeliveries.reduce((sum, order) => sum + (order.elapsedMinutes || 10), 0) / pendingDeliveries.length)
    : 0;

  const routeAddress = selectedOrder
    ? [selectedOrder.address, selectedOrder.district].filter(Boolean).join(', ')
    : 'Selecciona un pedido';
  const destinationCoords = selectedOrder ? DELIVERY_COORDS[String(selectedOrder.id)] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full font-sans">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Truck className="w-5 h-5 text-secondary" /> Módulo de Delivery
          </span>
          <h1 className="text-3xl font-extrabold text-emerald-950 font-display mt-1">Panel de Delivery</h1>
          <p className="text-slate-500 font-medium text-sm">Ruta real de entrega desde Mike’s Oven Pizza en Nuevo Chimbote.</p>
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
                  <p className="text-xs text-slate-400 mt-1">Los pedidos aparecerán aquí cuando estén listos para envío.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {pendingDeliveries.map(order => {
                    const isSelected = selectedOrder?.id === order.id;
                    const isDelivering = activeRouteId === order.id;
                    return (
                      <motion.button
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`w-full text-left rounded-2xl border p-4 transition-all ${
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
                            <p className="font-black text-slate-900">S/ {order.total.toFixed(2)}</p>
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
                          <p className="text-xs text-slate-400 mt-2">Geocodificando dirección...</p>
                        )}
                      </motion.button>
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
              <div ref={mapContainerRef} className="w-full h-full" />
              {mapError && (
                <div className="absolute left-4 top-4 rounded-2xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-700 max-w-sm shadow-sm">
                  <p className="font-semibold">Error en el mapa</p>
                  <p>{mapError}</p>
                </div>
              )}
              {routeInfo && (
                <div className="absolute right-4 top-4 rounded-2xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-700 max-w-sm shadow-sm">
                  <p className="font-semibold">Ruta calculada</p>
                  <p>{routeInfo.distance} km · {routeInfo.duration} min</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Origen</p>
                  <p className="font-black text-slate-900">Mike’s Oven Pizza</p>
                  <p className="text-xs text-slate-500">Nuevo Chimbote, Perú</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Destino</p>
                  <p className="font-black text-slate-900">{selectedOrder ? routeAddress : 'Selecciona un pedido'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Coordenadas</p>
                  <p className="font-black text-slate-900">Origen: {`${ORIGIN_COORDS.lat.toFixed(5)}, ${ORIGIN_COORDS.lng.toFixed(5)}`}</p>
                  <p className="text-sm text-slate-600 mt-1">Destino: {selectedOrder ? `${destinationCoords?.lat.toFixed(5)}, ${destinationCoords?.lng.toFixed(5)}` : '---'}</p>
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
