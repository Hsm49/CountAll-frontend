import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/Details.css';

interface ResumenProyecto {
  fecha_inicio: string;
  fecha_fin: string;
  progreso_general: number;
  estado: string;
  total_tareas: number;
  tareas_completadas: number;
  tareas_pendientes: number;
}

const ProjectSummary: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [resumen, setResumen] = useState<ResumenProyecto | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchResumen = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/verResumen/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setResumen(response.data.resumen_proyecto);
        } else {
          console.error('Failed to fetch project summary');
        }
      } catch (error) {
        console.error('Error fetching project summary:', error);
      }
    };

    if (location.state && location.state.resumen) {
      setResumen(location.state.resumen);
    } else {
      fetchResumen();
    }
  }, [nombre_proyecto, location.state]);

  if (!resumen) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Mexico_City',
    });
  };

  return (
    <div className="details-container mt-5">
      <div className="details-card">
        <h2>Resumen del Proyecto: {nombre_proyecto}</h2>
        <p>Fecha de inicio: {formatDate(resumen.fecha_inicio)}</p>
        <p>Fecha de fin: {formatDate(resumen.fecha_fin)}</p>
        <p>Progreso general: {resumen.progreso_general}%</p>
        <p>Estado: {resumen.estado}</p>
        <p>Total de tareas: {resumen.total_tareas}</p>
        <p>Tareas completadas: {resumen.tareas_completadas}</p>
        <p>Tareas pendientes: {resumen.tareas_pendientes}</p>
      </div>
    </div>
  );
};

export default ProjectSummary;