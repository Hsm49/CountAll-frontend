import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import HeaderLg from '../components/HeaderLg';
import SignUp from '../components/SignUp';
import ConfirmSignUp from '../components/ConfirmSignUp';
import AccountVerified from '../components/AccountVerified';
import RecoverPassword from '../components/RecoverPassword';
import RecoverSent from '../components/RecoverSent';
import NewPassword from '../components/NewPassword';
import PasswordSaved from '../components/PasswordSaved';
import LandingPage from '../components/LandingPage';
import Leaderboard from '../components/Leaderboard';
import Tracking from '../components/Tracking';
import PrivateRoute from '../components/PrivateRoute';
import Estadisticas from '../components/Statistics'
import ManageSites from '../components/ManageSites';
import Notifications from '../components/Notifications';
import ManageTeam from '../components/ManageTeam';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/header" element={<HeaderLg />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/confirm-sign-up" element={<ConfirmSignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/password-saved" element={<PasswordSaved />} />
      <Route path="/verify-account" element={<AccountVerified />} />
      <Route path="/recover-sent" element={<RecoverSent />} />
      <Route path="/" element={<LandingPage />} />

      {/* Private Routes */}
      <Route
        path="/tracking"
        element={
          <PrivateRoute>
            <Tracking />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        }
      />
      
      <Route path="/estadisticas" element={
        <PrivateRoute>
          <Estadisticas />
        </PrivateRoute>
        } 
        />

      <Route
        path="/configurar-sitios"
        element={
          <PrivateRoute>
            <ManageSites />
          </PrivateRoute>
        }
      />

      <Route
        path="/notificaciones"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />

      <Route
        path="/gestionar-equipo"
        element={
          <PrivateRoute>
            <ManageTeam />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;