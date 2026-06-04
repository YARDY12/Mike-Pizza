import { Pizza } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-100 w-full py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Pizza className="text-secondary w-6 h-6" />
            <span className="text-lg font-bold text-secondary font-display">Mike's Oven Pizza</span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Frescura en cada rebanada. Pizzas de masa madre natural recién horneadas con pasión en piedra volcánica.
          </p>
          <span className="text-xs text-outline">© 2026 Mike's Oven Pizza. Todos los derechos reservados.</span>
        </div>
        
        <div>
          <h4 className="font-bold text-secondary font-display mb-4">Empresa</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><button onClick={() => onNavigate('story')} className="hover:text-secondary cursor-pointer">Nuestra Historia</button></li>
            <li><button onClick={() => onNavigate('menu')} className="hover:text-secondary cursor-pointer">Nuestro Menú</button></li>
            <li><button onClick={() => onNavigate('offers')} className="hover:text-secondary cursor-pointer">Ofertas de Temporada</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-secondary font-display mb-4">Ayuda & Soporte</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-secondary">Ubicaciones y Locales</a></li>
            <li><a href="#" className="hover:text-secondary">Preguntas Frecuentes</a></li>
            <li><a href="#" className="hover:text-secondary">Escríbenos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-secondary font-display mb-4">Newsletter</h4>
          <p className="text-sm text-on-surface-variant mb-4 font-sans">
            Recibe cupones con 10% OFF y ofertas exclusivas en tu correo.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="bg-surface border border-outline-variant rounded px-3 py-2 text-sm flex-grow focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-sans"
            />
            <button type="submit" className="bg-primary text-white text-xs font-bold px-4 py-2 rounded shadow-md hover:bg-secondary active:scale-95 transition-all cursor-pointer">
              Unirse
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
