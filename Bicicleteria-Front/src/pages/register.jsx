import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    try {
      await register({
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        password: formData.password
      });
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse. Intenta con otro email.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clases comunes para los inputs
  const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cairo-orange focus:bg-white/5 focus:ring-1 focus:ring-cairo-orange transition-all duration-300";

  return (
    <div className="flex justify-center items-center min-h-screen pt-24 px-4 relative overflow-hidden bg-cairo-dark">
      
      {/* Luces Ambientales (Invertidas respecto al login para variar) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cairo-yellow/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cairo-red/10 rounded-full blur-[100px] -z-10" />

      {/* Tarjeta con Animación */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-8">
          <h2 className="text-5xl font-brand text-white tracking-wide mb-2 drop-shadow-lg">REGISTRO</h2>
          <p className="text-gray-400 text-sm font-medium">Únete a la comunidad El Cairo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center mb-6 font-bold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
            <input 
              name="nombreCompleto"
              type="text" 
              placeholder="Nombre Completo"
              className={inputClasses}
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
            <input 
              name="email"
              type="email" 
              placeholder="Email"
              className={inputClasses}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Contraseña"
              className={inputClasses}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cairo-orange transition-colors" size={20} />
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="Confirmar Contraseña"
              className={inputClasses}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="w-full btn-fire flex items-center justify-center gap-2 mt-8 text-lg group">
            CREAR CUENTA <UserPlus size={20} className="group-hover:scale-110 transition-transform"/>
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500 mb-2">¿Ya tienes cuenta?</p>
          <Link to="/login" className="text-white font-bold hover:text-cairo-yellow transition-colors relative group inline-block">
            Inicia Sesión aquí
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cairo-yellow transition-all group-hover:w-full"></span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Registro;