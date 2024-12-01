import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/Leaderboard.css';

const LeaderboardConfig: React.FC = () => {
  const { userRole, selectedTeam } = useContext(ProjectTeamContext)!;
  const navigate = useNavigate();

  const [frecuencia, setFrecuencia] = useState<string>('semanal');
  const [diaHora, setDiaHora] = useState<string>('');
  const [notificaciones, setNotificaciones] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'Líder') {
      navigate('/'); // Redirige a la pantalla de inicio si el usuario no es líder
    }
  }, [userRole, navigate]);

  const handleFrecuenciaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFrecuencia(event.target.value);
  };

  const handleDiaHoraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiaHora(event.target.value);
  };

  const handleNotificacionesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificaciones(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTeam) {
      setError('No team selected');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4444/api/configurar-clasificatorias/${selectedTeam.id_equipo}`, {
        frecuencia,
        diaHora,
        notificaciones
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Muestra un mensaje de confirmación
      alert('Configuración actualizada correctamente');

      // Envía un correo a los usuarios afectados (esto puede ser manejado en el backend)
      await axios.post(`http://localhost:4444/api/notificar-usuarios/${selectedTeam.id_equipo}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Redirige a la pantalla de clasificatorias
      navigate('/leaderboard');
    } catch (error) {
      console.error('Error updating configuration:', error);
      setError('Error updating configuration');
    }
  };

  return (
    <div className="details-container mt-5"> 
    <div className="config-form mt-5">
      <h1>Configurar Clasificatorias</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Frecuencia de cierre:</label>
          <select value={frecuencia} onChange={handleFrecuenciaChange}>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
          </select>
        </div>
        <div className="form-group">
          <label>Día y hora para la actualización:</label>
          <input type="datetime-local" value={diaHora} onChange={handleDiaHoraChange} />
        </div>
        <div className="form-group">
          <label>Notificaciones para los miembros:</label>
          <input type="checkbox" checked={notificaciones} onChange={handleNotificacionesChange} />
        </div>
        <button type="submit">Confirmar</button>
      </form>
    </div>
    </div>
  );
};

export default LeaderboardConfig;