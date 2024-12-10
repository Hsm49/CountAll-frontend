import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import Swal from 'sweetalert2';
import './css/Details.css';

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  metodologia_proyecto: string;
  estado_proyecto: string;
}

const ProjectDetails: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const { userRole } = useContext(ProjectTeamContext)!;
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

  if (!proyecto) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <p>Cargando datos...</p>
      </Box>
    );
  }

  const handleModifyProject = () => {
    navigate(`/modificar-proyecto/${nombre_proyecto}`);
  };

  const handleGenerateSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4444/api/proyecto/verResumen/${nombre_proyecto}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/resumen-proyecto/${nombre_proyecto}`, { state: { resumen: response.data.resumen_proyecto } });
      } else {
        console.error('Failed to generate project summary');
      }
    } catch (error) {
      console.error('Error generating project summary:', error);
    }
  };

  const handleRealizarCOCOMO = () => {
    navigate(`/realizar-cocomo/${nombre_proyecto}`);
  };

  const handleVerCOCOMO = () => {
    navigate(`/mis-estimaciones/${nombre_proyecto}`);
  };

  return (
    <div className="details-container mt-5">
      <div className="details-card">
        <h2>{proyecto.nombre_proyecto}</h2>
        <p>{proyecto.descr_proyecto}</p>
        <p>Fecha de inicio: {new Date(proyecto.fecha_inicio_proyecto).toLocaleDateString()}</p>
        <p>Fecha de fin: {new Date(proyecto.fecha_fin_proyecto).toLocaleDateString()}</p>
        <p>Metodología: {proyecto.metodologia_proyecto}</p>
        <p>Estado: {proyecto.estado_proyecto}</p>
        {userRole === 'Líder' && (
        <div className="button-group">
          <button onClick={handleModifyProject} className="btn-naranja">Modificar Proyecto</button>
          <button onClick={handleGenerateSummary} className="btn-naranja">Generar Resumen del Proyecto</button>
          <button onClick={handleRealizarCOCOMO} className="btn-naranja">Realizar COCOMO</button>
          <button onClick={handleVerCOCOMO} className="btn-naranja">Ver COCOMOs</button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProjectDetails;