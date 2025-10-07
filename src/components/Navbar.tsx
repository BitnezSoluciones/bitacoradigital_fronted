// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      auth.logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="Geek Depot Logo" />
        </div>
      </Link>
      
      <div className="navbar-center">
        <Link to="/" className="nav-link">Bitácoras</Link>
        {auth.isAdmin && (
          <Link to="/reportes" className="nav-link">Reportes</Link>
        )}
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          👤 {auth.user?.username}
          {auth.isAdmin && <span className="admin-badge">ADMIN</span>}
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;  