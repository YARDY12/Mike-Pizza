import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Truck, Store, MapPin, ShieldCheck, CheckCircle, QrCode } from 'lucide-react';
import { CartItem, UserProfile } from '../types';
import LocationMap from './LocationMap';

interface CheckoutViewProps {
  cart: CartItem[];
  user: UserProfile;
  onNavigate: (view: string) => void;
  onPlaceOrder: (orderData: {
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    paymentMethod: 'card' | 'digital_wallet' | 'cash';
    lat?: number;
    lng?: number;
  }) => void;
}

export default function CheckoutView({ cart, user, onNavigate, onPlaceOrder }: CheckoutViewProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [district, setDistrict] = useState('Miraflores');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital_wallet' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mapLat, setMapLat] = useState(-12.0464);
  const [mapLng, setMapLng] = useState(-77.0428);

  // Compute order totals
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = deliveryMethod === 'delivery' ? 5.00 : 0.00;
  const igv = subtotal * 0.18;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deliveryMethod === 'delivery' && !address.trim()) {
      alert('Por favor introduce tu dirección de delivery.');
      return;
    }
    
    if (paymentMethod === 'card' && (!cardNumber.trim() || !expiry.trim() || !cvc.trim())) {
      alert('Por favor completa los detalles de tu tarjeta.');
      return;
    }
    
    if (!agreeTerms) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    if (deliveryMethod === 'delivery' && district === 'Barranco') {
      onNavigate('coverage');
      return;
    }

    onPlaceOrder({
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? `${address}${apt ? ' ' + apt : ''}` : undefined,
      district: deliveryMethod === 'delivery' ? district : undefined,
      paymentMethod,
      lat: deliveryMethod === 'delivery' ? mapLat : undefined,
      lng: deliveryMethod === 'delivery' ? mapLng : undefined,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-sans">
        <button onClick={() => onNavigate('cart')} className="hover:text-secondary hover:underline cursor-pointer">Carrito</button>
        <span>&rsaquo;</span>
        <span className="text-secondary font-bold">Pago Seguro</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Pago Seguro</h1>

          {/* Step 1: Delivery Method */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-slate-800 font-display">Método de Entrega</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Option */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`relative flex w-full cursor-pointer rounded-xl border p-5 text-left transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="flex flex-1 items-center gap-3">
                  <Truck className="text-secondary w-6 h-6 shrink-0" />
                  <span className="flex flex-col">
                    <span className="block font-bold text-slate-900 text-sm">Delivery Entregado</span>
                    <span className="mt-1 text-xs text-gray-500">45-60 min &bull; S/ 5.00</span>
                  </span>
                </span>
                {deliveryMethod === 'delivery' && (
                  <CheckCircle className="text-secondary w-5 h-5 ml-auto self-center shrink-0 fill-secondary text-white" />
                )}
              </button>

              {/* Pickup Option */}
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`relative flex w-full cursor-pointer rounded-xl border p-5 text-left transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="flex flex-1 items-center gap-3">
                  <Store className="text-slate-600 w-6 h-6 shrink-0" />
                  <span className="flex flex-col">
                    <span className="block font-bold text-slate-900 text-sm">Recojo en Tienda</span>
                    <span className="mt-1 text-xs text-gray-500">15-20 min &bull; Gratis</span>
                  </span>
                </span>
                {deliveryMethod === 'pickup' && (
                  <CheckCircle className="text-secondary w-5 h-5 ml-auto self-center shrink-0 fill-secondary text-white" />
                )}
              </button>
            </div>

            {/* Address fields for delivery */}
            {deliveryMethod === 'delivery' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="address">Dirección</label>
                  <input 
                    type="text" 
                    id="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Av. Larco 123"
                    className="w-full rounded-xl border-gray-200 bg-slate-50/50 py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors"
                    required={deliveryMethod === 'delivery'}
                  />
                </div>

                <LocationMap 
                  onLocationSelect={(lat, lng, addr) => {
                    setMapLat(lat);
                    setMapLng(lng);
                    if (!address) {
                      setAddress(addr);
                    }
                  }}
                  initialLat={mapLat}
                  initialLng={mapLng}
                  initialAddress={address || 'Miraflores, Lima'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="apt">Apto, Suite, Piso (Opcional)</label>
                    <input 
                      type="text" 
                      id="apt"
                      value={apt}
                      onChange={e => setApt(e.target.value)}
                      placeholder="Piso 4 - Dpto 402"
                      className="w-full rounded-xl border-gray-200 bg-slate-50/50 py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="district">Distrito de Cobertura</label>
                    <select 
                      id="district"
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full rounded-xl border-gray-200 bg-slate-50/50 py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors"
                    >
                      <option value="Miraflores">Miraflores (Disponible)</option>
                      <option value="San Isidro">San Isidro (Disponible)</option>
                      <option value="Barranco">Barranco (¡Alerta: Fuera de Cobertura!)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="instructions">Instrucciones de Entrega (Opcional)</label>
                  <textarea 
                    id="instructions"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Tocar el intercomunicador, dejar con el vigilante en portería..."
                    rows={2}
                    className="w-full rounded-xl border-gray-200 bg-slate-50/50 py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}

            {deliveryMethod === 'pickup' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3"
              >
                <MapPin className="text-secondary w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Ubicación de nuestro local:</p>
                  <p className="text-sm text-gray-500">Calle de la Huizache 452, Col. Del Valle, CP 03100</p>
                  <p className="text-xs text-secondary font-semibold mt-1">¡Tu pedido estará caliente esperándote en 15 minutos!</p>
                </div>
              </motion.div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-slate-800 font-display">Método de Pago</h2>
            </div>

            <div className="space-y-4">
              {/* Card Payment Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex w-full cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-3 w-full">
                  <CreditCard className="text-secondary w-5 h-5 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">Tarjeta de Crédito o Débito</span>
                  {paymentMethod === 'card' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </button>

              {/* Card Fields - Conditional Render */}
              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-50/50 rounded-xl p-4 border border-gray-200 space-y-4 ml-8"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Número de Tarjeta *</label>
                    <input 
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={e => {
                        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        let matches = v.match(/\d{4,16}/g);
                        let match = matches && matches[0] || '';
                        let parts = [];
                        for (let i=0, len=match.length; i<len; i+=4) {
                          parts.push(match.substring(i, i+4));
                        }
                        setCardNumber(parts.length > 0 ? parts.join(' ') : v);
                      }}
                      maxLength={19}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Vencimiento (MM/YY) *</label>
                      <input 
                        type="text"
                        placeholder="12/28"
                        value={expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          if (v.length >= 2) {
                            setExpiry(v.substring(0,2) + '/' + v.substring(2,4));
                          } else {
                            setExpiry(v);
                          }
                        }}
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">CVC *</label>
                      <input 
                        type="password"
                        placeholder="123"
                        value={cvc}
                        onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Digital Wallet Payment Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('digital_wallet')}
                className={`flex w-full cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'digital_wallet'
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-3 w-full">
                  <QrCode className="text-secondary w-5 h-5 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">Plin / Yape (Código QR)</span>
                  {paymentMethod === 'digital_wallet' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </button>

              {/* QR Display - Conditional Render */}
              {paymentMethod === 'digital_wallet' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-dashed border-secondary/30 flex flex-col items-center text-center space-y-4 ml-8"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-slate-800">Código QR para Pago Inmediato</p>
                    <p className="text-xs text-slate-600">Escanea con <span className="font-bold">Yape</span> o <span className="font-bold">Plin</span></p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-secondary/20 inline-block shadow-md">
                    <div className="w-40 h-40 bg-white flex flex-col items-center justify-center relative border-4 border-slate-900">
                      <div className="absolute top-1 left-1 w-6 h-6 border-2 border-slate-900"></div>
                      <div className="absolute top-1 right-1 w-6 h-6 border-2 border-slate-900"></div>
                      <div className="absolute bottom-1 left-1 w-6 h-6 border-2 border-slate-900"></div>
                      
                      <div className="grid grid-cols-5 gap-1 w-24 h-24">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 w-4 ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-white'} border border-slate-200`} 
                          />
                        ))}
                      </div>
                      
                      <span className="absolute bottom-2 text-[8px] bg-white px-1 font-extrabold text-secondary">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-3 rounded-lg w-full text-left text-xs border border-secondary/20">
                    <p className="font-bold text-slate-800 mb-1">Celulares para transferencia:</p>
                    <p className="text-slate-700 font-mono">📱 Yape: 987 654 321</p>
                    <p className="text-slate-700 font-mono">📱 Plin: 987 654 321</p>
                  </div>
                </motion.div>
              )}

              {/* Cash Payment Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex w-full cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-3 w-full">
                  <span className="font-bold text-secondary font-sans shrink-0 text-xl">💵</span>
                  <span className="font-bold text-slate-900 text-sm">Efectivo contra entrega</span>
                  {paymentMethod === 'cash' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </button>

              {paymentMethod === 'cash' && (
                <div className="text-xs text-gray-500 ml-8">
                  * El repartidor llevará cambio para billetes de S/ 100.00 o S/ 50.00.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 sticky top-28 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 font-display">Resumen del Pedido</h2>

            {/* Cart products */}
            <ul className="flex flex-col gap-4 divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <li key={item.cartId} className={`flex justify-between items-start ${idx > 0 ? 'pt-4' : ''}`}>
                  <div className="flex gap-3">
                    <img 
                      src={item.image || 'https://via.placeholder.com/96?text=Sin+imagen'} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-slate-900 leading-tight">{item.name}</span>
                      <span className="text-gray-500 mt-0.5">Cant: {item.quantity}</span>
                      {item.customization && (
                        <span className="text-[10px] text-gray-400 font-sans mt-0.5 line-clamp-1">
                          {item.customization.size} &bull; {item.customization.crust}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-xs shrink-0 font-display">S/ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <hr className="border-gray-100" />

            {/* Price Calculations */}
            <div className="space-y-2 text-sm text-gray-500 font-sans">
              <div className="flex justify-between">
                <span>Subtotal (Con descto Club)</span>
                <span className="text-slate-800">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Incluye IGV (18%)</span>
                <span>S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de Envío</span>
                <span className="text-slate-800">{deliveryMethod === 'delivery' ? 'S/ 5.00' : 'Gratis'}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-gray-100 pt-3 text-base font-display">
                <span>Total</span>
                <span className="text-secondary text-lg">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="rounded border-gray-300 text-secondary focus:ring-secondary mt-1 shrink-0"
              />
              <span className="text-xs text-gray-600 leading-tight">
                Acepto los <span className="text-secondary font-semibold cursor-pointer hover:underline">Términos y Condiciones</span> y entiendo que mi pedido será preparado tras confirmar el pago.
              </span>
            </label>

            {/* Confirm button */}
            <button 
              type="submit"
              className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-extrabold py-4 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider text-sm active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" /> 
              {paymentMethod === 'card' && 'Pagar con Tarjeta'}
              {paymentMethod === 'digital_wallet' && 'Confirmar con QR'}
              {paymentMethod === 'cash' && 'Confirmar Pedido'}
            </button>

            <div className="bg-emerald-50/20 text-slate-800 p-3 rounded-lg border border-emerald-100 text-xs">
              <p className="font-semibold">💳 Pago Seguro</p>
              <p className="text-gray-600 mt-1 text-[11px]">Conexión cifrada 256-bit. Tu información está protegida.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
