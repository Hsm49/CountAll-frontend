import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import './css/RecoverPassword.css';

const NewPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Verificar la validez del token al cargar la página
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(`http://localhost:4444/api/usuario/comprobarToken/${token}`);
        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error('Error verificando el token:', error);
        setIsTokenValid(false);
      }
    };

    if (token) {
      checkToken();
    }
  }, [token]);

  // Configuración de Formik para manejar el formulario
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Ingresa una nueva contraseña'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
        .required('Confirma la contraseña'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:4444/api/usuario/reestablecerPassword/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevo_password: values.newPassword }),
        });

        if (response.ok) {
          alert('Contraseña cambiada exitosamente');
          navigate('/password-saved');
        } else {
          const data = await response.json();
          alert(data.message || 'Hubo un error al restablecer la contraseña.');
        }
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
      }
    },
  });

  // Si el token no es válido, mostrar un mensaje de error
  if (isTokenValid === false) {
    return (
      <div className="main-content">
        <div className="recover-container">
          <h2>Enlace inválido o expirado</h2>
          <p>El enlace para restablecer la contraseña no es válido o ya ha expirado.</p>
          <button className="btn-azul" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Mostrar un indicador de carga mientras se verifica el token
  if (isTokenValid === null) {
    return (
      <div className="main-content">
        <div className="recover-container">
          <p>Verificando el enlace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="recover-container">
        <div className="pass-container">
          <img src="src/assets/svg/password2.svg" alt="Nueva contraseña" className="img-fluid" />
        </div>
        <div className="form-container">
          <h2>Crea una nueva contraseña</h2>
          <p>Introduce y confirma tu nueva contraseña.</p>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Nueva contraseña"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              className={`form-control ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
            />
            {formik.errors.newPassword && formik.touched.newPassword ? (
              <div className="invalid-feedback">{formik.errors.newPassword}</div>
            ) : null}
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
              <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
            ) : null}
            <button type="submit" className="btn-azul">
              Guardar nueva contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
