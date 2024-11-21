import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/Login.css';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Formato de correo electrónico no válido').required('Campo obligatorio'),
      password: Yup.string().required('Campo obligatorio'),
    }),
    onSubmit: async (values) => {
      const response = await fetch('http://localhost:4444/api/usuario/iniciarSesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_usuario: values.email,
          password_usuario: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token); // Store the token in localStorage
        setIsLoggedIn(true); // Update the context
        navigate('/select-project'); // Redirect to the tracking screen
      } else {
        if (data.errors && data.errors[0].msg === 'El usuario no ha sido confirmado') {
          Swal.fire({
            icon: 'warning',
            title: 'Cuenta no confirmada',
            text: 'Por favor verifica tu correo',
            showCancelButton: true,
            confirmButtonText: 'Reenviar correo',
            cancelButtonText: 'Aceptar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              const resendResponse = await fetch('http://localhost:4444/api/usuario/reenviarCorreoConfirmacion', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_usuario: values.email }),
              });

              const resendData = await resendResponse.json();

              if (resendResponse.ok) {
                Swal.fire({
                  icon: 'success',
                  title: 'Correo reenviado',
                  text: 'El correo de confirmación ha sido reenviado',
                  confirmButtonText: 'Aceptar'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: resendData.errors[0].msg,
                });
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre de usuario o la contraseña son incorrectos.',
          });
        }
        console.error('Login failed:', data);
      }
    },
  });

  return (
    <>
      <div className="main-content">
        <div className="login-container container-fluid">
          <div className="row mt-5">
            <div className="form-signin w-50 mx-auto mt-5">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-header p-4">
                  <h1 className="h3 pt-3 mt-4 mb-3 fw-normal text-center">
                    ¡Bienvenido!
                  </h1>
                </div>
                <div className="form-body p-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control shadow ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                      id="loginEmail"
                      placeholder="Correo electrónico"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="loginEmail">Correo electrónico</label>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="invalid-feedback">{formik.errors.email}</div>
                    ) : null}
                  </div>

                  <div className="form-floating mt-4">
                    <input
                      type="password"
                      className={`form-control shadow ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                      id="loginPassword"
                      placeholder="Contraseña"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="loginPassword">Contraseña</label>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">{formik.errors.password}</div>
                    ) : null}
                  </div>

                  <p className="text-center mt-4 pt-4">
                    <a href="/recover-password">¿Olvidaste tu contraseña?</a>
                  </p>

                  <div className="container-fluid mt-4">
                    <div className="row">
                        <button className="col text-center btn-azul" type="submit">
                          Iniciar sesión
                        </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center text-register mt-4 pt-4">
            ¿No tienes una cuenta? <a href="/sign-up">Regístrate</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;