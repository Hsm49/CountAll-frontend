import React, { useEffect, useState, useContext } from 'react';
import { FaTrophy, FaCheck, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/Leaderboard.css';
import LeaderboardTable from './LeaderboardTable';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import axios from 'axios';

interface Clasificacion {
  id_usuario_fk_UE: number;
  puntuacion_local: number;
  usuario: {
    id_usuario: number;
    nombre_usuario: string;
    url_avatar: string;
  };
  rol: string;
}

const Leaderboard: React.FC = () => {
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const { selectedTeam, userRole } = useContext(ProjectTeamContext)!;
  const navigate = useNavigate();
  const [premio, setPremio] = useState<string>('Avatar de rareza alta');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);

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
    const fetchClasificaciones = async () => {
      if (!selectedTeam) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4444/api/clasificaciones/${selectedTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Received non-JSON response: ${text}`);
        }
        const data = await response.json();
        setClasificaciones(data);

        const currentUser = data.find((member: any) => member.id_usuario_fk_UE === usuarioId);
        if (currentUser) {
          setTotalPoints(currentUser.puntuacion_local);
        }
      } catch (error) {
        console.error('Error fetching clasificaciones:', error);
        setError('Error al recuperar la información de las clasificaciones. Por favor, inténtalo de nuevo más tarde.');
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

    fetchClasificaciones();
    fetchTasks();
  }, [selectedTeam, usuarioId]);

  const handleConfigClick = () => {
    navigate('/leaderboard-config');
  };

  return (
    <div className="content-wrapper">
      {/* Config Button */}
      {userRole === 'Líder' && (
        <button className="config-button mb-4 btn-naranja" onClick={handleConfigClick}>
          <FaCog /> Configurar clasificatorias
        </button>
      )}
      <div className="ranking-container">
        {/* User Scores Section */}
        <div className="user-scores">
          <div className="score-card">
            <div className="score-icon">
              <FaTrophy />
            </div>
            <div className="score-content">
              <h3>Puntos totales</h3>
              <p className="score">{totalPoints}</p>
            </div>
          </div>
          
          <div className="score-card">
            <div className="score-icon">
              <FaCheck />
            </div>
            <div className="score-content">
              <h3>Tareas completadas</h3>
              <p className="score">{completedTasks} / {totalTasks}</p>
              <div className="completion-bar">
                <div className="completion-progress" style={{ width: `${(completedTasks / totalTasks) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Podium and Table Section */}
        <div className="podium-and-table">
          <h2 className="premio-title text-center">Premio: {premio}</h2>
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="podium">
                {clasificaciones.length >= 3 && (
                  <>
                    <div key={`second-${clasificaciones[1].id_usuario_fk_UE}`} className="podium-member second">
                      <div className="avatar">
                        <img src={clasificaciones[1].usuario.url_avatar} alt="2nd Place" />
                      </div>
                      <h4>{`2° ${clasificaciones[1].usuario.nombre_usuario}`}</h4>
                      <p>{`${clasificaciones[1].puntuacion_local} pts`}</p>
                    </div>
                    <div key={`first-${clasificaciones[0].id_usuario_fk_UE}`} className="podium-member first">
                      <div className="avatar">
                        <img src={clasificaciones[0].usuario.url_avatar} alt="1st Place" />
                      </div>
                      <h4>{`1° ${clasificaciones[0].usuario.nombre_usuario}`}</h4>
                      <p>{`${clasificaciones[0].puntuacion_local} pts`}</p>
                    </div>
                    <div key={`third-${clasificaciones[2].id_usuario_fk_UE}`} className="podium-member third">
                      <div className="avatar">
                        <img src={clasificaciones[2].usuario.url_avatar} alt="3rd Place" />
                      </div>
                      <h4>{`3° ${clasificaciones[2].usuario.nombre_usuario}`}</h4>
                      <p>{`${clasificaciones[2].puntuacion_local} pts`}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Leaderboard Table */}
              <div className="leaderboard">
                <LeaderboardTable />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;