import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/MyProjects.css';
import { useNavigate } from 'react-router-dom';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
  estado_proyecto: string; 
}

const MyProjects: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noProjectsMessage, setNoProjectsMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/proyecto/misProyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.proyectos_usuario.length === 0) {
          setNoProjectsMessage('No se encontraron proyectos.');
        } else {
          setProyectos(response.data.proyectos_usuario);
        }
      } catch (error) {
        setError('Hubo un error al cargar los proyectos. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    fetchProyectos();
  }, []);

  const handleProjectClick = (nombre_proyecto: string) => {
    navigate(`/proyecto/${nombre_proyecto}`);
  };

  const handleChangeProject = () => {
    navigate('/select-project');
  };

  return (
    <div className="my-projects-container">
      <button className="btn-naranja" onClick={handleChangeProject}>Cambiar de proyecto</button>
      {error && <div className="error-message">{error}</div>}
      {noProjectsMessage && <div className="no-projects-message">{noProjectsMessage}</div>}
      {proyectos.map((proyecto) => (
        <div key={proyecto.id_proyecto} className="project-card" onClick={() => handleProjectClick(proyecto.nombre_proyecto)}>
          <h3>{proyecto.nombre_proyecto}</h3>
          <p>{proyecto.descr_proyecto}</p>
          <p><strong>Estado:</strong> {proyecto.estado_proyecto}</p>
        </div>
      ))}
    </div>
  );
};

export default MyProjects;