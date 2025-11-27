import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Asegúrate de que este puerto coincida con el de Dashboard.jsx
  const API_URL = 'https://localhost:7222/api/Auth';

  useEffect(() => {
    // 1. Configurar Interceptor: "Antes de enviar cualquier petición, haz esto..."
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Enviando Token:", token.substring(0, 10) + "..."); // Depuración
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Verificar Sesión al cargar
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Verificar expiración
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          console.warn("Token expirado");
          logout();
        }
      } catch (error) {
        console.error("Token inválido", error);
        logout();
      }
    }
    setLoading(false);

    // Limpieza del interceptor al desmontar
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      // Manejar si el back devuelve { token: "..." } o el string directo
      const token = response.data.token || response.data;
      
      if (!token) throw new Error("No se recibió token");

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      
      setUser(decoded);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};