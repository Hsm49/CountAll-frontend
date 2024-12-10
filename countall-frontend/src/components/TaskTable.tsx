import React, { useContext, useEffect, useState } from 'react';
import { FaFlag, FaCheck, FaCircle } from 'react-icons/fa';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import axios from 'axios';
import './css/TaskTable.css';

interface Task {
  id: number;
  nombre_tarea: string;
  encargado: string;
  fecha_fin_tarea: string;
  estado: string;
  prioridad: string;
}

const TaskTable: React.FC = () => {
  const { selectedTeam } = useContext(ProjectTeamContext)!;
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedTeam) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4444/api/tarea/verTareas/${selectedTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const fetchedTasks = response.data.tareas_equipo.map((taskData: any) => ({
          id: taskData.datos_tarea.tarea.id_tarea,
          nombre_tarea: taskData.datos_tarea.tarea.nombre_tarea,
          encargado: taskData.asignados.map((assignee: any) => assignee.nombre_usuario).join(', '),
          fecha_fin_tarea: new Date(taskData.datos_tarea.tarea.fecha_fin_tarea).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'America/Mexico_City',
          }),
          estado: taskData.datos_tarea.tarea.estado_tarea,
          prioridad: taskData.datos_tarea.tarea.prioridad_tarea.toLowerCase(),
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [selectedTeam]);

  return (
    <div className="task-table">
      <h4>Resumen del Proyecto</h4>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Encargado</th>
              <th>Fecha fin</th>
              <th>Estado</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.nombre_tarea}</td>
                <td>{task.encargado}</td>
                <td>{task.fecha_fin_tarea}</td>
                <td>{task.estado}</td>
                <td className="priority-label">
                  {task.prioridad === 'baja' && <FaFlag className="urgency-icon green" />}
                  {task.prioridad === 'media' && <FaFlag className="urgency-icon yellow" />}
                  {task.prioridad === 'alta' && <FaFlag className="urgency-icon red" />}
                  {task.prioridad === 'completada' && <FaCheck className="urgency-icon green" />}
                  {task.prioridad === 'revisión' && <FaCircle className="urgency-icon yellow" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;