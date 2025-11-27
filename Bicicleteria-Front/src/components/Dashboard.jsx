import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, 
  Settings, DollarSign, Activity, AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('estadisticas'); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'https://localhost:7222/api/Dashboard'; 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) setError("Sesión expirada.");
        else setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtenemos el nombre/email del token (sin hardcodear)
  // Nota: En tu backend configuraste el email como 'unique_name'
  const displayUser = user?.unique_name || user?.sub || "Usuario";

  return (
    <div className="flex h-screen bg-cairo-dark overflow-hidden">
      
      {/* --- SIDEBAR (Menú Izquierdo) --- */}
      <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col justify-between p-6 relative z-20 backdrop-blur-xl">
        
        <div>
          {/* Botón Volver */}
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="text-sm font-bold uppercase tracking-wider">Volver a la Tienda</span>
          </Link>
          
          {/* ELIMINADO: El bloque de logo "EC" y título "ADMIN" que no querías */}

          {/* Menú de Navegación */}
          <nav className="space-y-2">
            <SidebarItem 
              icon={<LayoutDashboard size={20}/>} 
              label="Estadísticas" 
              active={activeTab === 'estadisticas'} 
              onClick={() => setActiveTab('estadisticas')}
            />
            <SidebarItem 
              icon={<Package size={20}/>} 
              label="Productos" 
              active={activeTab === 'productos'} 
              onClick={() => setActiveTab('productos')}
            />
            <SidebarItem 
              icon={<ShoppingCart size={20}/>} 
              label="Ordenes" 
              active={activeTab === 'ordenes'} 
              onClick={() => setActiveTab('ordenes')}
            />
            <SidebarItem 
              icon={<Users size={20}/>} 
              label="Usuarios" 
              active={activeTab === 'usuarios'} 
              onClick={() => setActiveTab('usuarios')}
            />
            <SidebarItem 
              icon={<Settings size={20}/>} 
              label="Configuración" 
              active={activeTab === 'config'} 
              onClick={() => setActiveTab('config')}
            />
          </nav>
        </div>

        {/* --- PERFIL DE USUARIO (Nuevo Diseño) --- */}
        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-cairo-orange/30 transition-colors">
             
             {/* Inicial del Usuario */}
             <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-cairo-orange/20 border border-cairo-orange/50 flex items-center justify-center text-cairo-orange font-bold shadow-sm">
                {displayUser.charAt(0).toUpperCase()}
             </div>
             
             {/* Datos Reales */}
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold text-white truncate" title={displayUser}>
                 {displayUser}
               </p>
               <p className="text-[10px] text-cairo-orange font-bold uppercase tracking-wider truncate">
                 Administrador
               </p>
             </div>

             {/* Botón Salir (Icono) */}
             <button 
                onClick={handleLogout} 
                className="p-2 text-gray-400 hover:text-cairo-red hover:bg-white/10 rounded-lg transition-all"
                title="Cerrar Sesión"
             >
                <LogOut size={18}/>
             </button>
          </div>
        </div>

      </aside>

      {/* --- AREA PRINCIPAL (Contenido) --- */}
      <main className="flex-1 overflow-y-auto relative p-8">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cairo-red/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cairo-yellow/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'estadisticas' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl font-brand text-white mb-8 border-b border-white/10 pb-4">Resumen General</h2>
              
              {loading ? (
                 <div className="text-white">Cargando datos...</div>
              ) : error ? (
                 <div className="text-cairo-red p-4 border border-cairo-red/20 rounded-lg bg-cairo-red/5">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Ventas Mensuales" value={`$${data?.totalVendidoMes.toLocaleString()}`} icon={<DollarSign/>} color="text-green-400" />
                    <StatCard title="Pedidos" value={data?.cantidadVentasMes} icon={<ShoppingCart/>} color="text-cairo-yellow" />
                    <StatCard title="Clientes Nuevos" value={data?.clientesNuevosMes} icon={<Users/>} color="text-cairo-orange" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      <h3 className="font-brand text-2xl text-white mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-cairo-yellow"/> Últimas Ventas
                      </h3>
                      <div className="space-y-3">
                        {data?.ultimasVentas.map(v => (
                          <div key={v.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div>
                              <p className="text-sm font-bold text-white">{v.cliente}</p>
                              <p className="text-xs text-gray-500">{v.fecha}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-400">${v.total.toLocaleString()}</p>
                              <span className="text-[10px] uppercase text-gray-400">{v.estado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-cairo-red/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cairo-red/10 blur-xl rounded-full"></div>
                      <h3 className="font-brand text-2xl text-cairo-red mb-4 flex items-center gap-2">
                        <AlertTriangle size={20}/> Alertas de Stock
                      </h3>
                      <div className="space-y-3">
                        {data?.productosBajoStock.map((p, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-black/20 border border-white/5 rounded-lg">
                            <div>
                              <p className="text-sm font-bold text-gray-200">{p.descripcion}</p>
                              <p className="text-[10px] font-bold text-cairo-orange uppercase">{p.tipo} • {p.codigo}</p>
                            </div>
                            <div className="px-3 py-1 bg-cairo-red/10 border border-cairo-red/20 rounded text-cairo-red font-bold">
                              {p.stock} <span className="text-[8px]">Unid.</span>
                            </div>
                          </div>
                        ))}
                         {data?.productosBajoStock.length === 0 && <p className="text-green-500 text-sm">¡Stock en orden!</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'productos' && (
            <PlaceholderView title="Gestión de Productos" desc="Aquí podrás Crear, Editar y Eliminar Bicicletas y Repuestos." icon={<Package size={48}/>} />
          )}
          
          {activeTab === 'ordenes' && (
            <PlaceholderView title="Ordenes de Venta" desc="Administra los pedidos, cambia estados y emite facturas." icon={<ShoppingCart size={48}/>} />
          )}

          {activeTab === 'usuarios' && (
            <PlaceholderView title="Gestión de Usuarios" desc="Administra clientes, empleados y permisos." icon={<Users size={48}/>} />
          )}

        </div>
      </main>
    </div>
  );
};

// --- Componentes Auxiliares ---

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${active 
        ? 'bg-cairo-orange text-white shadow-lg shadow-cairo-orange/20 font-bold' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-cairo-yellow'} transition-colors`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-brand text-white">{value}</p>
    </div>
  </div>
);

const PlaceholderView = ({ title, desc, icon }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5"
  >
    <div className="p-6 bg-cairo-dark rounded-full mb-4 text-cairo-orange shadow-lg shadow-cairo-orange/10">
      {icon}
    </div>
    <h2 className="text-4xl font-brand text-white mb-2">{title}</h2>
    <p className="text-gray-400 max-w-md">{desc}</p>
    <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors">
      Próximamente
    </button>
  </motion.div>
);

export default Dashboard;