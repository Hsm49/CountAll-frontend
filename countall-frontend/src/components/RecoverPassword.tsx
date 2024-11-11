import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/RecoverPassword.css';

const RecoverPassword: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo inválido').required('El nombre es requerido'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:4444/api/usuario/olvidePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_usuario: values.email }),
        });

        if (response.ok) {
          navigate('/recover-sent');
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró ninguna cuenta asociada a la dirección de correo ingresada',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al enviar el correo de recuperación',
        });
      }
    },
  });

  return (
    <>
      <div className="main-content">
        <div className="recover-container">
          <div className="pass-container">
            <img src="src/assets/svg/password1.svg" alt="Correo enviado" className="pass1-img" />
          </div>
          <div className="form-container">
            <h2>Recuperar contraseña</h2>
            <p>Escribe el correo asociado a la cuenta que deseas recuperar.</p>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Correo electrónico"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="form-input"
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
              <button type="submit" className="btn-azul">
                Enviar correo de recuperación
              </button>
              <button type="button" className="btn-naranja" onClick={() => navigate('/login')}>
                Regresar a inicio de sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecoverPassword;