// frontend/src/LogoutPage.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export const LogoutPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // En cuanto este componente se cargue, cierra la sesión y redirige.
    auth.logout();
    navigate('/login');
  }, [auth, navigate]); // El efecto se ejecuta una sola vez

  // Este componente no necesita mostrar nada, ya que redirige inmediatamente.
  return null;
};