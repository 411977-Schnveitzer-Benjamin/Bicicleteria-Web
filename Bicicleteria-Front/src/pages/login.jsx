import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-24 px-4 relative overflow-hidden bg-cairo-dark">
      
      {/* Luces Ambientales de Fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cairo-red/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cairo-yellow/10 rounded-full blur-[120px] -z-10" />

      {/* Tarjeta con Animación */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl shadow-cairo-red/10"
      >
        <div className="text-center mb-8">
          <h2 className="text-5xl font-brand text-white tracking-wide mb-2 drop-shadow-lg">BIENVENIDO</h2>
          <p className="text-gray-400 text-sm font-medium">Accede al panel de control</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center mb-6 font-bold"
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-cairo-yellow text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
              <input 
                type="email" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cairo-orange focus:bg-white/5 focus:ring-1 focus:ring-cairo-orange transition-all duration-300"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-cairo-yellow text-xs font-bold uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
              <input 
                type="password" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cairo-orange focus:bg-white/5 focus:ring-1 focus:ring-cairo-orange transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="w-full btn-fire flex items-center justify-center gap-2 mt-6 group">
            INGRESAR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500 mb-2">¿No tienes cuenta?</p>
          <Link to="/registro" className="text-white font-bold hover:text-cairo-yellow transition-colors inline-flex items-center gap-1 group relative">
            Crear una cuenta nueva
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cairo-yellow transition-all group-hover:w-full"></span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;