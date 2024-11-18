import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Avatar.css';

interface Usuario {
  id_usuario: string;
  url_avatar: string;
}

const Avatar: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [avatars, setAvatars] = useState<{ id_recompensa: string; url_avatar: string; nombre_recompensa: string }[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
          setSelectedAvatar(response.data.url_avatar);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

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

  const handleAvatarChange = async (id_recompensa: string) => {
    if (!user || !user.id_usuario) {
      console.error('User is not defined or does not have an id_usuario');
      return;
    }

    try {
      await axios.post('http://localhost:4444/api/cambiar-avatar', {
        id_usuario: user.id_usuario,
        id_recompensa: id_recompensa,
      });
      setSelectedAvatar(id_recompensa);
      // Update user context or state with the new avatar
      window.location.reload(); // Reload the page
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
            <div key={avatar.id_recompensa} className="avatar-container">
              <img
          src={avatar.url_avatar}
          alt={avatar.nombre_recompensa}
          className={`avatar ${selectedAvatar === avatar.url_avatar ? 'selected' : ''}`}
          onClick={() => handleAvatarChange(avatar.id_recompensa)}
              />
              <span className="avatar-name">{avatar.nombre_recompensa}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avatar;