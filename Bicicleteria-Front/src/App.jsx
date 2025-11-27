import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion'; // Importamos animación
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registro from './pages/register';
import { ArrowRight, Zap, Shield, Trophy } from 'lucide-react'; // Iconos

// Seguridad Admin
const RutaProtegidaAdmin = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  const roleName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const isAdmin = user?.role === 'Administrador' || user?.Role === 'Administrador' || user?.[roleName] === 'Administrador';
  return isAdmin ? children : <Navigate to="/" />;
};

// Componente Home "Magic"
const Home = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      
      {/* HERO SECTION */}
      <div className="flex flex-col items-center text-center mb-24 relative">
        {/* Fondo de luz ambiental */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cairo-orange/20 rounded-full blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cairo-yellow text-xs font-bold uppercase tracking-widest mb-4">
            Nueva Colección 2025
          </span>
          <h1 className="text-7xl md:text-9xl font-brand leading-none mb-6">
            <span className="text-white">ROMPÉ TUS</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cairo-red via-cairo-orange to-cairo-yellow animate-shine bg-[length:200%_auto]">
              LÍMITES
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            Bicicletas de alta gama, repuestos y equipamiento profesional. 
            Calidad garantizada para ciclistas que exigen lo máximo.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/productos" className="btn-fire flex items-center gap-2">
              Ver Catálogo <ArrowRight size={20} />
            </Link>
            <Link to="/contacto" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 font-bold transition-colors">
              Contactar
            </Link>
          </div>
        </motion.div>
      </div>

      {/* BENTO GRID (Estilo Magic UI) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24"
      >
        {/* Card Grande */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-8 min-h-[300px] relative overflow-hidden group cursor-pointer hover:border-cairo-orange/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-cairo-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-4xl font-brand relative z-10">Bicicletas de Montaña</h3>
          <p className="text-gray-400 mt-2 relative z-10">Conquistá cualquier terreno con nuestra serie Pro.</p>
          {/* Aquí podrías poner una imagen de bici */}
          <div className="absolute bottom-4 right-4 bg-cairo-red p-3 rounded-full text-white transform translate-y-10 group-hover:translate-y-0 transition-transform">
             <ArrowRight />
          </div>
        </div>

        {/* Card Pequeña 1 */}
        <div className="glass-panel rounded-3xl p-8 min-h-[300px] flex flex-col justify-between group hover:border-cairo-yellow/50 transition-colors">
          <Zap className="text-cairo-yellow w-12 h-12 mb-4" />
          <div>
            <h3 className="text-3xl font-brand">E-Bikes</h3>
            <p className="text-gray-400 text-sm mt-1">Potencia eléctrica para llegar más lejos.</p>
          </div>
        </div>

        {/* Card Pequeña 2 */}
        <div className="glass-panel rounded-3xl p-8 min-h-[250px] flex flex-col justify-between group hover:border-cairo-orange/50 transition-colors">
          <Trophy className="text-cairo-orange w-12 h-12 mb-4" />
          <div>
            <h3 className="text-3xl font-brand">Competición</h3>
            <p className="text-gray-400 text-sm mt-1">Equipamiento oficial de carrera.</p>
          </div>
        </div>

        {/* Card Mediana */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-8 min-h-[250px] flex items-center justify-between group hover:border-cairo-red/50 transition-colors">
           <div>
             <h3 className="text-4xl font-brand">Repuestos & Taller</h3>
             <p className="text-gray-400 mt-2">Mantené tu nave siempre a punto.</p>
           </div>
           <Shield className="text-cairo-red w-24 h-24 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>

      {/* MARQUEE (Texto corriendo) */}
      <div className="overflow-hidden py-10 border-y border-white/5 mb-20 bg-cairo-dark/50">
         <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-10">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-6xl font-brand text-white/10 mx-8">
                EL CAIRO • RIDE YOUR WAY •
              </span>
            ))}
         </div>
      </div>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-cairo-dark text-white selection:bg-cairo-orange selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <RutaProtegidaAdmin>
                    <Dashboard />
                  </RutaProtegidaAdmin>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer Simple */}
          <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
            <p>© 2025 El Cairo Bicicletas. Diseñado para la velocidad.</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;