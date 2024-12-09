// Tracking.tsx
import React, { useState, useEffect, useContext } from 'react';
import { FaTrophy, FaCheck } from 'react-icons/fa';
import './css/Tracking.css';
import LeaderboardTable from './LeaderboardTable';
import TaskTable from './TaskTable';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import axios from 'axios';

const Tracking: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('semana');
  const [filter, setFilter] = useState('todas');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const { selectedTeam } = useContext(ProjectTeamContext)!;
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsuarioActual = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsuarioId(response.data.id_usuario);
      } catch (error) {
        console.error('Error fetching usuario actual:', error);
      }
    };

    fetchUsuarioActual();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedTeam || !usuarioId) return;

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/clasificaciones/${selectedTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const clasificaciones = response.data;
        const currentUser = clasificaciones.find((member: any) => member.id_usuario_fk_UE === usuarioId);
        if (currentUser) {
          setTotalPoints(currentUser.puntuacion_local);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchTasks = async () => {
      if (!selectedTeam) return;

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const teamMembers = response.data.equipo.integrantes_equipo;
        const currentUser = teamMembers.find((member: any) => member.id_usuario === usuarioId);
        if (currentUser) {
          setCompletedTasks(currentUser.tareas_completadas);
          setTotalTasks(currentUser.tareas_asignadas);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchUserDetails();
    fetchTasks();
  }, [selectedTeam, usuarioId]);

  return (
    <>    
        <div className="tracking-container">
            {/* Recuadros de información */}
            <div>
                <div className="info-cards">
                    <div className="score-card">
                        <div className="score-icon">
                            <FaTrophy />
                        </div>
                        <div className="score-content">
                            <h3>Puntos Totales</h3>
                            <p className="score">{totalPoints}</p>
                        </div>
                    </div>
                    <div className="score-card">
                        <div className="score-icon">
                            <FaCheck />
                        </div>
                        <div className="score-content">
                            <h3>Tareas Completadas</h3>
                            <p className="score">{completedTasks} / {totalTasks}</p>
                            <div className="completion-bar">
                                <div className="completion-progress" style={{ width: `${(completedTasks / totalTasks) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablas */}
            <div className="tables-container">
                {/* Tabla Resumen del Proyecto */}
                <TaskTable />

                {/* Tabla de Clasificatorias (del lado derecho) */}
                <div className="leaderboard">
                <h4>Clasificatorias</h4>
                <LeaderboardTable />
                </div>
            </div>
        </div>
    </>
  );
};

export default Tracking;