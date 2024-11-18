import React, { useEffect, useState } from 'react';
import './css/Leaderboard.css';

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
              <tr key={clasificacion.id} className={isCurrentUser ? 'highlight' : ''}>
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