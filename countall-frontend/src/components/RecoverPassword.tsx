import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './css/RecoverPassword.css';

const RecoverPassword: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo inválido').required('Requerido'),
    }),
    onSubmit: (values) => {
      // Lógica para enviar el correo de recuperación
      console.log(values);
      
    },
  });

  const handleEmailSent = () => {
    alert('Correo de recuperación enviado');
      navigate('/');
  };

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
            <button type="submit" className="btn-azul" onClick={() => navigate('/recover-sent')}>
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
