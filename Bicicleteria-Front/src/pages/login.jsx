import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      setError('Credenciales incorrectas.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cairo-cream-light px-4">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md border-t-8 border-cairo-mustard">
        
        <h2 className="text-5xl font-brand text-center text-cairo-brown mb-2">BIENVENIDO</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Ingresa a tu cuenta El Cairo</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-bold text-center mb-6 border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-cairo-brown font-bold text-sm uppercase tracking-wide mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-cairo-brown font-bold text-sm uppercase tracking-wide mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="w-full btn-cairo text-lg py-3 tracking-widest uppercase shadow-md hover:shadow-lg transform active:scale-95 transition-all">
            Ingresar
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">¿No tienes cuenta?</p>
          <Link to="/registro" className="text-cairo-mustard font-bold hover:text-cairo-brown transition-colors text-lg">
            Crear Cuenta Nueva
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;