import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, SlidersHorizontal, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data';

interface MenuViewProps {
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, size?: string) => void;
  menuItems?: MenuItem[];
}

export default function MenuView({ onSelectItem, onAddToCart, menuItems: menuItemsProp }: MenuViewProps) {
  // Filters State
  const [selectedSize, setSelectedSize] = useState<'Personal' | 'Mediana' | 'Familiar' | 'Mega'>('Mediana');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('Relevancia');

  // Category change wrapper
  const handleToggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const menuItems = menuItemsProp || INITIAL_MENU_ITEMS;
  const knownCategoryOrder = ['Clásicas', 'Especialidades', 'Vegetarianas', 'Complementos', 'Bebidas', 'Postres'];
  const availableCategories = Array.from(new Set(menuItems.map(item => item.category)));
  const allCategories = [
    ...knownCategoryOrder.filter(cat => availableCategories.includes(cat)),
    ...availableCategories.filter(cat => !knownCategoryOrder.includes(cat)).sort(),
  ];

  useEffect(() => {
    if (allCategories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(allCategories);
    }
  }, [allCategories, selectedCategories]);

  // Filter & sort logic
  const filteredItems = menuItems.filter(item => {
    // If pizza (is in 'Clásicas', 'Especialidades', 'Vegetarianas'), verify if selected
    // If not pizza (Complementos, Bebidas, Postres), we can show them if their category is checked, 
    // or if the categories filters represent ALL categories, let's keep them readable!
    // Simply: match item.category. If list includes item.category, show.
    // If no category selected (fallback), show all.
    return selectedCategories.includes(item.category);
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'Precio: Menor a Mayor') {
      return a.price - b.price;
    }
    if (sortBy === 'Precio: Mayor a Menor') {
      return b.price - a.price;
    }
    return 0; // Default relevance
  });

  // Calculate dynamic size modifier for price showcase
  const getSizeMultiplier = (size: string) => {
    switch (size) {
      case 'Personal': return 0.8;
      case 'Mediana': return 1.0;
      case 'Familiar': return 1.4;
      case 'Mega': return 1.8;
      default: return 1.0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full flex flex-col md:flex-row gap-8"
    >
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-secondary font-display mb-2 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filtros
          </h2>
          <div className="h-1 w-12 bg-primary-container rounded-full mb-6"></div>
        </div>

        {/* Size selection */}
        <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,10,5,0.01)] border border-gray-100">
          <h3 className="font-bold text-sm text-on-surface-variant font-display mb-4 uppercase tracking-wider">Tamaño Pizza</h3>
          <div className="flex flex-wrap gap-2">
            {(['Personal', 'Mediana', 'Familiar', 'Mega'] as const).map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Categories selector */}
        <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,10,5,0.01)] border border-gray-100">
          <h3 className="font-bold text-sm text-on-surface-variant font-display mb-4 uppercase tracking-wider">Categorías</h3>
          <div className="space-y-3">
            {allCategories.map(cat => (
              <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleToggleCategory(cat)}
                  className="form-checkbox h-5 w-5 text-primary-container border-outline rounded bg-surface focus:ring-primary-container transition-colors"
                />
                <span className="font-sans text-sm text-on-surface group-hover:text-primary transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Menu Main Contents */}
      <section className="flex-grow">
        
        {/* Header Title & Sorting drop-down */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-secondary font-display">
            {selectedCategories.length === 1 ? `Pizzas ${selectedCategories[0]}` : 'Nuestras Pizzas & Menú'}
          </h1>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface-container-highest text-on-surface-variant font-bold text-xs py-2.5 pl-4 pr-10 rounded-lg border-none focus:ring-2 focus:ring-primary-container focus:outline-none cursor-pointer font-sans"
            >
              <option>Ordenar por: Relevancia</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-xs font-bold">
              ▼
            </span>
          </div>
        </div>

        {/* Grid display */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
            <p className="text-on-surface-variant text-lg">No encontramos productos en esta combinación de filtros.</p>
            <button 
              onClick={() => setSelectedCategories([...allCategories])}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Mostrar todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((pizza) => {
              // Calculate specific base price modified by chosen general size filter if pizza, or baseline price if complement
              const basePrice = pizza.price;
              const isPizza = ['Clásicas', 'Especialidades', 'Vegetarianas'].includes(pizza.category);
              const calculatedPrice = isPizza ? basePrice * getSizeMultiplier(selectedSize) : basePrice;

              return (
                <div
                  key={pizza.id}
                  className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,10,3,0.01)] hover:shadow-[0px_12px_32px_rgba(0,90,49,0.06)] transition-all duration-300 flex flex-col group border border-gray-100"
                >
                  {/* Photo representation */}
                  <div 
                    onClick={() => onSelectItem(pizza)}
                    className="relative aspect-video overflow-hidden bg-surface-container cursor-pointer"
                  >
                    <img
                      src={pizza.image || 'https://via.placeholder.com/320x180?text=Sin+imagen'}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {pizza.isPopular && (
                      <span className="absolute top-2.5 right-2.5 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                        Popular
                      </span>
                    )}
                    {pizza.isNew && (
                      <span className="absolute top-2.5 right-2.5 bg-tertiary text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                        Nuevo
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 
                      onClick={() => onSelectItem(pizza)}
                      className="text-lg font-bold text-secondary font-display mb-1.5 hover:text-primary cursor-pointer"
                    >
                      {pizza.name}
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant flex-grow line-clamp-2 leading-relaxed mb-4">
                      {pizza.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-display">
                          {isPizza ? `Desde (${selectedSize})` : 'Precio'}
                        </span>
                        <span className="text-xl font-bold text-secondary font-display">
                          S/ {calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      {isPizza ? (
                        <button
                          onClick={() => onSelectItem(pizza)}
                          className="bg-primary-container text-on-primary-container font-semibold hover:bg-primary hover:text-white transition-all text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          Personalizar
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCart(pizza)}
                          className="bg-primary text-white font-semibold hover:bg-secondary transition-all text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}
