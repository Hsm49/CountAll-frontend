import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import './css/VerCOCOMO.css';

interface Estimacion {
  id_estimacion: number;
  entradas_externas: number;
  salidas_externas: number;
  peticiones: number;
  archivos_logicos: number;
  archivos_interfaz: number;
  puntos_funcion: number;
  lenguaje_predominante: string;
  loc: number;
  tipo_proyecto: string;
  personas_estimacion: number;
  tiempo_estimacion: number;
  precio_estimacion: number;
}

const VerCOCOMO: React.FC = () => {
  const { id_estimacion } = useParams<{ id_estimacion: string }>();
  const [estimacion, setEstimacion] = useState<Estimacion | null>(null);

  useEffect(() => {
    const fetchEstimacion = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:4444/api/estimacion/verCOCOMO/${id_estimacion}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setEstimacion(response.data.estimacion);
        } else {
          console.error('Failed to fetch estimation data');
        }
      } catch (error) {
        console.error('Error fetching estimation data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al obtener la estimación',
        });
      }
    };

    fetchEstimacion();
  }, [id_estimacion]);

  if (!estimacion) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <p>Cargando datos...</p>
      </Box>
    );
  }

  return (
    <div className="ver-cocomo-container">
      <div className="cocomo-card">
        <h2>Estimación COCOMO</h2>
        <p><strong>Entradas Externas:</strong> {estimacion.entradas_externas}</p>
        <p><strong>Salidas Externas:</strong> {estimacion.salidas_externas}</p>
        <p><strong>Peticiones:</strong> {estimacion.peticiones}</p>
        <p><strong>Archivos Lógicos:</strong> {estimacion.archivos_logicos}</p>
        <p><strong>Archivos de Interfaz:</strong> {estimacion.archivos_interfaz}</p>
        <p><strong>Puntos de Función:</strong> {estimacion.puntos_funcion}</p>
        <p><strong>Lenguaje Predominante:</strong> {estimacion.lenguaje_predominante}</p>
        <p><strong>LOC:</strong> {estimacion.loc}</p>
        <p><strong>Tipo de Proyecto:</strong> {estimacion.tipo_proyecto}</p>
        <p><strong>Personas Estimadas:</strong> {estimacion.personas_estimacion}</p>
        <p><strong>Tiempo Estimado (meses):</strong> {estimacion.tiempo_estimacion}</p>
        <p><strong>Precio Estimado:</strong> {estimacion.precio_estimacion}</p>
      </div>
    </div>
  );
};

export default VerCOCOMO;