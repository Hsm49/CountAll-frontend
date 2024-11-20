import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Details.css';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  metodologia_proyecto: string;
  estado_proyecto: string;
}

const ProjectDetails: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);

  useEffect(() => {
    const fetchProyecto = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/misProyectos/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setProyecto(response.data.proyecto);
        } else {
          console.error('Failed to fetch project data');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProyecto();
  }, [nombre_proyecto]);

  if (!proyecto) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container mt-5">
      <div className="details-card">
        <h2>{proyecto.nombre_proyecto}</h2>
        <p>{proyecto.descr_proyecto}</p>
        <p>Fecha de inicio: {new Date(proyecto.fecha_inicio_proyecto).toLocaleDateString()}</p>
        <p>Fecha de fin: {new Date(proyecto.fecha_fin_proyecto).toLocaleDateString()}</p>
        <p>Metodología: {proyecto.metodologia_proyecto}</p>
        <p>Estado: {proyecto.estado_proyecto}</p>
      </div>
    </div>
  );
};

export default ProjectDetails;