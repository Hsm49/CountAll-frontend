import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './css/RecoverPassword.css';
import Header from './HeaderLg';

const NewPassword: React.FC = () => {
    const navigate = useNavigate();

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
      onSubmit: (values) => {
        // Lógica para crear la nueva contraseña
        console.log(values);
        alert('Contraseña cambiada exitosamente');
        navigate('/password-saved'); 
      },
    });

  return (
    <>
    <Header/>
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
    </>
  );
};

export default NewPassword;
