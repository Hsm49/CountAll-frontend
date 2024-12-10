import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/MisEstimaciones.css';

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

const MisEstimaciones: React.FC = () => {
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const [estimaciones, setEstimaciones] = useState<Estimacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstimaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4444/api/estimacion/verCOCOMO/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEstimaciones(response.data.estimaciones);
      } catch (error) {
        setError('Error al obtener las estimaciones');
      }
    };

    fetchEstimaciones();
  }, [nombre_proyecto]);

  const handleVerDetalle = (id_estimacion: number) => {
    navigate(`/ver-cocomo/${id_estimacion}`);
  };

  return (
    <div className="mis-estimaciones-container">
      <h2>Mis Estimaciones</h2>
      {error && <div className="error">{error}</div>}
      {estimaciones.map((estimacion) => (
        <div key={estimacion.id_estimacion} className="estimacion-card">
          <h3>Estimación {estimacion.id_estimacion}</h3>
          <p>Entradas Externas: {estimacion.entradas_externas}</p>
          <p>Salidas Externas: {estimacion.salidas_externas}</p>
          <p>Peticiones: {estimacion.peticiones}</p>
          <p>Archivos Lógicos: {estimacion.archivos_logicos}</p>
          <p>Archivos de Interfaz: {estimacion.archivos_interfaz}</p>
          <p>Puntos de Función: {estimacion.puntos_funcion}</p>
          <p>Lenguaje Predominante: {estimacion.lenguaje_predominante}</p>
          <p>LOC: {estimacion.loc}</p>
          <p>Tipo de Proyecto: {estimacion.tipo_proyecto}</p>
          <p>Personas Estimadas: {estimacion.personas_estimacion}</p>
          <p>Tiempo Estimado: {estimacion.tiempo_estimacion} meses</p>
          <p>Precio Estimado: ${estimacion.precio_estimacion}</p>
          <button onClick={() => handleVerDetalle(estimacion.id_estimacion)} className="btn-naranja">Ver Detalle</button>
        </div>
      ))}
    </div>
  );
};

export default MisEstimaciones;