import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registro from './pages/register';

// Componente de seguridad: Solo deja pasar si es Admin
const RutaProtegidaAdmin = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Cargando permisos...</div>;
  
  // Si no está logueado, lo mandamos al login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Lógica ROBUSTA para detectar el rol (igual que en el Navbar)
  const roleName = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const isAdmin = 
    user?.role === 'Administrador' || 
    user?.Role === 'Administrador' || 
    user?.[roleName] === 'Administrador';

  // Si es admin, mostramos la página. Si no, lo mandamos al inicio.
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar />
          
          <main className="grow">
            <Routes>
              {/* Ruta Pública: Inicio */}
              <Route path="/" element={
                <div className="text-center mt-20">
                  <h1 className="text-4xl font-bold text-gray-800">Bienvenido a El Cairo</h1>
                  <p className="text-gray-600 mt-4">La mejor tienda de bicicletas</p>
                </div>
              } />
              
              {/* Rutas de Autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registro />} />

              {/* RUTA DEL DASHBOARD (Esta es la que te faltaba o fallaba) */}
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;