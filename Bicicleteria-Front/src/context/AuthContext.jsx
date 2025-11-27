import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ojo: importación correcta de la librería

const AuthContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // URL Base (ajusta si usas https://localhost:7222)
  const API_URL = 'https://localhost:7222/api/Auth'; 

  // Verificar si ya hay sesión al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Verificamos si el token no ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded); // Guardamos datos del usuario (rol, email, etc.)
          setIsAuthenticated(true);
          // Configuramos axios para que siempre envíe el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // POST al endpoint de Login de tu backend
      const response = await axios.post(`${API_URL}/Login`, { email, password });
      
      // Asumiendo que tu back devuelve { token: "..." } o similar
      // Ajusta esto según tu LoginDTO response. A veces es response.data directamente.
      const token = response.data.token || response.data; 

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      
      setUser(decoded);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true; // Login exitoso
    } catch (error) {
      console.error("Error en login:", error);
      throw error; // Para mostrar error en el formulario
    }
  };

  const register = async (userData) => {
    try {
        // Asumiendo endpoint /Registro
      await axios.post(`${API_URL}/Registro`, userData);
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};