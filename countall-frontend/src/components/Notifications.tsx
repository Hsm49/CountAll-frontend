import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import './css/Notifications.css';

type NotificationType = 'activities' | 'reminders' | 'achievements' | 'scores';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState({
    activities: true,
    reminders: true,
    achievements: true,
    scores: true,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/usuario/preferencias', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { preferencias } = response.data;
          setNotifications({
            activities: preferencias.pref_actividades,
            reminders: preferencias.pref_recordatorio,
            achievements: true, // Assuming achievements is not part of the response
            scores: preferencias.pref_puntajes,
          });
        } else {
          throw new Error('Error al obtener las preferencias de notificaciones');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener las preferencias de notificaciones',
        });
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (type: NotificationType) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  const handleSaveChanges = async () => {
    const schema = Yup.object().shape({
      activities: Yup.boolean().required(),
      reminders: Yup.boolean().required(),
      achievements: Yup.boolean().required(),
      scores: Yup.boolean().required(),
    });

    try {
      await schema.validate(notifications);

      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:4444/api/usuario/modificarPreferencias', {
        pref_actividades: notifications.activities,
        pref_recordatorio: notifications.reminders,
        pref_puntajes: notifications.scores,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Configuraciones guardadas',
          text: 'Las configuraciones de notificaciones se han guardado exitosamente',
        });
      } else {
        throw new Error('Error al guardar la configuración de notificaciones');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la configuración de notificaciones',
      });
    }
  };

  return (
    <div className="notifications-container">
      <h2>Configuración de Notificaciones</h2>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.activities}
            onChange={() => handleToggle('activities')}
          />
          Notificaciones de actividades (creación de tareas, asignación de tareas, actualizaciones de estado)
        </label>
      </div>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.reminders}
            onChange={() => handleToggle('reminders')}
          />
          Notificaciones de recordatorios (fechas límite de tareas)
        </label>
      </div>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.scores}
            onChange={() => handleToggle('scores')}
          />
          Notificaciones de puntajes (posición en la clasificatoria)
        </label>
      </div>
      <button className="btn-blue" onClick={handleSaveChanges}>
        Guardar cambios
      </button>
    </div>
  );
};

export default Notifications;