import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLoggedIn from './HeaderLoggedIn';
import HeaderLg from './HeaderLg';
import './css/DefaultLayout.css';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual login check
  const location = useLocation();

  // Paths that should always show HeaderLg
  const publicPaths = [
    '/',
    '/confirm-sign-up',
    '/new-password',
    '/password-saved',
    '/recover-password',
    '/recover-sent',
    '/login',
    '/sign-up'
  ];

  const showHeaderLg = publicPaths.includes(location.pathname);

  // Define titles for different routes
  const titles: { [key: string]: string } = {
    '/tracking': 'Inicio',
    '/gestionar-equipo': 'Gestionar equipo',
    '/tareas': 'Tareas',
    '/avatar': 'Avatar',
    '/configurar-sitios': 'Configurar sitios',
    '/leaderboard': 'Clasificatorias',
    '/usuario': 'Usuario',
    '/statistics': 'Estadísticas',
    '/notificaciones': 'Notificaciones',
  };

  const currentTitle = titles[location.pathname] || 'Default Title';

  return (
    <>
      {showHeaderLg || !isLoggedIn ? (
        <>
          <HeaderLg />
          <div className={`main-content public-path`}>
            {children}
          </div>
        </>
      ) : (
        <HeaderLoggedIn title={currentTitle}>
          <div className={`main-content private-path`}>
            {children}
          </div>
        </HeaderLoggedIn>
      )}
    </>
  );
};

export default DefaultLayout;