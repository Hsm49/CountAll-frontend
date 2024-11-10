import React, { useState } from 'react';
import './css/ManageSites.css';

const ManageSites: React.FC = () => {
  const [teamSites, setTeamSites] = useState<string[]>(['example.com', 'example.org']);
  const [personalSites, setPersonalSites] = useState<string[]>(['example.net']);
  const [newSite, setNewSite] = useState<string>('');

  const handleAddSite = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (newSite && !list.includes(newSite)) {
      setList([...list, newSite]);
      setNewSite('');
    }
  };

  const handleRemoveSite = (site: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter(s => s !== site));
  };

  const handleEditSite = (oldSite: string, newSite: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const updatedList = list.map(s => (s === oldSite ? newSite : s));
    setList(updatedList);
  };

  const handleSaveChanges = () => {
    // Agregar la lógica para enviar los cambios al backend
    alert('Cambios guardados');
  };

  return (
    <div className="manage-sites-container">
      <div className="sites-section">
        <h3>Lista de sitios del equipo</h3>
        <ul>
          {teamSites.map(site => (
            <li key={site}>
              {site}
              <button className="btn-blue" onClick={() => handleRemoveSite(site, teamSites, setTeamSites)}>Eliminar</button>
              <button className="btn-orange" onClick={() => handleEditSite(site, prompt('Nuevo nombre del sitio:', site) || site, teamSites, setTeamSites)}>Editar</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Añadir nuevo sitio"
        />
        <button className="btn-orange" onClick={() => handleAddSite(teamSites, setTeamSites)}>Añadir sitio</button>
      </div>
      <div className="sites-section">
        <h3>Lista personal</h3>
        <ul>
          {personalSites.map(site => (
            <li key={site}>
              {site}
              <button className="btn-blue" onClick={() => handleRemoveSite(site, personalSites, setPersonalSites)}>Eliminar</button>
              <button className="btn-orange" onClick={() => handleEditSite(site, prompt('Nuevo nombre del sitio:', site) || site, personalSites, setPersonalSites)}>Editar</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Añadir nuevo sitio"
        />
        <button className="btn-orange" onClick={() => handleAddSite(personalSites, setPersonalSites)}>Añadir sitio</button>
      </div>
      <button className="btn-blue" onClick={handleSaveChanges}>Guardar cambios</button>
    </div>
  );
};

export default ManageSites;