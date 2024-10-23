import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, menuClasses } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCog, FaHome, FaUsers, FaTasks, FaUser, FaCogs, 
         FaTrophy, FaUserCircle, FaChartBar, FaBellSlash } from 'react-icons/fa';
import './css/HeaderLoggedIn.css';

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

const HeaderLoggedIn: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [theme] = useState<Theme>('light');
    const navigate = useNavigate();
  
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
              <img src="src/assets/img/logos/CA2.png" alt="Logo" className="logo" />
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<FaHome />} onClick={() => navigate('/inicio')}>Inicio</MenuItem>
              <MenuItem icon={<FaUsers />} onClick={() => navigate('/gestionar-equipo')}>Gestionar equipo</MenuItem>
              <MenuItem icon={<FaTasks />} onClick={() => navigate('/tareas')}>Tareas</MenuItem>
              <MenuItem icon={<FaUser />} onClick={() => navigate('/avatar')}>Avatar</MenuItem>
              <MenuItem icon={<FaCogs />} onClick={() => navigate('/configurar-sitios')}>Configurar sitios</MenuItem>
              <MenuItem icon={<FaTrophy />} onClick={() => navigate('/clasificatorias')}>Clasificatorias</MenuItem>
              <MenuItem icon={<FaUserCircle />} onClick={() => navigate('/usuario')}>Usuario</MenuItem>
              <MenuItem icon={<FaChartBar />} onClick={() => navigate('/estadisticas')}>Estadísticas</MenuItem>
              <MenuItem icon={<FaBellSlash />} onClick={() => navigate('/notificaciones')}>Notificaciones</MenuItem>
            </Menu>
          </Sidebar>
    
          <div className="main-layout">
            <header className="header">
              <div className="left-side">
                <button className="hamburger-menu" onClick={() => setCollapsed(!collapsed)}>
                  ☰
                </button>
                <h1 className="title">Current Screen Title</h1>
              </div>
              <div className="right-side">
                <button className="icon-button notification-button" onClick={() => navigate('/notifications')}>
                  <FaBell />
                </button>
                <button className="icon-button config-button" onClick={() => navigate('/config')}>
                  <FaCog />
                </button>
                <div className="profile-button">
                  <div className="user-info">
                    <strong>John Doe</strong>
                    <span>User Role</span>
                  </div>
                  <div className="avatar-circle">
                    <img src="/api/placeholder/40/40" alt="User Avatar" />
                  </div>
                  <div className="profile-menu">
                    <button onClick={() => navigate('/profile')}>Profile</button>
                    <button onClick={() => navigate('/logout')}>Log Out</button>
                  </div>
                </div>
              </div>
            </header>
            <div className="main-content">
              {/* Content will be rendered here */}
            </div>
          </div>
        </div>
      );
    };

export default HeaderLoggedIn;