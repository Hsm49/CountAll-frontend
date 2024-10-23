import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ConfirmSignUp.css';
import Header from './HeaderLg';

const PasswordSaved: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/login');
  };

  return (
    <>
    <Header />
    <div className="main-content">
      <div className="confirm-container">
        <h1 className="text-center mb-4">Contraseña guardada</h1>
        <p className="text-center mb-4">
          La nueva contraseña se ha guardado correctamente.
          Inicia sesión para continuar.
        </p>
        <div className="text-center mb-4 mt-5">
          <img src="src/assets/svg/password3.svg" alt="Correo enviado" className="secure-img" />
        </div>
        <div className="buttons-container">
          <button className="btn-azul" onClick={handleBackToHome}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PasswordSaved;
