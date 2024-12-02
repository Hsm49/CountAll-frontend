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

  // Paths that should not show any header
  const noHeaderPaths = [
    '/select-project',
    '/select-team',
    '/set-project-details'
  ];

  // Define titles for different routes
  const titles: { [key: string]: string } = {
    '/': 'CountAll',
    '/tracking': 'Inicio',
    '/gestionar-equipo': 'Gestionar equipo',
    '/tareas': 'Tareas',
    '/avatar': 'Avatar',
    '/configurar-sitios': 'Configurar sitios',
    '/leaderboard': 'Clasificatorias',
    '/usuario': 'Usuario',
    '/estadisticas': 'Estadísticas y tablas',
    '/notificaciones': 'Notificaciones',
    '/profile': 'Mi Perfil',
    '/my-projects': 'Mis Proyectos',
    '/my-teams': 'Mis Equipos',
    '/estimaciones': 'Generar Estimaciones',
    '/mis-estimaciones': 'Mis Estimaciones',
    '/user-manual': 'Manual de Usuario',
    '/leaderboard-config': 'Configurar Clasificatorias',
    '/resumen-proyecto': 'Resumen del Proyecto',
  };

  let currentTitle = titles[location.pathname] || 'Default Title';

  // Determine which header to show based on auth state and current path
  const showPublicHeader = !isLoggedIn || publicOnlyPaths.includes(location.pathname);
  const showPrivateHeader = isLoggedIn && !publicOnlyPaths.includes(location.pathname);
  const showNoHeader = noHeaderPaths.some(path => location.pathname.startsWith(path));

  if (location.pathname.startsWith('/proyecto/')) {
    const projectName = location.pathname.split('/proyecto/')[1];
    currentTitle = `Proyecto`;
  }

  if (location.pathname.startsWith('/equipo/')) {
    const teamName = location.pathname.split('/equipo/')[1];
    currentTitle = `Equipo`;
  }

  return (
    <>
      {showNoHeader ? (
        <div className="main-content no-header">
          {children}
        </div>
      ) : showPrivateHeader ? (
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