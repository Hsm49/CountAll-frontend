import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/ConfirmSignUp.css';

const ConfirmSignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Recuperar el email del state de la navegación
  const email = location.state?.email || localStorage.getItem('signupEmail');

  const handleResendEmail = async () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el correo electrónico para reenviar la confirmación',
      });
      return;
    }

    setIsLoading(true);

    try {
      const resendResponse = await fetch('http://localhost:4444/api/usuario/reenviarCorreoConfirmacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_usuario: email }),
      });

      const data = await resendResponse.json();

      if (!resendResponse.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Error al reenviar el correo');
      }

      Swal.fire({
        icon: 'success',
        title: 'Correo reenviado',
        text: 'Se ha reenviado el correo de confirmación exitosamente',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al reenviar el correo de confirmación',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem('signupEmail'); // Limpiar el email almacenado
    navigate('/login');
  };

  return (
    <>
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
            <button 
              className="btn-naranja" 
              onClick={handleResendEmail}
              disabled={isLoading}
            >
              {isLoading ? 'Reenviando...' : 'Reenviar correo'}
            </button>
            <button 
              className="btn-azul" 
              onClick={handleBackToHome}
              disabled={isLoading}
            >
              Volver al inicio
            </button>
          </div>
          {email && (
            <p className="text-center mt-3 text-muted">
              Se enviará el correo a: {email}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmSignUp;