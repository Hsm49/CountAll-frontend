import React from 'react';
import './css/Login.css';
import Header from './HeaderLg';

const Login: React.FC = () => {
  return (
    <>
    <div className="main-content">
      <div className="login-container container-fluid">
        <div className="row mt-5">
          <div className="form-signin w-50 mx-auto mt-5">
            <form>
              <div className="form-header p-4">
                <h1 className="h3 pt-3 mt-4 mb-3 fw-normal text-center">
                  ¡Bienvenido!
                </h1>
              </div>
              <div className="form-body p-3">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control shadow"
                    id="loginEmail"
                    placeholder="Correo electrónico"
                    name="loginEmail"
                  />
                  <label htmlFor="loginEmail">Correo electrónico</label>
                </div>

                <div className="form-floating mt-4">
                  <input
                    type="password"
                    className="form-control shadow"
                    id="loginPassword"
                    placeholder="Contraseña"
                    name="loginPassword"
                  />
                  <label htmlFor="loginPassword">Contraseña</label>
                </div>

                <p className="text-center mt-4 pt-4">
                  <a href="/recover-password">¿Olvidaste tu contraseña?</a>
                </p>

                <div className="container-fluid mt-4">
                  <div className="row">
                    <div className="col text-center btn-azul">
                      <input
                        className="w-50 btn "
                        type="submit"
                        value="Iniciar sesión"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="text-center text-register mt-4 pt-4 ">
              ¿No tienes una cuenta? <a href="/sign-up">Regístrate</a>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;
