import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, menuClasses } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCog, FaHome, FaUsers, FaTasks, FaUser, FaCogs, 
         FaTrophy, FaUserCircle, FaChartBar, FaBellSlash } from 'react-icons/fa';
import './css/HeaderLoggedIn.css';
import axios from 'axios';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

interface Usuario {
  url_avatar: string;
  nombre_usuario: string;
  name_usuario: string;
  surname_usuario: string;
}

interface HeaderLoggedInProps {
  title: string;
  children: React.ReactNode;
}

const HeaderLoggedIn: React.FC<HeaderLoggedInProps> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUsuario(response.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: themes[theme].menu.hover.backgroundColor,
        color: themes[theme].menu.hover.color,
      },
    },
  };

  return (
    <div className="layout-container">
      <Sidebar
        collapsed={collapsed}
        backgroundColor={themes[theme].sidebar.backgroundColor}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
        width="250px"
        breakPoint="md"
      >
        <div className="sidebar-header">
          <img 
            src={collapsed ? "src/assets/img/logos/CA3.png" : "src/assets/img/logos/CA2.png"} 
            alt="Logo" 
            className={`logo ${collapsed ? 'collapsed' : ''}`} 
          />
        </div>
        <Menu menuItemStyles={menuItemStyles}>
          <MenuItem icon={<FaHome />} onClick={() => navigate('/tracking')}>Inicio</MenuItem>
          <MenuItem icon={<FaUsers />} onClick={() => navigate('/gestionar-equipo')}>Gestionar equipo</MenuItem>
          <MenuItem icon={<FaTasks />} onClick={() => navigate('/tareas')}>Tareas</MenuItem>
          <MenuItem icon={<FaUser />} onClick={() => navigate('/avatar')}>Avatar</MenuItem>
          <MenuItem icon={<FaCogs />} onClick={() => navigate('/configurar-sitios')}>Configurar sitios</MenuItem>
          <MenuItem icon={<FaTrophy />} onClick={() => navigate('/leaderboard')}>Clasificatorias</MenuItem>
          <MenuItem icon={<FaUserCircle />} onClick={() => navigate('/usuario')}>Usuario</MenuItem>
          <MenuItem icon={<FaChartBar />} onClick={() => navigate('/estadisticas')}>Estadísticas</MenuItem>
          <MenuItem icon={<FaBellSlash />} onClick={() => navigate('/notificaciones')}>Notificaciones</MenuItem>
        </Menu>
      </Sidebar>

      <div className={`main-layout ${collapsed ? 'collapsed' : ''}`}>
        <header className={`header ${collapsed ? 'collapsed' : ''}`}>
          <div className="left-side">
            <button 
              className="hamburger-menu" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <h1 className="title">{title}</h1>
          </div>

            <div className="right-side">
              <button 
                className="icon-button notification-button"
                onClick={() => navigate('/notifications')}
              >
                <FaBell />
              </button>
              <button 
                className="icon-button config-button"
                onClick={() => navigate('/config')}
              >
                <FaCog />
              </button>
              <div className="profile-button-container">
                <div className="profile-button">
                  <div className="user-info">
                    <strong>{usuario ? `${usuario.name_usuario} ${usuario.surname_usuario}` : 'John Doe'}</strong>
                    <span>{usuario ? usuario.nombre_usuario : 'User Role'}</span>
                  </div>
                  <div className="avatar-circle">
                      <img 
                          src={usuario ? usuario.url_avatar : 'src/assets/img/avatars/A1.jpg'} 
                          alt="User Avatar" 
                      />
                  </div>
                </div>
                <div className="profile-menu">
                  <button onClick={() => navigate('/profile')}>Perfil</button>
                  <button onClick={() => navigate('/my-projects')}>Mis proyectos</button>
                  <button onClick={() => navigate('/my-teams')}>Mis equipos</button>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </div>
            </div>
        </header>
        {menuOpen && (
          <div className="mobile-menu">
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<FaHome />} onClick={() => navigate('/tracking')}>Inicio</MenuItem>
              <MenuItem icon={<FaUsers />} onClick={() => navigate('/gestionar-equipo')}>Gestionar equipo</MenuItem>
              <MenuItem icon={<FaTasks />} onClick={() => navigate('/tareas')}>Tareas</MenuItem>
              <MenuItem icon={<FaUser />} onClick={() => navigate('/avatar')}>Avatar</MenuItem>
              <MenuItem icon={<FaCogs />} onClick={() => navigate('/configurar-sitios')}>Configurar sitios</MenuItem>
              <MenuItem icon={<FaTrophy />} onClick={() => navigate('/leaderboard')}>Clasificatorias</MenuItem>
              <MenuItem icon={<FaUserCircle />} onClick={() => navigate('/usuario')}>Usuario</MenuItem>
              <MenuItem icon={<FaChartBar />} onClick={() => navigate('/estadisticas')}>Estadísticas</MenuItem>
              <MenuItem icon={<FaBellSlash />} onClick={() => navigate('/notificaciones')}>Notificaciones</MenuItem>
            </Menu>
          </div>
        )}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HeaderLoggedIn;