// frontend/src/components/Navbar.tsx

import './Navbar.css'; // Importamos los estilos para este componente
import logo from '../assets/logo.png'; // Importamos la imagen del logo

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Geek Depot Logo" />
      </div>
      <div className="navbar-links">
        {/* Aquí irán los futuros enlaces de navegación */}
      </div>
    </nav>
  );
};

export default Navbar;