import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, 
  Settings, DollarSign, Activity, AlertTriangle, Search, Filter, Plus, 
  ArrowUpDown, Edit, Trash2, X, CheckSquare, Square, Save, Store, 
  Truck, Loader, Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// IMPORTAMOS EL UPLOADER
import ImageUploader from '../components/ImageUploader';

// --- URL BASE ---
const BASE_URL = 'https://localhost:7222/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('estadisticas'); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados estadísticas
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Dashboard`);
        setStatsData(response.data);
      } catch (err) {
        if (err.response?.status !== 404) {
           if (err.response?.status === 401) setStatsError("Sesión expirada.");
           else setStatsError("No se pudo conectar con el servidor.");
        }
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

  const displayName = user?.Nombre || "Administrador";
  const displayEmail = user?.unique_name || "admin@elcairo.com";

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans text-gray-100">
      
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
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors group">
             <div className="h-10 w-10 min-w-10 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-500 font-bold shadow-sm group-hover:scale-105 transition-transform">
                {displayName.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold text-white truncate">{displayName}</p>
               <p className="text-[10px] text-gray-400 font-medium truncate group-hover:text-gray-300 transition-colors">{displayEmail}</p>
             </div>
             <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/10 rounded-lg transition-all" title="Cerrar Sesión">
                <LogOut size={18}/>
             </button>
          </div>
        </div>
      </aside>

      {/* --- AREA PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto">
          
          {/* 1. VISTA DE ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Resumen General</h2>
              
              {statsLoading ? (
                 <div className="flex items-center gap-2 text-white"><Loader className="animate-spin"/> Cargando datos...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Ventas Mensuales" value={`$${statsData?.totalVendidoMes?.toLocaleString() || 0}`} icon={<DollarSign/>} color="text-green-400" />
                    <StatCard title="Pedidos" value={statsData?.cantidadVentasMes || 0} icon={<ShoppingCart/>} color="text-yellow-400" />
                    <StatCard title="Clientes Nuevos" value={statsData?.clientesNuevosMes || 0} icon={<Users/>} color="text-orange-400" />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="font-bold text-2xl text-white mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-yellow-400"/> Últimas Ventas
                      </h3>
                      <div className="space-y-3">
                        {statsData?.ultimasVentas?.map(v => (
                          <div key={v.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div><p className="text-sm font-bold text-white">{v.cliente}</p><p className="text-xs text-gray-500">{v.fecha}</p></div>
                            <div className="text-right"><p className="text-sm font-bold text-green-400">${v.total.toLocaleString()}</p><span className="text-[10px] uppercase text-gray-400">{v.estado}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* 2. VISTA DE PRODUCTOS (CON FILTROS RESTAURADOS) */}
          {activeTab === 'productos' && <ProductsView />}

          {/* 3. VISTA DE CONFIGURACIÓN */}
          {activeTab === 'config' && <ConfigView />}

          {/* PLACEHOLDERS */}
          {activeTab === 'ordenes' && <PlaceholderView title="Ordenes de Venta" desc="Administra los pedidos." icon={<ShoppingCart size={48}/>} />}
          {activeTab === 'usuarios' && <PlaceholderView title="Gestión de Usuarios" desc="Administra usuarios." icon={<Users size={48}/>} />}

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

  // ESTADOS DE FILTRO Y ORDENAMIENTO (RESTAURADOS)
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ categoria: '', talle: '' });
  const [sortOrder, setSortOrder] = useState('az'); 
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Bicicletas`); // Ajusta si tienes endpoint unificado
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

  // LÓGICA DE FILTRADO (RESTAURADA)
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => 
        (p.descripcion || p.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.categoria) result = result.filter(p => p.categoria === filters.categoria);
    
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
      // Aquí iría el DELETE real
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
          <h2 className="text-4xl font-bold text-white">Productos</h2>
          <p className="text-gray-400 text-sm">Inventario general ({products.length} ítems)</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus size={18} /> Crear Nuevo
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS (RESTAURADA) */}
      <div className="bg-white/5 p-4 rounded-2xl mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between border border-white/10">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Filtro Categoría */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-2.5 rounded-xl hover:border-white/20 transition-colors">
            <Filter size={16} className="text-yellow-400" />
            <select
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer w-32"
              value={filters.categoria}
              onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            >
              <option value="" className="bg-[#111]">Todas Categorías</option>
              <option value="Bicicletas" className="bg-[#111]">Bicicletas</option>
              <option value="Repuestos" className="bg-[#111]">Repuestos</option>
              <option value="Indumentaria" className="bg-[#111]">Indumentaria</option>
            </select>
          </div>
          {/* Ordenamiento */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-2.5 rounded-xl hover:border-white/20 transition-colors">
            <ArrowUpDown size={16} className="text-orange-500" />
            <select
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer w-32"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="az" className="bg-[#111]">A-Z</option>
              <option value="za" className="bg-[#111]">Z-A</option>
              <option value="price-asc" className="bg-[#111]">$ Menor</option>
              <option value="price-desc" className="bg-[#111]">$ Mayor</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {loading ? (
            <div className="p-12 text-center text-white flex flex-col items-center">
              <Loader className="animate-spin mb-2" size={32}/>
              <p>Cargando inventario...</p>
            </div>
        ) : error ? (
            <div className="p-12 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-gray-400 font-bold">
                  <th className="p-4 w-12 text-center">
                    <button onClick={handleSelectAll} className="text-gray-400 hover:text-white transition-colors">
                      {selectedIds.length > 0 && selectedIds.length === filteredProducts.length 
                        ? <CheckSquare size={20} className="text-orange-500"/> 
                        : <Square size={20}/>
                      }
                    </button>
                  </th>
                  <th className="p-4 text-center">Imagen</th>
                  <th className="p-4 text-center">Código</th>
                  <th className="p-4 text-center">Producto</th>
                  <th className="p-4 text-center">Precio</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-sm">
                {filteredProducts.map(product => {
                  const pId = product.bicicletaId || product.repuestoId || product.id;
                  const isSelected = selectedIds.includes(pId);
                  const pNombre = product.descripcion || product.nombre || "Sin Nombre";
                  const pPrecio = product.precioPublico || product.precio || 0;
                  const pStock = product.stock !== undefined ? product.stock : 0;

                  return (
                    <tr key={pId} className={`transition-colors group ${isSelected ? 'bg-orange-500/10' : 'hover:bg-white/5'}`}>
                      <td className="p-4 text-center">
                        <button onClick={() => handleSelectOne(pId)} className="text-gray-500 hover:text-white transition-colors flex justify-center w-full">
                          {isSelected ? <CheckSquare size={20} className="text-orange-500"/> : <Square size={20}/>}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-orange-500/30 transition-colors mx-auto">
                           {/* LOGICA DE IMAGEN CLOUDINARY O NULL */}
                           {product.imagenUrl ? (
                            <img src={product.imagenUrl} alt="" className="w-full h-full object-cover"/> 
                          ) : (
                            <Package size={20} className="text-gray-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 inline-block">
                          {product.codigo}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">{pNombre}</td>
                      <td className="p-4 font-bold text-xl text-white tracking-wide">${pPrecio.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase inline-block
                          ${pStock <= 2 ? 'bg-red-500/10 text-red-400 border-red-500/20' : pStock < 10 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                          {pStock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-gray-400 hover:text-white"><Edit size={18}/></button>
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
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111]/90 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{selectedIds.length}</div>
              <span className="text-sm font-medium text-white">seleccionados</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedIds([])} className="text-gray-400 hover:text-white text-xs font-bold uppercase transition-colors px-2">Cancelar</button>
              <button onClick={handleDeleteSelected} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase px-4 py-2 rounded-full transition-colors shadow-lg shadow-red-500/20"><Trash2 size={14} /> Eliminar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSave={() => window.location.reload()}
      />
    </motion.div>
  );
};

// --- COMPONENTE: MODAL DE CREACIÓN (INTEGRADO CON IMAGE UPLOADER) ---
const CreateProductModal = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState('Bicicleta');
  const [loading, setLoading] = useState(false);
  const [formDataState, setFormDataState] = useState({
    codigo: '', descripcion: '', precioPublico: '', stock: '', imagenUrl: '',
    rodado: '', velocidades: '', marca: '', color: '', 
    categoria: '', compatibilidad: '', 
    talle: '', genero: '', tipoPrenda: '', frenos: ''
  });
  const [touched, setTouched] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDataState.codigo || !formDataState.descripcion || !formDataState.precioPublico || !formDataState.stock) {
      alert("Por favor completa los campos obligatorios (*)");
      setTouched({ codigo: true, descripcion: true, precioPublico: true, stock: true });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('Codigo', formDataState.codigo);
      data.append('Descripcion', formDataState.descripcion);
      data.append('PrecioPublico', formDataState.precioPublico);
      data.append('PrecioCosto', Number(formDataState.precioPublico) * 0.7);
      data.append('Stock', formDataState.stock);
      data.append('Activo', true);
      
      // SOLO ENVIAMOS LA URL (SI EXISTE)
      if (formDataState.imagenUrl) {
        data.append('ImagenUrl', formDataState.imagenUrl);
      }

      let endpoint = '';
      if (type === 'Bicicleta') {
        endpoint = '/Bicicletas';
        data.append('Rodado', formDataState.rodado || '');
        data.append('Velocidades', formDataState.velocidades || '');
        data.append('Marca', formDataState.marca || '');
        data.append('Color', formDataState.color || '');
        data.append('Frenos', formDataState.frenos || 'V-Brake');
      } else if (type === 'Repuesto') {
        endpoint = '/Repuestos';
        data.append('Categoria', formDataState.categoria || '');
        data.append('Compatibilidad', formDataState.compatibilidad || '');
        data.append('MarcaComponente', formDataState.marca || '');
      } else {
        endpoint = '/Indumentaria';
        data.append('Talle', formDataState.talle || '');
        data.append('Genero', formDataState.genero || '');
        data.append('TipoPrenda', formDataState.tipoPrenda || '');
      }

      const token = localStorage.getItem('token'); 
      await axios.post(`${BASE_URL}${endpoint}`, data, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      alert("¡Producto creado exitosamente!");
      onSave(); 
      onClose(); 

    } catch (error) {
      console.error(error);
      alert("Error al crear: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f0f0f] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-0 shadow-2xl relative">
        <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-brand text-white flex items-center gap-2"><Plus className="text-orange-500"/> Nuevo Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Selector de TIPO */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
            {['Bicicleta', 'Repuesto', 'Indumentaria'].map(t => (
              <label key={t} className={`flex-1 cursor-pointer text-center py-2.5 rounded-lg transition-all font-bold text-sm ${type === t ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="hidden"/>{t}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* COLUMNA IZQUIERDA: IMAGEN */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">Imagen del Producto</label>
              
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <ImageUploader 
                      onImageUpload={(url) => setFormDataState(prev => ({ ...prev, imagenUrl: url }))} 
                  />
              </div>

              <div className="relative">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><ImageIcon size={14} className="text-gray-600"/></div>
                 <input 
                    name="imagenUrl" 
                    placeholder="URL..." 
                    value={formDataState.imagenUrl} 
                    readOnly 
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-400 focus:outline-none cursor-not-allowed"
                 />
              </div>
            </div>

            {/* COLUMNA DERECHA: CAMPOS */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="codigo" label="Código (SKU)" value={formDataState.codigo} onChange={handleChange} onBlur={handleBlur} required error={touched.codigo && !formDataState.codigo} />
              <div className="md:col-span-2"><Input name="descripcion" label="Nombre / Descripción" value={formDataState.descripcion} onChange={handleChange} onBlur={handleBlur} required error={touched.descripcion && !formDataState.descripcion} /></div>
              <Input name="precioPublico" label="Precio Venta ($)" type="number" value={formDataState.precioPublico} onChange={handleChange} required error={touched.precioPublico && !formDataState.precioPublico} />
              <Input name="stock" label="Stock Inicial" type="number" value={formDataState.stock} onChange={handleChange} required error={touched.stock && !formDataState.stock} />
              <div className="col-span-2 h-px bg-white/10 my-2"></div>
              <AnimatePresence mode='wait'>
                {type === 'Bicicleta' && (
                  <motion.div key="bici" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="marca" label="Marca" value={formDataState.marca} onChange={handleChange} />
                    <Input name="rodado" label="Rodado" value={formDataState.rodado} onChange={handleChange} />
                    <Input name="velocidades" label="Velocidades" value={formDataState.velocidades} onChange={handleChange} />
                    <Input name="color" label="Color" value={formDataState.color} onChange={handleChange} />
                  </motion.div>
                )}
                {type === 'Repuesto' && (
                  <motion.div key="rep" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="categoria" label="Categoría" value={formDataState.categoria} onChange={handleChange} />
                    <Input name="compatibilidad" label="Compatibilidad" value={formDataState.compatibilidad} onChange={handleChange} />
                    <Input name="marca" label="Marca Componente" value={formDataState.marca} onChange={handleChange} />
                  </motion.div>
                )}
                {type === 'Indumentaria' && (
                  <motion.div key="ind" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="col-span-2 grid grid-cols-2 gap-4">
                    <Input name="tipoPrenda" label="Tipo de Prenda" value={formDataState.tipoPrenda} onChange={handleChange} />
                    <Input name="talle" label="Talle" value={formDataState.talle} onChange={handleChange} />
                    <Input name="genero" label="Género" value={formDataState.genero} onChange={handleChange} />
                    <Input name="color" label="Color" value={formDataState.color} onChange={handleChange} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-2.5 text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 rounded-xl transition-all">
              {loading ? <Loader className="animate-spin" size={18}/> : <Save size={18}/>} 
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const Input = ({ label, error, type = "text", ...props }) => (
  <div className="w-full">
    <label className={`block text-xs font-bold uppercase mb-1.5 transition-colors ${error ? 'text-red-400' : 'text-gray-500'}`}>{label} {props.required && <span className="text-orange-500">*</span>}</label>
    <input type={type} {...props} className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white text-sm transition-all focus:outline-none placeholder-gray-700 ${error ? 'border-red-400 focus:border-red-400 bg-red-400/5' : 'border-white/10 focus:border-orange-500 focus:bg-black/60'} ${type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}`} />
    {error && <p className="text-[10px] text-red-400 mt-1 font-medium">Requerido</p>}
  </div>
);
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <span className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`}>{icon}</span><span className="text-sm">{label}</span>
  </button>
);
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>{icon}</div><div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p><p className="text-2xl font-brand text-white">{value}</p></div>
  </div>
);
const ConfigView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex justify-between items-center mb-8">
      <div><h2 className="text-4xl font-brand text-white">Configuración</h2><p className="text-gray-400 text-sm">Ajustes generales.</p></div>
    </div>
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10"><h3 className="font-brand text-2xl text-white mb-6 flex items-center gap-2"><Store size={22} className="text-yellow-400"/> Datos de Tienda</h3></div>
  </motion.div>
);
const PlaceholderView = ({ title, desc, icon }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
    <div className="p-6 bg-[#0a0a0a] rounded-full mb-4 text-orange-500 shadow-lg shadow-orange-500/10">{icon}</div><h2 className="text-4xl font-brand text-white mb-2">{title}</h2><p className="text-gray-400 max-w-md">{desc}</p>
  </motion.div>
);

export default Dashboard;