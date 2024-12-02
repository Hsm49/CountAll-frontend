import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/Details.css';

interface ResumenProyecto {
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  progreso_general: number;
  estado_proyecto: string;
  total_tareas: number;
  tareas_completadas: number;
  tareas_pendientes: number;
  estadisticas_generales: string;
}

const ProjectSummary: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [resumen, setResumen] = useState<ResumenProyecto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de datos estáticos para el proyecto "CountAll"
    const simulatedResumen: ResumenProyecto = {
      fecha_inicio_proyecto: '2023-01-01',
      fecha_fin_proyecto: '2023-12-31',
      progreso_general: 75,
      estado_proyecto: 'En progreso',
      total_tareas: 100,
      tareas_completadas: 75,
      tareas_pendientes: 25,
    };

    setResumen(simulatedResumen);
  }, [nombre_proyecto]);

  if (!resumen) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container mt-5">
      <div className="details-card">
        <h2>Resumen del Proyecto: {nombre_proyecto}</h2>
        <p>Fecha de inicio: {new Date(resumen.fecha_inicio_proyecto).toLocaleDateString()}</p>
        <p>Fecha de fin: {new Date(resumen.fecha_fin_proyecto).toLocaleDateString()}</p>
        <p>Progreso general: {resumen.progreso_general}%</p>
        <p>Estado: {resumen.estado_proyecto}</p>
        <p>Total de tareas: {resumen.total_tareas}</p>
        <p>Tareas completadas: {resumen.tareas_completadas}</p>
        <p>Tareas pendientes: {resumen.tareas_pendientes}</p>
      </div>
    </div>
  );
};

export default ProjectSummary;