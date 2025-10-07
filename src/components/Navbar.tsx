// frontend/src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext'; // 1. Importa useAuth

export const Navbar = () => {
  const auth = useAuth(); // 2. Usa el hook de autenticación
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout(); // 3. Llama a la función de logout del contexto
    navigate('/login'); // Opcional: redirige al login
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="Bitnez Soluciones Logo" />
          <h1 className="navbar-title">Bitácora Digital</h1>
        </div>
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Bitácoras</Link>
        <Link to="/reportes" className="nav-link">Reportes</Link>
        <Link to="/logout" className="nav-link logout-btn">Cerrar Sesión</Link>
      </div>
    </nav>
  );
};

export default Navbar;