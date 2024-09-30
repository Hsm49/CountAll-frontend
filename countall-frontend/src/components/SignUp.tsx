import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import './css/SignUp.css';
import Header from './HeaderLg';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    const navigate = useNavigate(); 

    const formik = useFormik({
      initialValues: {
        nombre: '',
        apellidos: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validationSchema: Yup.object({
        nombre: Yup.string().required('El nombre es requerido'),
        apellidos: Yup.string().required('Los apellidos son requeridos'),
        username: Yup.string().required('El nombre de usuario es requerido'),
        email: Yup.string().email('Correo inválido').required('El correo es requerido'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'Las contraseñas deben coincidir')
          .required('Debes confirmar la contraseña'),
      }),
      onSubmit: (values) => {
        // Lógica para registrar al usuario
        console.log(values);
        navigate('/confirm-sign-up');
      },
    });
  
    return (
      <>
        <Header />
        <div className="container-fluid signup-container">
          <div className="row">
            <div className="col-md-5 image-container d-none d-md-block">
              <img src="src/assets/img/signup-image.jpg" alt="Imagen lateral" className="img-fluid" />
            </div>
  
            {/* Formulario a la derecha */}
            <div className="col-md-7 d-flex align-items-center justify-content-center form-container">
              <div className="w-75">
                <h2 className="text-center mb-4">Crea tu cuenta</h2>
  
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        className={`form-control ${formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''}`}
                        placeholder="Nombre(s)"
                        {...formik.getFieldProps('nombre')}
                      />
                      {formik.touched.nombre && formik.errors.nombre ? (
                        <div className="invalid-feedback">{formik.errors.nombre}</div>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="apellidos">Apellidos</label>
                      <input
                        type="text"
                        id="apellidos"
                        className={`form-control ${formik.touched.apellidos && formik.errors.apellidos ? 'is-invalid' : ''}`}
                        placeholder="Tus apellidos"
                        {...formik.getFieldProps('apellidos')}
                      />
                      {formik.touched.apellidos && formik.errors.apellidos ? (
                        <div className="invalid-feedback">{formik.errors.apellidos}</div>
                      ) : null}
                    </div>
                  </div>
  
                  <div className="mt-3">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                      type="text"
                      id="username"
                      className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                      placeholder="Nombre de usuario"
                      {...formik.getFieldProps('username')}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className="invalid-feedback">{formik.errors.username}</div>
                    ) : null}
                  </div>
  
                  <div className="mt-3">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                      placeholder="Correo electrónico"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="invalid-feedback">{formik.errors.email}</div>
                    ) : null}
                  </div>
  
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label htmlFor="password">Contraseña</label>
                      <input
                        type="password"
                        id="password"
                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        placeholder="Contraseña"
                        {...formik.getFieldProps('password')}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="invalid-feedback">{formik.errors.password}</div>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="confirmPassword">Confirmar contraseña</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirmar contraseña"
                        {...formik.getFieldProps('confirmPassword')}
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                      ) : null}
                    </div>
                  </div>
                    
                    <button className="btn-azul mt-5" type="submit">
                        Crear cuenta
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default SignUp;
