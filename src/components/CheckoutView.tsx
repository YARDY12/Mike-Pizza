import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Truck, Store, MapPin, ShieldCheck, HelpCircle, User, FileText, CheckCircle } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  user: UserProfile;
  onNavigate: (view: string) => void;
  onPlaceOrder: (orderData: {
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    paymentMethod: 'card' | 'digital_wallet' | 'cash';
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

    // Check if district is outside range
    // If district is Barranco, we can purposefully trigger the "coverage" warning view.
    if (deliveryMethod === 'delivery' && district === 'Barranco') {
      onNavigate('coverage');
      return;
    }

    onPlaceOrder({
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? `${address} ${apt}` : undefined,
      district: deliveryMethod === 'delivery' ? district : undefined,
      paymentMethod
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Pago Seguro</h1>

          {/* Step 1: Delivery Method */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-slate-800 font-display">Método de Entrega</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Option */}
              <label 
                className={`relative flex cursor-pointer rounded-xl border p-5 transition-all ${
                  deliveryMethod === 'delivery' 
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="delivery_method" 
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                  className="sr-only" 
                />
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
              </label>

              {/* Pickup Option */}
              <label 
                className={`relative flex cursor-pointer rounded-xl border p-5 transition-all ${
                  deliveryMethod === 'pickup' 
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="delivery_method" 
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="sr-only" 
                />
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
              </label>
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
              {/* Card option */}
              <label 
                className={`flex cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="sr-only" 
                />
                <span className="flex items-center gap-3 w-full">
                  <CreditCard className="text-secondary w-5 h-5 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">Tarjeta de Crédito o Débito (Visa, Mastercard, AMEX)</span>
                  {paymentMethod === 'card' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </label>

              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50/50 rounded-xl p-4 border border-gray-150 space-y-4 pl-12"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Número de Tarjeta</label>
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
                        if (parts.length > 0) {
                          setCardNumber(parts.join(' '));
                        } else {
                          setCardNumber(v);
                        }
                      }}
                      maxLength={19}
                      className="w-full rounded-xl border-gray-200 bg-white py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors"
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">MM/YY</label>
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
                        className="w-full rounded-xl border-gray-200 bg-white py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">CVC</label>
                      <input 
                        type="password"
                        placeholder="123"
                        value={cvc}
                        onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                        className="w-full rounded-xl border-gray-200 bg-white py-3 px-4 focus:ring-secondary focus:border-secondary transition-colors text-center"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Plin / Yape */}
              <label 
                className={`flex cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'digital_wallet' 
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="digital_wallet"
                  checked={paymentMethod === 'digital_wallet'}
                  onChange={() => setPaymentMethod('digital_wallet')}
                  className="sr-only" 
                />
                <span className="flex items-center gap-3 w-full">
                  <span className="p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg text-white font-black text-[9px] w-6 h-6 flex items-center justify-center shrink-0">Y/P</span>
                  <span className="font-bold text-slate-900 text-sm">Plin / Yape (Pago QR Inmediato)</span>
                  {paymentMethod === 'digital_wallet' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </label>

              {paymentMethod === 'digital_wallet' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center text-center space-y-2 pl-12"
                >
                  <p className="font-bold text-sm text-slate-700">Código QR para Pago</p>
                  <p className="text-xs text-gray-500 max-w-sm">Escanea este código desde tu aplicación de Yape o Plin al pulsar "Confirmar Pedido".</p>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block">
                    {/* Simulated QR Code structure */}
                    <div className="w-32 h-32 bg-slate-100 flex flex-col items-center justify-center relative border border-slate-200">
                      <div className="grid grid-cols-4 gap-2 w-24 h-24 opacity-60">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`h-4 w-4 ${i % 3 === 0 || i % 5 === 1 ? 'bg-slate-900' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      <span className="absolute text-[10px] bg-white px-2 py-0.5 border border-gray-200 font-extrabold text-indigo-700 rounded-md">MIKE'S PIZZA</span>
                    </div>
                  </div>
                  <p className="font-bold text-xs text-secondary mt-1">Celular para Plin/Yape: 987 654 321</p>
                </motion.div>
              )}

              {/* Cash option */}
              <label 
                className={`flex cursor-pointer rounded-xl border p-4 items-center transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-secondary bg-emerald-50/20 ring-1 ring-secondary' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="sr-only" 
                />
                <span className="flex items-center gap-3 w-full">
                  <span className="font-bold text-secondary font-sans shrink-0">&#x1F4B5;</span>
                  <span className="font-bold text-slate-900 text-sm">Efectivo contra entrega / Pago contra entrega</span>
                  {paymentMethod === 'cash' && (
                    <CheckCircle className="text-secondary w-5 h-5 ml-auto shrink-0 fill-secondary text-white" />
                  )}
                </span>
              </label>

              {paymentMethod === 'cash' && (
                <div className="text-xs text-gray-500 pl-12">
                  * El repartidor llevará cambio para billetes de S/ 100.00 o S/ 50.00.
                </div>
              )}
            </div>
          </section>
        </form>

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
                      src={item.image} 
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
            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="rounded border-gray-300 text-secondary focus:ring-secondary mt-1 shrink-0"
              />
              <span className="text-xs text-gray-500 leading-tight">
                Acepto los <a href="#" onClick={(e) => { e.preventDefault(); alert('Políticas de Mike\'s Oven: tu pizza fresca artesanal se prepara con ingredientes de Km 0 y llega en menos de 45 mins.'); }} className="text-secondary hover:underline font-semibold">Términos y Condiciones</a> y entiendo las políticas de entrega fresca de Mike's Oven.
              </span>
            </label>

            {/* Confirm button */}
            <button 
              onClick={handleSubmit}
              className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-extrabold py-4 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider text-sm active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" /> Confirmar Pedido
            </button>

            <div className="flex justify-center items-center gap-1.5 text-xs text-gray-400 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conexión cifrada de 256 bits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
