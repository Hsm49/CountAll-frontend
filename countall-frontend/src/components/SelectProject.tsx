import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import CreateProjectModal from './modals/CreateProjectModal';
import './css/SelectProject.css';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
}

const SelectProject: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const navigate = useNavigate();
  const { setSelectedProject } = useContext(ProjectTeamContext)!;

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/proyecto/misProyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProyectos(response.data.proyectos_usuario || []);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProyectos([]);
        } else {
          console.error('Error fetching proyectos:', error);
          setError('Error al cargar los proyectos');
        }
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  const handleProjectClick = (proyecto: Proyecto) => {
    setIsVisible(false);
    
    setTimeout(() => {
      setSelectedProject(proyecto);
      navigate(`/select-team/${proyecto.nombre_proyecto}`);
    }, 300);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
    setShowCreateProjectModal(true);
    console.log('Modal state:', showCreateProjectModal);
  };

  const handleProjectCreated = (project: Proyecto) => {
    setProyectos([...proyectos, project]);
    setSelectedProject(project);
    navigate(`/select-team/${project.nombre_proyecto}`);
  };

  if (loading) {
    return <div>Cargando...</div>;
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
      <div className="select-project-container">
        <h2>Bienvenido a CountAll</h2>
        
        {proyectos.length === 0 ? (
          <div className="empty-state">
            <h3>Para empezar, crea un nuevo proyecto:</h3>
            <button 
              className="create-project-btn" 
              onClick={handleCreateProject}
            >
              Crear Proyecto
            </button>
          </div>
        ) : (
          <>
            <h3>Selecciona un proyecto:</h3>
            <div className="project-cards-grid">
              {proyectos.map((proyecto) => (
                <div 
                  key={proyecto.id_proyecto} 
                  className="project-card" 
                  onClick={() => handleProjectClick(proyecto)}
                >
                  <h3>{proyecto.nombre_proyecto}</h3>
                  <p>{proyecto.descr_proyecto}</p>
                </div>
              ))}
            </div>
            <button 
              className="create-project-btn" 
              onClick={handleCreateProject}
            >
              Crear Nuevo Proyecto
            </button>
          </>
        )}
        {showCreateProjectModal && (
          <CreateProjectModal
            onClose={() => setShowCreateProjectModal(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </div>
    </CSSTransition>
  );
};

export default SelectProject;