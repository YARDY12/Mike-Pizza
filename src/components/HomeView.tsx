import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onAddToCart: (item: MenuItem, size?: string) => void;
}

export default function HomeView({ onNavigate, onAddToCart }: HomeViewProps) {
  // Extract specific promo pizzas
  const featuredPizzas = [
    {
      id: 'combo-margherita',
      name: 'Combo Margherita',
      desc: '1 Familiar Margherita Pizza + 1 Garlic Bread + 1L Soda.',
      price: 39.90,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARjprN7fU58PlzXdnf5DNQIRJFmCwIzdwJXglNBUM3t6Xc0kU7AKR40GpWAyS10j5gAG46dlPzdOCLLu6nDuX_FpOTE6FaJ1J_HtktizUxUspnxfjlwv_WYkI54AY0RZOrbmD_9zbvGJcLNwXuegI6Vd35jgDPNwB3AntAkaak3MURGas2-vhy6XfSSmotVCAQZtXwFsiBuGHqTbyY6FcIRLrylO_3N3QcPRPWFfhi4HZeEgW57Vrmza9ZIY7F0cRd8oiTZdEsUCs',
      badge: '-20%'
    },
    {
      id: 'duo-pepperoni',
      name: 'Duo Pepperoni',
      desc: '2 Medium Pepperoni Pizzas con extra queso fundido.',
      price: 55.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxPDiIoRI-wYgn1eLkkFrp1QGKnbOplQ4NlARovpClU9a2oh2ZFN3l7zPxXZYc4YtD0Tlddv1rc0BfioX2uxYlrYf1cGyGQDmz64U5JyQ_wKMM9DS9pdl9GZIGsA6YUGj6q1fTd7eylkQUh77CK-RnECinsxA-Ca2hk492azS_OKcod4TkYErRfj3z6TaHYokFwyb1QMKYWfugf0RElByLeuGbjnv12Zj12ey5MS7z1vqPoyhvUmG-vbbbK9U7-E_IDMBwmQHZsgE',
      badge: 'Popular'
    },
    {
      id: 'veggie-delight-combo',
      name: 'Veggie Delight',
      desc: '1 Familiar Veggie Pizza con premium toppings + 2 Dips rústicos.',
      price: 42.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IBFoMs3wt9NYEtmu1ltqMWRTBWW1u-yEpCcBLTcFB8Prpe_csP6QAo0IYnQXQCiA6Oq45llDE7UDWOHtYmEn4gTh4OnuOBefi-letHv4yxGMN49QVzuArCKJC5aKV32c7IBfosqjcnGcORZ0rX40N-NJ7G3bmTnvjENJS_LIebu4y2BsgUB1ujodZ94XuH4rEd2acaHiD5V9Z_Fkbbj9eYSKzbw5E0uA2gQcKFtZwXlWTRCw8MSYqQSbB8z_H0b0lIQCVLId3sk',
      badge: null
    }
  ];

  const handleAddComboToCart = (combo: typeof featuredPizzas[0]) => {
    // Generate actual MenuItem dynamic wrapper
    const item: MenuItem = {
      id: combo.id,
      name: combo.name,
      description: combo.desc,
      price: combo.price,
      image: combo.image,
      category: 'Clásicas'
    };
    onAddToCart(item, combo.id === 'combo-margherita' || combo.id === 'veggie-delight-combo' ? 'Familiar' : 'Mediana');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex-grow"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[580px] overflow-hidden flex items-center justify-center bg-surface-container-low font-display">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center" 
            alt="Visión completa cenital de pizza artesanal de masa madre de Mike" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp67rxbCNWJvok8FFVsgR0HqKcVVHj2vQawzmI8Sb7MTNrT2gG4lhwl5GBMGViamRXgNbJj73g4e5ojRZhM0EIgmRgkW2c16laVeWtTRZmSJzK3EGVHnrWOKAv6EmUvmXibTPCafl4K6R9Grtc-c7JmCXlE9Xm4AW_QULNaoJbnvMDlETrw1IMo5p5pQLEHy2_Y7UNXd7Uv68ioOd69SUlB-mEdrMzh7ZUDFbv1PjifxCi3TUM4ffzcZ50CvhvdV_xSrlMgZiUxiU"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/75 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center items-start space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-container text-on-primary-container font-semibold text-xs rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Recién salido del horno
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              Pizza artesanal,<br />
              <span className="text-secondary">elaborada con pasión</span>
            </h1>
            <p className="font-sans text-on-surface-variant max-w-md leading-relaxed text-base lg:text-lg">
              Disfruta de la combinación perfecta entre ingredientes frescos de origen local y los métodos tradicionales de horneado en horno de piedra volcánica. Prueba hoy mismo la auténtica diferencia.
            </p>
            <button 
              onClick={() => onNavigate('menu')}
              className="bg-primary text-white font-bold px-8 py-4 rounded-lg hover:bg-secondary active:scale-95 transition-all shadow-md flex items-center gap-2 mt-4 cursor-pointer"
            >
              Pedir Ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Promociones Destacadas */}
      <section className="py-16 bg-surface-bright font-display">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-on-surface mb-2">Promociones Destacadas</h2>
              <p className="font-sans text-on-surface-variant text-sm md:text-base">Nuestras mejores ofertas, recién salidas del horno para deleitarte</p>
            </div>
            <button 
              onClick={() => onNavigate('offers')}
              className="text-primary font-bold text-sm flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
            >
              Ver Todas las Ofertas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPizzas.map((combo) => (
              <div 
                key={combo.id}
                className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,10,5,0.02)] group hover:shadow-[0px_12px_32px_rgba(0,90,49,0.06)] transition-all duration-300 flex flex-col border border-gray-100"
              >
                <div className="h-48 overflow-hidden relative bg-gray-50">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={combo.image} 
                    alt={combo.name} 
                  />
                  {combo.badge && (
                    <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary font-bold text-xs px-3 py-1 rounded-full shadow">
                      {combo.badge}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-secondary mb-2">{combo.name}</h3>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed flex-grow">{combo.desc}</p>
                  
                  <div className="mt-6 pt-4 flex items-center justify-between border-t border-surface-container">
                    <span className="text-2xl font-black text-secondary font-display">S/ {combo.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddComboToCart(combo)}
                      className="bg-primary text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías (Bento Grid Style) */}
      <section className="py-16 bg-surface-container-low font-display">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-on-surface mb-2">Explorar Categorías</h2>
            <p className="font-sans text-on-surface-variant">Encuentra justo lo que te apetece hoy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[550px]">
            {/* Pizzas (Large Cell) */}
            <div 
              onClick={() => onNavigate('menu')}
              className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group shadow-[0px_4px_20px_rgba(0,0,0,0.02)] cursor-pointer min-h-[250px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGzhiQOoFir-5sp4-MSsEK_HInRhYQ1CI2pGdLTbUO5w-N9Gj0gg0eHMWE-jyvzUqwQ6wwnwhLNro7GZ6nC-AVYwjWPYEFSheQDevvdP8cQFhn3owb5yHLGPle8LdXBKwyzxK7OfXs_1nFX30iMa1P10utaXRsLcS8iHDN2WMzJkOOfCEw135ghf9aY5bUEpYrlWqAx7rSH4cDlMg4o_Uh5qRblW1JFZjhscyWG4HLdFRqeY64KcMH-SNmfkbofgqV9B4WvfkEM8E" 
                alt="Pizzas rústicas de Mike" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-black text-white mb-2">Pizzas</h3>
                <p className="font-sans text-sm text-white/90 flex items-center gap-1">
                  Mirar todo el Menú <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </div>

            {/* Complementos (Medium Cell) */}
            <div 
              onClick={() => onNavigate('menu')}
              className="md:col-span-2 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-[0px_4px_20px_rgba(0,0,0,0.02)] cursor-pointer min-h-[180px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjmS3a20o-LJLA-za5PARg6SCBJY8pwW3ZJ9q1Zd5JB1VpBuRCH_vO5kcZM43SkMS0aFiEKEE4CvWCpeSkgbA6ozEqzwMhOW3h1vTEKYQV7J7G4PSeZ2XaXstIO5GuZ5IR5hMxQwivCQ9u_cA6Cx-_NjjWWSJz2pFM48RNwRvFlQLxauhcMRef49IxcyWSSJCOc8Pj72GP0Vj6mOEpuc7X2EqM8JNr7NWQBk9XBBR0dGBzeX5m1h21AVzerO0E7yYUE71LBuW_IQ" 
                alt="Acompañamientos" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-black text-white mb-1">Complementos</h3>
                <p className="font-sans text-xs text-white/95">Pan de ajo, nudos de ajo rústicos y más</p>
              </div>
            </div>

            {/* Bebidas */}
            <div 
              onClick={() => onNavigate('menu')}
              className="md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-[0px_4px_20px_rgba(0,0,0,0.02)] cursor-pointer min-h-[180px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwTJzwZigputMGW3tJzjmXxzMoAASK4zBgooPe95sslg10-OVp_Mhv3GWBpYTUL3w3SdNgMFuZd4sNtYJ9_uD2ZbUFojzkpCNC4G2kFj1nMbH9HGjiAopinxIc_al5g4QTeGfE2TuAhF5bj0fhaL1jOjLCEYByuTVL3BWWzEhhHgcwPPuPjnUnMLPOV9DPuUEftOqifyf7twi7nCgDhbLhWKUMNk7ssapTOYDw8m43z1XD1RT7L_8L12lNtxn2N6rZqVfMf5ipVQU" 
                alt="Bebidas naturales" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-1">Bebidas</h3>
                <p className="font-sans text-xs text-white/90">Limonadas artesanales y refrescos</p>
              </div>
            </div>

            {/* Postres */}
            <div 
              onClick={() => onNavigate('menu')}
              className="md:col-span-1 md:row-span-1 relative rounded-2xl overflow-hidden group shadow-[0px_4px_20px_rgba(0,0,0,0.02)] cursor-pointer min-h-[180px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXzNwkod4Pk5uIZgEjPV2DNKWLoanB6caDbvyLp1H6dB6h_OSPTlDvAOJiEWwkHWXFumCvoH7E6F_c34hA0mKt8EKWT3zwYY0mWwgdR3eaLcZu7LVKBqU-yhknGc5tmW2tWt5w1lbNWQgv8Ngwpvw4947FZg9Y1C2pHRQvbbEDC0RHtdWhorTxHefOupiDJE8ktsgJxxD--WcGzMATeXv5dN2GtSMhntq9-NTh25fU-cuTpbQX8z0R3fQrK5SadTbxEtbcf5TkY9w" 
                alt="Postres dulces" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-1">Postres</h3>
                <p className="font-sans text-xs text-white/90">Dulces rústicos horneados</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
