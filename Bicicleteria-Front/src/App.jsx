import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './pages/login';
import Registro from './pages/register';

// Componente para proteger rutas (Solo Admins)
const RutaProtegidaAdmin = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // Verifica el rol (ajusta "Administrador" según tu BD)
  const isAdmin = user?.role === 'Administrador' || user?.rol === 'Administrador';
  
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Ruta pública */}
              <Route path="/" element={<h1 className="text-3xl text-center mt-10">Bienvenido a El Cairo</h1>} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Ruta Protegida: Dashboard */}
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
          {/* Aquí podrías poner un Footer */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;