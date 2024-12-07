import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/SelectProject.css';
import { InputLabel } from '@mui/material';

interface Usuario {
  url_avatar: string;
  nombre_usuario: string;
  name_usuario: string;
  surname_usuario: string;
}

const SetProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const proyecto = location.state?.proyecto;
  const { setSelectedProject, setSelectedTeam } = useContext(ProjectTeamContext)!;
  const [nombreProyecto, setNombreProyecto] = useState(proyecto?.nombre_proyecto || '');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('En Progreso');
  const [metodologia, setMetodologia] = useState('Scrum');
  const [numeroEtapas, setNumeroEtapas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

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

    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data;
          const avatarFileName = userData.url_avatar.split('/').pop();
          const fullAvatarPath = `/src/assets/img/avatars/${avatarFileName}`;
          setUsuario({ ...userData, url_avatar: fullAvatarPath });
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsuario();
  }, [projectId, nombreProyecto]);

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
        const updatedProject = {
          id_proyecto: parseInt(projectId!),
          nombre_proyecto: nombreProyecto,
          descr_proyecto: proyecto?.descr_proyecto || ''
        };
        setSelectedProject(updatedProject);

        // Fetch the team associated with the project
        const teamResponse = await axios.get(`http://localhost:4444/api/equipo/misEquiposProyecto/${nombreProyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (teamResponse.data.equipos_usuario.length > 0) {
          setSelectedTeam(teamResponse.data.equipos_usuario[0]);
        }

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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
      
      <h2>Proyecto: {nombreProyecto}</h2>
      <h4>Ingresa los detalles del proyecto</h4>

      <div className="user-info-container">
        <div className="user-info">
          <strong>{usuario ? `${usuario.name_usuario} ${usuario.surname_usuario}` : 'John Doe'}</strong>
          <span>{usuario ? usuario.nombre_usuario : 'User Role'}</span>
        </div>
        <div className="avatar-circle">
          <img 
            src={usuario ? usuario.url_avatar : 'src/assets/img/avatars/A1.jpg'} 
            alt="User Avatar" 
          />
        </div>
      </div>

      <div className="create-form">
        <InputLabel>Fecha de inicio</InputLabel>
        <input
          type="date"
          placeholder="Fecha de Inicio"
          value={fechaInicio}
          min={today}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
        <InputLabel>Fecha de fin</InputLabel>
        <input
          type="date"
          placeholder="Fecha de Fin"
          value={fechaFin}
          min={fechaInicio || today}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />
        <InputLabel>Estado del proyecto</InputLabel>
        <input
          type="text"
          placeholder="Estado del Proyecto"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
          disabled
        />
        <InputLabel>Metodología</InputLabel>
        <select
          value={metodologia}
          onChange={(e) => setMetodologia(e.target.value)}
        >
          <option value="Scrum">Scrum</option>
        </select>
        <InputLabel>Número de etapas</InputLabel>
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