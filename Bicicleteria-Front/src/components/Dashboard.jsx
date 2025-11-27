import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); 

  // CONFIGURADO PARA HTTPS 7222
  const API_URL = 'https://localhost:7222/api/Dashboard'; 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        console.error("Error Dashboard:", err);
        if (err.response && err.response.status === 401) {
            setError("Sesión expirada.");
        } else if (err.code === "ERR_NETWORK" || err.code === "ERR_EMPTY_RESPONSE") {
            // Mensaje específico para el error de certificado
            setError("Error de Certificado SSL. Abre https://localhost:7222/api/Dashboard en otra pestaña y acepta el riesgo.");
        } else {
            setError("No se pudo conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [logout]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-cairo-dark">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cairo-orange shadow-[0_0_20px_rgba(242,100,25,0.5)]"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 flex justify-center items-center min-h-screen bg-cairo-dark">
        <div className="glass-panel border border-red-500/30 text-red-200 px-8 py-6 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(220,38,38,0.2)] max-w-lg text-center">
            <div className="flex items-center mb-4">
                <AlertTriangle className="mr-4 text-cairo-red flex-shrink-0" size={32}/>
                <span className="font-bold text-lg">Error de Conexión</span>
            </div>
            <p className="text-sm opacity-90">{error}</p>
            {error.includes("SSL") && (
                <a 
                    href="https://localhost:7222/api/Dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 px-6 py-2 bg-cairo-red text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
                >
                    Solucionar Permiso SSL
                </a>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 bg-cairo-dark relative overflow-hidden">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cairo-red/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cairo-yellow/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* TITULO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-4 border-b border-white/10 pb-6"
        >
          <div className="p-3 bg-cairo-red rounded-lg shadow-[0_0_15px_rgba(217,37,37,0.4)]">
             <Activity className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-brand text-white tracking-wide">PANEL DE CONTROL</h1>
            <p className="text-gray-400 text-sm">Resumen de actividad en tiempo real</p>
          </div>
        </motion.div>

        {/* 1. TARJETAS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard 
            icon={<DollarSign size={28} />} 
            title="Ventas del Mes" 
            value={data ? `$${data.totalVendidoMes.toLocaleString()}` : "$0"} 
            color="text-green-400"
            bgGlow="bg-green-500/10"
            delay={0.1}
          />
          <MetricCard 
            icon={<ShoppingBag size={28} />} 
            title="Pedidos Realizados" 
            value={data?.cantidadVentasMes || 0} 
            color="text-cairo-yellow"
            bgGlow="bg-cairo-yellow/10"
            delay={0.2}
          />
          <MetricCard 
            icon={<Users size={28} />} 
            title="Nuevos Clientes" 
            value={data?.clientesNuevosMes || 0} 
            color="text-cairo-orange"
            bgGlow="bg-cairo-orange/10"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 2. TABLA ÚLTIMAS VENTAS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cairo-yellow/5 rounded-full blur-[50px] group-hover:bg-cairo-yellow/10 transition-colors" />
            
            <h2 className="text-3xl font-brand mb-6 flex items-center text-white">
              <Package className="mr-3 text-cairo-yellow" size={24}/> Últimas Ventas
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 font-bold uppercase text-xs tracking-widest border-b border-white/10">
                  <tr>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.ultimasVentas && data.ultimasVentas.length > 0 ? (
                    data.ultimasVentas.map((venta, i) => (
                      <tr key={venta.id} className="hover:bg-white/5 transition-colors group/row">
                        <td className="p-4 text-gray-400 text-sm">{venta.fecha}</td>
                        <td className="p-4 text-white font-medium group-hover/row:text-cairo-yellow transition-colors">{venta.cliente}</td>
                        <td className="p-4 text-white font-bold">${venta.total.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                            ${venta.estado === 'Entregado' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-cairo-orange/10 text-cairo-orange border-cairo-orange/20'}`}>
                            {venta.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                        No hay movimientos recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* 3. ALERTAS DE STOCK */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-8 rounded-3xl border border-cairo-red/20 relative overflow-hidden shadow-[0_0_30px_rgba(217,37,37,0.05)]"
          >
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-cairo-red/10 rounded-full blur-[60px]" />

            <h2 className="text-3xl font-brand mb-6 flex items-center text-cairo-red drop-shadow-sm">
              <AlertTriangle className="mr-3" size={24}/> Stock Crítico
            </h2>

            <div className="space-y-3">
              {data?.productosBajoStock && data.productosBajoStock.length > 0 ? (
                data.productosBajoStock.map((prod, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5 hover:border-cairo-red/40 transition-colors group">
                    <div>
                      <p className="font-bold text-white group-hover:text-cairo-red transition-colors">{prod.descripcion}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Cód: {prod.codigo} • {prod.tipo}</p>
                    </div>
                    <div className="text-center bg-cairo-red/10 px-4 py-2 rounded-lg border border-cairo-red/20 min-w-[70px]">
                      <span className="text-2xl font-brand text-cairo-red block leading-none">{prod.stock}</span>
                      <span className="text-[9px] text-red-300 uppercase font-bold">Unid.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-green-500 bg-green-500/5 rounded-2xl border border-green-500/10">
                    <Package size={40} className="mb-3 opacity-50"/>
                    <p className="font-brand text-xl tracking-wide">¡Todo en Orden!</p>
                    <p className="text-xs text-green-400/60">Stock saludable</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// Componente Tarjeta de Métrica Reutilizable
const MetricCard = ({ icon, title, value, color, bgGlow, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay }}
    className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 ${bgGlow} rounded-full blur-[40px] group-hover:blur-[50px] transition-all`} />
    
    <div className="flex items-center mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-white/5 ${color} border border-white/5 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="ml-4 text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
    </div>
    
    <p className={`text-4xl font-brand text-white relative z-10 drop-shadow-lg`}>{value}</p>
    
    {/* Barra decorativa inferior */}
    <div className={`absolute bottom-0 left-0 h-1 bg-current ${color} w-0 group-hover:w-full transition-all duration-700 opacity-50`} />
  </motion.div>
);

export default Dashboard;