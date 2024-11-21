import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import LoadingScreen from './LoadingScreen';
import CreateTeamModal from './modals/CreateTeamModal';
import ProjectDetailsModal from './modals/ProjectDetailsModal';
import './css/SelectProject.css';

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
}

const SelectTeam: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const navigate = useNavigate();
  const { setSelectedTeam, selectedProject } = useContext(ProjectTeamContext)!;
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const location = useLocation();
  const proyecto = location.state?.proyecto;

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!nombre_proyecto) return;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquiposProyecto/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipos(response.data.equipos_usuario || []);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEquipos([]);
        } else {
          console.error('Error fetching equipos:', error);
          setError('Error fetching equipos');
        }
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [nombre_proyecto]);

  const handleTeamClick = (equipo: Equipo) => {
    setIsVisible(false);
    
    setTimeout(() => {
      setSelectedTeam(equipo);
      navigate('/tracking', { replace: true });
    }, 300);
  };

  const handleCreateTeam = () => {
    setShowCreateTeamModal(true);
  };

  const handleTeamCreated = (team: Equipo) => {
    setEquipos([...equipos, team]);
    setSelectedTeam(team);
    setShowProjectDetailsModal(true);
  };

  const handleDetailsProvided = () => {
    navigate('/tracking', { replace: true });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
      className="page-container"
    >
      <div className="select-team-container">
        {equipos.length === 0 ? (
          <div className="empty-state">
            <h2>Proyecto: {nombre_proyecto}</h2>
            <h3>Para continuar, crea un nuevo equipo:</h3>
            <button 
              className="create-team-btn" 
              onClick={handleCreateTeam}
            >
              Crear Equipo
            </button>
          </div>
        ) : (
          <>
            <h2>Proyecto: {nombre_proyecto}</h2>
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
            <button 
              className="create-team-btn" 
              onClick={handleCreateTeam}
            >
              Crear Nuevo Equipo
            </button>
          </>
        )}
        {showCreateTeamModal && selectedProject && (
          <CreateTeamModal
            projectId={selectedProject.id_proyecto}
            projectName={selectedProject.nombre_proyecto}
            onClose={() => setShowCreateTeamModal(false)}
            onTeamCreated={handleTeamCreated}
          />
        )}
        {showProjectDetailsModal && selectedProject && (
          <ProjectDetailsModal
            projectId={selectedProject.id_proyecto}
            onClose={() => setShowProjectDetailsModal(false)}
            onDetailsProvided={handleDetailsProvided}
          />
        )}
      </div>
    </CSSTransition>
  );
};

export default SelectTeam;