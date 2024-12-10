import React, { useState, useEffect, useContext } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { MaterialReactTable } from 'material-react-table';
import { Box, Card, CircularProgress } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoGraph } from "react-icons/go";
import './css/Statistics.css';
import axios from 'axios';
import { ProjectTeamContext } from '../context/ProjectTeamContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement);

const Estadisticas: React.FC = () => {
  const { selectedProject, selectedTeam, teamProjectName } = useContext(ProjectTeamContext)!;
  const [estadisticas, setEstadisticas] = useState<any>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      const projectName = selectedProject ? selectedProject.nombre_proyecto : teamProjectName;
      if (!projectName) return;

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/verEstadisticas/${projectName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEstadisticas(response.data.estadisticas_proyecto);
      } catch (error) {
        console.error('Error fetching estadisticas:', error);
      }
    };

    fetchEstadisticas();
  }, [selectedProject, teamProjectName]);

  if (!estadisticas) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <p>Cargando estadísticas...</p>
      </Box>
    );
  }

  const projectProgressData = {
    labels: ['Completadas', 'Pendientes', 'En Proceso'],
    datasets: [
      {
        label: 'Avance del Proyecto',
        data: [
          estadisticas.datos_grafico_avance.tareas_completadas,
          estadisticas.datos_grafico_avance.tareas_porHacer,
          estadisticas.datos_grafico_avance.tareas_enProgreso
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#1b70a6'],
        borderColor: ['#4CAF50', '#FFC107', '#1b70a6'],
        borderWidth: 1,
      },
    ],
  };

  const teamPerformanceData = {
    labels: estadisticas.datos_grafico_rendimiento.map((item: any) => item.username_integrante),
    datasets: [
      {
        label: 'Rendimiento del equipo',
        data: estadisticas.datos_grafico_rendimiento.map((item: any) => item.revisadas_integrante),
        backgroundColor: '#1b70a6',
        borderColor: '#1b70a6',
        borderWidth: 1,
      },
    ],
  };

  const timeSpentData = {
    labels: estadisticas.datos_grafico_dedicado.map((item: any) => item.username_asignado),
    datasets: [
      {
        label: 'Horas dedicadas',
        data: estadisticas.datos_grafico_dedicado.map((item: any) => item.horas_dedicadas),
        fill: true,
        backgroundColor: 'rgba(242, 84, 27, 0.4)',
        borderColor: '#F2541B',
      },
    ],
  };

  const taskColumns = [
    { accessorKey: 'nombre', header: 'Nombre de Tarea' },
    { accessorKey: 'responsable', header: 'Responsable' },
    { accessorKey: 'estado', header: 'Estado' },
    { accessorKey: 'fechaLimite', header: 'Fecha Límite' },
    { accessorKey: 'urgencia', header: 'Urgencia' },
  ];

  const teamColumns = [
    { accessorKey: 'miembro', header: 'Miembro del Equipo' },
    { accessorKey: 'tareasAsignadas', header: 'Tareas Asignadas' },
    { accessorKey: 'tareasCompletadas', header: 'Tareas Completadas' },
    { accessorKey: 'tiempoPromedio', header: 'Tiempo Promedio de Finalización' },
  ];

  const stageColumns = [
    { accessorKey: 'etapa', header: 'Etapa del Proyecto' },
    { accessorKey: 'porcentajeCompletado', header: 'Porcentaje Completado' },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const taskData = estadisticas.datos_tabla_tareas.map((item: any) => ({
    nombre: item.datos_tarea.nombre_tarea,
    responsable: item.asignados.map((asignado: any) => asignado.nombre_usuario).join(', '),
    estado: item.datos_tarea.estado_tarea,
    fechaLimite: formatDate(item.datos_tarea.fecha_fin_tarea),
    urgencia: item.datos_tarea.prioridad_tarea,
  }));

  const teamData = estadisticas.datos_tabla_desempeno.map((item: any) => ({
    miembro: item.username_asignado,
    tareasAsignadas: item.total_tareas_asignadas,
    tareasCompletadas: item.total_tareas_revisadas,
    tiempoPromedio: `${item.total_horas_dedicadas} horas`,
  }));

  const stageData = estadisticas.datos_tabla_etapas.map((item: any) => ({
    etapa: item.nomnbre_etapa,
    porcentajeCompletado: `${item.porcentaje_completado}%`,
  }));

  const projectName = selectedProject ? selectedProject.nombre_proyecto : teamProjectName;
  const teamName = selectedTeam ? selectedTeam.nombre_equipo : '';

  return (
    <Box className="statistics-container">
      <div className="info-cards">
        <div className="score-card">
          <div className="score-icon">
            <GoGraph />
          </div>
          <div className="score-content">
            <h3>Porcentaje General de Avance</h3>
            <p className="score">{estadisticas.inicio_estadisticas.porcentaje_avance}%</p>
          </div>
        </div>
        <div className="score-card">
          <div className="score-icon">
            <FaExclamationCircle />
          </div>
          <div className="score-content">
            <h3>Tareas Críticas</h3>
            <p className="score">{estadisticas.inicio_estadisticas.tareas_criticas}</p>
          </div>
        </div>
      </div>

      <Box className="tables-container">
        <Card className="chart-card">
          <h4>Gráfico de Avance del Proyecto - {projectName}</h4>
          <Pie data={projectProgressData} />
        </Card>

        <Card className="chart-card">
          <h4>Gráfico del Rendimiento del Equipo - {projectName} ({teamName})</h4>
          <Bar data={teamPerformanceData} />
        </Card>

        <Card className="chart-card">
          <h4>Gráfico de Tiempo Dedicado - {projectName} ({teamName})</h4>
          <Line data={timeSpentData} options={{ elements: { line: { tension: 0.4 } } }} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Tareas por Estado - {projectName} ({teamName})</h4>
          <MaterialReactTable columns={taskColumns} data={taskData} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Miembros del Equipo y Desempeño - {projectName} ({teamName})</h4>
          <MaterialReactTable columns={teamColumns} data={teamData} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Avance por Etapa - {projectName} ({teamName})</h4>
          <MaterialReactTable columns={stageColumns} data={stageData} />
        </Card>
      </Box>
    </Box>
  );
};

export default Estadisticas;