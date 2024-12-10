import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/MyProjects.css';
import { useNavigate } from 'react-router-dom';

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
  nombre_proyecto: string; // Añadido para almacenar el nombre del proyecto
}

const MyTeams: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleTeamClick = (id_equipo: number) => {
    navigate(`/equipo/${id_equipo}`);
  };

  const handleChangeTeam = () => {
    navigate('/select-team-user');
  };

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-projects-container d-flex justify-content-center">
      <button className="btn-naranja" onClick={handleChangeTeam}>Cambiar de equipo</button>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar equipo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredEquipos.map((equipo) => (
        <div key={equipo.id_equipo} className="project-card" onClick={() => handleTeamClick(equipo.id_equipo)}>
          <h3>{equipo.nombre_equipo}</h3>
          <p>{equipo.descr_equipo}</p>
          <p><strong>Proyecto:</strong> {equipo.nombre_proyecto}</p>
        </div>
      ))}
    </div>
  );
};

export default MyTeams;