import React from 'react';
import './css/HeaderLg.css';
import { useNavigate } from 'react-router-dom';

const HeaderLg: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img
            src="src/assets/img/logos/CA2.png"
            alt="Logo"
            className="logo-img"
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="auth-buttons">
          <button className="btn-li" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className="btn-su" onClick={() => navigate('/sign-up')}>
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderLg;