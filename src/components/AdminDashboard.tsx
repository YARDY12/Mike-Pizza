import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, ClipboardList, Timer, ShieldCheck, 
  Trash2, Edit, Plus, Users, UserPlus, FileText, CheckCircle, 
  Settings, LogOut, Search, Bell, BarChart2, DollarSign, Leaf, Map, X 
} from 'lucide-react';
import { CartItem, MenuItem, UserProfile, ServerOrder } from '../types';
import { createProducto, deleteProducto } from '../api/productos';

interface AdminDashboardProps {
  orders: ServerOrder[];
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export default function AdminDashboard({ 
  orders, 
  menuItems, 
  onAddMenuItem, 
  onUpdateMenuItem, 
  onDeleteMenuItem 
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'control' | 'menu' | 'users' | 'reports'>('control');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Forms state for adding a new pizza
  const [newCategoriaId, setNewCategoriaId] = useState('');
  const [newPizzaName, setNewPizzaName] = useState('');
  // Backend expects 3 explicit prices
  const [newPizzaPricePersonal, setNewPizzaPricePersonal] = useState('');
  const [newPizzaPriceMediano, setNewPizzaPriceMediano] = useState('');
  const [newPizzaPriceFamiliar, setNewPizzaPriceFamiliar] = useState('');
  const [newPizzaCategory, setNewPizzaCategory] = useState<'Clásicas' | 'Especialidades' | 'Vegetarianas' | 'Complementos' | 'Bebidas' | 'Postres'>('Clásicas');
  const [newPizzaDesc, setNewPizzaDesc] = useState('');
  const [newPizzaStock, setNewPizzaStock] = useState('10');
  const [newPizzaImageFile, setNewPizzaImageFile] = useState<File | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newPizzaIngredients, setNewPizzaIngredients] = useState<string[]>(['Mozzarella', 'Albahaca']);
  const [ingredientInput, setIngredientInput] = useState('');

  const [usersList, setUsersList] = useState<UserProfile[]>([
    { fullName: 'Marco Polo', email: 'marco.polo@mikesoven.com', phone: '+51 987 8821', isAuthenticated: true, role: 'cocinero' },
    { fullName: 'Sofía García', email: 's.garcia@gmail.com', phone: '+51 912 345 678', isAuthenticated: true, role: 'repartidor' },
    { fullName: 'Ricardo Luna', email: 'rluna_pizza@outlook.com', phone: '+51 934 1029', isAuthenticated: true, role: 'cliente' },
    { fullName: 'Juan Pérez', email: 'j.perez@mikesoven.com', phone: '+51 911 7732', isAuthenticated: true, role: 'mesero' },
    { fullName: 'Chef Mike', email: 'mike.admin@mikesoven.com', phone: '+51 999 0000', isAuthenticated: true, role: 'admin' }
  ]);

  // Compute stats
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0) + 42580.00; // pre-populated sales as requested
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;

  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      e.preventDefault();
      if (!newPizzaIngredients.includes(ingredientInput.trim())) {
        setNewPizzaIngredients(prev => [...prev, ingredientInput.trim()]);
      }
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (tag: string) => {
    setNewPizzaIngredients(prev => prev.filter(t => t !== tag));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');

    if (!newCategoriaId || !newPizzaName) {
      setSaveError('Completa el ID de categoría y el nombre.');
      return;
    }
    if (!newPizzaPricePersonal || !newPizzaPriceMediano || !newPizzaPriceFamiliar) {
      setSaveError('Completa los 3 precios (Personal, Mediano, Familiar).');
      return;
    }
    if (!newPizzaStock) {
      setSaveError('Completa el stock.');
      return;
    }
    if (!newPizzaImageFile) {
      setSaveError('Selecciona una imagen.');
      return;
    }

    const categoriaIdNum = Number(newCategoriaId);
    const precioPersonalNum = Number(newPizzaPricePersonal);
    const precioMedianoNum = Number(newPizzaPriceMediano);
    const precioFamiliarNum = Number(newPizzaPriceFamiliar);
    const stockNum = Number(newPizzaStock);

    if (!Number.isFinite(categoriaIdNum) || categoriaIdNum <= 0) {
      setSaveError('El ID de categoría debe ser un número válido.');
      return;
    }
    if (![precioPersonalNum, precioMedianoNum, precioFamiliarNum].every(n => Number.isFinite(n) && n > 0)) {
      setSaveError('Los precios deben ser números válidos mayores a 0.');
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setSaveError('El stock debe ser un número entero (0 o mayor).');
      return;
    }

    setSavingProduct(true);
    try {
      const created = await createProducto({
        categoriaId: categoriaIdNum,
        nombre: newPizzaName,
        descripcion: newPizzaDesc,
        precioPersonal: precioPersonalNum,
        precioMediano: precioMedianoNum,
        precioFamiliar: precioFamiliarNum,
        stock: stockNum,
        imagen: newPizzaImageFile,
      });

      // Map backend Producto to our MenuItem shape (minimal, safe mapping)
      const createdObj = (created ?? {}) as any;
      const newItem: MenuItem = {
        id: String(createdObj.idProducto ?? createdObj.id ?? newPizzaName.toLowerCase().replace(/\s+/g, '-')),
        name: String(createdObj.nombre ?? newPizzaName),
        description: String(createdObj.descripcion ?? newPizzaDesc ?? 'Hecha con nuestra masa madre fermentada de 48 horas e ingredientes frescos.'),
        price: typeof createdObj.precio === 'number' ? createdObj.precio : precioMedianoNum,
        category: newPizzaCategory,
        image: String(createdObj.imagenUrl ?? ''),
        isNew: true,
      };

      onAddMenuItem(newItem);
      alert(`¡Producto "${newPizzaName}" creado en el servidor!`);

      // reset form
      setNewCategoriaId('');
      setNewPizzaName('');
      setNewPizzaPricePersonal('');
      setNewPizzaPriceMediano('');
      setNewPizzaPriceFamiliar('');
      setNewPizzaDesc('');
      setNewPizzaStock('10');
      setNewPizzaImageFile(null);
      setNewPizzaIngredients(['Mozzarella', 'Albahaca']);
      setShowAddModal(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) setSaveError('No autorizado (rol insuficiente).');
      else if (status === 401) setSaveError('Sesión expirada. Vuelve a iniciar sesión.');
      else setSaveError('No se pudo guardar el producto. Revisa el backend.');
    } finally {
      setSavingProduct(false);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-72px)] font-sans w-full">
      
