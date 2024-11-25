import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import LoadingScreen from './LoadingScreen';
import './css/SelectProject.css';

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
}

const SelectTeamUser: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setSelectedTeam, userRole, setUserRole } = useContext(ProjectTeamContext)!;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCurrentUser(response.data.nombre_usuario);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchEquipos = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:4444/api/equipo/misEquipos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipos(response.data.equipos_usuario || []);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setEquipos([]);
        } else {
          console.error('Error fetching equipos:', error);
          setError('Error fetching equipos');
        }
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  const handleTeamClick = async (equipo: Equipo) => {
    setIsVisible(false);
    setTimeout(async () => {
      setSelectedTeam(equipo);

      // Fetch user role
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${equipo.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserRole(response.data.rol_sesion);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }

      navigate('/tracking');
    }, 300);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>{error}</div>;

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
      className="page-container"
    >
      <div className="select-team-container">
        <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
        <h2>Mis Equipos</h2>
        
        {equipos.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes equipos disponibles.</h3>
          </div>
        ) : (
          <>
            <h3>Selecciona un equipo:</h3>
            <div className="team-cards-grid">
              {equipos.map((equipo) => (
                <div 
                  key={equipo.id_equipo} 
                  className="team-card" 
                  onClick={() => handleTeamClick(equipo)}
                >
                  <h3>{equipo.nombre_equipo}</h3>
                  <p>{equipo.descr_equipo}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </CSSTransition>
  );
};

export default SelectTeamUser;