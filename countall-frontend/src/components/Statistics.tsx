import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { MaterialReactTable } from 'material-react-table';
import { Box, Card, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';
import { GoGraph } from "react-icons/go";
import './css/Statistics.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement);

const Estadisticas: React.FC = () => {
  const [filter, setFilter] = React.useState('etapa');

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  const projectProgressData = {
    labels: ['Completadas', 'Pendientes', 'En Proceso'],
    datasets: [
      {
        label: 'Avance del Proyecto',
        data: [30, 20, 50],
        backgroundColor: ['#4CAF50', '#FFC107', '#1b70a6'],
        borderColor: ['#4CAF50', '#FFC107', '#1b70a6'],
        borderWidth: 1,
      },
    ],
  };

  const teamPerformanceData = {
    labels: ['Rendimiento del equipo'],
    datasets: [
      {
        label: 'Miembro 1',
        data: [12],
        backgroundColor: '#1b70a6',
        borderColor: '#1b70a6',
        borderWidth: 1,
      },
      {
        label: 'Miembro 2',
        data: [19],
        backgroundColor: '#F2541B',
        borderColor: '#F2541B',
        borderWidth: 1,
      },
      {
        label: 'Miembro 3',
        data: [3],
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
      {
        label: 'Miembro 4',
        data: [5],
        backgroundColor: '#FFC107',
        borderColor: '#FFC107',
        borderWidth: 1,
      },
    ],
  };

  const timeSpentData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [
      {
        label: 'Horas dedicadas',
        data: [2, 3, 4, 5, 6],
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

  const taskData = [
    { nombre: 'Diseño de la base de datos', responsable: 'Juan Pérez', estado: 'En progreso', fechaLimite: '2023-11-01', urgencia: 'Alta' },
    { nombre: 'Implementación del frontend', responsable: 'María López', estado: 'Pendiente', fechaLimite: '2023-11-15', urgencia: 'Media' },
    { nombre: 'Pruebas unitarias', responsable: 'Carlos García', estado: 'Completada', fechaLimite: '2023-10-20', urgencia: 'Baja' },
  ];

  const teamData = [
    { miembro: 'Juan Pérez', tareasAsignadas: 5, tareasCompletadas: 3, tiempoPromedio: '2 días' },
    { miembro: 'María López', tareasAsignadas: 4, tareasCompletadas: 2, tiempoPromedio: '3 días' },
    { miembro: 'Carlos García', tareasAsignadas: 6, tareasCompletadas: 6, tiempoPromedio: '1 día' },
  ];

  const stageData = [
    { etapa: 'Planificación', porcentajeCompletado: '100%' },
    { etapa: 'Desarrollo', porcentajeCompletado: '60%' },
    { etapa: 'Pruebas', porcentajeCompletado: '30%' },
  ];

  return (
    <Box className="statistics-container">
      <div className="info-cards">
        <div className="score-card">
          <div className="score-icon">
            <GoGraph />
          </div>
          <div className="score-content">
            <h3>Porcentaje General de Avance</h3>
            <p className="score">75%</p>
          </div>
        </div>
        <div className="score-card">
          <div className="score-icon">
            <FaExclamationCircle />
          </div>
          <div className="score-content">
            <h3>Tareas Críticas</h3>
            <p className="score">5</p>
          </div>
        </div>

      </div>

      <Box className="tables-container">
        <Card className="chart-card">
          <h4>Gráfico de Avance del Proyecto</h4>
          <Pie data={projectProgressData} />
        </Card>

        <Card className="chart-card">
          <h4>Gráfico del Rendimiento del Equipo</h4>
          <Bar data={teamPerformanceData} />
        </Card>

        <Card className="chart-card">
          <h4>Gráfico de Tiempo Dedicado</h4>
          <Line data={timeSpentData} options={{ elements: { line: { tension: 0.4 } } }} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Tareas por Estado</h4>
          <MaterialReactTable columns={taskColumns} data={taskData} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Miembros del Equipo y Desempeño</h4>
          <MaterialReactTable columns={teamColumns} data={teamData} />
        </Card>

        <Card className="table-card">
          <h4>Tabla de Avance por Etapa</h4>
          <MaterialReactTable columns={stageColumns} data={stageData} />
        </Card>
      </Box>
    </Box>
  );
};

export default Estadisticas;