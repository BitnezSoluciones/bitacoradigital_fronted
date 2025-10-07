// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { BitacorasPage } from './BitacorasPage';
import { ReportesDashboard } from './ReportesDashboard';
import Navbar from './components/Navbar';
import './App.css';
import { JSX } from 'react';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente para rutas solo de admin
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!auth.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const auth = useAuth();

  return (
    <>
      {auth.isAuthenticated && <Navbar />}
      
      <div className="app-container">
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <BitacorasPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta solo para admin */}
          <Route 
            path="/reportes" 
            element={
              <AdminRoute>
                <ReportesDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;