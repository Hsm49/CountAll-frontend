import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ConfirmSignUp.css';
import authenticationImage from '../assets/svg/authentication.svg'; // Importa la imagen

const InvitationAccepted: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`http://localhost:4444/api/equipo/aceptarInvitacion/${token}`);
        if (response.ok) {
          setVerificationStatus('success');
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
          <p className="text-center mb-4">Cargando la invitación...</p>
        )}
        {verificationStatus === 'success' && (
          <>
            <h1 className="text-center mb-4">Has aceptado la invitación a este equipo</h1>
            <p className="text-center mb-4">La invitación se na procesado adecuadamente. Puedes cerrar esta pestaña.</p>
            <div className="text-center mb-4">
              <img src={authenticationImage} alt="Correo verificado" className="email-img" /> {/* Usa la imagen importada */}
            </div>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <h1 className="text-center mb-4">Error en la invitación</h1>
            <p className="text-center mb-4">El enlace no es válido o ya ha sido utilizado.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default InvitationAccepted;
