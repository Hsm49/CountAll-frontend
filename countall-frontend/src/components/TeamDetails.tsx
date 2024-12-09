import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/Details.css';

interface Integrante {
  nombre_usuario: string;
  id_usuario: number;
  email_usuario: string;
  rol: string;
}

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
  nombre_proyecto: string; // Añadido para almacenar el nombre del proyecto
  integrantes_equipo: Integrante[];
}

const TeamDetails: React.FC = () => {
  const { id_equipo } = useParams<{ id_equipo: string }>();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [rolSesion, setRolSesion] = useState<string>('');

  useEffect(() => {
    const fetchEquipo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setEquipo(response.data.equipo);
          setRolSesion(response.data.rol_sesion);
        } else {
          console.error('Failed to fetch team data');
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchEquipo();
  }, [id_equipo]);

  if (!equipo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container mt-5">
      <div className="details-card">
        <h2>{equipo.nombre_equipo}</h2>
        <p>{equipo.descr_equipo}</p>
        <p><strong>Proyecto:</strong> {equipo.nombre_proyecto}</p> {/* Añadido para mostrar el nombre del proyecto */}
        <p>Rol en la sesión: {rolSesion}</p>
        <h3>Integrantes del equipo:</h3>
        <ul>
          {equipo.integrantes_equipo.map((integrante) => (
            <li key={integrante.id_usuario}>
              {integrante.nombre_usuario} ({integrante.rol}) - {integrante.email_usuario}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamDetails;