import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificamos si es admin buscando el rol en el token
  // Nota: Ajusta "Administrador" según cómo lo guardes en la BD (Role o role, mayúscula o minúscula)
  const isAdmin = user?.role === 'Administrador' || user?.Role === 'Administrador' || user?.rol === 'Administrador';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wider text-yellow-500">
            EL CAIRO
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-400 transition">Inicio</Link>
            
            {/* Dropdown Productos (Simple con CSS group-hover) */}
            <div className="relative group">
              <button className="hover:text-yellow-400 flex items-center transition">
                Productos <span className="ml-1 text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 hidden group-hover:block text-gray-800">
                <Link to="/productos/bicis" className="block px-4 py-2 hover:bg-gray-100">Bicicletas</Link>
                <Link to="/productos/repuestos" className="block px-4 py-2 hover:bg-gray-100">Repuestos</Link>
                <Link to="/productos/accesorios" className="block px-4 py-2 hover:bg-gray-100">Accesorios</Link>
              </div>
            </div>

            {/* Link Dashboard (Solo Admin) */}
            {isAdmin && (
              <Link to="/dashboard" className="text-red-400 font-semibold hover:text-red-300 border border-red-500 px-3 py-1 rounded">
                Dashboard
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">{user?.unique_name || user?.Nombre || "Usuario"}</span>
                </div>
                <button onClick={handleLogout} title="Cerrar Sesión">
                  <LogOut size={20} className="text-gray-400 hover:text-red-500 transition" />
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-3 py-1 text-sm hover:text-white text-gray-300">Login</Link>
                <Link to="/registro" className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm font-bold hover:bg-yellow-400 transition">
                  Registro
                </Link>
              </div>
            )}
            
            {/* Carrito siempre visible */}
            <button className="relative p-2 hover:bg-gray-800 rounded-full transition">
              <ShoppingCart size={22} />
              {/* Badge contador (ejemplo) */}
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu (Básico) */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block py-2 hover:text-yellow-400">Inicio</Link>
          <Link to="/productos" className="block py-2 hover:text-yellow-400">Productos</Link>
          {isAdmin && <Link to="/dashboard" className="block py-2 text-red-400">Dashboard</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;