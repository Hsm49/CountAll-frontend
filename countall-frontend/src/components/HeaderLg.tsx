import React from 'react';
import './css/HeaderLg.css'; // Asegúrate de que este archivo esté presente y contenga los estilos

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        {/* Logo en la izquierda */}
        <div className="logo">
          <img src="../assets/CA4.png" alt="Logo" className="logo-img" />
        </div>

        {/* Botones en la derecha */}
        <div className="auth-buttons">
          <button className="btn-li">Iniciar sesión</button>
          <button className="btn-su">Registrarse</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
