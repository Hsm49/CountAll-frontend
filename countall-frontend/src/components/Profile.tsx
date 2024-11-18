import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './css/Profile.css'; // Crea este archivo para los estilos
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4444/api/usuario/verPerfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data.info_usuario);
        formik.setValues({
          name_usuario: response.data.info_usuario.name_usuario,
          surname_usuario: response.data.info_usuario.surname_usuario,
          nombre_usuario: response.data.info_usuario.username_usuario,
          numero_telefonico: response.data.info_usuario.numero_telefonico
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const validationSchema = yup.object({
    name_usuario: yup.string().required('Nombre de usuario vacío'),
    surname_usuario: yup.string().required('Apellido de usuario vacío'),
    numero_telefonico: yup.string().required('Número telefónico vacío')
  });

  const formik = useFormik({
    initialValues: {
      name_usuario: '',
      surname_usuario: '',
      nombre_usuario: '',
      numero_telefonico: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        console.log('Submitting values:', values);
        await axios.post('http://localhost:4444/api/usuario/modificarDatos', values, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'Los cambios han sido guardados exitosamente',
        }).then(() => {
          window.location.reload();
        });
        setEditMode(false);
      } catch (error) {
        console.error('Error saving changes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron guardar los cambios',
        });
      }
    }
  });

  const handleSaveChanges = () => {
    console.log('Form values before submit:', formik.values);
    formik.handleSubmit();
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Perfil de Usuario</h2>
      <form onSubmit={formik.handleSubmit} className="profile-info">
        <div className="profile-info">
          <label>Nombre:</label>
          {editMode ? (
            <input
              type="text"
              name="name_usuario"
              value={formik.values.name_usuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ) : (
            <p>{user.name_usuario}</p>
          )}
          {formik.touched.name_usuario && formik.errors.name_usuario ? (
            <div className="error">{formik.errors.name_usuario}</div>
          ) : null}
        </div>
        <div className="profile-info">
          <label>Apellido:</label>
          {editMode ? (
            <input
              type="text"
              name="surname_usuario"
              value={formik.values.surname_usuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ) : (
            <p>{user.surname_usuario}</p>
          )}
          {formik.touched.surname_usuario && formik.errors.surname_usuario ? (
            <div className="error">{formik.errors.surname_usuario}</div>
          ) : null}
        </div>
        <div className="profile-info">
          <label>Nombre de Usuario:</label>
          {editMode ? (
            <input
              type="text"
              name="nombre_usuario"
              value={formik.values.nombre_usuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ) : (
            <p>{user.username_usuario}</p>
          )}
        </div>
        <div className="profile-info">
          <label>Número Telefónico:</label>
          {editMode ? (
            <input
              type="text"
              name="numero_telefonico"
              value={formik.values.numero_telefonico}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ) : (
            <p>{user.numero_telefonico}</p>
          )}
          {formik.touched.numero_telefonico && formik.errors.numero_telefonico ? (
            <div className="error">{formik.errors.numero_telefonico}</div>
          ) : null}
        </div>
        {editMode ? (
          <button className="btn-naranja" type="button" onClick={handleSaveChanges}>Guardar Cambios</button>
        ) : (
          <button className="btn-azul" type="button" onClick={() => setEditMode(true)}>Editar Perfil</button>
        )}
      </form>
    </div>
  );
};

export default Profile;