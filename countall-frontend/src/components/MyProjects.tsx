import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/MyProjects.css';
import { useNavigate } from 'react-router-dom';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
}

const MyProjects: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyectos = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4444/api/proyecto/misProyectos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProyectos(response.data.proyectos_usuario);
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
      {proyectos.map((proyecto) => (
        <div key={proyecto.id_proyecto} className="project-card" onClick={() => handleProjectClick(proyecto.nombre_proyecto)}>
          <h3>{proyecto.nombre_proyecto}</h3>
          <p>{proyecto.descr_proyecto}</p>
        </div>
      ))}
    </div>
  );
};

export default MyProjects;