import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); 

  const API_URL = 'http://localhost:5028/api/Dashboard'; 

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
            setError("Sesión expirada.");
        } else if (err.response && err.response.status === 403) {
            setError("Acceso denegado.");
        } else {
            setError("Error de conexión.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [logout]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-cairo-cream-light">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cairo-mustard"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 flex justify-center bg-cairo-cream-light min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center shadow-sm">
            <AlertTriangle className="mr-3"/>
            <span className="font-bold">{error}</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cairo-cream-light p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* TITULO PRINCIPAL */}
        <h1 className="text-5xl font-brand text-cairo-brown mb-10 border-l-8 border-cairo-mustard pl-6">
          PANEL DE CONTROL
        </h1>

        {/* 1. TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card 
            icon={<DollarSign size={32} className="text-cairo-mustard" />} 
            title="Ventas del Mes" 
            value={data ? `$${data.totalVendidoMes.toLocaleString()}` : "$0"} 
          />
          <Card 
            icon={<ShoppingBag size={32} className="text-blue-600" />} 
            title="Pedidos" 
            value={data?.cantidadVentasMes || 0} 
          />
          <Card 
            icon={<Users size={32} className="text-green-600" />} 
            title="Nuevos Clientes" 
            value={data?.clientesNuevosMes || 0} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* 2. TABLA ÚLTIMAS VENTAS */}
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-cairo-brown">
            <h2 className="text-3xl font-brand mb-6 flex items-center text-cairo-brown">
              <Package className="mr-3 text-cairo-mustard" size={28}/> Últimas Ventas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-cairo-mustard/10 text-cairo-brown font-bold uppercase text-sm tracking-wider">
                  <tr>
                    <th className="p-4 rounded-l-lg">Fecha</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 rounded-r-lg">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.ultimasVentas && data.ultimasVentas.length > 0 ? (
                    data.ultimasVentas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-cairo-cream-light transition-colors">
                        <td className="p-4 text-gray-600 font-medium">{venta.fecha}</td>
                        <td className="p-4 text-cairo-brown font-bold">{venta.cliente}</td>
                        <td className="p-4 text-cairo-mustard-dark font-bold text-lg">${venta.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${venta.estado === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {venta.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                        No hay movimientos recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. ALERTAS DE STOCK */}
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-red-500">
            <h2 className="text-3xl font-brand mb-6 flex items-center text-red-600">
              <AlertTriangle className="mr-3" size={28}/> Stock Bajo
            </h2>
            <div className="space-y-4">
              {data?.productosBajoStock && data.productosBajoStock.length > 0 ? (
                data.productosBajoStock.map((prod, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100 hover:shadow-sm transition-shadow">
                    <div>
                      <p className="font-bold text-cairo-brown text-lg">{prod.descripcion}</p>
                      <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Cód: {prod.codigo} • {prod.tipo}</p>
                    </div>
                    <div className="text-center bg-white px-4 py-2 rounded border border-red-200 shadow-sm">
                      <span className="text-2xl font-brand text-red-600 block leading-none">{prod.stock}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Unid.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-green-600 bg-green-50 rounded-lg border border-green-100">
                    <Package size={40} className="mb-2 opacity-50"/>
                    <p className="font-bold text-lg">¡Stock Saludable!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Tarjeta Simple
const Card = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-cairo-mustard flex items-center hover:shadow-md transition-shadow">
    <div className="p-4 bg-cairo-cream-light rounded-full mr-5 border border-cairo-mustard/20">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-brand text-cairo-brown mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;