import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ConfirmSignUp.css';
import Header from './HeaderLg';

const AccountVerified: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
    <Header />
    <div className="confirm-container">
      <h1 className="text-center mb-4">Cuenta verificada</h1>
      <p className="text-center mb-4">
        Se ha verificado la cuenta correctamente.
      </p>
      <div className="text-center mb-4">
        <img src="src/assets/svg/authentication.svg" alt="Correo verificado" className="email-img" />
      </div>
      <div className="buttons-container">
        <button className="btn-naranja" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <button className="btn-azul" onClick={handleBackToHome}>
          Volver al inicio
        </button>
      </div>
    </div>
    </>
  );
};

export default AccountVerified;
