// frontend/src/App.tsx
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { BitacorasPage } from './BitacorasPage';
import { ReportesDashboard } from './ReportesDashboard';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { useAuth } from './context/AuthContext';
import { JSX } from 'react';

// Componente Layout para rutas protegidas
const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Outlet /> {/* Outlet renderiza el componente hijo de la ruta */}
      </div>
    </>
  );
};

// Componente para proteger rutas individuales
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* 2. Añade la nueva ruta para el logout */}
      <Route path="/logout" element={<LogoutPage />} />

      {/* Rutas Protegidas */}
      <Route 
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<BitacorasPage />} />
        <Route path="/reportes" element={<ReportesDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;