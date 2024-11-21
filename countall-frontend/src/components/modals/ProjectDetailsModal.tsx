import React, { useState } from 'react';
import axios from 'axios';
import './ProjectModal.css';

interface ProjectDetailsModalProps {
  projectId: number;
  onClose: () => void;
  onDetailsProvided: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ projectId, onClose, onDetailsProvided }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('');
  const [metodologia, setMetodologia] = useState('Scrum');
  const [numeroEtapas, setNumeroEtapas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProvideDetails = async () => {
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4444/api/proyecto/crearProyecto/${projectId}`, {
        fecha_inicio_proyecto: fechaInicio,
        fecha_fin_proyecto: fechaFin,
        estado_proyecto: estado,
        metodologia_proyecto: metodologia,
        numero_etapas_proyecto: numeroEtapas
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onDetailsProvided();
      onClose();
    } catch (error) {
      console.error('Error providing project details:', error);
      setError('Error al proporcionar los detalles del proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Detalles del Proyecto</h2>
        <input
          type="date"
          placeholder="Fecha de Inicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha de Fin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Estado del Proyecto"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
        <select
          value={metodologia}
          onChange={(e) => setMetodologia(e.target.value)}
        >
          <option value="Scrum">Scrum</option>
        </select>
        <select
          value={numeroEtapas}
          onChange={(e) => setNumeroEtapas(Number(e.target.value))}
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        {error && <p className="error">{error}</p>}
        <button onClick={handleProvideDetails} disabled={loading}>
          {loading ? 'Proporcionando...' : 'Proporcionar Detalles'}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;