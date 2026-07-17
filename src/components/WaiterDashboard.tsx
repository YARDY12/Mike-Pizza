import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, GlassWater, Plus, Minus, Trash2, Send, X, 
  Map, ChefHat, Bell, Table, Beer, Pizza, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { CartItem, MenuItem, ServerOrder, TableState } from '../types';

interface WaiterDashboardProps {
  orders: ServerOrder[];
  tables: TableState[];
  menuItems: MenuItem[];
  onUpdateTableState: (tableId: number, status: 'free' | 'occupied', items: CartItem[], notes?: string, dinersCount?: number) => void;
  onSubmitWaiterOrder: (order: ServerOrder) => void;
}

export default function WaiterDashboard({ orders, tables, menuItems, onUpdateTableState, onSubmitWaiterOrder }: WaiterDashboardProps) {
  const [activeTableId, setActiveTableId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'fullForm'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('Pizzas');
  
  // Kitchen Alert Modal simulation state
  const [showAlertModal, setShowAlertModal] = useState(true);

  // Guests & notes for table creation
  const [diners, setDiners] = useState<number>(2);
  const [tableNotes, setTableNotes] = useState<string>('');
  const [tempCart, setTempCart] = useState<CartItem[]>([]);
  const [selectedDetailedTable, setSelectedDetailedTable] = useState<TableState | null>(null);

  // Local states for initializing a new table order
  const [initDiners, setInitDiners] = useState<number>(2);
  const [initNotes, setInitNotes] = useState<string>('');

  const selectedTable = tables.find(t => t.id === activeTableId);
  const pendingOrders = orders.filter(o => o.status === 'requested' || o.status === 'processing');

  const categoryGroups: Record<string, string[]> = {
    Pizzas: ['Clásicas', 'Especialidades', 'Vegetarianas'],
    Entradas: ['Complementos'],
    Bebidas: ['Bebidas', 'Postres'],
  };

  const availableCategories = useMemo(() => {
    const distinct = new Set<string>(['Pizzas', 'Entradas', 'Bebidas']);
    menuItems.forEach(item => {
      if (!categoryGroups.Pizzas.includes(item.category) && !categoryGroups.Entradas.includes(item.category) && !categoryGroups.Bebidas.includes(item.category)) {
        distinct.add(item.category);
      }
    });
    return Array.from(distinct);
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === 'Pizzas') {
      return menuItems.filter(item => categoryGroups.Pizzas.includes(item.category));
    }
    if (selectedCategory === 'Entradas') {
      return menuItems.filter(item => categoryGroups.Entradas.includes(item.category));
    }
    if (selectedCategory === 'Bebidas') {
      return menuItems.filter(item => categoryGroups.Bebidas.includes(item.category));
    }
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleSelectTable = (tableId: number) => {
    setActiveTableId(tableId);
    const target = tables.find(t => t.id === tableId);
    if (target) {
      setDiners(target.dinersCount || 2);
      setTableNotes(target.notes || '');
      setTempCart(target.items || []);
    }
  };

  const handleQuickAdd = (name: string, price: number, id: string, image: string) => {
    setTempCart(prev => {
      const matchIndex = prev.findIndex(item => item.id === id);
      if (matchIndex > -1) {
        const updated = [...prev];
        updated[matchIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, {
          cartId: `${id}-${Date.now()}`,
          id,
          name,
          price,
          image,
          quantity: 1
        }];
      }
    });
  };

  const handleRemoveItem = (cartId: string) => {
    setTempCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    setTempCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalAmount = tempCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmSendToKitchen = () => {
    if (!activeTableId) return;
    if (tempCart.length === 0) {
      alert('Por favor, añade productos antes de enviar a cocina.');
      return;
    }

    onUpdateTableState(activeTableId, 'occupied', tempCart, tableNotes, diners);

    const newOrder: ServerOrder = {
      id: `ORD-${9400 + activeTableId}`,
      customerName: `Mesa ${activeTableId}`,
      items: tempCart,
      total: totalAmount,
      status: 'requested',
      elapsedMinutes: 0,
      deliveryMethod: 'pickup',
      tableId: activeTableId,
      notes: tableNotes
    };

    onSubmitWaiterOrder(newOrder);
    alert(`¡Pedido enviado éxitosamente a la Cocina para la Mesa ${activeTableId}!`);
    setActiveTableId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full font-sans relative">
      
      {/* Persona Header bar tag */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Table className="w-4 h-4 text-secondary" /> Servicio de Salón Activo
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">Dashboard de Mesero</h1>
          <p className="text-slate-500 font-medium text-sm">Gestiona la comanda física de cada comensal directo al horno de piedra.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                activeTab === 'map' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mapa de Mesas
            </button>
            <button 
              onClick={() => setActiveTab('fullForm')}
              className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                activeTab === 'fullForm' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Formulario Completo (Menú)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main area */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Pedidos activos</p>
                <h2 className="text-xl font-extrabold text-slate-900">Pedidos esperando cocina</h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{pendingOrders.length} en cola</span>
            </div>
            {pendingOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                No hay pedidos abiertos en cocina. El mesero puede crear uno nuevo desde el panel.
              </div>
            ) : (
              <ul className="space-y-3">
                {pendingOrders.slice(0, 4).map(order => (
                  <li key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-bold text-slate-900">Pedido #{order.id}</p>
                        <p className="text-xs text-slate-500">{order.customerName} • {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Recojo'}</p>
                      </div>
                      <span className="text-xs font-semibold text-secondary">{order.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      {order.items.slice(0, 3).map(item => (
                        <span key={item.cartId} className="rounded-full bg-white border border-slate-200 px-3 py-1">{item.quantity}x {item.name}</span>
                      ))}
                      {order.items.length > 3 && <span className="rounded-full bg-white border border-slate-200 px-3 py-1">+{order.items.length - 3} más</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {activeTab === 'map' ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <header className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-slate-800">Mapa del Restaurante</h2>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-500"></span>
                    <span className="text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-red-100 border border-red-500"></span>
                    <span className="text-gray-600">Ocupado</span>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tables.map(table => {
                  const isOccupied = table.status === 'occupied';
                  const isCurrent = activeTableId === table.id;
                  
                  return (
                    <button 
                      key={table.id}
                      onClick={() => {
                        setSelectedDetailedTable(table);
                        setInitDiners(2);
                        setInitNotes('');
                      }}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center relative ${
                        isCurrent 
                          ? 'border-secondary bg-emerald-50/20 ring-4 ring-secondary/20 shadow-md' 
                          : isOccupied 
                            ? 'border-red-400 bg-red-50/20 hover:bg-red-50/40 text-red-800' 
                            : 'border-emerald-300 bg-emerald-50/10 hover:bg-emerald-50/20 text-emerald-850'
                      }`}
                    >
                      <Table className={`w-8 h-8 ${isOccupied ? 'text-red-700' : 'text-emerald-700'} mb-2`} />
                      <span className="font-extrabold text-sm font-display">Mesa {table.id}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wide mt-0.5 flex items-center gap-1.5 ">
                        <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <span>{isOccupied ? 'Ver Pedido' : 'Libre'}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Waiter Menu Full Order creation form
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800 font-display">Añadir Productos Rápidos al Pedido</h2>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                  <span>Mesa Seleccionada:</span>
                  <span className="text-secondary font-extrabold">{activeTableId ? `Mesa ${activeTableId}` : 'Ninguna'}</span>
                </div>
              </div>

              {/* Fast Categories chips selectors */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['Pizzas', 'Entradas', 'Bebidas'].map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === category 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                    No hay productos disponibles para esta categoría.
                  </div>
                ) : (
                  filteredMenuItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-150 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="flex gap-3">
                        <img 
                          src={item.image || 'https://via.placeholder.com/96'} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-emerald-700 font-bold mt-1">S/ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleQuickAdd(item.name, item.price, item.id, item.image)}
                        className="w-full bg-secondary text-white font-bold py-1.5 rounded-lg text-xs mt-3 flex items-center justify-center gap-1 hover:bg-opacity-95 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Order Panel */}
        <aside className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                {activeTableId ? `Mesa #${activeTableId}` : 'Seleccione Mesa'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedTable?.status === 'occupied' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedTable?.status === 'occupied' ? 'OCUPADO' : 'DISPONIBLE'}
              </span>
            </div>
            {activeTableId && (
              <button 
                onClick={() => handleSelectTable(activeTableId)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-5 flex-grow space-y-6">
            {/* Diners & Waiter credentials */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Comensales</label>
                <input 
                  type="number" 
                  value={diners} 
                  onChange={e => setDiners(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 rounded-lg p-2 text-xs border border-gray-200 outline-none text-center font-bold"
                  disabled={!activeTableId}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Mesero ID</label>
                <input 
                  type="text" 
                  value="MIKE-01" 
                  readOnly 
                  className="w-full bg-slate-100 rounded-lg p-2 text-xs border border-gray-200 text-slate-500 text-center opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Fast Add Buttons grid inside Sidebar as specified also */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Comanda rápida</h4>
              <div className="grid grid-cols-3 gap-2">
                {menuItems && menuItems.length > 0 ? (
                  menuItems.slice(0, 6).map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleQuickAdd(item.name, item.price, item.id, item.image)}
                      className={`p-2 border border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
                        !activeTableId 
                          ? 'border-slate-100 opacity-40 cursor-not-allowed text-slate-400' 
                          : 'border-gray-200 hover:border-secondary hover:bg-emerald-50/20 cursor-pointer text-slate-800'
                      }`}
                      disabled={!activeTableId}
                      type="button"
                    >
                      <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className={`w-5 h-5 mb-1 rounded ${!activeTableId ? 'opacity-40' : ''}`} />
                      <span className="text-[10px] font-bold">{item.name.split(' ')[0]} ({Math.round(item.price)})</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-xs text-slate-500">No hay productos rápidos configurados.</div>
                )}
              </div>
            </div>

            {/* Selected items list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Resumen parcial del Pedido</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {tempCart.length === 0 ? (
                  <div className="text-center py-6 text-slate-350 bg-slate-50 rounded-xl border border-gray-150">
                    <Users className="w-8 h-8 mx-auto opacity-35" />
                    <p className="text-[11px] mt-1">Mesa vacía / comanda vacía</p>
                  </div>
                ) : (
                  tempCart.map(item => (
                    <div key={item.cartId} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-900 group">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-emerald-700 font-extrabold mt-0.5">S/ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button 
                          onClick={() => handleUpdateQty(item.cartId, -1)}
                          className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-bold w-4 text-center text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQty(item.cartId, 1)}
                          className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item.cartId)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Special waiter notes */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Notas del Mesero</label>
              <textarea 
                value={tableNotes}
                onChange={e => setTableNotes(e.target.value)}
                placeholder="Ej. Sin cebolla, pizza bien tostada, gaseosa con hielo..."
                rows={2}
                disabled={!activeTableId}
                className="w-full bg-slate-50 rounded-xl p-3 text-xs border border-gray-200 outline-none resize-none focus:ring-secondary focus:border-secondary"
              />
            </div>
          </div>

          {/* Totals & Submit footer */}
          <div className="p-5 border-t border-gray-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4 text-sm font-sans text-slate-600">
              <span>Total Comanda</span>
              <span className="font-bold text-secondary text-lg">S/ {totalAmount.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleConfirmSendToKitchen}
              disabled={!activeTableId || tempCart.length === 0}
              className="w-full bg-tertiary text-white hover:bg-red-700 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> ENVIAR A COCINA
            </button>
          </div>
        </aside>

      </div>

      {/* ALERT MODAL: Waiter order ready overlay as requested by templates */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border-t-8 border-primary relative"
            >
              {/* Modal Cover Image */}
              <div className="relative h-44">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCFI_j5YKmREMx5KaaKOwh3JexrtwBrORadI62-0Im0taeCz5krW0zxxKfGnUUiSowu6rhFMhynLwuuQx6bcduq6hfs5dLmotdjN8KjBkOdhc4TqEwi7UKODbPSrMgtxbM_LycvjR6CxadsaHwbpghib8oDS6TcwVHu0ziQ8NdmZsW6w2Ov6mBHzV257y_gMMgr4kLYYCKK1Mch2eQrkPARoMNTYVpNqP2IEbiiZHRDX1WLNhqyw_R8keMsp_lWq_D2_TeX9ulu8I" 
                  alt="Pepperoni caliente"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Cover Label */}
                <span className="absolute bottom-4 left-4 bg-tertiary text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  ALERTA DE COCINA
                </span>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-slate-950 font-display">¡Pedido de Mesa 4 Listo!</h3>
                <p className="text-slate-500 font-sans text-xs leading-relaxed">
                  El horno de piedra de Mike's acaba de reventar las burbujas de la mozzarella. El pedido está humeante y listo para ser llevado de corrido al cliente.
                </p>

                {/* Quick details */}
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-150 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold border-b border-gray-150 pb-2">
                    <span className="text-secondary uppercase">Mesa 4 &rsaquo; Servidora</span>
                    <span className="text-slate-500">ID #8842</span>
                  </div>
                  <ul className="text-xs text-slate-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-secondary font-bold font-sans">&bull;</span>
                      <span>1 Pizza Pepperoni Familiar (Masa Madre)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-secondary font-bold font-sans">&bull;</span>
                      <span>1 Garlic Knots (Ajo rústico)</span>
                    </li>
                  </ul>
                </div>

                {/* Tracker bar indicator inside modal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span className="text-secondary">Preparado</span>
                    <span className="text-secondary">En Horno</span>
                    <span className="text-tertiary animate-pulse">¡Listo!</span>
                  </div>
                  {/* Progress Line bar */}
                  <div className="relative w-full h-1.5 bg-slate-100 rounded-full flex items-center bg-slate-150">
                    <div className="absolute h-full bg-secondary rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
                    <div className="absolute left-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
                    <div className="absolute right-0 w-4 h-4 bg-tertiary rounded-full border-2 border-white shadow animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setShowAlertModal(false);
                      const table4 = tables.find(t => t.id === 4);
                      if (table4) {
                        setSelectedDetailedTable(table4);
                      }
                    }}
                    className="py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-700 text-xs hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Ver Detalles (Mesa 4)
                  </button>
                  <button 
                    onClick={() => {
                      setShowAlertModal(false);
                      alert('Comanda Mesa 4 marcada como ENTREGADA y servida exitosamente.');
                    }}
                    className="py-3 px-4 bg-tertiary text-white font-bold rounded-xl text-xs hover:bg-opacity-95 active:scale-95 cursor-pointer transition-colors text-center"
                  >
                    Marcar como Entregado
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETALLE DE IMPRESION DE COMANDA / VISTA DETALLE DE MESA GENERAL */}
      <AnimatePresence>
        {selectedDetailedTable && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 font-sans text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              {selectedDetailedTable.status === 'occupied' ? (
                <>
                  {/* Header - Ocupado */}
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                    <div className="text-left">
                      <span className="bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                        Mesa Ocupada / Pedido Activo
                      </span>
                      <h3 className="text-xl font-extrabold font-display mt-1.5 flex items-center gap-2">
                        <Table className="w-5 h-5 text-primary-container" /> Detalles de Mesa {selectedDetailedTable.id}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setSelectedDetailedTable(null)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body - Ocupado */}
                  <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh] bg-slate-50/50 text-left">
                    {/* Meta details */}
                    <div className="flex justify-between items-center text-xs font-bold bg-white p-3.5 rounded-xl border border-slate-150">
                      <div className="text-slate-500">
                        Comensales: <span className="text-slate-800 text-sm font-black">{selectedDetailedTable.dinersCount || 2}</span>
                      </div>
                      <div className="text-slate-500">
                        Mesero a cargo: <span className="text-slate-800 text-sm font-black font-mono">MIKE-01</span>
                      </div>
                    </div>

                    {/* Comanda Receipt list */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4 relative text-left">
                      <div className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-dashed border-slate-200 pb-2 flex justify-between">
                        <span>Productos Ordenados</span>
                        <span className="text-right">Subtotal</span>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {selectedDetailedTable.items && selectedDetailedTable.items.length > 0 ? (
                          selectedDetailedTable.items.map((item) => (
                            <div key={item.cartId} className="py-2.5 flex justify-between items-start text-xs text-left">
                              <div className="space-y-0.5 text-left">
                                <div className="flex items-center gap-2 text-left">
                                  <span className="font-extrabold text-secondary bg-emerald-50 text-emerald-800 w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0">{item.quantity}x</span>
                                  <span className="font-bold text-slate-800 text-left">{item.name}</span>
                                </div>
                                {item.customization && (
                                  <p className="text-[10px] text-slate-400 pl-7 text-left leading-normal">
                                    {item.customization.size} ({item.customization.crust})
                                    {item.customization.toppings.length > 0 && ` + ${item.customization.toppings.join(', ')}`}
                                  </p>
                                )}
                              </div>
                              <span className="font-extrabold text-slate-700 shrink-0 select-text">S/ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-slate-400 italic">No hay productos en esta comanda.</p>
                        )}
                      </div>

                      {/* Calculations total */}
                      <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Total de la mesa</span>
                        <span className="font-black text-secondary text-base font-display">
                          S/ {selectedDetailedTable.items ? selectedDetailedTable.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* Waiter notes */}
                    {selectedDetailedTable.notes && (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-150 text-xs text-slate-600 italic text-left">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-amber-700 block mb-1 font-sans not-italic">Notas o Personalizaciones:</span>
                        "{selectedDetailedTable.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions panel - Ocupado */}
                  <div className="p-5 border-t border-slate-150 bg-white space-y-2.5 shrink-0 text-left">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        onClick={() => {
                          handleSelectTable(selectedDetailedTable.id);
                          setSelectedDetailedTable(null);
                          setActiveTab('fullForm');
                        }}
                        className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        ✏️ Modificar
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`¿Liberar Mesa ${selectedDetailedTable.id} y vaciar comanda?`)) {
                            onUpdateTableState(selectedDetailedTable.id, 'free', [], '', 2);
                            setSelectedDetailedTable(null);
                            alert(`Mesa ${selectedDetailedTable.id} liberada con éxito y lista para nuevos comensales.`);
                          }
                        }}
                        className="py-3 px-4 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        💵 Liberar Mesa
                      </button>
                    </div>
                    <button 
                      onClick={() => setSelectedDetailedTable(null)}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Regresar al Mapa
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Header - Libre */}
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                    <div className="text-left">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                        Mesa Disponible / Libre
                      </span>
                      <h3 className="text-xl font-extrabold font-display mt-1.5 flex items-center gap-2">
                        <Table className="w-5 h-5 text-emerald-400" /> Abrir Mesa {selectedDetailedTable.id}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setSelectedDetailedTable(null)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body - Libre */}
                  <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50 text-left">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Abre el sistema de comanda para la <span className="font-extrabold font-display text-slate-800">Mesa {selectedDetailedTable.id}</span> e introduce los detalles iniciales de los comensales antes de registrar los platillos.
                    </p>

                    {/* Comensales Setup */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Número de Comensales *</label>
                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                        <button 
                          type="button"
                          onClick={() => setInitDiners(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-lg flex items-center justify-center font-sans active:scale-95 transition-all cursor-pointer text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-black text-slate-800 text-center flex-grow font-sans">{initDiners} Personas</span>
                        <button 
                          type="button"
                          onClick={() => setInitDiners(prev => prev + 1)}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-lg flex items-center justify-center font-sans active:scale-95 transition-all cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Initial Notes Setup */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Requerimientos o notas del cliente (Opcional)</label>
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-850 outline-none resize-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary min-h-[90px] font-sans"
                        value={initNotes}
                        onChange={(e) => setInitNotes(e.target.value)}
                        placeholder="Ej: Prefieren mesa cerca de la ventana, cubiertos adicionales, masa crocante..."
                      />
                    </div>
                  </div>

                  {/* Actions panel - Libre */}
                  <div className="p-5 border-t border-slate-150 bg-white space-y-2.5 shrink-0 text-left">
                    <button 
                      onClick={() => {
                        // Switch active state, apply setup parameters, clear previous items
                        handleSelectTable(selectedDetailedTable.id);
                        setDiners(initDiners);
                        setTableNotes(initNotes);
                        setTempCart([]);
                        setSelectedDetailedTable(null);
                        setActiveTab('fullForm');
                        alert(`¡Mesa ${selectedDetailedTable.id} habilitada! Ahora puedes seleccionar los platos del menú para la comanda.`);
                      }}
                      className="w-full py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                    >
                      📋 Crear Comanda e Ir al Menú
                    </button>
                    <button 
                      onClick={() => setSelectedDetailedTable(null)}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Regresar al Mapa
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
