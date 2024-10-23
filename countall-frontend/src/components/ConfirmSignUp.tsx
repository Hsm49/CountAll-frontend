import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ConfirmSignUp.css';
import Header from './HeaderLg';

const ConfirmSignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleResendEmail = () => {
    // Lógica para reenviar el correo
    alert('Correo de confirmación reenviado.');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
    <Header />
    <div className="main-content">
    <div className="confirm-container">
      <h1 className="text-center mb-4">Registro exitoso</h1>
      <p className="text-center mb-4">
        Por favor revisa tu email para continuar con el registro.
      </p>
      <div className="text-center mb-4">
        <img src="src/assets/svg/email.svg" alt="Correo enviado" className="email-img" />
      </div>
      <div className="buttons-container">
        <button className="btn-naranja" onClick={handleResendEmail}>
          Reenviar correo
        </button>
        <button className="btn-azul" onClick={handleBackToHome}>
          Volver al inicio
        </button>
      </div>
    </div>
    </div>
    </>
  );
};

export default ConfirmSignUp;
