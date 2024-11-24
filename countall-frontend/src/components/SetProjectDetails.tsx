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
  const [estado, setEstado] = useState('Activo');
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

  // Función para normalizar una fecha a medianoche en UTC
  const normalizeDateToUTC = (dateString: string): Date => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  };

  // Función para obtener la fecha actual normalizada a medianoche UTC
  const getTodayUTC = (): Date => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  // Función para formatear la fecha para el backend
  const formatDateForBackend = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleProvideDetails = async () => {
    if (!fechaInicio || !fechaFin || !estado) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const fechaInicioUTC = normalizeDateToUTC(fechaInicio);
    const fechaFinUTC = normalizeDateToUTC(fechaFin);
    const todayUTC = getTodayUTC();

    // Comparación de fechas normalizadas
    if (fechaInicioUTC < todayUTC) {
      setError('La fecha de inicio debe ser hoy o en el futuro');
      return;
    }

    if (fechaInicioUTC >= fechaFinUTC) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setLoading(true);
    setError(null);

    const projectDetails = {
      fecha_inicio_proyecto: formatDateForBackend(fechaInicio),
      fecha_fin_proyecto: formatDateForBackend(fechaFin),
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
        <h3>Detalles del Proyecto: {nombreProyecto}</h3>
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