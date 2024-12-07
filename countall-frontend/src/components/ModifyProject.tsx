import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/SelectProject.css';
import { InputLabel } from '@mui/material';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  metodologia_proyecto: string;
  estado_proyecto: string;
  numero_etapas: number;
}

interface UpdatedProject {
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  estado_proyecto: string;
  metodologia_proyecto: string;
  numero_etapas_proyecto: number;
}

const ModifyProject: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSelectedProject } = useContext(ProjectTeamContext)!;

  useEffect(() => {
    const fetchProyecto = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/misProyectos/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setProyecto(response.data.proyecto);
        } else {
          console.error('Failed to fetch project data');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProyecto();
  }, [nombre_proyecto]);

  // Función para formatear la fecha para el backend
  const formatDateForBackend = (dateString: string): string => {
    return `${dateString}T00:00:00Z`;
  };

  const handleSaveChanges = async () => {
    if (!proyecto) return;
  
    setLoading(true);
    setError(null);
  
    const fechaInicioFormatted = formatDateForBackend(proyecto.fecha_inicio_proyecto);
    const fechaFinFormatted = formatDateForBackend(proyecto.fecha_fin_proyecto);
  
    const updatedProject = {
      fecha_inicio_proyecto: fechaInicioFormatted,
      fecha_fin_proyecto: fechaFinFormatted,
      estado_proyecto: proyecto.estado_proyecto,
      metodologia_proyecto: proyecto.metodologia_proyecto,
      numero_etapas_proyecto: proyecto.numero_etapas,
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:4444/api/proyecto/modificarProyecto/${nombre_proyecto}`, updatedProject, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setSelectedProject(proyecto);
        navigate(`/proyecto/${nombre_proyecto}`);
      } else {
        setError('Failed to save changes');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Error saving changes');
      } else {
        console.error('Error saving changes:', error);
        setError('Error saving changes');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!proyecto) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
      
      <h2>Modificar Proyecto: {proyecto.nombre_proyecto}</h2>
      <h4>Ingresa los detalles del proyecto</h4>

      <div className="create-form">
        <InputLabel>Fecha de inicio</InputLabel>
        <input
          type="date"
          placeholder="Fecha de Inicio"
          value={proyecto.fecha_inicio_proyecto.split('T')[0]}
          min={today}
          onChange={(e) => setProyecto({ ...proyecto, fecha_inicio_proyecto: e.target.value })}
          required
        />
        <InputLabel>Fecha de fin</InputLabel>
        <input
          type="date"
          placeholder="Fecha de Fin"
          value={proyecto.fecha_fin_proyecto.split('T')[0]}
          min={proyecto.fecha_inicio_proyecto || today}
          onChange={(e) => setProyecto({ ...proyecto, fecha_fin_proyecto: e.target.value })}
          required
        />
        <InputLabel>Estado del proyecto</InputLabel>
        <select
          value={proyecto.estado_proyecto}
          onChange={(e) => setProyecto({ ...proyecto, estado_proyecto: e.target.value })}
        >
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
        </select>
        <InputLabel>Metodología</InputLabel>
        <select
          value={proyecto.metodologia_proyecto}
          onChange={(e) => setProyecto({ ...proyecto, metodologia_proyecto: e.target.value })}
        >
          <option value="Scrum">Scrum</option>
        </select>
        <InputLabel>Número de etapas</InputLabel>
        <select
          value={proyecto.numero_etapas}
          onChange={(e) => setProyecto({ ...proyecto, numero_etapas: Number(e.target.value) })}
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button type="button" onClick={handleSaveChanges} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate(`/proyecto/${nombre_proyecto}`)} disabled={loading}>
          {loading ? 'Guardando...' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyProject;