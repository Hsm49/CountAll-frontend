import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/ConfirmSignUp.css';

const AccountVerified: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`http://localhost:4444/api/usuario/confirmarUsuario/${token}`);
        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };
    verifyAccount();
  }, [token]);

  return (
    <div className="main-content">
      <div className="confirm-container">
        {verificationStatus === 'loading' && (
          <p className="text-center mb-4">Cargando la verificación...</p>
        )}
        {verificationStatus === 'success' && (
          <>
            <h1 className="text-center mb-4">Cuenta verificada</h1>
            <p className="text-center mb-4">Se ha verificado la cuenta correctamente.</p>
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
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <h1 className="text-center mb-4">Error en la verificación</h1>
            <p className="text-center mb-4">El enlace no es válido o ya ha sido utilizado.</p>
            <div className="buttons-container">
              <button className="btn-azul" onClick={handleBackToHome}>
                Volver al inicio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountVerified;
