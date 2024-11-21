import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProjectModal.css';

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descrProyecto, setDescrProyecto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4444/api/proyecto/crearProyecto', {
        nombre_proyecto: nombreProyecto,
        descr_proyecto: descrProyecto
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onProjectCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Crear Proyecto</h2>
        <input
          type="text"
          placeholder="Nombre del Proyecto"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
        />
        <textarea
          placeholder="Descripción del Proyecto"
          value={descrProyecto}
          onChange={(e) => setDescrProyecto(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleCreateProject} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Proyecto'}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default CreateProjectModal;