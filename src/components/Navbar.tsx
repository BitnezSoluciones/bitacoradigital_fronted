// frontend/src/components/Navbar.tsx

import { Link } from 'react-router-dom'; // 1. Importamos Link
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="Bitnez Soluciones Logo" />
          <h1 className="navbar-title">Bitácora Digital</h1>
        </div>
      </Link>
      <div className="navbar-links">
        {/* 2. Usamos Link en lugar de <a> */}
        <Link to="/" className="nav-link">Bitácoras</Link>
        <Link to="/reportes" className="nav-link">Reportes</Link>
      </div>
    </nav>
  );
};

export default Navbar;