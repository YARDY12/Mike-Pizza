import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Plus, Minus, ShoppingBasket, MapPin, 
  CreditCard, Check, Ticket, ChevronRight, CheckCircle, 
  Sparkles, Wallet, Flame, Milestone
} from 'lucide-react';
import { CartItem, MenuItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  user: { fullName: string; email: string; isAuthenticated: boolean };
  onNavigate: (view: string) => void;
  onPlaceOrder: (orderData: {
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    paymentMethod: 'card' | 'digital_wallet' | 'cash';
    lat?: number;
    lng?: number;
  }) => Promise<void>;
}

export default function CartView({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  user,
  onNavigate,
  onPlaceOrder
}: CartViewProps) {
  
  // Checkout Steps: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Promo Code States
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Checkout Form States
  const [formName, setFormName] = useState(user.fullName || '');
  const [formEmail, setFormEmail] = useState(user.email || '');
  const [formPhone, setFormPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Domicilio' | 'Recojo'>('Domicilio');
  const [formAddress, setFormAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Yape' | 'Efectivo'>('Tarjeta');
  const [formError, setFormError] = useState('');

  // Auto-calculated order ID when placed
  const [confirmedOrderId, setConfirmedOrderId] = useState('MK-1024');

  // Compute Subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Discount reduction
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    return subtotal * (appliedDiscount.percent / 100);
  }, [subtotal, appliedDiscount]);

  // Delivery Cost (S/ 5.00 for Domicilio, S/ 0.00 for Recojo)
  const deliveryFee = deliveryMethod === 'Domicilio' ? 5.00 : 0.00;

  // Final total
  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [subtotal, discountAmount, deliveryFee]);

  // Validate Promo Code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'MIKES10') {
      setAppliedDiscount({ code: 'MIKES10', percent: 10 });
      setPromoError('');
    } else if (cleanCode === 'FRESCO20') {
      setAppliedDiscount({ code: 'FRESCO20', percent: 20 });
      setPromoError('');
    } else {
      setPromoError('Cupón inválido. Intenta con MIKES10 (10% OFF)');
    }
  };

  // Submit Checkout order to backend
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) {
      setFormError('Por favor completa todos los campos requeridos de contacto.');
      return;
    }
    if (deliveryMethod === 'Domicilio' && !formAddress) {
      setFormError('La dirección de entrega es obligatoria para envíos a domicilio.');
      return;
    }

    try {
      await onPlaceOrder({
        deliveryMethod: deliveryMethod === 'Domicilio' ? 'delivery' : 'pickup',
        address: formAddress,
        district: 'Miraflores', // TODO: obtener de UI
        paymentMethod: paymentMethod === 'Tarjeta' ? 'card' : paymentMethod === 'Yape' ? 'digital_wallet' : 'cash',
      });
      // Success is handled by App.tsx callback; just update UI here
      const randomId = `MK-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(randomId);
      setFormError('');
      setStep('success');
    } catch (err: any) {
      setFormError(err?.message || 'Error al procesar el pedido. Intenta de nuevo.');
    }
  };

  const handleFinishSuccess = () => {
    onClearCart();
    onNavigate('home');
  };

  // Success screen tracker simulated timeline
  const orderTrackSteps = [
    { title: 'Pedido Confirmado', icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, desc: 'La granja ya está seleccionando los ingredientes', active: true },
    { title: 'En Amasado', icon: <Flame className="w-5 h-5 text-amber-500 animate-pulse" />, desc: 'Nuestra masa de 48h recibe su toque manual rústico', active: true },
    { title: 'Al Horno de Piedra', icon: '🔥', desc: 'Cocción explosiva a máxima temperatura', active: false },
    { title: 'Entregando Frescura', icon: <Milestone className="w-5 h-5 text-slate-300" />, desc: 'Ya casi tocamos tu puerta', active: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full font-display">
      
      {/* Step Indicators Header */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-on-surface-variant font-semibold mb-8 border-b border-surface-container pb-4 font-sans justify-center">
          <span className={step === 'cart' ? 'text-secondary font-black font-display font-bold' : ''}>1. Mi Carrito</span>
          <ChevronRight className="w-4 h-4 text-outline" />
          <span className={step === 'checkout' ? 'text-secondary font-black font-display font-bold' : ''}>2. Dirección de Envío</span>
          <ChevronRight className="w-4 h-4 text-outline" />
          <span className="text-slate-300">3. Confirmación</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 1: CART LIST & SUMMARY */}
        {step === 'cart' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            key="cart"
            className="flex flex-col lg:flex-row gap-10 items-start"
          >
            {/* Products List Column */}
            <div className="flex-grow w-full space-y-6">
              <h1 className="text-3xl font-extrabold text-secondary mb-2 flex items-center gap-2">
                <ShoppingBasket className="w-8 h-8 text-primary" />
                Tu Carrito
              </h1>
              
              {cart.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-[0px_4px_22px_rgba(0,10,5,0.01)] flex flex-col items-center">
                  <span className="text-5xl mb-4">🍕</span>
                  <h3 className="font-bold text-lg text-secondary font-display mb-2">Tu carrito está vacío</h3>
                  <p className="font-sans text-sm text-on-surface-variant mb-6 max-w-sm">
                    Añade deliciosas pizzas de masa madre y complementos rústicos de la granja a tu pedido.
                  </p>
                  <button 
                    onClick={() => onNavigate('menu')}
                    className="bg-primary text-white text-xs font-bold px-6 py-3 rounded-lg hover:bg-secondary cursor-pointer"
                  >
                    Explorar el Menú
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.cartId}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0px_4px_20px_rgba(0,10,3,0.01)] hover:shadow-[0px_8px_24px_rgba(0,90,49,0.03)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg bg-surface border border-gray-100 shrink-0" 
                          src={item.image || 'https://via.placeholder.com/96?text=Sin+imagen'} 
                        />
                        <div>
                          <h3 className="font-bold text-secondary text-base mb-1 font-display">{item.name}</h3>
                          
                          {/* Selected Customization Options */}
                          {item.customization ? (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="bg-surface-container-highest text-on-surface-variant font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
                                {item.customization.size}
                              </span>
                              <span className="bg-secondary/10 text-secondary font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
                                {item.customization.crust}
                              </span>
                              {item.customization.toppings.length > 0 && (
                                <span className="bg-primary/10 text-primary font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
                                  {item.customization.toppings.length} Extras
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
                              Mediana Estándar
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Control Block */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                        {/* Incrementor/Decrementor */}
                        <div className="flex items-center border border-outline-variant rounded bg-white font-sans overflow-hidden">
                          <button 
                            onClick={() => onUpdateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-slate-50 text-on-surface-variant cursor-pointer"
                            aria-label="Reducir"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-sm text-secondary px-3 select-none">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                            className="p-2 hover:bg-slate-50 text-on-surface-variant cursor-pointer"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Calculated pricing details */}
                        <div className="flex flex-col items-end shrink-0 min-w-[80px]">
                          <span className="text-sm font-black text-secondary font-display font-bold">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Eliminator Trigger */}
                        <button 
                          onClick={() => onRemoveItem(item.cartId)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg cursor-pointer"
                          aria-label="Borrar producto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown Sidebar Column */}
            {cart.length > 0 && (
              <div className="w-full lg:w-96 shrink-0 space-y-6">
                {/* Cupon validation */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0px_4px_22px_rgba(0,10,5,0.01)]">
                  <h3 className="font-bold text-sm text-secondary uppercase tracking-wider font-display mb-3 flex items-center gap-1">
                    <Ticket className="w-4 h-4 text-primary" />
                    Cupón de Descuento
                  </h3>
                  <form onSubmit={handleApplyPromo} className="flex gap-2 font-sans">
                    <input 
                      type="text" 
                      placeholder="Ej: MIKES10" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-surface border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm flex-grow focus:outline-none focus:border-secondary uppercase"
                    />
                    <button type="submit" className="bg-primary hover:bg-secondary text-white text-xs font-bold px-4 py-2.5 rounded-lg active:scale-95 cursor-pointer">
                      Aplicar
                    </button>
                  </form>
                  {appliedDiscount && (
                    <div className="mt-3 bg-emerald-50 text-emerald-700 text-xs py-2 px-3 rounded-lg flex items-center justify-between border border-emerald-100 font-sans">
                      <span className="font-semibold">¡Cupón {appliedDiscount.code} Aplicado!</span>
                      <span className="font-bold">-{appliedDiscount.percent}%</span>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-red-500 font-medium text-xs mt-2 font-sans">{promoError}</p>
                  )}
                </div>

                {/* Totals Summary */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0px_4px_22px_rgba(0,10,10,0.02)] flex flex-col gap-4">
                  <h3 className="font-bold text-sm text-secondary uppercase tracking-wider font-display border-b border-surface-container pb-3">
                    Resumen del Pedido
                  </h3>

                  <div className="space-y-2.5 font-sans text-sm text-on-surface-variant">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="font-semibold text-secondary">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center text-emerald-600">
                        <span>Descuento ({appliedDiscount.code})</span>
                        <span className="font-semibold">-S/ {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Costo de envío</span>
                      <span className="font-semibold text-secondary">
                        {deliveryFee === 0 ? 'Gratis' : `S/ ${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="h-[1px] bg-slate-100 w-full my-1"></div>
                    <div className="flex justify-between items-center text-secondary text-lg font-bold font-display">
                      <span>Total</span>
                      <span className="text-2xl font-black text-primary">S/ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!user.isAuthenticated) {
                        alert('¡Hola! Para proceder al pago de tu pedido, es obligatorio que inicies sesión o te registres primero.');
                        onNavigate('login');
                      } else {
                        setStep('checkout');
                      }
                    }}
                    className="w-full bg-secondary text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-md mt-4 text-sm cursor-pointer"
                  >
                    Continuar con el Pedido
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: SHIPPING ADDRESSES & CHECKOUT */}
        {step === 'checkout' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            key="checkout"
            className="flex flex-col lg:flex-row gap-10 items-start"
          >
            {/* Delivery Form */}
            <div className="flex-grow w-full bg-white p-8 rounded-xl border border-gray-100 shadow-[0px_4px_22px_rgba(0,10,3,0.01)]">
              <h1 className="text-2xl font-extrabold text-secondary font-display mb-6">
                Dirección de Envío & Datos
              </h1>
              
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {formError && (
                  <div className="bg-error-container text-on-error-container text-xs p-4 rounded-lg border border-red-200">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Nombre Completo *</label>
                    <input 
                      type="text"
                      className="w-full bg-surface border border-outline-variant rounded-lg p-3.5 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej: Marcelo Ramos"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Correo Electrónico *</label>
                    <input 
                      type="email"
                      className="w-full bg-surface border border-outline-variant rounded-lg p-3.5 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Teléfono Móvil *</label>
                    <input 
                      type="tel"
                      className="w-full bg-surface border border-outline-variant rounded-lg p-3.5 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Ej: +51 987 654 321"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('Domicilio')}
                        className={`py-3 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                          deliveryMethod === 'Domicilio' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                        }`}
                      >
                        Domicilio
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('Recojo')}
                        className={`py-3 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                          deliveryMethod === 'Recojo' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                        }`}
                      >
                        Recoger en Tienda
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conditional physical address with Location Pin decoration */}
                {deliveryMethod === 'Domicilio' && (
                  <div className="space-y-1 font-sans">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Dirección Completa de Envío *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <MapPin className="w-5 h-5 text-primary" />
                      </span>
                      <input 
                        type="text"
                        className="w-full bg-surface border border-outline-variant rounded-lg py-3.5 pl-11 pr-4 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="Ej: Av. Primavera 1230, San Borja, Lima"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Payment selectors */}
                <div className="pt-4 font-sans">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Método de Pago</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Tarjeta')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'Tarjeta'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">Tarjeta</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Yape')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'Yape'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                      }`}
                    >
                      <Wallet className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-bold">Yape / Plin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Efectivo')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'Efectivo'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant bg-white text-on-surface-variant hover:border-outline'
                      }`}
                    >
                      <span>💸</span>
                      <span className="text-xs font-bold">Efectivo</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-surface-container">
                  <button 
                    type="button" 
                    onClick={() => setStep('cart')}
                    className="text-on-surface-variant font-bold hover:text-secondary text-sm cursor-pointer"
                  >
                    Volver al Carrito
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-white font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-colors shadow-md text-sm cursor-pointer"
                  >
                    Realizar Pedido
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Invoice Summary Recap */}
            <div className="w-full lg:w-96 shrink-0 bg-white p-6 rounded-xl border border-gray-100 shadow-[0px_4px_22px_rgba(0,10,10,0.01)] flex flex-col gap-4 font-sans text-sm text-on-surface-variant">
              <h3 className="font-bold text-sm text-secondary uppercase tracking-wider font-display border-b border-surface-container pb-3">
                Tu Carrito
              </h3>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-start gap-2 text-xs">
                    <div className="flex-grow">
                      <p className="font-bold text-secondary font-display">{item.name} <span className="text-xs text-on-surface-variant">x{item.quantity}</span></p>
                      {item.customization && <p className="text-[10px] text-on-surface-variant italic leading-relaxed">{item.customization.size} • {item.customization.crust}</p>}
                    </div>
                    <span className="font-bold text-secondary shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="h-[1px] bg-slate-100 w-full my-2"></div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Descuento</span>
                    <span>-S/ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{deliveryFee === 0 ? 'Gratis' : `S/ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-black font-extrabold text-base pt-2 font-display">
                  <span>Total Neto</span>
                  <span className="text-primary font-black">S/ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ORDER CONFIRMED SUCCESS & REAL-TIME TRACKING */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            key="success"
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Confirmation header stamp */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0px_12px_32px_rgba(0,90,49,0.05)] w-full text-center flex flex-col items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
              </div>
              <h1 className="text-3xl font-extrabold text-secondary font-display">¡Pedido Confirmado!</h1>
              <p className="font-sans text-emerald-800 bg-emerald-50 text-xs px-3 py-1.5 rounded-full font-bold">¡Gracias por tu compra, {formName}!</p>
              <p className="font-sans text-sm text-on-surface-variant max-w-md leading-relaxed">
                Tu orden <span className="font-bold text-secondary">#{confirmedOrderId}</span> está siendo preparada con insumos frescos de la granja de Mike.
              </p>
            </div>

            {/* Simulated Realtime Track Timeline display */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0px_4px_20px_rgba(0,10,3,0.01)] w-full mb-8 font-sans">
              <h3 className="font-display font-bold text-lg text-secondary mb-6 text-center">Estado del Pedido en Tiempo Real</h3>
              <div className="space-y-6">
                {orderTrackSteps.map((track, i) => (
                  <div key={track.title} className="flex gap-4 relative">
                    {/* Connecting vertical line helper */}
                    {i < orderTrackSteps.length - 1 && (
                      <div className={`absolute left-[13px] top-[26px] bottom-[-22px] w-[2px] ${track.active ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    )}
                    
                    <div className="shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm ring-4 ring-offset-1 ${
                        track.active ? 'bg-primary text-white ring-emerald-100' : 'bg-slate-100 text-slate-300 ring-slate-50'
                      }`}>
                        {track.icon}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-sm font-bold font-display ${track.active ? 'text-secondary' : 'text-slate-400'}`}>
                        {track.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-sans mt-0.5">{track.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recap specifications and checkout properties */}
            <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 w-full font-sans text-xs text-on-surface-variant space-y-3.5 mb-8">
              <h4 className="font-display font-extrabold text-sm text-secondary uppercase border-b border-gray-100 pb-2">Resumen de Entrega</h4>
              <div className="flex justify-between">
                <span>Dirección</span>
                <span className="font-bold text-secondary text-right max-w-xs">{formAddress || 'Recojo en Local'}</span>
              </div>
              <div className="flex justify-between">
                <span>Método de Entrega</span>
                <span className="font-bold text-secondary">{deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Método de Pago</span>
                <span className="font-bold text-secondary">{paymentMethod === 'Tarjeta' ? 'Tarjeta de Crédito' : paymentMethod === 'Yape' ? 'Yape / Plin' : 'Efectivo'}</span>
              </div>
              <div className="flex justify-between text-sm text-black pt-2 font-display border-t border-gray-100">
                <span className="font-bold">Total Pagado</span>
                <span className="text-primary font-black text-lg">S/ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Follow checkout details CTA */}
            <button 
              onClick={handleFinishSuccess}
              className="bg-primary text-white font-bold py-3.5 px-10 rounded-full hover:bg-secondary active:scale-95 transition-all shadow-md text-sm cursor-pointer"
            >
              Seguir Comprando
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
