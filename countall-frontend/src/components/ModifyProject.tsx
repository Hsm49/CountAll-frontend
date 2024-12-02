import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/SelectProject.css';

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

const ModifyProject: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    return `${dateString} 00:00:00-06`;
  };

  const handleSaveChanges = async () => {
    if (!proyecto) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formattedProyecto = {
        ...proyecto,
        fecha_inicio_proyecto: formatDateForBackend(proyecto.fecha_inicio_proyecto),
        fecha_fin_proyecto: formatDateForBackend(proyecto.fecha_fin_proyecto),
      };
      const response = await axios.put(`http://localhost:4444/api/proyecto/modificarProyecto/${nombre_proyecto}`, formattedProyecto, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/proyecto/${nombre_proyecto}`);
      } else {
        setError('Failed to save changes');
      }
    } catch (error) {
      setError('Error saving changes');
    } finally {
      setLoading(false);
    }
  };

  if (!proyecto) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="create-form">
        <h3>Modificar Proyecto: {proyecto.nombre_proyecto}</h3>
        <form>
          <label>
            Fecha de inicio:
            <input
              type="date"
              value={proyecto.fecha_inicio_proyecto}
              onChange={(e) => setProyecto({ ...proyecto, fecha_inicio_proyecto: e.target.value })}
            />
          </label>
          <label>
            Fecha de fin:
            <input
              type="date"
              value={proyecto.fecha_fin_proyecto}
              onChange={(e) => setProyecto({ ...proyecto, fecha_fin_proyecto: e.target.value })}
            />
          </label>
          <label>
            Estado:
            <select
              value={proyecto.estado_proyecto}
              onChange={(e) => setProyecto({ ...proyecto, estado_proyecto: e.target.value })}
            >
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </label>
          <label>
            Número de etapas:
            <input
              type="number"
              min="1"
              max="10"
              value={proyecto.numero_etapas}
              onChange={(e) => setProyecto({ ...proyecto, numero_etapas: parseInt(e.target.value) })}
            />
          </label>
          <label>
            Metodología:
            <input
              type="text"
              value={proyecto.metodologia_proyecto}
              readOnly
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="button-group">
            <button type="button" onClick={handleSaveChanges} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate(`/proyecto/${nombre_proyecto}`)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyProject;