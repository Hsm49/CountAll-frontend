import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/ManageSites.css';

const ManageSites: React.FC = () => {
  const { userRole, selectedTeam } = useContext(ProjectTeamContext)!;
  interface Site {
    id_pagina: number;
    nombre_pagina: string;
    descr_pagina: string;
    url_pagina: string;
    nivel_bloqueo: number;
  }

  const [personalSites, setPersonalSites] = useState<Site[]>([]);
  const [teamSites, setTeamSites] = useState<Site[]>([]);
  const [newPersonalSite, setNewPersonalSite] = useState({ nombre_pagina: '', descr_pagina: '', url_pagina: '' });
  const [newTeamSite, setNewTeamSite] = useState({ nombre_pagina: '', descr_pagina: '', url_pagina: '' });

  useEffect(() => {
    fetchBlockedSites();
  }, []);

  const fetchBlockedSites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4444/api/paginaWeb/verPaginasBloqueadas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPersonalSites(response.data.paginas_bloqueadas.filter((site: Site) => site.nivel_bloqueo === 0));
      setTeamSites(response.data.paginas_bloqueadas.filter((site: Site) => site.nivel_bloqueo === 1));
    } catch (error) {
      console.error('Error fetching blocked sites:', error);
    }
  };

  const normalizeUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.replace('www.', '');
    } catch (e) {
      return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    }
  };

  const handleBlockSite = async (site: Site, isTeam: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isTeam
        ? `http://localhost:4444/api/paginaWeb/bloquearPaginaEquipo/${selectedTeam?.id_equipo}`
        : 'http://localhost:4444/api/paginaWeb/bloquearPagina';
      await axios.post(endpoint, site, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Sitio bloqueado',
        text: 'El sitio ha sido bloqueado exitosamente',
      });
      fetchBlockedSites();
    } catch (error) {
      console.error('Error blocking site:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al bloquear el sitio',
      });
    }
  };

  const handleUnblockSite = async (url_pagina: string, isTeam: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const normalizedSite = normalizeUrl(url_pagina);
      let endpoint;
      if (isTeam && selectedTeam) {
        endpoint = `http://localhost:4444/api/paginaWeb/desbloquearPaginaEquipo/${selectedTeam.id_equipo}/${normalizedSite}`;
      } else {
        endpoint = `http://localhost:4444/api/paginaWeb/desbloquearPagina/${normalizedSite}`;
      }
      await axios.delete(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Sitio desbloqueado',
        text: 'El sitio ha sido desbloqueado exitosamente',
      });
      fetchBlockedSites();
    } catch (error) {
      console.error('Error unblocking site:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al desbloquear el sitio',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isTeam: boolean) => {
      e.preventDefault();
      const site = {
        ...isTeam ? newTeamSite : newPersonalSite,
        id_pagina: Date.now(), // or any unique identifier
        nivel_bloqueo: isTeam ? 1 : 0
      };
      if (!site.nombre_pagina || !site.descr_pagina || !site.url_pagina) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completa todos los campos',
        });
        return;
      }
      handleBlockSite(site, isTeam);
      if (isTeam) {
        setNewTeamSite({ nombre_pagina: '', descr_pagina: '', url_pagina: '' });
      } else {
        setNewPersonalSite({ nombre_pagina: '', descr_pagina: '', url_pagina: '' });
      }
    };

  return (
    <div className="manage-sites-container">
      <h2>Gestión de Sitios Bloqueados</h2>
      <div className="block-section">
        <h3>Bloqueo de Sitios Personales</h3>
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <input
            type="text"
            placeholder="Nombre del Sitio"
            value={newPersonalSite.nombre_pagina}
            onChange={(e) => setNewPersonalSite({ ...newPersonalSite, nombre_pagina: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción del Sitio"
            value={newPersonalSite.descr_pagina}
            onChange={(e) => setNewPersonalSite({ ...newPersonalSite, descr_pagina: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="URL del Sitio"
            value={newPersonalSite.url_pagina}
            onChange={(e) => setNewPersonalSite({ ...newPersonalSite, url_pagina: e.target.value })}
            required
          />
          <button type="submit">Bloquear Sitio</button>
        </form>
        <div className="blocked-sites-list">
          {personalSites.map(site => (
            <div key={site.id_pagina} className="site-item">
              <span>{site.nombre_pagina}</span>
              <button onClick={() => handleUnblockSite(site.url_pagina, false)}>Desbloquear</button>
            </div>
          ))}
        </div>
      </div>
      <div className="block-section">
        <h3>Bloqueo de Sitios por Equipo</h3>
        {userRole === 'Líder' && (
          <form onSubmit={(e) => handleSubmit(e, true)}>
            <input
              type="text"
              placeholder="Nombre del Sitio"
              value={newTeamSite.nombre_pagina}
              onChange={(e) => setNewTeamSite({ ...newTeamSite, nombre_pagina: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descripción del Sitio"
              value={newTeamSite.descr_pagina}
              onChange={(e) => setNewTeamSite({ ...newTeamSite, descr_pagina: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="URL del Sitio"
              value={newTeamSite.url_pagina}
              onChange={(e) => setNewTeamSite({ ...newTeamSite, url_pagina: e.target.value })}
              required
            />
            <button type="submit">Bloquear Sitio</button>
          </form>
        )}
        <div className="blocked-sites-list">
          {teamSites.map(site => (
            <div key={site.id_pagina} className="site-item">
              <span>{site.nombre_pagina}</span>
              {userRole === 'Líder' ? (
                <button onClick={() => handleUnblockSite(site.url_pagina, true)}>Desbloquear</button>
              ) : (
                <span>Bloqueado por el líder</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSites;