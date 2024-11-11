import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './css/Avatar.css';

const Avatar: React.FC = () => {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<{ id_recompensa: string; url_avatar: string; nombre_recompensa: string }[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.url_avatar || '');

  useEffect(() => {
    // Fetch available avatars from the backend
    const fetchAvatars = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/obtenerRecompensas');
        setAvatars(response.data);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars();
  }, []);

  const handleAvatarChange = async (avatarUrl: string) => {
    if (!user || !user.id_usuario) {
      console.error('User is not defined or does not have an id_usuario');
      return;
    }

    try {
      await axios.post('http://localhost:4444/api/cambiar-avatar', {
        id_usuario: user.id_usuario,
        id_recompensa: avatarUrl, // Cambiar a id_recompensa
      });
      setSelectedAvatar(avatarUrl);
      // Update user context or state with the new avatar
    } catch (error) {
      console.error('Error changing avatar:', error);
    }
  };

  return (
    <div className="avatar-selection">
      <div className="chart-card"> 
        <h2>Selecciona tu avatar</h2>
        <div className="avatars">
          {avatars.map((avatar) => (
            <img
              key={avatar.id_recompensa}
              src={avatar.url_avatar}
              alt={avatar.nombre_recompensa}
              className={`avatar ${selectedAvatar === avatar.url_avatar ? 'selected' : ''}`}
              onClick={() => handleAvatarChange(avatar.id_recompensa)} // Cambiar a id_recompensa
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avatar;