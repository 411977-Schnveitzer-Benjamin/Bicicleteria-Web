// src/components/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de tu API (Ajusta el puerto si es necesario, ej: 7222 para https)
  const API_URL = 'https://localhost:7222/api/Dashboard';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // NOTA: Cuando tengas Login, aquí iría: headers: { Authorization: `Bearer ${token}` }
        // Por ahora intentaremos la petición directa (asegúrate de permitir CORS en el back)
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        console.error(err);
        // Si falla (ej. por falta de permisos/token), mostramos datos falsos de prueba
        // para que puedas ver el diseño mientras arreglamos el login.
        setError('No se pudo conectar (¿Falta Login?). Mostrando datos de prueba...');
        
        // DATOS DE PRUEBA (SOLO PARA DISEÑO)
        setData({
          totalVendidoMes: 150000,
          cantidadVentasMes: 24,
          clientesNuevosMes: 5,
          ultimasVentas: [
            { id: 1, fecha: '27/11/2025', cliente: 'Juan Perez', total: 12000, estado: 'Entregado' },
            { id: 2, fecha: '26/11/2025', cliente: 'Ana Gomez', total: 4500, estado: 'Pendiente' },
          ],
          productosBajoStock: [
             { descripcion: 'Cámara Rodado 29', codigo: 'CAM-29', stock: 2, tipo: 'Repuesto' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 text-center text-xl">Cargando métricas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración - El Cairo</h1>
        
        {error && (
           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
             <p className="font-bold">Modo Diseño</p>
             <p>{error}</p>
           </div>
        )}

        {/* 1. Tarjetas Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            icon={<DollarSign size={28} className="text-green-600" />} 
            title="Ventas del Mes" 
            value={`$${data?.totalVendidoMes?.toLocaleString()}`} 
            color="bg-green-100"
          />
          <Card 
            icon={<ShoppingBag size={28} className="text-blue-600" />} 
            title="Pedidos Realizados" 
            value={data?.cantidadVentasMes} 
            color="bg-blue-100"
          />
          <Card 
            icon={<Users size={28} className="text-purple-600" />} 
            title="Nuevos Clientes" 
            value={data?.clientesNuevosMes} 
            color="bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 2. Tabla Últimas Ventas */}
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
                  {data?.ultimasVentas?.map((venta) => (
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
                  ))}
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
                  <div className="text-center bg-white px-3 py-1 rounded shadow-sm">
                    <span className="text-xl font-bold text-red-600 block leading-none">{prod.stock}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Unidades</span>
                  </div>
                </div>
              ))}
              {(!data?.productosBajoStock || data.productosBajoStock.length === 0) && (
                <p className="text-green-600 text-center py-4 bg-green-50 rounded">¡Stock saludable!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para las tarjetas de arriba
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