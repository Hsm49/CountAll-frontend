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
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/proyecto/misProyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProyectos(response.data.proyectos_usuario);
      } catch (error) {
        console.error('Error fetching proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  const handleProjectClick = (id: number) => {
    // Aquí puedes manejar lo que sucede al hacer clic en una tarjeta de proyecto
    console.log(`Proyecto clickeado: ${id}`);
  };

  return (
    <div className="my-projects-container">
      {proyectos.map((proyecto) => (
        <div key={proyecto.id_proyecto} className="project-card" onClick={() => handleProjectClick(proyecto.id_proyecto)}>
          <h3>{proyecto.nombre_proyecto}</h3>
          <p>{proyecto.descr_proyecto}</p>
        </div>
      ))}
    </div>
  );
};

export default MyProjects;