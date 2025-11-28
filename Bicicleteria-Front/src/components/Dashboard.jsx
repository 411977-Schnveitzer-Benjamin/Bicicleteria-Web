import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, 
  Settings, DollarSign, Activity, AlertTriangle, Search, Filter, Plus, 
  ArrowUpDown, Edit, Trash2, X, CheckSquare, Square, Save, Store, 
  Truck, Bell, Shield, RefreshCw, Loader, Upload, Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- URL BASE (HTTPS) ---
const BASE_URL = 'https://localhost:7222/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('estadisticas'); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para Estadísticas
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Dashboard`);
        setStatsData(response.data);
      } catch (err) {
        if (err.response?.status === 401) setStatsError("Sesión expirada.");
        else setStatsError("No se pudo conectar con el servidor.");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.Nombre || user?.unique_name || "Usuario";
  const displayEmail = user?.unique_name || user?.email || "sin-email@elcairo.com";

  return (
    <div className="flex h-screen bg-cairo-dark overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col justify-between p-6 relative z-20 backdrop-blur-xl">
        <div>
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="text-sm font-bold uppercase tracking-wider">Volver a la Tienda</span>
          </Link>
          
          <nav className="space-y-2">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Estadísticas" active={activeTab === 'estadisticas'} onClick={() => setActiveTab('estadisticas')}/>
            <SidebarItem icon={<Package size={20}/>} label="Productos" active={activeTab === 'productos'} onClick={() => setActiveTab('productos')}/>
            <SidebarItem icon={<ShoppingCart size={20}/>} label="Ordenes" active={activeTab === 'ordenes'} onClick={() => setActiveTab('ordenes')}/>
            <SidebarItem icon={<Users size={20}/>} label="Usuarios" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')}/>
            <SidebarItem icon={<Settings size={20}/>} label="Configuración" active={activeTab === 'config'} onClick={() => setActiveTab('config')}/>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-cairo-orange/30 transition-colors group">
             <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-cairo-orange/20 border border-cairo-orange/50 flex items-center justify-center text-cairo-orange font-bold shadow-sm group-hover:scale-105 transition-transform">
                {displayName.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold text-white truncate" title={displayName}>{displayName}</p>
               <p className="text-[10px] text-gray-400 font-medium truncate group-hover:text-gray-300 transition-colors" title={displayEmail}>{displayEmail}</p>
             </div>
             <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-cairo-red hover:bg-white/10 rounded-lg transition-all" title="Cerrar Sesión">
                <LogOut size={18}/>
             </button>
          </div>
        </div>
      </aside>

      {/* --- AREA PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cairo-red/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cairo-yellow/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto">
          
          {/* 1. VISTA DE ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl font-brand text-white mb-8 border-b border-white/10 pb-4">Resumen General</h2>
              
              {statsLoading ? (
                 <div className="flex items-center gap-2 text-white"><Loader className="animate-spin"/> Cargando datos...</div>
              ) : statsError ? (
                 <div className="text-cairo-red p-4 border border-cairo-red/20 rounded-lg bg-cairo-red/5">{statsError}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Ventas Mensuales" value={`$${statsData?.totalVendidoMes.toLocaleString()}`} icon={<DollarSign/>} color="text-green-400" />
                    <StatCard title="Pedidos" value={statsData?.cantidadVentasMes} icon={<ShoppingCart/>} color="text-cairo-yellow" />
                    <StatCard title="Clientes Nuevos" value={statsData?.clientesNuevosMes} icon={<Users/>} color="text-cairo-orange" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="font-brand text-2xl text-white mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-cairo-yellow"/> Últimas Ventas
                      </h3>
                      <div className="space-y-3">
                        {statsData?.ultimasVentas.map(v => (
                          <div key={v.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div><p className="text-sm font-bold text-white">{v.cliente}</p><p className="text-xs text-gray-500">{v.fecha}</p></div>
                            <div className="text-right"><p className="text-sm font-bold text-green-400">${v.total.toLocaleString()}</p><span className="text-[10px] uppercase text-gray-400">{v.estado}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-cairo-red/20 relative overflow-hidden">
                      <h3 className="font-brand text-2xl text-cairo-red mb-4 flex items-center gap-2">
                        <AlertTriangle size={20}/> Alertas de Stock
                      </h3>
                      <div className="space-y-3">
                        {statsData?.productosBajoStock.map((p, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-black/20 border border-white/5 rounded-lg">
                            <div><p className="text-sm font-bold text-gray-200">{p.descripcion}</p><p className="text-[10px] font-bold text-cairo-orange uppercase">{p.tipo} • {p.codigo}</p></div>
                            <div className="px-3 py-1 bg-cairo-red/10 border border-cairo-red/20 rounded text-cairo-red font-bold">{p.stock} <span className="text-[8px]">Unid.</span></div>
                          </div>
                        ))}
                         {statsData?.productosBajoStock.length === 0 && <p className="text-green-500 text-sm">¡Stock en orden!</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* 2. VISTA DE PRODUCTOS (REAL) */}
          {activeTab === 'productos' && <ProductsView />}

          {/* 3. VISTA DE CONFIGURACIÓN */}
          {activeTab === 'config' && <ConfigView />}

          {/* PLACEHOLDERS */}
          {activeTab === 'ordenes' && <PlaceholderView title="Ordenes de Venta" desc="Administra los pedidos, cambia estados y emite facturas." icon={<ShoppingCart size={48}/>} />}
          {activeTab === 'usuarios' && <PlaceholderView title="Gestión de Usuarios" desc="Administra clientes, empleados y permisos." icon={<Users size={48}/>} />}

        </div>
      </main>
    </div>
  );
};

// --- COMPONENTE: VISTA DE PRODUCTOS ---
const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ categoria: '', talle: '' });
  const [sortOrder, setSortOrder] = useState('az'); 
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Productos`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("Error al cargar el inventario.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => 
        (p.descripcion || p.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.categoria) result = result.filter(p => p.categoria === filters.categoria);
    if (filters.talle) result = result.filter(p => (p.talle || "").includes(filters.talle));
    
    result.sort((a, b) => {
      const nameA = a.descripcion || a.nombre || "";
      const nameB = b.descripcion || b.nombre || "";
      const priceA = a.precioPublico || a.precio || 0;
      const priceB = b.precioPublico || b.precio || 0;
      switch (sortOrder) {
        case 'az': return nameA.localeCompare(nameB);
        case 'za': return nameB.localeCompare(nameA);
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        default: return 0;
      }
    });
    return result;
  }, [products, searchTerm, filters, sortOrder]);

  const handleSelectOne = (id) => {
    const prodId = id; 
    if (selectedIds.includes(prodId)) setSelectedIds(selectedIds.filter(item => item !== prodId));
    else setSelectedIds([...selectedIds, prodId]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map(p => p.bicicletaId || p.repuestoId || p.id));
  };

  const handleDeleteSelected = async () => {
    if(!window.confirm(`¿Seguro que quieres eliminar ${selectedIds.length} productos?`)) return;
    try {
      alert(`Simulación: Eliminando IDs ${selectedIds.join(", ")}`);
      setProducts(products.filter(p => !selectedIds.includes(p.bicicletaId || p.repuestoId || p.id)));
      setSelectedIds([]);
    } catch (err) {
      alert("Error al eliminar productos");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[80vh]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-brand text-white">Productos</h2>
          <p className="text-gray-400 text-sm">Inventario general ({products.length} ítems)</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-fire flex items-center gap-2 text-sm px-6 py-2.5 shadow-lg shadow-cairo-orange/20"
        >
          <Plus size={18} /> Crear Nuevo
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between border border-white/10">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cairo-orange focus:bg-black/60 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-2.5 rounded-xl hover:border-white/20 transition-colors">
            <Filter size={16} className="text-cairo-yellow" />
            <select
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer w-32"
              value={filters.categoria}
              onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            >
              <option value="" className="bg-cairo-dark">Categoría</option>
              <option value="Bicicletas" className="bg-cairo-dark">Bicicletas</option>
              <option value="Repuestos" className="bg-cairo-dark">Repuestos</option>
              <option value="Indumentaria" className="bg-cairo-dark">Indumentaria</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {loading ? (
           <div className="p-12 text-center text-white flex flex-col items-center">
              <Loader className="animate-spin mb-2" size={32}/>
              <p>Cargando inventario...</p>
           </div>
        ) : error ? (
           <div className="p-12 text-center text-cairo-red">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-gray-400 font-bold">
                  <th className="p-4 w-12 text-center">
                    <button onClick={handleSelectAll} className="text-gray-400 hover:text-white transition-colors">
                      {selectedIds.length > 0 && selectedIds.length === filteredProducts.length 
                        ? <CheckSquare size={20} className="text-cairo-orange"/> 
                        : <Square size={20}/>
                      }
                    </button>
                  </th>
                  <th className="p-4 text-center">Imagen</th>
                  <th className="p-4 text-center">Código</th>
                  <th className="p-4 text-center">Producto</th>
                  <th className="p-4 text-center">Info</th>
                  <th className="p-4 text-center">Precio</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Editar</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-sm">
                {filteredProducts.map(product => {
                  const pId = product.bicicletaId || product.repuestoId || product.id;
                  const isSelected = selectedIds.includes(pId);
                  const pNombre = product.descripcion || product.nombre || "Sin Nombre";
                  const pPrecio = product.precioPublico || product.precio || 0;
                  const pStock = product.stock !== undefined ? product.stock : 0;
                  const pCategoria = product.categoria || "General";
                  const pTalle = product.talle || product.rodado || "-";

                  return (
                    <tr key={pId} className={`transition-colors group ${isSelected ? 'bg-cairo-orange/10' : 'hover:bg-white/5'}`}>
                      <td className="p-4 text-center">
                        <button onClick={() => handleSelectOne(pId)} className="text-gray-500 hover:text-white transition-colors flex justify-center w-full">
                          {isSelected ? <CheckSquare size={20} className="text-cairo-orange"/> : <Square size={20}/>}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-cairo-orange/30 transition-colors mx-auto">
                          {product.imagenUrl ? <img src={product.imagenUrl} alt="" className="w-full h-full object-cover"/> : <Package size={24} className="text-gray-600" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs text-cairo-orange bg-cairo-orange/10 px-2 py-1 rounded border border-cairo-orange/20 inline-block">
                          {product.codigo}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">{pNombre}</td>
                      <td className="p-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-400">{pCategoria}</span>
                          <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded w-fit mt-1">{pTalle}</span>
                        </div>
                      </td>
                      <td className="p-4 font-brand text-xl text-white tracking-wide">${pPrecio.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase inline-block
                          ${pStock <= 2 ? 'bg-red-500/10 text-red-400 border-red-500/20' : pStock < 10 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                          {pStock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-cairo-orange/10 hover:text-cairo-orange text-gray-400 transition-colors"><Edit size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredProducts.length === 0 && (
           <div className="text-center py-12 text-gray-500"><Package size={48} className="mx-auto mb-3 opacity-50"/><p>No se encontraron productos.</p></div>
        )}
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel bg-cairo-dark/90 backdrop-blur-xl border border-cairo-red/30 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-cairo-orange text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{selectedIds.length}</div>
              <span className="text-sm font-medium text-white">seleccionados</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedIds([])} className="text-gray-400 hover:text-white text-xs font-bold uppercase transition-colors px-2">Cancelar</button>
              <button onClick={handleDeleteSelected} className="flex items-center gap-2 bg-cairo-red hover:bg-red-600 text-white text-xs font-bold uppercase px-4 py-2 rounded-full transition-colors shadow-lg shadow-cairo-red/20"><Trash2 size={14} /> Eliminar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE CREACIÓN --- */}
      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSave={() => window.location.reload()}
      />
    </motion.div>
  );
};

// --- COMPONENTE: CONFIGURACIÓN ---
const ConfigView = () => {
  const [loadingSave, setLoadingSave] = useState(false);
  const handleSave = () => {
    setLoadingSave(true);
    setTimeout(() => { setLoadingSave(false); alert("Configuración guardada exitosamente"); }, 1500);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div><h2 className="text-4xl font-brand text-white">Configuración</h2><p className="text-gray-400 text-sm">Ajustes generales de la tienda y el sistema.</p></div>
        <button onClick={handleSave} className="btn-fire flex items-center gap-2 text-sm px-8 py-3 shadow-lg shadow-cairo-orange/20" disabled={loadingSave}>
          {loadingSave ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>} {loadingSave ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="font-brand text-2xl text-white mb-6 flex items-center gap-2"><Store size={22} className="text-cairo-yellow"/> Perfil de Tienda</h3>
          <div className="space-y-4">
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre de la Tienda</label><input type="text" defaultValue="El Cairo Bicicletas" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-cairo-orange outline-none transition-colors"/></div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="font-brand text-2xl text-white mb-6 flex items-center gap-2"><Truck size={22} className="text-cairo-orange"/> Logística</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Costo Envío</label><input type="number" defaultValue="5000" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-cairo-orange outline-none"/></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENTE: MODAL DE CREACIÓN AVANZADO ---
const CreateProductModal = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState('Bicicleta');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); 
  const [formData, setFormData] = useState({
    codigo: '', descripcion: '', precioPublico: '', stock: '', imagenURL: '',
    rodado: '', velocidades: '', marca: '', color: '', 
    categoria: '', compatibilidad: '', 
    talle: '', genero: '', tipoPrenda: '' 
  });
  const [touched, setTouched] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (value && ['descripcion', 'marca', 'color', 'categoria', 'tipoPrenda', 'genero', 'compatibilidad'].includes(name)) {
      const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.descripcion || !formData.precioPublico || !formData.stock) {
      alert("Por favor completa los campos obligatorios.");
      setTouched({ codigo: true, descripcion: true, precioPublico: true, stock: true });
      return;
    }
    setLoading(true);
    
    let endpoint = '';
    let payload = {
      codigo: formData.codigo,
      descripcion: formData.descripcion,
      precioPublico: Number(formData.precioPublico),
      precioCosto: Number(formData.precioPublico) * 0.7, 
      stock: Number(formData.stock),
      imagenURL: formData.imagenURL || (images.length > 0 ? "imagen_local_placeholder.jpg" : ""),
      moneda: 'ARS',
      activo: true
    };

    if (type === 'Bicicleta') {
      endpoint = '/Bicicletas';
      payload = { ...payload, rodado: formData.rodado, velocidades: formData.velocidades, marca: formData.marca, color: formData.color, frenos: 'V-Brake' };
    } else if (type === 'Repuesto') {
      endpoint = '/Repuestos';
      payload = { ...payload, categoria: formData.categoria, compatibilidad: formData.compatibilidad, marcaComponente: formData.marca };
    } else {
      endpoint = '/Indumentaria';
      payload = { ...payload, talle: formData.talle, color: formData.color, genero: formData.genero, tipoPrenda: formData.tipoPrenda };
    }

    try {
      const token = localStorage.getItem('token'); 
      await axios.post(`${BASE_URL}${endpoint}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      onSave(); onClose(); alert("¡Producto creado exitosamente!");
    } catch (error) {
      console.error(error); alert("Error al crear: " + (error.response?.data?.title || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-0 shadow-2xl relative bg-[#0f0f0f]">
        <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-brand text-white flex items-center gap-2"><Plus className="text-cairo-orange"/> Nuevo Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
            {['Bicicleta', 'Repuesto', 'Indumentaria'].map(t => (
              <label key={t} className={`flex-1 cursor-pointer text-center py-2.5 rounded-lg transition-all font-bold text-sm ${type === t ? 'bg-cairo-orange text-white shadow-lg shadow-cairo-orange/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="hidden"/>{t}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">Imágenes del Producto</label>
              <div className="relative group">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:border-cairo-orange/50 group-hover:bg-white/5 transition-all min-h-[160px]">
                  <div className="bg-white/5 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform"><Upload size={24} className="text-cairo-orange"/></div>
                  <p className="text-sm text-gray-300 font-medium">Click o arrastra aquí</p>
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                      <img src={img.preview} alt="preview" className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-cairo-red"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative"><div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><ImageIcon size={14} className="text-gray-600"/></div><input name="imagenURL" placeholder="O pega una URL externa..." value={formData.imagenURL} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:border-cairo-orange focus:outline-none placeholder-gray-700"/></div>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="codigo" label="Código (SKU)" value={formData.codigo} onChange={handleChange} onBlur={handleBlur} required error={touched.codigo && !formData.codigo} />
              <div className="md:col-span-2"><Input name="descripcion" label="Nombre / Descripción" value={formData.descripcion} onChange={handleChange} onBlur={handleBlur} required error={touched.descripcion && !formData.descripcion} /></div>
              <Input name="precioPublico" label="Precio Venta ($)" type="number" value={formData.precioPublico} onChange={handleChange} required error={touched.precioPublico && !formData.precioPublico} />
              <Input name="stock" label="Stock Inicial" type="number" value={formData.stock} onChange={handleChange} required error={touched.stock && !formData.stock} />
              <div className="col-span-2 h-px bg-white/10 my-2"></div>
              <AnimatePresence mode='wait'>
                {type === 'Bicicleta' && (
                  <motion.div key="bici" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="marca" label="Marca" value={formData.marca} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="rodado" label="Rodado (ej: 29)" value={formData.rodado} onChange={handleChange} />
                    <Input name="color" label="Color" value={formData.color} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="velocidades" label="Velocidades" value={formData.velocidades} onChange={handleChange} />
                  </motion.div>
                )}
                {type === 'Repuesto' && (
                  <motion.div key="rep" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="categoria" label="Categoría" value={formData.categoria} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="compatibilidad" label="Compatibilidad" value={formData.compatibilidad} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="marca" label="Marca Componente" value={formData.marca} onChange={handleChange} onBlur={handleBlur} />
                  </motion.div>
                )}
                {type === 'Indumentaria' && (
                  <motion.div key="ind" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="tipoPrenda" label="Tipo de Prenda" value={formData.tipoPrenda} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="talle" label="Talle" value={formData.talle} onChange={handleChange} />
                    <Input name="genero" label="Género" value={formData.genero} onChange={handleChange} onBlur={handleBlur} />
                    <Input name="color" label="Color" value={formData.color} onChange={handleChange} onBlur={handleBlur} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-fire px-8 py-2.5 text-sm shadow-lg shadow-cairo-orange/20 flex items-center gap-2">{loading ? <Loader className="animate-spin" size={18}/> : <Save size={18}/>} {loading ? 'Guardando...' : 'Guardar Producto'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- HELPER INPUT ---
const Input = ({ label, error, type = "text", ...props }) => (
  <div className="w-full">
    <label className={`block text-xs font-bold uppercase mb-1.5 transition-colors ${error ? 'text-cairo-red' : 'text-gray-500'}`}>{label} {props.required && <span className="text-cairo-orange">*</span>}</label>
    <input type={type} {...props} className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white text-sm transition-all focus:outline-none placeholder-gray-700 ${error ? 'border-cairo-red focus:border-cairo-red bg-cairo-red/5' : 'border-white/10 focus:border-cairo-orange focus:bg-black/60'} ${type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}`} />
    {error && <p className="text-[10px] text-cairo-red mt-1 font-medium">Requerido</p>}
  </div>
);

// --- OTROS AUXILIARES ---
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-cairo-orange text-white shadow-lg shadow-cairo-orange/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <span className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-cairo-yellow'} transition-colors`}>{icon}</span><span className="text-sm">{label}</span>
  </button>
);
const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>{icon}</div><div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p><p className="text-2xl font-brand text-white">{value}</p></div>
  </div>
);
const PlaceholderView = ({ title, desc, icon }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
    <div className="p-6 bg-cairo-dark rounded-full mb-4 text-cairo-orange shadow-lg shadow-cairo-orange/10">{icon}</div><h2 className="text-4xl font-brand text-white mb-2">{title}</h2><p className="text-gray-400 max-w-md">{desc}</p>
  </motion.div>
);

export default Dashboard;