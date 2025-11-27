import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto para saber si hay error de auth

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); // Para cerrar sesión si el token venció

  // Asegúrate de usar el mismo puerto que en AuthContext (5028 http o 7222 https)
  const API_URL = 'http://localhost:2777/api/Dashboard'; 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // La petición GET enviará automáticamente el token gracias a AuthContext
        const response = await axios.get(API_URL);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        if (err.response && err.response.status === 401) {
            setError('Tu sesión ha expirado. Por favor ingresa nuevamente.');
            // Opcional: logout(); 
        } else {
            setError('Error al conectar con el servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [logout]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
      Cargando métricas...
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <AlertTriangle className="inline-block mr-2 mb-1"/>
            {error}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h1>

        {/* 1. Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            icon={<DollarSign size={28} className="text-green-600" />} 
            title="Ventas del Mes" 
            value={data ? `$${data.totalVendidoMes.toLocaleString()}` : "$0"} 
            color="bg-green-100"
          />
          <Card 
            icon={<ShoppingBag size={28} className="text-blue-600" />} 
            title="Pedidos Realizados" 
            value={data?.cantidadVentasMes || 0} 
            color="bg-blue-100"
          />
          <Card 
            icon={<Users size={28} className="text-purple-600" />} 
            title="Nuevos Clientes" 
            value={data?.clientesNuevosMes || 0} 
            color="bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 2. Últimas Ventas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-700">
              <Package className="mr-2" size={20}/> Últimas Ventas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.ultimasVentas?.length > 0 ? (
                    data.ultimasVentas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-600">{venta.fecha}</td>
                        <td className="p-3 font-medium text-gray-800">{venta.cliente}</td>
                        <td className="p-3 font-bold text-gray-700">${venta.total.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${venta.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {venta.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400">No hay ventas recientes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Alertas de Stock */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
            <h2 className="text-xl font-bold mb-4 flex items-center text-red-600">
              <AlertTriangle className="mr-2" size={20}/> Alertas de Stock Bajo
            </h2>
            <div className="space-y-3">
              {data?.productosBajoStock?.map((prod, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-bold text-gray-800">{prod.descripcion}</p>
                    <p className="text-xs text-gray-500">Cód: {prod.codigo} | {prod.tipo}</p>
                  </div>
                  <div className="text-center bg-white px-3 py-1 rounded shadow-sm border border-red-100">
                    <span className="text-xl font-bold text-red-600 block leading-none">{prod.stock}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Unidades</span>
                  </div>
                </div>
              ))}
              
              {(!data?.productosBajoStock || data.productosBajoStock.length === 0) && (
                <div className="flex flex-col items-center justify-center h-32 text-green-600 bg-green-50 rounded-lg">
                    <Package size={32} className="mb-2 opacity-50"/>
                    <p className="font-medium">¡Stock Saludable!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para tarjetas
const Card = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition hover:shadow-md">
    <div className={`p-4 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;