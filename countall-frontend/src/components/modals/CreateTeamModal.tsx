import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectModal.css';

interface CreateTeamModalProps {
  projectId: number;
  projectName: string;
  onClose: () => void;
  onTeamCreated: (team: any) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ projectId, projectName, onClose, onTeamCreated }) => {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [descrEquipo, setDescrEquipo] = useState('');
  const [usuarios, setUsuarios] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCurrentUser(response.data.nombre_usuario);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleAddUser = () => {
    if (newUser && !usuarios.includes(newUser)) {
      setUsuarios([...usuarios, newUser]);
      setNewUser('');
    }
  };

  const handleCreateTeam = async () => {
    setLoading(true);
    setError(null);

    // If no users are added, add the current user by default
    if (usuarios.length === 0 && currentUser) {
      setUsuarios([currentUser]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4444/api/equipo/crearEquipo', {
        nombre_equipo: nombreEquipo,
        descr_equipo: descrEquipo,
        usuarios,
        proyecto: projectName // Asegúrate de pasar el nombre del proyecto
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onTeamCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Error al crear el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Crear Equipo</h2>
        <input
          type="text"
          placeholder="Nombre del Equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
        />
        <textarea
          placeholder="Descripción del Equipo"
          value={descrEquipo}
          onChange={(e) => setDescrEquipo(e.target.value)}
        />
        <div className="user-input">
          <input
            type="text"
            placeholder="Agregar Usuario"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
          <button onClick={handleAddUser}>Agregar</button>
        </div>
        <ul>
          {usuarios.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        {error && <p className="error">{error}</p>}
        <button onClick={handleCreateTeam} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Equipo'}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default CreateTeamModal;