import React, { useEffect, useState, useContext } from 'react';
import './css/Leaderboard.css';
import { ProjectTeamContext } from '../context/ProjectTeamContext';

interface Clasificacion {
  id: number;
  puntuacion_local: number;
  usuario: {
    id_usuario: number;
    nombre_usuario: string;
    url_avatar: string;
  };
  rol: string;
}

const LeaderboardTable: React.FC = () => {
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const { selectedTeam } = useContext(ProjectTeamContext)!;

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
      } catch (error) {
        console.error('Error fetching clasificaciones:', error);
        setError('Error fetching clasificaciones');
      }
    };

    const fetchUsuarioActual = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsuarioId(data.id_usuario);
      } catch (error) {
        console.error('Error fetching usuario actual:', error);
        setError('Error fetching usuario actual');
      }
    };

    fetchClasificaciones();
    fetchUsuarioActual();
  }, [selectedTeam]);

  return (
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {clasificaciones.map((clasificacion, index) => {
            const isCurrentUser = clasificacion.usuario.id_usuario === usuarioId;
            return (
              <tr key={clasificacion.id} className={isCurrentUser ? 'highlight underline' : ''}>
                <td>{index + 1}</td>
                <td>
                  <div className="user-photo-circle">
                    <img src={clasificacion.usuario.url_avatar} alt="User" />
                  </div>
                </td>
                <td>{clasificacion.usuario.nombre_usuario}</td>
                <td>{clasificacion.rol}</td>
                <td>{clasificacion.puntuacion_local}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;