import { motion } from 'motion/react';
import { Sparkles, Calendar, BookOpen, Truck, Award, Shield } from 'lucide-react';

interface StoryViewProps {
  onNavigate: (view: string) => void;
}

export default function StoryView({ onNavigate }: StoryViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full font-display"
    >
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden rounded-xl bg-emerald-900 border border-emerald-950 shadow-md">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvFq1kWNNGIQ5-rNqyC_34w8NZHSF64aZ9Mb3Q7FxRqUCNlidOX9nDvi-t6dXfhUPLZT4RMjU0pIjbwV3zyapvut7GzNI7NauMzrmZH2A2yxiJX2L04VSLq-5VLIaX7bjmpbUCADkKPnDvojMRSoP2puYwGqCN6KFLilhLPMt6jCEOy44Y1YUBGEMi-LKbNy4KpQNx9TPUZcLDz8nIyDNGulcFAcWM9G9ZoFqeHb7m4l9yIRWy5hVjwGstwL3ptnLDlZUeV_9aFFo" 
            alt="Interior del horno rústico de piedra con madera encendida" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-955 via-emerald-900/60 to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Nuestra Historia
          </h1>
          <p className="font-sans text-sm md:text-base text-emerald-100 max-w-2xl leading-relaxed opacity-95">
            Desde el corazón del campo hasta el calor de nuestro horno de piedra volcánica, cada rebanada cuenta una tierna historia de tradición, paciencia y frescura.
          </p>
        </div>
      </section>

      {/* Nuestros Orígenes */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1 flex flex-col items-start gap-4">
          <span className="font-bold text-xs text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full uppercase tracking-wider">
            HERENCIA FAMILIAR
          </span>
          <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
            Nuestros Orígenes
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed text-justify">
            Todo comenzó en la pequeña cocina de Mike, donde el aroma de la albahaca fresca y el tomate maduro era el despertador diario. Inspirado por las atesoradas recetas tradicionales italianas que pasaron de generación en generación, Mike se propuso devolverle a la pizza su verdadera esencia: ingredientes reales de productores locales, procesos lentos de fermentación artesanal y absoluto respeto por la tierra.
          </p>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed text-justify mt-2">
            Lo que empezó como un simple horno de piedra artesanal en el patio trasero familiar, hoy se ha convertido en Mike's Oven Pizza. Un cálido refugio para quienes buscan revivir el verdadero valor de lo auténtico y disfrutar una auténtica explosión de sabores sanos directamente de la granja a la mesa.
          </p>
        </div>
        <div className="order-1 md:order-2 relative bg-gray-50 rounded-xl p-1 shadow-sm flex justify-center">
          <div className="aspect-square w-full max-w-[420px] rounded-xl overflow-hidden shadow">
            <img 
              className="w-full h-full object-cover hover:scale-103 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1lHuzjXF0-WEqaxTK6d4D31YukKJ8_taEHNW8MmU1nJGTTYxGnKIkxbncjoL_Qg1wxXv0_knXI8UbxiFIEr2UAt7x-Pn1U_Fk_bf9VNCLvNko_FlWiERVhl2jGoyrW_Xzgutxs1nArQZYptUGKKaYELHd4yTJlPohZO9B_z3YJ6eMQKOQSKuVwW2AzXeouCBXjDd0QKH0a6sw8pXCfdBLwe1Y23xgiQVeOYC_lm2zShZ_w5YNP-6ScAavIY-eUaPTBucBm6rtW4I" 
              alt="Manos del panadero amasando pizza" 
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-primary-container p-4 rounded-lg shadow-md border border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-on-primary-container" />
            <p className="font-bold text-lg text-on-primary-container">Est. 2021</p>
          </div>
        </div>
      </section>

      {/* El Secreto de la Masa (Bento Style) */}
      <section className="py-16 bg-surface-container rounded-3xl px-6 md:px-12 border border-gray-200 shadow-sm">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-bold text-xs text-secondary bg-secondary-container text-on-secondary-container px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            EL PROCESO
          </span>
          <h2 className="text-3xl font-extrabold text-secondary">
            El Secreto de la Masa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.01)] border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-secondary font-display mb-3">Fermentación de 48 Horas</h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed text-justify">
                No hay atajos para la perfección. Nuestra masa de firma descansa durante dos días de fermentación lenta en frío, permitiendo que las levaduras naturales desarrollen una textura increíblemente ligera, bordes inflados y crujientes, y una facilidad de digestión sin igual. Es una ciencia de paciencia y devoción.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              Mínimo 48h de maduración lenta controlada
            </div>
          </div>

          <div className="bg-primary p-8 rounded-xl gap-4 flex flex-col items-center justify-center text-center text-white border border-secondary shadow shadow-primary-container">
            <BookOpen className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold font-display">Harina Orgánica</h3>
            <p className="font-sans text-xs opacity-90 leading-relaxed text-center">
              Seleccionamos granos premium locales molidos cuidadosamente en piedra tradicional para conservar intactos todos sus nutrientes y el sabor rústico auténtico de alta cocina.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.01)] border border-gray-100 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-44 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6XmaHwPnrpF-OEa0VpY-hgQMRl--o6UgMET7--fRw7HCad0CyQWWd6u9D83VLU7rb6gBo_-vo8U684f_VYEfj6EdvtNO492KNTRofy4HPtXEh41k2_h6A_KJD8YASj_GoV_QAgn9xQGve-GrE3MN0TDW-CvDdKeAYOTq-2engyOh5CrTRjROnuANrrVFKbmxcEyB1vZtJ308eGd_g-fswmRAFM-83w8DXMPBaGN2xe66Q5r0TZTC_dfE_pQeimURZa14s1Hx9ltw" 
                alt="Detalle macro de masa fermentada aireada" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-secondary font-display">Hidratación Perfecta</h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed text-justify">
                Utilizamos agua de manantial filtrada con pH controlado para asegurar que nuestra masa adquiera la elasticidad ideal para una cocción explosiva en piedra a más de 400 grados centígrados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compromiso con la Calidad */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <img 
                className="rounded-xl shadow-sm h-52 w-full object-cover border border-gray-100" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9cQcYea-ciEnGRxG6e4yvnfbwrBbWReCifX1dqlki_ryhdinXyzpAyOEAywZWQqkHQFfn0qxsB5z1cNc9mMWoIyAmk6Mm-PO5so-KPIBVFpaqYivEnti4lLbQvIJUe1u6ruZCukcVC_utlP-J5hDswBjpMkZdrab1F9Wrot3w5FvrNOwGNxQ-VlsCus7eE0KchQeiTIKMG1kRdqmfUznjUZ-kqoj-sGEC41-rBWwSdrnn6UXRtW5PQrDuryoQXEJRz5dcSGHf04c" 
                alt="Tomates frescos italianos con aceite oliva" 
              />
              <img 
                className="rounded-xl shadow-sm h-52 w-full object-cover border border-gray-100 mt-6" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnjBX35mOFmFZ-Bx2U2U3fNHRI_fQE8T02ar7PtQ3K2njS1_IfDPlufu20NREDClwkGT-CKLMOaz2M872BQobZno1RfYAGILXZs-bU4sbjBu5YjOW12yajDtmQpRoCAdZM1TV0KRmG_hZZHMOmcXxUKpH3bFJRPsiVW6hy9bdtyZMf1pShCkYGGyWN6uV6yuo7yVVzepPXC3WCIhsVGbDVzLA-NODIsOBBcX_C92mp8ZgVTGdY5NtnoPpnn_UoNmjBAz1I3gZOFsA" 
                alt="Vegetales orgánicos frescos" 
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <span className="font-bold text-xs text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full uppercase tracking-wider">
              NUESTROS VALORES
            </span>
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Compromiso con la Calidad
            </h2>
            <div className="space-y-6 mt-4">
              
              <div className="flex gap-4">
                <div className="bg-secondary-container p-2.5 rounded-full h-fit flex-shrink-0 text-on-secondary-container shadow-sm border border-secondary-container">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-base mb-1">Km 0: Productos Locales</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Trabajamos directamente con agricultores de nuestra región para asegurar que los tomates de huerta y los vegetales frescos lleguen a los hornos apenas unas horas después de ser cosechados.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-secondary-container p-2.5 rounded-full h-fit flex-shrink-0 text-on-secondary-container shadow-sm border border-secondary-container">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-base mb-1">Certificación de Origen</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Nuestros quesos mozzarella, mozzarella de búfala fresca y albahacas poseen denominación certificada, garantizando las texturas correctas y la pureza de cada bocado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-secondary-container p-2.5 rounded-full h-fit flex-shrink-0 text-on-secondary-container shadow-sm border border-secondary-container">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-base mb-1">Sin Aditivos ni Conservantes</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    En Mike's Oven Pizza no existen aditivos artificiales, potenciadores de sabor químicos ni grasas transgénicas. Creemos firmemente en el sabor transparente y en la salud de tu familia.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* From Farm To Table Diagram (De la Granja a tu Mesa) */}
      <section className="py-8 font-sans">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0px_12px_32px_rgba(0,90,49,0.03)] border border-gray-100 flex flex-col items-center">
          <h3 className="font-display text-2xl font-black text-secondary mb-10 text-center">De la Granja a tu Mesa</h3>
          
          <div className="relative flex justify-between w-full max-w-3xl items-center mb-8 overflow-x-auto pb-4 scrollbar-none font-sans">
            {/* Background vine line */}
            <div className="absolute h-1 bg-lime-200 w-full top-1/2 -translate-y-1/2 z-0"></div>
            
            {/* Node 1 */}
            <div className="relative z-10 flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-xl shadow hover:scale-105 transition-transform duration-300">
                🚜
              </div>
              <span className="font-bold text-[10px] tracking-wider uppercase text-secondary font-display">Cosecha</span>
            </div>

            {/* Node 2 */}
            <div className="relative z-10 flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-xl shadow hover:scale-105 transition-transform duration-300">
                🥖
              </div>
              <span className="font-bold text-[10px] tracking-wider uppercase text-secondary font-display">Fermentación</span>
            </div>

            {/* Node 3 */}
            <div className="relative z-10 flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-xl shadow hover:scale-105 transition-transform duration-300">
                🍕
              </div>
              <span className="font-bold text-[10px] tracking-wider uppercase text-secondary font-display">Horneado</span>
            </div>

            {/* Node 4 */}
            <div className="relative z-10 flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 bg-lime-100 border-2 border-primary-container text-primary rounded-full flex items-center justify-center text-xl shadow hover:scale-105 transition-transform duration-300">
                🛵
              </div>
              <span className="font-bold text-[10px] tracking-wider uppercase text-slate-400 font-display">Entrega</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => onNavigate('menu')}
              className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3.5 rounded-full transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer text-sm"
            >
              Explorar el Menú Completo
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
