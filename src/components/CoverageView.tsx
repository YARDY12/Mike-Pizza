import { motion } from 'motion/react';
import { MapPin, AlertTriangle, Store, Edit3, PhoneCall, ArrowRight, CornerUpLeft } from 'lucide-react';

interface CoverageViewProps {
  onNavigate: (view: string) => void;
  onModifyAddress: () => void;
  onChangeToPickup: () => void;
}

export default function CoverageView({ onNavigate, onModifyAddress, onChangeToPickup }: CoverageViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span>Pago Seguro</span>
        <span>&rsaquo;</span>
        <span className="text-secondary font-bold">Dirección</span>
        <span>&rsaquo;</span>
        <span className="text-tertiary font-bold">Aviso de Cobertura</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Map/Illustration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-stone-100 aspect-video border border-slate-200">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8yQkbojpiM4NpXi2kPL6KPSNHn48V0j-G5vROHdSZ4qqzhqB-b7TDU7MwCtQZZ-6LbkvvIZwz531AJzHvFRTSu2FETzgLMeTxFnNTnQoFQ8G00WF7WmOpGOBWgmm1rly-4QCamYTFeMQqeYmMobs3NO2SiajR66di8d_IBlRv7fUHf7NsomZYD9m1nziHUEMDeQZqvytZt8EvK5u6Tm3EvaO9hsqyC_5YMTmPQM-beZjiINKIhc0O-QbIgJHnHVmK08h2QYz_iBw" 
              alt="Cobertura de delivery de Mike's Oven"
              className="w-full h-full object-cover grayscale opacity-60"
            />
            
            {/* Center Animation indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/95 backdrop-blur-md p-6 rounded-full flex flex-col items-center gap-1 border border-red-200 shadow-xl"
              >
                <AlertTriangle className="w-12 h-12 text-tertiary fill-tertiary/10" />
              </motion.div>
            </div>

            {/* Simulated Headquarter Overlay */}
            <div className="absolute top-1/4 left-1/4 p-3 bg-secondary-container/90 text-on-secondary-container rounded-xl shadow-md flex items-center gap-2 font-display text-xs border border-secondary/20">
              <Store className="text-secondary w-4 h-4" />
              <span className="font-bold">Mike's Oven HQ</span>
            </div>
          </div>

          <div className="flex gap-3 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-sm text-slate-700">
            <span>&bull;</span>
            <p className="italic">
              Nuestra zona de entrega rápida garantiza que tu pizza artesanal de masa madre llegue crujiente, caliente y en menos de 40 minutos de manera perfecta. ¡Apostamos por la frescura!
            </p>
          </div>
        </div>

        {/* Right Column: Information & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="space-y-4">
            <span className="text-tertiary font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-4 h-4 text-tertiary" /> Fuera de Rango de Delivery
            </span>
            <h1 className="text-3.5xl font-extrabold text-slate-900 leading-tight font-display">
              Lo sentimos, tu dirección está fuera de nuestra zona de cobertura.
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm">
              Queremos asegurarnos de que disfrutes de nuestra calidad artesanal recién salida del horno de piedra. Actualmente no llegamos a Barranco con servicio de motorizado propio para evitar que la pizza pierda su temperatura ideal, ¡pero no te quedes sin tu porción!
            </p>
          </div>

          {/* conversion options */}
          <div className="space-y-4">
            {/* Primary conversion: Change to Pickup */}
            <button 
              onClick={onChangeToPickup}
              className="group w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white p-5 rounded-2xl flex items-center justify-between shadow-sm transition-all active:scale-95 cursor-pointer text-left border border-primary-container/25"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/80 p-2.5 rounded-lg text-primary">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Cambiar a Recojo en Local</h3>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-75 mt-0.5">Pickup GRATIS &bull; Listo en 15 mins</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary conversion: Modify address */}
            <button 
              onClick={onModifyAddress}
              className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 cursor-pointer text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Modificar Dirección</h3>
                  <p className="text-xs text-slate-500 uppercase font-semibold mt-0.5">Intentar con otra ubicación cercana</p>
                </div>
              </div>
              <CornerUpLeft className="w-5 h-5 text-slate-400 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Support section */}
          <div className="border-t border-slate-150 pt-6 flex items-center justify-between">
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-slate-500">¿Tienes dudas con tu rango?</span>
              <a 
                href="tel:+51987654321" 
                className="text-secondary font-bold flex items-center gap-1 hover:underline text-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Hablar con Soporte</span>
              </a>
            </div>

            {/* Staff profile photo */}
            <div className="flex items-center -space-x-2">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJmY6JkKcRJ3YxdKa6deOQ0iynGzmNDJiSRGL340ic96t9LJ1jZi1NKYaMRe3fas06ur5P4CLVAj_8Zm9jk2I6-Mrqxi3J2cCHGu-6wIW4Rvxp-Jf8h3_EZr2onoBo6oDrAZb2dVkKlg1F_B7I3jvBwLh265p0sISYrI63s-BSXjJ8dB6wXASKkcJeK_u8fB0tl0FKFF-jP4Xh2OINFfakGQUuTh6RvD7talNKmqyeEzl0tdlh3NBShpOHLUybD7u_NK-DfOsR0Rk" 
                alt="Agente de cocina" 
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
