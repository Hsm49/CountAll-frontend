import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import LoadingScreen from './LoadingScreen';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './css/SelectProject.css';

interface Usuario {
  url_avatar: string;
  nombre_usuario: string;
  name_usuario: string;
  surname_usuario: string;
}

interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
}

const SelectTeam: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [descrEquipo, setDescrEquipo] = useState('');
  const [usuarios, setUsuarios] = useState<{ email: string; role: 'Lider' | 'Miembro' | 'Invitado' }[]>([]);
  const [newEmails, setNewEmails] = useState<string>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const navigate = useNavigate();
  const { setSelectedTeam, selectedProject, setUserRole } = useContext(ProjectTeamContext)!;
  const { nombre_proyecto } = useParams<{ nombre_proyecto: string }>();
  const location = useLocation();
  const proyecto = location.state?.proyecto;

  useEffect(() => {
    if (!selectedProject) {
      navigate('/select-project');
      return;
    }

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data;
        const avatarFileName = userData.url_avatar.split('/').pop();
        const fullAvatarPath = `/src/assets/img/avatars/${avatarFileName}`;
        setCurrentUser(userData.nombre_usuario);
        setUsuario({ ...userData, url_avatar: fullAvatarPath });
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, [selectedProject, navigate]);

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!nombre_proyecto) return;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquiposProyecto/${nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipos(response.data.equipos_usuario || []);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setEquipos([]);
        } else {
          console.error('Error fetching equipos:', error);
          setError('Error fetching equipos');
        }
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [nombre_proyecto]);

  const handleTeamClick = async (equipo: Equipo) => {
    setIsVisible(false);
    setTimeout(async () => {
      setSelectedTeam(equipo);

      // Fetch user role
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${equipo.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserRole(response.data.rol_sesion);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }

      // Verificar si los detalles del proyecto ya han sido proporcionados
      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/misProyectos/${selectedProject?.nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.proyecto.estado_proyecto) {
          navigate('/tracking', { state: { equipo } });
        } else {
          navigate(`/set-project-details/${selectedProject?.id_proyecto}`, { state: { proyecto: selectedProject } });
        }
      } catch (error) {
        console.error('Error verifying project details:', error);
        navigate('/tracking', { state: { equipo } });
      }
    }, 300);
  };

  const validateEmails = (emailString: string) => {
    const emailArray = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emailArray) {
      if (!emailRegex.test(email)) {
        return false;
      }
    }
    return true;
  };

  const handleEmailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailString = event.target.value;
    setNewEmails(emailString);
    if (validateEmails(emailString)) {
      setEmailError('');
    } else {
      setEmailError('Por favor agrega direcciones de correo válidas separadas por comas.');
    }
  };

  const handleAddEmails = () => {
    if (!validateEmails(newEmails)) {
      setEmailError('Por favor agrega direcciones de correo válidas separadas por comas.');
      return;
    }

    const emails = newEmails.split(',').map(email => email.trim()).filter(email => email);
    const newEmailList = emails.map(email => ({ email, role: 'Miembro' as 'Lider' | 'Miembro' | 'Invitado' }));
    setUsuarios(newEmailList);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmailList = usuarios.filter(({ email }) => email !== emailToRemove);
    setUsuarios(updatedEmailList);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    // If no users are added, add the current user by default
    if (usuarios.length === 0 && currentUser) {
      setUsuarios([{ email: currentUser, role: 'Miembro' }]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4444/api/equipo/crearEquipo', {
        nombre_equipo: nombreEquipo,
        descr_equipo: descrEquipo,
        usuarios: usuarios.map(user => user.email),
        proyecto: nombre_proyecto
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const newTeam = response.data;
      setEquipos([...equipos, newTeam]);
      setSelectedTeam(newTeam);

      // Fetch user role
      try {
        const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${newTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserRole(response.data.rol_sesion);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }

      // Verificar si los detalles del proyecto ya han sido proporcionados
      try {
        const response = await axios.get(`http://localhost:4444/api/proyecto/misProyectos/${selectedProject?.nombre_proyecto}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.proyecto.estado_proyecto) {
          navigate('/tracking');
        } else {
          navigate(`/set-project-details/${selectedProject?.id_proyecto}`, { state: { proyecto: selectedProject } });
        }
      } catch (error) {
        console.error('Error verifying project details:', error);
        navigate('/tracking');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setCreateError('Error al crear el equipo');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>{error}</div>;

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
      className="page-container"
    >
      <div className="select-team-container">
        <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
        <h2>Proyecto: {nombre_proyecto}</h2>
        
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

        {!isCreating ? (
          <>
            {equipos.length === 0 ? (
              <div className="empty-state">
                <h3>Para continuar, crea un nuevo equipo:</h3>
                <button 
                  className="create-team-btn" 
                  onClick={() => setIsCreating(true)}
                >
                  Crear Equipo
                </button>
              </div>
            ) : (
              <>
                <h3>Selecciona un equipo:</h3>
                <div className="team-cards-grid">
                  {equipos.map((equipo) => (
                    <div 
                      key={equipo.id_equipo} 
                      className="team-card" 
                      onClick={() => handleTeamClick(equipo)}
                    >
                      <h3>{equipo.nombre_equipo}</h3>
                      <p>{equipo.descr_equipo}</p>
                    </div>
                  ))}
                </div>
                <button 
                  className="create-team-btn" 
                  onClick={() => setIsCreating(true)}
                >
                  Crear Nuevo Equipo
                </button>
              </>
            )}
          </>
        ) : (
          <div className="create-form">
            <h3>Crear Nuevo Equipo</h3>
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                placeholder="Nombre del Equipo"
                value={nombreEquipo}
                onChange={(e) => setNombreEquipo(e.target.value)}
                required
              />
              <textarea
                placeholder="Descripción del Equipo"
                value={descrEquipo}
                onChange={(e) => setDescrEquipo(e.target.value)}
                required
              />
              <div className="user-input">
                <input
                  type="text"
                  placeholder="Agregar Usuarios por Correo (separados por comas)"
                  value={newEmails}
                  onChange={handleEmailsChange}
                />
                <button type="button" onClick={handleAddEmails}>Agregar</button>
              </div>
              {emailError && <p className="error">{emailError}</p>}
              <ul>
                {usuarios.map((user, index) => (
                  <li key={index}>
                    {user.email}
                    <button type="button" onClick={() => handleRemoveEmail(user.email)}>
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
              {createError && <p className="error">{createError}</p>}
              <div className="button-group">
                <button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creando...' : 'Crear Equipo'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

export default SelectTeam;