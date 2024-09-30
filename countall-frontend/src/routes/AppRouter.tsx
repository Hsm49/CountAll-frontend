import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import HeaderLg from '../components/HeaderLg';
import SignUp from '../components/SignUp';
import ConfirmSignUp from '../components/ConfirmSignUp';
import AccountVerified from '../components/AccountVerified';
import RecoverPassword from '../components/RecoverPassword';
import RecoverSent from '../components/RecoverSent';
import NewPassword from '../components/NewPassword';
import PasswordSaved from '../components/PasswordSaved';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el header */}
        <Route path="/header" element={<HeaderLg />} />

        {/* Ruta para registrarse */}
        <Route path="/sign-up" element={<SignUp />} /> 

        {/* Ruta para confirmar correo */}
        <Route path="/confirm-sign-up" element={<ConfirmSignUp />} /> 

        {/* Ruta para recuperar contraseña */}
        <Route path="/recover-password" element={<RecoverPassword />} /> 

        {/* Ruta para crear nueva contraseña */}
        <Route path="/new-password" element={<NewPassword />} />

        {/* Ruta de contraseña guardada*/}
        <Route path="/password-saved" element={<PasswordSaved />} />

        {/* Ruta de verificación de cuenta */}
        <Route path="/verify-account" element={<AccountVerified />} /> 

         {/* Ruta de correo de recuperación enviado */}
         <Route path="/recover-sent" element={<RecoverSent />} /> 

        {/* Ruta raíz que redirige a login */}
        <Route path="/" element={<Login />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
