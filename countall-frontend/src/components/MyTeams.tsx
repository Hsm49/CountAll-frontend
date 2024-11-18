import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/MyProjects.css';
import { useNavigate } from 'react-router-dom';

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
}

const MyTeams: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/equipo/misEquipos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipos(response.data.equipos_usuario);
      } catch (error) {
        console.error('Error fetching equipos:', error);
      }
    };

    fetchEquipos();
  }, []);

  const handleTeamClick = (id: number) => {
    // Aquí puedes manejar lo que sucede al hacer clic en una tarjeta de equipo
    console.log(`Equipo clickeado: ${id}`);
  };

  return (
    <div className="my-projects-container">
      {equipos.map((equipo) => (
        <div key={equipo.id_equipo} className="project-card" onClick={() => handleTeamClick(equipo.id_equipo)}>
          <h3>{equipo.nombre_equipo}</h3>
          <p>{equipo.descr_equipo}</p>
        </div>
      ))}
    </div>
  );
};

export default MyTeams;