      {/* Side Tabs Navigation */}
      <aside className="w-64 bg-white border-r border-slate-150 flex flex-col justify-between p-6 shrink-0 hidden md:flex font-sans">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-secondary font-display select-none">Mike's Oven</h2>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1 block">Panel Administrativo</span>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setAdminTab('control')}
              className={`flex items-center gap-3.5 px-4 h-12 rounded-xl text-left font-bold text-xs cursor-pointer transition-all ${
                adminTab === 'control' ? 'bg-primary-container text-on-primary-container' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="w-5 h-5 shrink-0 text-secondary" />
              <span>Resumen / Control</span>
            </button>
            <button 
              onClick={() => setAdminTab('menu')}
              className={`flex items-center gap-3.5 px-4 h-12 rounded-xl text-left font-bold text-xs cursor-pointer transition-all ${
                adminTab === 'menu' ? 'bg-primary-container text-on-primary-container' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Leaf className="w-5 h-5 shrink-0 text-secondary" />
              <span>Gestión de Menú</span>
            </button>
            <button 
              onClick={() => setAdminTab('users')}
              className={`flex items-center gap-3.5 px-4 h-12 rounded-xl text-left font-bold text-xs cursor-pointer transition-all ${
                adminTab === 'users' ? 'bg-primary-container text-on-primary-container' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-5 h-5 shrink-0 text-secondary" />
              <span>Usuarios / Roles</span>
            </button>
            <button 
              onClick={() => setAdminTab('reports')}
              className={`flex items-center gap-3.5 px-4 h-12 rounded-xl text-left font-bold text-xs cursor-pointer transition-all ${
                adminTab === 'reports' ? 'bg-primary-container text-on-primary-container' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-5 h-5 shrink-0 text-secondary" />
              <span>Reportes & Ventas</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-150 pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-800">Chef Mike</p>
              <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">Owner / Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin canvas */}
      <main className="flex-grow p-8 overflow-y-auto space-y-8 font-sans">
        
        {/* Dynamic view rendering */}

        {/* View 1: Control Center panel */}
        {adminTab === 'control' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Panel de Control</h1>
                <p className="text-sm text-gray-500">Métricas de cocina, velocidad de barra y comanda de hoy.</p>
              </div>
            </div>

            {/* Quick KPI stats cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide font-extrabold text-slate-400">Ventas del Día</span>
                  <DollarSign className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-black text-slate-900 font-display mt-4">S/ {totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                <span className="text-[10px] font-bold text-secondary mt-1.5 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> +12% vs ayer</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide font-extrabold text-slate-400">Pedidos Activos</span>
                  <ClipboardList className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-black text-slate-900 font-display mt-4">{activeOrdersCount + 24} órdenes</p>
                <span className="text-[10px] font-bold text-secondary mt-1.5">+5 recibidas hoy</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide font-extrabold text-slate-400">Tiempo Promedio</span>
                  <Timer className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-black text-slate-900 font-display mt-4">18 minutos</p>
                <span className="text-[10px] font-bold text-red-600 mt-1.5 flex items-center gap-0.5"><TrendingDown className="w-3.5 h-3.5" /> -2 mins</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide font-extrabold text-slate-400">Calificación</span>
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-black text-slate-900 font-display mt-4">98% Satisfacción</p>
                <span className="text-[10px] font-bold text-secondary mt-1.5">4.9 promedio</span>
              </div>
            </section>

            {/* Real-time kitchen vine tracker visual */}
            <section className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm">
              <h3 className="font-extrabold text-slate-900 font-display mb-6">Estado de Cocina en Tiempo Real</h3>
              <div className="relative py-8 px-2 max-w-4xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-secondary to-primary-container -translate-y-1/2" style={{ width: '66%' }}></div>
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow">P</span>
                    <span className="text-xs font-bold text-slate-900">Preparando (12)</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shadow">H</span>
                    <span className="text-xs font-bold text-slate-900">En Horno (8)</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs ring-4 ring-white shadow">R</span>
                    <span className="text-xs font-bold text-slate-400">Reparto (4)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Active comanda queues details */}
            <section className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
              <header className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-slate-800 text-sm font-display">Comandas Recientes hoy</h3>
              </header>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-slate-50 font-bold text-slate-400 border-b border-slate-150">
                    <tr>
                      <th className="px-6 py-3 uppercase">Código</th>
                      <th className="px-6 py-3 uppercase">Cliente / Origen</th>
                      <th className="px-6 py-3 uppercase">Productos</th>
                      <th className="px-6 py-3 uppercase">Precio Total</th>
                      <th className="px-6 py-3 uppercase text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold">#{order.id}</td>
                        <td className="px-6 py-4 font-semibold">{order.customerName}</td>
                        <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-secondary font-display">S/ {order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-105 bg-amber-50 text-amber-700'
                          }`}>
                            {order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* View 2: Menu / Inventory management */}
        {adminTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Gestión de Menú</h1>
                <p className="text-sm text-gray-500">Ajusta ingredientes, precios y disponibilidades en segundos.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white hover:bg-emerald-700 font-extrabold text-xs py-3 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wide"
              >
                <Plus className="w-4.5 h-4.5" /> Nueva Pizza artesanal
              </button>
            </div>

            {/* Search Input Filter bar */}
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar pizzas o bebidas..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-xl py-3 pl-10 pr-4 text-xs border border-gray-250 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-150">
                    <tr>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4">Precio Base</th>
                      <th className="px-6 py-4">Disponibilidad</th>
                      <th className="px-6 py-4 text-right">Controles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-slate-900">{item.name}</p>
                              <p className="text-slate-400 text-[10px] truncate max-w-xs mt-0.5">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-500">{item.category}</td>
                        <td className="px-6 py-4 font-bold text-secondary font-display text-sm">S/ {item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={true} // simulation stock
                              onChange={() => alert('Modificando stock de la pizza...')}
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                            <span className="text-[10px] font-bold ml-2 text-slate-600">Disp.</span>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => {
                                const newPrice = prompt(`Editar precio para ${item.name}:`, item.price.toString());
                                if (newPrice) {
                                  onUpdateMenuItem({ ...item, price: parseFloat(newPrice) || item.price });
                                }
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`¿Eliminar ${item.name} del menú?`)) {
                                  (async () => {
                                    try {
                                      await deleteProducto(item.id);
                                      onDeleteMenuItem(item.id);
                                    } catch (err: any) {
                                      const status = err?.response?.status;
                                      if (status === 403) alert('No autorizado (rol insuficiente).');
                                      else if (status === 401) alert('Sesión expirada. Vuelve a iniciar sesión.');
                                      else alert('No se pudo eliminar en el servidor.');
                                    }
                                  })();
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Reports & Analytics charts */}
        {adminTab === 'reports' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Reportes y Estadísticas</h1>
              <p className="text-sm text-gray-500">Métricas analíticas del volumen comercial de Mike's Oven.</p>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bar Chart top pizzas */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
                <h3 className="font-extrabold text-slate-900 font-display text-sm pb-2 border-b border-slate-50">Top 5 Pizzas Más Vendidas</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span>Margherita Classica (Horno Tradicional)</span>
                      <span>450 unidades</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span>Pepperoni Miel Picante</span>
                      <span>385 unidades</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span>Cuatro Quesos de Búfala</span>
                      <span>290 unidades</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full transition-all" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span>Bosque Silvestre (Setas Trufadas)</span>
                      <span>210 unidades</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full transition-all" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span>Hawaiana Rústica</span>
                      <span>180 unidades</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-slate-200 h-full rounded-full transition-all" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo gauge visual meter */}
              <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 font-display text-sm mb-4">Rendimiento de Cupones</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">Proporción de comensales que aplicaron código de descuento en el carro digital.</p>
                </div>

                <div className="py-6 flex flex-col items-center">
                  <div className="relative w-40 h-20">
                    <div className="absolute inset-0 border-[14px] border-slate-100 border-b-0 rounded-t-full"></div>
                    <div className="absolute inset-0 border-[14px] border-secondary border-b-0 rounded-t-full" style={{ clipPath: 'polygon(0 0, 85% 0, 85% 100%, 0 100%)' }}></div>
                    <div className="absolute bottom-0 left-1/2 -translateX-1/2 text-center -translate-x-1/2">
                      <span className="text-2xl font-black text-secondary font-display">85%</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-bold leading-none">Meta</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">2x1 Martes Rústico</span>
                    <span className="font-bold text-secondary">S/ 8,420</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">MEMBER10 Club</span>
                    <span className="font-bold text-secondary">S/ 5,150</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* View 4: Users Directory and Staff roles */}
        {adminTab === 'users' && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Gestión de Usuarios</h1>
                <p className="text-sm text-gray-500">Asigna jefes de cocina, repartidores y administra clientes registrados.</p>
              </div>
              <button 
                onClick={() => {
                  const name = prompt('Nombre completo del nuevo trabajador:');
                  const email = prompt('Correo del nuevo trabajador:');
                  if (name && email) {
                    setUsersList(prev => [...prev, {
                      fullName: name,
                      email: email,
                      role: 'mesero',
                      isAuthenticated: true
                    }]);
                  }
                }}
                className="bg-primary text-white hover:bg-emerald-700 font-extrabold text-xs py-3 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wide"
              >
                <UserPlus className="w-4.5 h-4.5" /> AGREGAR TRABAJADOR
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-150">
                    <tr>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Correo Electrónico</th>
                      <th className="px-6 py-4">Rol en Sistema</th>
                      <th className="px-6 py-4 text-right">Controles de Acceso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {usersList.map((usr, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                              {usr.fullName.substring(0,2).toUpperCase()}
                            </div>
                            <span>{usr.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{usr.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            usr.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : usr.role === 'cocinero' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : usr.role === 'repartidor' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : usr.role === 'mesero' 
                                    ? 'bg-blue-105 bg-blue-50 text-blue-700' 
                                    : 'bg-slate-150 bg-slate-100 text-slate-600'
                          }`}>
                            {usr.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              const options = ['cliente', 'mesero', 'cocinero', 'repartidor', 'admin'];
                              const newRole = prompt(`Cambiar rol de ${usr.fullName} a (cliente, mesero, cocinero, repartidor, admin):`, usr.role);
                              if (newRole && options.includes(newRole)) {
                                setUsersList(prev => prev.map((u, idx) => idx === i ? { ...u, role: newRole as any } : u));
                                alert('Rol actualizado correctamente.');
                              } else if (newRole) {
                                alert('Rol no válido.');
                              }
                            }}
                            className="text-secondary font-bold hover:underline"
                          >
                            Modificar Acceso
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal overlay form to insert new pizza onto dynamic list */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm p-4 font-sans">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 border-none text-base font-display">Añadir Nueva Pizza Artesanal</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-slate-150 rounded-full text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">ID Categoría (backend)</label>
                    <input
                      type="number"
                      placeholder="Ej. 1"
                      value={newCategoriaId}
                      onChange={e => setNewCategoriaId(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium font-sans"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nombre de la Pizza</label>
                    <input 
                      type="text"
                      placeholder="Ej. Bosque de Trufa Rústica"
                      value={newPizzaName}
                      onChange={e => setNewPizzaName(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Categoría</label>
                    <select 
                      value={newPizzaCategory}
                      onChange={e => setNewPizzaCategory(e.target.value as any)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium text-slate-700"
                    >
                      <option value="Clásicas">Clásicas</option>
                      <option value="Especialidades">Especialidades</option>
                      <option value="Vegetarianas">Vegetarianas</option>
                      <option value="Complementos">Complementos</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Postres">Postres</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Precio Personal (S/)</label>
                    <input 
                      type="number"
                      placeholder="35.00"
                      step="0.10"
                      value={newPizzaPricePersonal}
                      onChange={e => setNewPizzaPricePersonal(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium font-sans"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Precio Mediano (S/)</label>
                    <input 
                      type="number"
                      placeholder="42.00"
                      step="0.10"
                      value={newPizzaPriceMediano}
                      onChange={e => setNewPizzaPriceMediano(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Precio Familiar (S/)</label>
                    <input 
                      type="number"
                      placeholder="55.00"
                      step="0.10"
                      value={newPizzaPriceFamiliar}
                      onChange={e => setNewPizzaPriceFamiliar(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium font-sans"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Stock (unidades)</label>
                    <input 
                      type="number"
                      placeholder="10"
                      step="1"
                      value={newPizzaStock}
                      onChange={e => setNewPizzaStock(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Imagen (archivo)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPizzaImageFile(e.target.files?.[0] ?? null)}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none font-medium"
                    required
                  />
                </div>

                {saveError && (
                  <div className="bg-error-container text-on-error-container text-xs p-3 rounded-xl border border-red-200">
                    {saveError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Descripción</label>
                  <textarea 
                    placeholder="Salsa de tomate importada, mozzarela fresca di fior, gotas del mejor aceite perfumado..."
                    value={newPizzaDesc}
                    onChange={e => setNewPizzaDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 p-3 text-xs rounded-xl border border-slate-200 focus:ring-secondary focus:border-secondary outline-none resize-none font-medium text-slate-700"
                  />
                </div>

                {/* Ingredients tagger */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ingredientes Principales (Enter para añadir)</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px] items-center">
                    {newPizzaIngredients.map(tag => (
                      <span key={tag} className="bg-primary-container text-on-primary-container text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shrink-0 font-sans">
                        {tag} <X className="w-3 h-3 text-slate-500 cursor-pointer hover:text-red-700" onClick={() => handleRemoveIngredient(tag)} />
                      </span>
                    ))}
                    <input 
                      type="text"
                      placeholder={newPizzaIngredients.length === 0 ? "Añadir..." : ""}
                      value={ingredientInput}
                      onChange={e => setIngredientInput(e.target.value)}
                      onKeyDown={handleAddIngredient}
                      className="border-none bg-transparent focus:ring-0 text-xs p-0 w-24 outline-none placeholder:text-gray-450 text-slate-700"
                    />
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3 text-xs">
                <button 
                  onClick={() => setShowAddModal(false)}
                  disabled={savingProduct}
                  className={`py-2.5 px-5 hover:bg-slate-150 rounded-xl font-bold text-slate-600 ${
                    savingProduct ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProduct}
                  disabled={savingProduct}
                  className={`bg-primary text-white hover:bg-emerald-700 font-extrabold py-3 px-6 rounded-xl shadow-sm uppercase tracking-wide ${
                    savingProduct ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {savingProduct ? 'Guardando...' : 'Guardar Pizza'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
