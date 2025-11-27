import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // LOGICA IMPORTANTE: Detectar si es Admin
  // .NET a veces guarda el rol con nombres raros, revisamos todas las opciones:
  const roleName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  
  const isAdmin = 
    user?.role === 'Administrador' || 
    user?.Role === 'Administrador' || 
    user?.[roleName] === 'Administrador';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wider text-yellow-500 hover:text-yellow-400 transition">
            EL CAIRO
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-400 transition">Inicio</Link>
            
            {/* Dropdown Productos */}
            <div className="relative group h-full flex items-center">
              <button className="hover:text-yellow-400 flex items-center transition focus:outline-none">
                Productos <span className="ml-1 text-xs">▼</span>
              </button>
              {/* Menú desplegable */}
              <div className="absolute top-10 left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 hidden group-hover:block text-gray-800 border border-gray-200 z-50">
                <Link to="/productos/bicis" className="block px-4 py-2 hover:bg-gray-100 transition">Bicicletas</Link>
                <Link to="/productos/repuestos" className="block px-4 py-2 hover:bg-gray-100 transition">Repuestos</Link>
                <Link to="/productos/accesorios" className="block px-4 py-2 hover:bg-gray-100 transition">Accesorios</Link>
              </div>
            </div>

            {/* BOTÓN DASHBOARD (SOLO VISIBLE SI ES ADMIN) */}
            {isAdmin && (
              <Link 
                to="/dashboard" 
                className="flex items-center text-red-400 font-semibold hover:text-red-300 border border-red-500 px-3 py-1 rounded transition hover:bg-red-500/10"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Acciones de Usuario (Derecha) */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 border-r border-gray-700 pr-4">
                  <User size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-300">
                    {user?.unique_name || user?.sub || "Usuario"}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-white transition flex items-center text-sm"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} className="mr-1" /> Salir
                </button>
              </>
            ) : (
              <div className="space-x-3 text-sm font-medium">
                <Link to="/login" className="hover:text-yellow-400 transition">Ingresar</Link>
                <Link to="/registro" className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition shadow-md">
                  Registrarse
                </Link>
              </div>
            )}
            
            {/* Carrito */}
            <button className="relative p-2 hover:bg-gray-800 rounded-full transition group">
              <ShoppingCart size={22} className="group-hover:text-yellow-400 transition"/>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                0
              </span>
            </button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
               <Menu size={28} />
             </button>
          </div>
        </div>
      </div>
      
      {/* Menú Móvil (Desplegable) */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-4 pb-6 space-y-3 shadow-inner">
          <Link to="/" className="block py-2 text-gray-300 hover:text-white border-b border-gray-700">Inicio</Link>
          <Link to="/productos" className="block py-2 text-gray-300 hover:text-white border-b border-gray-700">Productos</Link>
          
          {isAdmin && (
            <Link to="/dashboard" className="block py-2 text-red-400 font-bold border-b border-gray-700">
              ⚡ Ir al Dashboard
            </Link>
          )}

          {!isAuthenticated ? (
             <div className="pt-2 flex flex-col space-y-2">
               <Link to="/login" className="block text-center py-2 border border-gray-600 rounded text-gray-300">Iniciar Sesión</Link>
               <Link to="/registro" className="block text-center py-2 bg-yellow-500 text-gray-900 rounded font-bold">Registrarse</Link>
             </div>
          ) : (
             <button onClick={handleLogout} className="w-full text-left py-2 text-gray-400 hover:text-white flex items-center">
               <LogOut size={18} className="mr-2"/> Cerrar Sesión
             </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;