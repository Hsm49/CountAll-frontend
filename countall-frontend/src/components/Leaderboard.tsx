import React, { useEffect, useState } from 'react';
import { FaTrophy, FaCheck, FaArrowUp } from 'react-icons/fa';
import './css/Leaderboard.css';
import LeaderboardTable from './LeaderboardTable';

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

  useEffect(() => {
    const fetchClasificaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4444/api/clasificaciones', {
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

        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        setUsuarioId(usuario.id_usuario);
      } catch (error) {
        console.error('Error fetching clasificaciones:', error);
        setError('Error fetching clasificaciones');
      }
    };

    fetchClasificaciones();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="ranking-container">
        {/* User Scores Section */}
        <div className="user-scores">
          <div className="score-card">
            <div className="score-icon">
              <FaTrophy />
            </div>
            <div className="score-content">
              <h3>Puntos totales</h3>
              <p className="score">1250</p>
              <div className="score-trend positive">
                <FaArrowUp />
                <small>Aumento del 5% desde el último mes</small>
              </div>
            </div>
          </div>
          
          <div className="score-card">
            <div className="score-icon">
              <FaCheck />
            </div>
            <div className="score-content">
              <h3>Tareas completadas</h3>
              <p className="score">10 / 15</p>
              <div className="completion-bar">
                <div className="completion-progress" style={{ width: '66.67%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Podium and Table Section */}
        <div className="podium-and-table">
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
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;