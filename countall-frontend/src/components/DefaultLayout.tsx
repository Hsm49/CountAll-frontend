import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLoggedIn from './HeaderLoggedIn';
import HeaderLg from './HeaderLg';
import './css/DefaultLayout.css';
import { useAuth } from '../context/AuthContext';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Paths that should always show HeaderLg even when logged in
  const publicOnlyPaths = [
    '/login',
    '/sign-up',
    '/confirm-sign-up',
    '/new-password',
    '/password-saved',
    '/recover-password',
    '/recover-sent',
  ];

  // Define titles for different routes
  const titles: { [key: string]: string } = {
    '/tracking': 'Inicio',
    '/gestionar-equipo': 'Gestionar equipo',
    '/tareas': 'Tareas',
    '/avatar': 'Avatar',
    '/configurar-sitios': 'Configurar sitios',
    '/leaderboard': 'Clasificatorias',
    '/usuario': 'Usuario',
    '/estadisticas': 'Estadísticas y tablas',
    '/notificaciones': 'Notificaciones',
  };

  const currentTitle = titles[location.pathname] || 'Default Title';

  // Determine which header to show based on auth state and current path
  const showPublicHeader = !isLoggedIn || publicOnlyPaths.includes(location.pathname);
  const showPrivateHeader = isLoggedIn && !publicOnlyPaths.includes(location.pathname);

  return (
    <>
      {showPrivateHeader ? (
        <HeaderLoggedIn title={currentTitle}>
          <div className="main-content private-path">
            {children}
          </div>
        </HeaderLoggedIn>
      ) : (
        <>
          {showPublicHeader && <HeaderLg />}
          <div className="main-content public-path">
            {children}
          </div>
        </>
      )}
    </>
  );
};

export default DefaultLayout;