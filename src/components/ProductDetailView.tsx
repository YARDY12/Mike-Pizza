import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Plus, Minus, ShoppingBasket, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductDetailViewProps {
  selectedItem: MenuItem | null;
  onNavigate: (view: string) => void;
  onAddCustomizedToCart: (
    item: MenuItem, 
    customization: {
      size: 'Personal' | 'Mediana' | 'Familiar';
      crust: 'Masa Madre Clásica' | 'Integral' | 'Sin Gluten';
      toppings: string[];
    }, 
    quantity: number,
    finalPrice: number
  ) => void;
}

export default function ProductDetailView({ selectedItem, onNavigate, onAddCustomizedToCart }: ProductDetailViewProps) {
  // If no selected item, fallback to default Maruti pizza to ensure error-free compiling and presentation
  const pizza = selectedItem || {
    id: 'margherita-rustica',
    name: 'Margherita Rústica',
    description: 'Nuestra masa madre de 48 horas, salsa de tomates San Marzano triturados a mano, mozzarella de búfala fresca, albahaca recién cosechada y un toque de aceite de oliva extra virgen.',
    price: 45.00,
    category: 'Clásicas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo'
  };

  // Customization Core States
  const [size, setSize] = useState<'Personal' | 'Mediana' | 'Familiar'>('Mediana');
  const [crust, setCrust] = useState<'Masa Madre Clásica' | 'Integral' | 'Sin Gluten'>('Masa Madre Clásica');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // Extras configuration with added math
  const EXTRAS_OPTIONS = useMemo(() => [
    { name: 'Extra Mozzarella de Búfala', price: 8.00 },
    { name: 'Prosciutto di Parma', price: 12.00 },
    { name: 'Tomates Cherry Confitados', price: 5.00 }
  ], []);

  // Compute calculated individual price based on selections
  const calculatedPizzaPrice = useMemo(() => {
    let priceMultiplier = 1.0;
    if (size === 'Personal') priceMultiplier = 0.8;
    if (size === 'Familiar') priceMultiplier = 1.4;

    let base = pizza.price * priceMultiplier;

    // Added Crust cost
    if (crust === 'Integral') base += 3.00;
    if (crust === 'Sin Gluten') base += 6.00;

    // Added extras toppings cost
    toppings.forEach(toppingName => {
      const option = EXTRAS_OPTIONS.find(o => o.name === toppingName);
      if (option) {
        base += option.price;
      }
    });

    return base;
  }, [size, crust, toppings, pizza.price, EXTRAS_OPTIONS]);

  const handleToppingToggle = (name: string) => {
    if (toppings.includes(name)) {
      setToppings(toppings.filter(t => t !== name));
    } else {
      setToppings([...toppings, name]);
    }
  };

  const handleAddToCart = () => {
    onAddCustomizedToCart(
      pizza,
      { size, crust, toppings },
      quantity,
      calculatedPizzaPrice
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full flex flex-col font-display"
    >
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-8 font-sans">
        <button onClick={() => onNavigate('menu')} className="hover:text-primary cursor-pointer font-semibold">Menú</button>
        <ChevronRight className="w-4 h-4 text-outline" />
        <span className="text-on-surface-variant">Pizzas Artesanales</span>
        <ChevronRight className="w-4 h-4 text-outline" />
        <span className="text-on-surface font-bold font-display">{pizza.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left column: Large Pizza Image */}
        <div className="w-full">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-[0px_12px_32px_rgba(0,90,49,0.06)] bg-surface-container-low border border-gray-100 p-2">
            <img 
              alt={pizza.name} 
              className="w-full h-full object-cover rounded-xl" 
              src={pizza.image || 'https://via.placeholder.com/500?text=Sin+imagen'} 
            />
          </div>
        </div>

        {/* Right column: Customization Options */}
        <div className="flex flex-col">
          <div className="mb-8 border-b border-surface-variant pb-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-secondary mb-3 tracking-tight">
              {pizza.name}
            </h1>
            <p className="font-sans text-sm md:text-base text-on-surface-variant mb-4 leading-relaxed">
              {pizza.description}
            </p>
            <div className="text-2xl font-black text-primary">
              S/ {calculatedPizzaPrice.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Size options */}
            <div>
              <h3 className="font-bold text-sm text-on-surface mb-3 uppercase tracking-wider font-display">Tamaño</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setSize('Personal')}
                  className={`px-5 py-3 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                    size === 'Personal' 
                      ? 'bg-primary-container text-on-primary-container shadow-sm' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Personal (25cm)
                </button>
                <button 
                  onClick={() => setSize('Mediana')}
                  className={`px-5 py-3 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                    size === 'Mediana' 
                      ? 'bg-primary-container text-on-primary-container shadow-sm' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Mediana (35cm)
                </button>
                <button 
                  onClick={() => setSize('Familiar')}
                  className={`px-5 py-3 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                    size === 'Familiar' 
                      ? 'bg-primary-container text-on-primary-container shadow-sm' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Familiar (45cm)
                </button>
              </div>
            </div>

            {/* Crust selection */}
            <div>
              <h3 className="font-bold text-sm text-on-surface mb-3 uppercase tracking-wider font-display">Tipo de Masa</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setCrust('Masa Madre Clásica')}
                  className={`px-5 py-3 rounded-lg font-semibold text-xs border cursor-pointer flex items-center justify-between transition-all ${
                    crust === 'Masa Madre Clásica'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant bg-white text-on-surface hover:border-outline'
                  }`}
                >
                  Masa Madre Clásica
                </button>
                <button 
                  onClick={() => setCrust('Integral')}
                  className={`px-5 py-3 rounded-lg font-semibold text-xs border cursor-pointer flex items-center justify-between transition-all ${
                    crust === 'Integral'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant bg-white text-on-surface hover:border-outline'
                  }`}
                >
                  Integral (+ S/ 3.00)
                </button>
                <button 
                  onClick={() => setCrust('Sin Gluten')}
                  className={`px-5 py-3 rounded-lg font-semibold text-xs border cursor-pointer flex items-center justify-between transition-all ${
                    crust === 'Sin Gluten'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant bg-white text-on-surface hover:border-outline'
                  }`}
                >
                  Sin Gluten (+ S/ 6.00)
                </button>
              </div>
            </div>

            {/* Toppings Checklist */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider font-display">Extras</h3>
                <span className="font-sans text-xs text-on-surface-variant">Opcional</span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded-xl border border-gray-100">
                {EXTRAS_OPTIONS.map((option, idx) => (
                  <div key={option.name}>
                    {idx > 0 && <div className="h-[1px] bg-gray-250/30 w-full my-2"></div>}
                    <label className="flex justify-between items-center cursor-pointer py-1 group">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={toppings.includes(option.name)}
                          onChange={() => handleToppingToggle(option.name)}
                          className="form-checkbox h-5 w-5 text-primary-container border-outline rounded bg-white focus:ring-primary-container transition-colors"
                        />
                        <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors">
                          {option.name}
                        </span>
                      </div>
                      <span className="text-sm font-sans text-on-surface-variant font-medium">
                        + S/ {option.price.toFixed(2)}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-8 pt-6 border-t border-surface-variant flex gap-4 items-end">
            <div className="flex flex-col">
              <label className="font-bold text-xs text-on-surface-variant mb-2 font-sans uppercase">Cantidad</label>
              <div className="flex items-center border border-outline rounded-lg bg-white overflow-hidden height-input">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-on-surface-variant hover:text-primary hover:bg-slate-50 transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-sans font-bold text-on-surface w-8 text-center text-sm">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 text-on-surface-variant hover:text-primary hover:bg-slate-50 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-secondary text-white font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-md cursor-pointer"
            >
              <ShoppingBasket className="w-5 h-5" />
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>

      {/* Nutritional Stats */}
      <div className="mt-16 pt-8 border-t border-surface-variant">
        <h2 className="text-2xl font-black text-secondary mb-4 flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-primary" />
          Información Nutricional 
          <span className="text-on-surface-variant font-sans text-xs font-normal ml-2">
            (Por porción - 1/8 de pizza mediana)
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
            <span className="text-4xl font-extrabold text-primary font-display mb-1">210</span>
            <span className="font-bold text-xs text-on-surface-variant tracking-wider font-sans uppercase">Calorías</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
            <span className="text-4xl font-extrabold text-secondary font-display mb-1">12g</span>
            <span className="font-bold text-xs text-on-surface-variant tracking-wider font-sans uppercase">Proteínas</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
            <span className="text-4xl font-extrabold text-secondary font-display mb-1">24g</span>
            <span className="font-bold text-xs text-on-surface-variant tracking-wider font-sans uppercase">Carbohidratos</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
            <span className="text-4xl font-extrabold text-secondary font-display mb-1">8g</span>
            <span className="font-bold text-xs text-on-surface-variant tracking-wider font-sans uppercase">Grasas Totales</span>
          </div>
        </div>
        <p className="font-sans text-xs text-on-surface-variant mt-4 text-justify leading-relaxed">
          * Los valores numéricos nutricionales se calculan de manera referencial y pueden variar ligeramente según las personalizaciones elegidas, aderezos secundarios y el proceso artesanal de horneado en piedra.
        </p>
      </div>
    </motion.div>
  );
}
