import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { register } from '../api/auth';
import { tokenStorage } from '../api/tokenStorage';

interface RegisterViewProps {
  onNavigate: (view: string) => void;
  onRegisterSuccess: (fullName: string, email: string, phone?: string) => void;
}

export default function RegisterView({ onNavigate, onRegisterSuccess }: RegisterViewProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 5) {
      setError('La contraseña debe tener al menos 5 caracteres.');
      return;
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones de Mike.');
      return;
    }

    setLoading(true);
    setError('');
    console.log('[RegisterView] submit', { nombre, apellido, email, telefono: phone.trim() || undefined });

    try {
      const res = await register({
        nombre,
        apellido,
        email,
        password,
        telefono: phone.trim() || undefined,
      });
      console.log('[RegisterView] register response', res);

      if (res.token) {
        tokenStorage.set(res.token);
      }

      const registeredName = `${res.nombre ?? nombre}${res.apellido ? ` ${res.apellido}` : ''}`.trim();
      const registerPayload = {
        fullName: registeredName,
        email: res.email ?? email,
        phone: phone.trim() || res.telefono || (res as any).phone || undefined,
      };
      console.log('[RegisterView] register payload sent to app', registerPayload);
      onRegisterSuccess(registerPayload.fullName, registerPayload.email, registerPayload.phone);
    } catch (err: any) {
      console.error('[RegisterView] register error', err);
      const status = err?.response?.status;
      if (status === 400) {
        setError('Error en el registro. Revisa los datos e intenta de nuevo.');
      } else if (status === 404) {
        setError('Endpoint de registro no encontrado. Revisa la URL de backend.');
      } else {
        setError('No se pudo registrar. Revisa el backend y vuelve a intentar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="min-h-[calc(100vh-76px)] flex flex-col md:flex-row w-full font-display"
    >
      {/* Left side panel: Large Pizza Image */}
      <div className="hidden md:block w-1/2 relative h-[calc(100vh-76px)] sticky top-[76px] overflow-hidden">
        <img 
          alt="Ingredientes de pizza colocados con cuidado en la mesa" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9cQcYea-ciEnGRxG6e4yvnfbwrBbWReCifX1dqlki_ryhdinXyzpAyOEAywZWQqkHQFfn0qxsB5z1cNc9mMWoIyAmk6Mm-PO5so-KPIBVFpaqYivEnti4lLbQvIJUe1u6ruZCukcVC_utlP-J5hDswBjpMkZdrab1F9Wrot3w5FvrNOwGNxQ-VlsCus7eE0KchQeiTIKMG1kRdqmfUznjUZ-kqoj-sGEC41-rBWwSdrnn6UXRtW5PQrDuryoQXEJRz5dcSGHf04c"
        />
        <div className="absolute inset-0 bg-black/15"></div>

        {/* Promotional Overlay */}
        <div className="absolute bottom-12 left-12 right-12 p-6 bg-white/95 backdrop-blur-md rounded-xl shadow-xl flex items-center gap-4 max-w-sm border border-white/20">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-inner bg-surface">
            <img 
              alt="Promo Pizza mini" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApqcjK_Rp7uzHFuqAzbm_xHmu4_TSD8AL56FkK8uDrH7zRzzZlfYveF_WxOqIazSy6a17R0ZUnUZDMtHGJxTQo63iJ5Wv-dd-BWfZASPRCySoR94B70_M6aVtzztodgZNx3D8dAztYYmbYDOjFi8_nBLPsrr_SMq-WCerUYYRHbUF7rH0Ryx483A6HycZVTOfZlli9vvBMjw0lDZAlL7OcbtktdUIBKpr0vUqctJTChw6lV8OhLdZ-goiU_x2IYN4XTfnzDlzHiRw"
            />
          </div>
          <div>
            <p className="font-bold text-sm text-secondary font-display flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              Únete gratis hoy mismo
            </p>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Acumula rebanadas gratis con tus compras y canjéalas por entradas.
            </p>
          </div>
        </div>
      </div>

      {/* Right side panel: Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-surface">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-secondary mb-1">Crea tu cuenta</h1>
            <p className="font-sans text-sm text-on-surface-variant">Conviértete en miembro del Club del Horno.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-error-container text-on-error-container text-xs p-3.5 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* First name field */}
            <div className="space-y-1">
              <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="nombre">
                Nombre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setError(''); }}
                  placeholder="Renzo"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-10 pr-4 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  required
                />
              </div>
            </div>

            {/* Last name field */}
            <div className="space-y-1">
              <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="apellido">
                Apellido
              </label>
              <input 
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => { setApellido(e.target.value); setError(''); }}
                placeholder="Zavaleta"
                className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-4 pr-4 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                required
              />
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-10 pr-4 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone field */}
            <div className="space-y-1">
              <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="phone">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                placeholder="Ej. 946075308"
                className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-4 pr-4 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-10 pr-4 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => { setAcceptTerms(e.target.checked); setError(''); }}
                  className="form-checkbox h-5 w-5 text-primary-container border-outline rounded bg-white focus:ring-primary-container transition-colors mt-0.5"
                />
                <span className="text-xs font-sans text-on-surface-variant select-none leading-relaxed">
                  Acepto los <a href="#" onClick={(e) => e.preventDefault()} className="text-secondary hover:text-primary font-bold hover:underline">términos de membresía</a> y el procesamiento responsable de mis datos de contacto de Mike's Oven Pizza.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary active:scale-[0.98] transition-all font-display text-sm mt-4 ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {loading ? 'Registrando...' : 'Registrarse Gratis'}
            </button>
          </form>

          {/* Registry transition */}
          <div className="mt-8 text-center border-t border-surface-container-highest pt-6">
            <p className="font-sans text-xs text-on-surface-variant">
              ¿Ya posees una cuenta?
              <button 
                onClick={() => onNavigate('login')}
                className="font-bold text-secondary hover:text-primary underline decoration-2 underline-offset-4 ml-1.5 cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
