import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/SelectProject.css';

const SetProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const proyecto = location.state?.proyecto;
  const [nombreProyecto, setNombreProyecto] = useState(proyecto?.nombre_proyecto || '');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('En Progreso');
  const [metodologia, setMetodologia] = useState('Scrum');
  const [numeroEtapas, setNumeroEtapas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nombreProyecto) {
      const fetchProyecto = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get(`http://localhost:4444/api/proyecto/misProyectos/${projectId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setNombreProyecto(response.data.proyecto.nombre_proyecto);
          } else {
            console.error('Failed to fetch project data');
          }
        } catch (error) {
          console.error('Error fetching project data:', error);
        }
      };

      fetchProyecto();
    }
  }, [projectId, nombreProyecto]);

  // Función para formatear la fecha para el backend
  const formatDateForBackend = (dateString: string): string => {
    return `${dateString} 00:00:00-06`;
  };

  const handleProvideDetails = async () => {
    if (!fechaInicio || !fechaFin || !estado) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const fechaInicioFormatted = formatDateForBackend(fechaInicio);
    const fechaFinFormatted = formatDateForBackend(fechaFin);

    setLoading(true);
    setError(null);

    const projectDetails = {
      fecha_inicio_proyecto: fechaInicioFormatted,
      fecha_fin_proyecto: fechaFinFormatted,
      estado_proyecto: estado,
      metodologia_proyecto: metodologia,
      numero_etapas_proyecto: numeroEtapas
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4444/api/proyecto/crearProyecto/${nombreProyecto}`, 
        projectDetails,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.msg) {
        navigate('/tracking');
      }
    } catch (error: any) {
      console.error('Error providing project details:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(error.response?.data?.error || 'Error al proporcionar los detalles del proyecto');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener la fecha actual en formato YYYY-MM-DD para el input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
      <div className="create-form">
        <input
          type="date"
          placeholder="Fecha de Inicio"
          value={fechaInicio}
          min={today}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Fecha de Fin"
          value={fechaFin}
          min={fechaInicio || today}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Estado del Proyecto"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
          disabled
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
        <div className="button-group">
          <button onClick={handleProvideDetails} disabled={loading}>
            {loading ? 'Proporcionando...' : 'Proporcionar Detalles'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetProjectDetails;