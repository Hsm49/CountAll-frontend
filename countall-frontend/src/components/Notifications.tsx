import React, { useState } from 'react';
import './css/Notifications.css';

type NotificationType = 'activities' | 'reminders' | 'achievements' | 'scores';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState({
    activities: true,
    reminders: true,
    achievements: true,
    scores: true,
  });

  const handleToggle = (type: NotificationType) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  const handleSaveChanges = () => {
    // Agregar la lógica para enviar los cambios al backend
    alert('Configuraciones de notificaciones guardadas');
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
          Notificaciones de actividades
        </label>
      </div>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.reminders}
            onChange={() => handleToggle('reminders')}
          />
          Notificaciones de recordatorios
        </label>
      </div>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.achievements}
            onChange={() => handleToggle('achievements')}
          />
          Notificaciones de logros
        </label>
      </div>
      <div className="notification-item">
        <label>
          <input
            type="checkbox"
            checked={notifications.scores}
            onChange={() => handleToggle('scores')}
          />
          Notificaciones de puntajes
        </label>
      </div>
      <button className="btn-blue" onClick={handleSaveChanges}>
        Guardar cambios
      </button>
    </div>
  );
};

export default Notifications;