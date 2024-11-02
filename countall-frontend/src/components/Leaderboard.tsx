import React, { useEffect, useState } from 'react';
import { FaTrophy, FaCheck, FaArrowUp } from 'react-icons/fa';
import './css/Leaderboard.css';
import LeaderboardTable from './LeaderboardTable';

interface Clasificacion {
  id: number;
  puntuacion: number;
  usuario: {
    nombre_usuario: string;
    rol: {
      rol: string;
    } | null;
  };
}

const Leaderboard: React.FC = () => {
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasificaciones = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación del almacenamiento local
        const response = await fetch('http://localhost:4444/api/clasificaciones', {
          headers: {
            'Authorization': `Bearer ${token}` // Incluye el token en los encabezados de la solicitud
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
      } catch (error) {
        console.error('Error fetching clasificaciones:', error);
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
                <div key={`second-${clasificaciones[1].id}`} className="podium-member second">
                  <div className="avatar">
                    <img src="/api/placeholder/50/50" alt="2nd Place" />
                  </div>
                  <h4>{`2° ${clasificaciones[1].usuario.nombre_usuario}`}</h4>
                  <p>{`${clasificaciones[1].puntuacion} pts`}</p>
                </div>
                <div key={`first-${clasificaciones[0].id}`} className="podium-member first">
                  <div className="avatar">
                    <img src="/api/placeholder/50/50" alt="1st Place" />
                  </div>
                  <h4>{`1° ${clasificaciones[0].usuario.nombre_usuario}`}</h4>
                  <p>{`${clasificaciones[0].puntuacion} pts`}</p>
                </div>
                <div key={`third-${clasificaciones[2].id}`} className="podium-member third">
                  <div className="avatar">
                    <img src="/api/placeholder/50/50" alt="3rd Place" />
                  </div>
                  <h4>{`3° ${clasificaciones[2].usuario.nombre_usuario}`}</h4>
                  <p>{`${clasificaciones[2].puntuacion} pts`}</p>
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