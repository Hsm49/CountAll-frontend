import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './css/SelectProject.css';

interface Usuario {
  url_avatar: string;
  nombre_usuario: string;
  name_usuario: string;
  surname_usuario: string;
}

interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
  estado_proyecto: string; 
}

const SelectProject: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { setSelectedProject } = useContext(ProjectTeamContext)!;
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/proyecto/misProyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProyectos(response.data.proyectos_usuario || []);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setProyectos([]);
        } else {
          console.error('Error fetching proyectos:', error);
          setError('Error al cargar los proyectos');
        }
        setLoading(false);
      }
    };

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
          setUsuario(response.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchProyectos();
    fetchUsuario();
  }, []);

  const handleProjectClick = (proyecto: Proyecto) => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedProject(proyecto);
      navigate(`/select-team/${proyecto.nombre_proyecto}`, { state: { proyecto } });
    }, 300);
  };

  const formik = useFormik({
    initialValues: {
      nombreProyecto: '',
      descrProyecto: '',
    },
    validationSchema: Yup.object({
      nombreProyecto: Yup.string().required('El nombre del proyecto es requerido'),
      descrProyecto: Yup.string().required('La descripción del proyecto es requerida'),
    }),
    onSubmit: async (values) => {
      setCreateError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4444/api/proyecto/crearProyecto', {
          nombre_proyecto: values.nombreProyecto,
          descr_proyecto: values.descrProyecto
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const newProject = response.data;
        setProyectos([...proyectos, newProject]);
        setSelectedProject(newProject);
        // Recargar la página para seleccionar el proyecto recién creado
        window.location.reload();
      } catch (error) {
        console.error('Error creating project:', error);
        setCreateError('Error al crear el proyecto');
      }
    },
  });

  const handleSkipToTeams = () => {
    navigate('/select-team-user');
  };

  const filteredProyectos = proyectos.filter(proyecto =>
    proyecto.nombre_proyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
      className="page-container"
    >
      <div className="select-project-container">
        <h2>Bienvenido a CountAll</h2>
        <p className="skip-link" onClick={handleSkipToTeams}>¿Ya perteneces a un equipo? Haz clic aquí</p>
        
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

        {proyectos.length > 0 && (
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {!isCreating ? (
          <>
            {proyectos.length === 0 ? (
              <div className="empty-state">
                <h3>Para empezar, crea un nuevo proyecto:</h3>
                <button 
                  className="create-project-btn" 
                  onClick={() => setIsCreating(true)}
                >
                  Crear Proyecto
                </button>
              </div>
            ) : (
              <>
                <h3>Selecciona un proyecto:</h3>
                {filteredProyectos.length === 0 ? (
                  <div className="empty-state">
                    <h3>No se encontraron proyectos con ese nombre.</h3>
                  </div>
                ) : (
                  <div className="project-cards-grid">
                    {filteredProyectos.map((proyecto) => (
                      <div 
                        key={proyecto.id_proyecto} 
                        className="project-card" 
                        onClick={() => handleProjectClick(proyecto)}
                      >
                        <h3>{proyecto.nombre_proyecto}</h3>
                        <p>{proyecto.descr_proyecto}</p>
                        <p><strong>Estado:</strong> {proyecto.estado_proyecto}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  className="create-project-btn" 
                  onClick={() => setIsCreating(true)}
                >
                  Crear Nuevo Proyecto
                </button>
              </>
            )}
          </>
        ) : (
          <div className="create-form">
            <h3>Crear Nuevo Proyecto</h3>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Nombre del Proyecto"
                {...formik.getFieldProps('nombreProyecto')}
                className={`form-control ${formik.touched.nombreProyecto && formik.errors.nombreProyecto ? 'is-invalid' : ''}`}
              />
              {formik.touched.nombreProyecto && formik.errors.nombreProyecto ? (
                <div className="invalid-feedback">{formik.errors.nombreProyecto}</div>
              ) : null}
              <textarea
                placeholder="Descripción del Proyecto"
                {...formik.getFieldProps('descrProyecto')}
                className={`form-control ${formik.touched.descrProyecto && formik.errors.descrProyecto ? 'is-invalid' : ''}`}
              />
              {formik.touched.descrProyecto && formik.errors.descrProyecto ? (
                <div className="invalid-feedback">{formik.errors.descrProyecto}</div>
              ) : null}
              {createError && <p className="error">{createError}</p>}
              <div className="button-group">
                <button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Creando...' : 'Crear Proyecto'}
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

export default SelectProject;