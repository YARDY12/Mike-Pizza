import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Check, Leaf } from 'lucide-react';
import { OFFERS } from '../data';
import { MenuItem } from '../types';

interface OffersViewProps {
  onAddToCart: (item: MenuItem, size?: string) => void;
}

export default function OffersView({ onAddToCart }: OffersViewProps) {
  const [activeTab, setActiveTab] = useState<string>('Todas');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  // Filter logic
  const filteredOffers = OFFERS.filter(offer => {
    if (activeTab === 'Todas') return true;
    return offer.category === activeTab;
  });

  const handleAddOfferToCart = (offer: typeof OFFERS[0]) => {
    const item: MenuItem = {
      id: offer.id,
      name: offer.name,
      description: offer.description,
      price: offer.price,
      image: offer.image,
      category: 'Clásicas'
    };
    onAddToCart(item, offer.id.includes('familiar') || offer.id.includes('xl') ? 'Familiar' : 'Mediana');

    // Trigger visual checked state
    setAddedItemIds(prev => [...prev, offer.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== offer.id));
    }, 2000);
  };

  const tabs = ['Todas', 'Combos Familiares', 'Individuales', 'Vegetarianas', 'Sin Gluten'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full font-display"
    >
      {/* Featured Weekly Promotion Hero */}
      <section className="relative mb-12 rounded-xl overflow-hidden min-h-[380px] flex items-center bg-emerald-900 border border-emerald-950 shadow-md">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkBN_PMGls3z7gp0DIOGf60HqR4t6DwfJoiEFxg_UQiPfT0CFHtOPL48V4UO_k9kJfXQvgHjclLQhVSctvQDkyck6KftEubz8E7ggOv27u1UzwlvaJd2YCDr9bugkLQB_S9LFJJJ3vR3NwM-IL3W2EpgPGpX2Pzvp4rj47nSBc2s1z_S5v5lCjJwtHyxpSDaH0MmY6DM-yT7AvP19xhL3bvMvnAdSyPGdWxkuvzzqKbe7n7ay7HKRvybVmXlOJOnR4oRZU0gryDsA" 
            alt="Detalle de horno de piedra en acción con chispas de fuego" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent"></div>

        <div className="relative z-10 p-8 md:p-12 lg:w-2/3 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1 bg-primary-container text-on-primary-container font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Oferta de la Semana
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            El Combo Granjero Artesanal
          </h1>
          <p className="font-sans text-emerald-100 text-sm md:text-base leading-relaxed max-w-xl opacity-90">
            Disfruta de nuestra pizza insignia de masa madre de 48h, 2 limonadas naturales de hierba buena y un dulce postre rústico recién horneado. Ingredientes frescos directo de la granja a tu mesa.
          </p>
          <div className="flex flex-wrap gap-4 items-center mt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
              <span className="block text-emerald-200 text-xs line-through opacity-70">Antes S/ 65.00</span>
              <span className="block font-black text-primary-container text-3xl font-display">S/ 42.90</span>
            </div>
            <button 
              onClick={() => handleAddOfferToCart({
                id: 'combo-granjero-semanal',
                name: 'El Combo Granjero Artesanal',
                description: 'Granjero Pizza + 2 Limonadas + 1 Postre Rústico',
                price: 42.90,
                originalPrice: 65.00,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkBN_PMGls3z7gp0DIOGf60HqR4t6DwfJoiEFxg_UQiPfT0CFHtOPL48V4UO_k9kJfXQvgHjclLQhVSctvQDkyck6KftEubz8E7ggOv27u1UzwlvaJd2YCDr9bugkLQB_S9LFJJJ3vR3NwM-IL3W2EpgPGpX2Pzvp4rj47nSBc2s1z_S5v5lCjJwtHyxpSDaH0MmY6DM-yT7AvP19xhL3bvMvnAdSyPGdWxkuvzzqKbe7n7ay7HKRvybVmXlOJOnR4oRZU0gryDsA',
                category: 'Combos Familiares'
              })}
              className="bg-tertiary text-white font-bold px-8 py-4 rounded-lg hover:bg-secondary transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              Comprar Ahora S/ 42.90
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs Chips */}
      <div className="flex flex-wrap gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs border cursor-pointer transition-all duration-300 ${
              activeTab === tab
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm'
                : 'bg-white text-on-surface-variant border-gray-200 hover:border-lime-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <AnimatePresence mode="popLayout">
          {filteredOffers.map((offer) => {
            const isAdded = addedItemIds.includes(offer.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={offer.id}
                className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,10,3,0.01)] hover:shadow-[0px_12px_32px_rgba(0,90,49,0.06)] border border-gray-100 group transition-all flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    src={offer.image} 
                    alt={offer.name} 
                  />
                  {offer.badge && (
                    <span className="absolute top-3 right-3 bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      {offer.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-secondary font-display group-hover:text-primary transition-colors">
                      {offer.name}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed flex-grow">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-container">
                    <div className="flex flex-col">
                      <span className="text-slate-400 line-through text-xs font-sans">S/ {offer.originalPrice.toFixed(2)}</span>
                      <span className="font-bold text-xl text-primary font-display font-black">
                        S/ {offer.price.toFixed(2)}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleAddOfferToCart(offer)}
                      disabled={isAdded}
                      className={`font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                        isAdded 
                          ? 'bg-secondary text-white' 
                          : 'bg-tertiary text-white hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          ¡Añadido!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Agregar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* Freshness Timeline Tracker Metaphor ("Tu frescura garantizada") */}
      <section className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,10,3,0.01)] border border-gray-100 mb-8 flex flex-col items-center">
        <h2 className="text-xl font-bold text-secondary font-display mb-8 text-center flex items-center justify-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Tu frescura garantizada
        </h2>
        
        <div className="relative flex justify-between w-full max-w-2xl items-center mb-6">
          {/* Connecting line */}
          <div className="absolute h-0.5 bg-primary-container w-full top-1/2 -translate-y-1/2 z-0"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container shadow ring-4 ring-secondary-container">
              🌱
            </div>
            <span className="font-bold text-[10px] tracking-wider uppercase font-sans text-on-surface">Cosechado</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-white border-2 border-primary-container rounded-full flex items-center justify-center text-primary shadow">
              👨‍🍳
            </div>
            <span className="font-bold text-[10px] tracking-wider uppercase font-sans text-slate-400">Preparado</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-300 shadow">
              🔥
            </div>
            <span className="font-bold text-[10px] tracking-wider uppercase font-sans text-slate-400">Al Horno</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-300 shadow">
              🛵
            </div>
            <span className="font-bold text-[10px] tracking-wider uppercase font-sans text-slate-400">En Camino</span>
          </div>
        </div>
        <p className="text-center font-sans text-xs text-on-surface-variant max-w-md mt-2">
          Cada ingrediente delicado es seleccionado de la granja local esta misma mañana antes de preparar tu pedido.
        </p>
      </section>
    </motion.div>
  );
}
