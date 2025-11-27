import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      alert('¡Cuenta creada con éxito!');
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse. Intenta con otro email.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cairo-cream-light px-4 py-10">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md border-t-8 border-cairo-brown">
        
        <h2 className="text-5xl font-brand text-center text-cairo-brown mb-2">REGISTRO</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Únete a la comunidad El Cairo</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-bold text-center mb-6 border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" placeholder="Nombre Completo"
            className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
            value={formData.nombreCompleto}
            onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Email"
            className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Contraseña"
            className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Repetir Contraseña"
            className="w-full p-3 border-2 border-gray-200 rounded focus:outline-none focus:border-cairo-mustard transition-colors bg-gray-50"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          
          <button type="submit" className="w-full bg-cairo-brown text-white font-bold py-3 px-4 rounded hover:bg-cairo-mustard transition-colors uppercase tracking-widest text-lg shadow-md mt-4">
            Crear Cuenta
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">¿Ya tienes cuenta?</p>
          <Link to="/login" className="text-cairo-brown font-bold hover:text-cairo-mustard transition-colors text-lg">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;