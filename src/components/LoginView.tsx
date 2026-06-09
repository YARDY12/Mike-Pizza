import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { login } from '../api/auth';
import { tokenStorage } from '../api/tokenStorage';

interface LoginViewProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (payload: { fullName: string; email: string; roles: string[]; phone?: string }) => void;
}

export default function LoginView({ onNavigate, onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    console.debug('[LoginView] submit', { email, password: password ? '••••••••' : '' });
    try {
      const res = await login({ email, password });
      console.debug('[LoginView] login response', res);
      if (!res?.token) {
        setError('No se recibió token del servidor.');
        return;
      }

      tokenStorage.set(res.token);

      const fullName = `${res.nombre ?? ''} ${res.apellido ?? ''}`.trim() || email.split('@')[0];
      const loginPayload = {
        fullName,
        email: res.email ?? email,
        roles: Array.isArray(res.roles) ? res.roles : [],
        phone: res.telefono ?? (res as any).phone ?? undefined,
      };
      console.debug('[LoginView] login payload sent to app', loginPayload);
      onLoginSuccess(loginPayload);
    } catch (err: any) {
      console.error('[LoginView] login error', err);
      const status = err?.response?.status;
      if (status === 401) {
        setError('Credenciales inválidas.');
      } else if (status === 404) {
        setError('Endpoint de login no encontrado. Revisa la URL de backend.');
      } else {
        setError('No se pudo iniciar sesión. Revisa el backend y vuelve a intentar.');
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
          alt="Pizza fresca artesanal saliendo del horno de Mike" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeZYB_GHTGtJq2pDeiTWk-N_MXmwQTmXLgr3f8Q2qalCCb5bDWNrIkYG9izdh-xemUaMqlqFUiGDwkyNuR49ePTsxF-VluHM3vxLTOU7jScx7ZctYSL15mgQqnsFzBL9ot4EZvwG8zC0yxEOpQxsauuLW5v3-tXAjQTRmMgzu3r4mYbGr1J7LLPvGUlnvDgb4T70ptR33YDplFnUxnxG6iD3crtXfHgNbN7AS58559iZP63oxEX26AD89sDLnneE53idKlo1munrE"
        />
        <div className="absolute inset-0 bg-black/15"></div>

        {/* Promotional Overlay */}
        <div className="absolute bottom-12 left-12 right-12 p-6 bg-white/95 backdrop-blur-md rounded-xl shadow-xl flex items-center gap-4 max-w-sm border border-white/20">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-inner bg-surface">
            <img 
              alt="Promo Pizza thumbnail" 
              className="w-full h-full object-cover animate-pulse" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrW9H5uPgi-9R088lrDKg05shtZX9N4QEKkI3GWgSPlfjrRUY9t4ukfIwwYc4WS8gk8Nz2zZj6fVbYbBaFZf0Q0TExiwGK2aeEInVVT-WZ4gwhDLUMF6qtjfB2g1BktbdYNVTnezmefdhrTcW_gCXXcTXKVBx5RCKwGloOcXH2Ns1lzlBR42Rch52uZOA_ByNUr7bPywIBb82QPiaSCWas7FO13-wIa94bzixw9T_1hcEiPjpP2qaA4Jt9nC4bgT4Jd1okWgFnECA"
            />
          </div>
          <div>
            <p className="font-bold text-sm text-secondary font-display flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              Pide hoy y obtén 10% OFF
            </p>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Solo para usuarios registrados y pedidos desde el Club del Horno.
            </p>
          </div>
        </div>
      </div>

      {/* Right side panel: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-surface">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-secondary mb-1">¡Bienvenido de nuevo!</h1>
            <p className="font-sans text-sm text-on-surface-variant">La frescura de Mike's te espera.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error-container text-on-error-container text-xs p-3.5 rounded-lg border border-red-200">
                {error}
              </div>
            )}

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

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block font-bold text-xs text-on-surface uppercase tracking-wider font-sans mb-1" htmlFor="password">
                  Contraseña
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-secondary hover:text-primary transition-colors hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-10 pr-10 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary focus:outline-none p-1 rounded-full cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary active:scale-[0.98] transition-all font-display text-sm mt-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-container-highest"></div>
            </div>
            <div className="relative flex justify-center text-xs font-sans">
              <span className="px-4 bg-surface text-on-surface-variant">O continúa con</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onLoginSuccess({ fullName: 'Invitado Google', email: 'google@mikes.com', roles: [] })}
              className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg font-bold text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <img 
                alt="Google icon" 
                className="w-4 h-4" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxctEXXeeMbSI4IEcEVj4X6Cy5ZxLGW6hQAfIfq1bOUKDGJxKGsjaXzjrB6aB7E-Ahwtg628ZmLNpCC8JDQeiBMWu9ergF7xOpZ88Pz_fMUWDOjNnLxm3S0PYot6EESn1Y2-JTLJ6bEZJp9ZZHw6KSccGHvqp2j-9UAtJ_zKeADZHdU4tHXSMISwFyyY2_GvDg81KwfMX6JWXYeQbCWUBMF9c98tUUB-DCUNcFTYxuHBaIOMJv-GpTanCWcYvevIqxyQoqJclzUcs"
              />
              Google
            </button>
            <button 
              onClick={() => onLoginSuccess({ fullName: 'Invitado Facebook', email: 'fb@mikes.com', roles: [] })}
              className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg font-bold text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
              </svg>
              Facebook
            </button>
          </div>

          {/* Registry transition */}
          <div className="mt-8 text-center">
            <p className="font-sans text-xs text-on-surface-variant">
              ¿No tienes una cuenta aún?
              <button 
                onClick={() => onNavigate('register')}
                className="font-bold text-secondary hover:text-primary underline decoration-2 underline-offset-4 ml-1.5 cursor-pointer"
              >
                Regístrate aquí
              </button>
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
