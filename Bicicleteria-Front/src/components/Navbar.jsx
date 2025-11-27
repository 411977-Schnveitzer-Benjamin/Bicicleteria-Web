import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lógica Admin
  const roleName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const isAdmin = user?.role === 'Administrador' || user?.Role === 'Administrador' || user?.[roleName] === 'Administrador';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Barra Flotante Glassmorphism */}
          <div className="glass-panel rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-cairo-red/5">
            
            {/* --- LOGO LIMPIO --- */}
            <Link to="/" className="flex items-center">
              <img 
                src="/img/Logo.png" 
                alt="El Cairo Logo" 
                // CAMBIOS AQUÍ:
                // 1. h-14 w-auto: Altura fija un poco más grande, ancho automático para no deformar.
                // 2. Quitados: rounded-full, border, object-cover, shadow-lg (caja).
                // 3. Añadidos: hover:scale-105 (crece sutilmente) y hover:drop-shadow (resplandor naranja).
                className="h-14 w-auto transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(242,100,25,0.6)]" 
              />
            </Link>
            {/* ------------------- */}

            {/* MENÚ ESCRITORIO */}
            <div className="hidden md:flex items-center space-x-8 font-medium text-sm">
              {['Inicio', 'Productos', 'Nosotros'].map((item) => (
                <Link 
                  key={item} 
                  to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} 
                  className="relative text-gray-300 hover:text-white transition-colors group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cairo-orange transition-all group-hover:w-full"/>
                </Link>
              ))}

              {isAdmin && (
                <Link to="/dashboard" className="text-cairo-red font-bold uppercase tracking-wider text-xs border border-cairo-red/30 px-3 py-1 rounded-full hover:bg-cairo-red hover:text-white transition-all">
                  Dashboard
                </Link>
              )}
            </div>

            {/* ACCIONES */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-gray-400">Hola,</p>
                    <p className="text-sm font-bold text-cairo-yellow leading-none">
                      {user?.unique_name || "Ciclista"}
                    </p>
                  </div>
                  <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Salir">
                    <LogOut size={18} className="text-gray-300 hover:text-cairo-red"/>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold text-white hover:text-cairo-yellow">Login</Link>
                  <Link to="/registro" className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-cairo-yellow transition-colors">
                    Registro
                  </Link>
                </div>
              )}

              <button className="relative p-2 bg-white/5 rounded-full hover:bg-cairo-orange/20 transition-colors group">
                <ShoppingCart size={20} className="text-white group-hover:text-cairo-orange transition-colors"/>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cairo-red rounded-full text-[10px] flex items-center justify-center font-bold">0</span>
              </button>
            </div>

            {/* Botón Móvil */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-cairo-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white hover:text-cairo-red">
              <X size={40} />
            </button>
            
            {/* Logo grande limpio en móvil también */}
            <img 
              src="/img/Logo.png" 
              alt="El Cairo Logo" 
              className="h-28 w-auto mb-6 hover:drop-shadow-[0_0_25px_rgba(242,100,25,0.8)] transition-all duration-500" 
            />

            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-brand text-5xl hover:text-cairo-yellow transition-colors">INICIO</Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)} className="font-brand text-5xl hover:text-cairo-orange transition-colors">PRODUCTOS</Link>
            {isAuthenticated ? (
               <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="font-brand text-5xl text-gray-500 hover:text-cairo-red transition-colors">SALIR</button>
            ) : (
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-brand text-5xl text-cairo-red hover:text-white transition-colors">INGRESAR</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;