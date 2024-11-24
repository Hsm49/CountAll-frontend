import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
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
  const [isCreating, setIsCreating] = useState(false);
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descrProyecto, setDescrProyecto] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
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
        if (axios.isAxiosError(error) && error.response?.status === 404) {
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
      navigate(`/select-team/${proyecto.nombre_proyecto}`, { state: { proyecto } });
    }, 300);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4444/api/proyecto/crearProyecto', {
        nombre_proyecto: nombreProyecto,
        descr_proyecto: descrProyecto
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const newProject = response.data;
      setProyectos([...proyectos, newProject]);
      setSelectedProject(newProject);
      // Recargar la página para seleccionar el proyecto recién creado
      window.location.reload();
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateError('Error al crear el proyecto');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSkipToTeams = () => {
    navigate('/select-team-user');
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

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
        <p className="skip-link" onClick={handleSkipToTeams}>¿Ya perteneces a un equipo? Haz clic aquí</p>
        
        {!isCreating ? (
          <>
            {proyectos.length === 0 ? (
              <div className="empty-state">
                <h3>Para empezar, crea un nuevo proyecto:</h3>
                <button 
                  className="create-project-btn" 
                  onClick={() => setIsCreating(true)}
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
                  onClick={() => setIsCreating(true)}
                >
                  Crear Nuevo Proyecto
                </button>
              </>
            )}
          </>
        ) : (
          <div className="create-form">
            <h3>Crear Nuevo Proyecto</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Nombre del Proyecto"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                required
              />
              <textarea
                placeholder="Descripción del Proyecto"
                value={descrProyecto}
                onChange={(e) => setDescrProyecto(e.target.value)}
                required
              />
              {createError && <p className="error">{createError}</p>}
              <div className="button-group">
                <button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creando...' : 'Crear Proyecto'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

export default SelectProject;