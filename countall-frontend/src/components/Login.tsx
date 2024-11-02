import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('http://localhost:4444/api/usuario/iniciarSesion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_usuario: email,
        password_usuario: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); // Store the token in localStorage
      setIsLoggedIn(true); // Update the context
      navigate('/tracking'); // Redirect to the tracking screen
    } else {
      console.error('Login failed:', data);
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="login-container container-fluid">
          <div className="row mt-5">
            <div className="form-signin w-50 mx-auto mt-5">
              <form onSubmit={handleSubmit}>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                          className="w-50 btn"
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
          <div className="text-center text-register mt-4 pt-4">
            ¿No tienes una cuenta? <a href="/sign-up">Regístrate</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;