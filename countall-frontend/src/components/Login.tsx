import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={loginContainerStyle}>
      <h2>Iniciar Sesión</h2>
      <form style={formStyle}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" style={inputStyle} required />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" style={inputStyle} required />
        </div>
        <button type="submit" style={buttonStyle}>Entrar</button>
      </form>
    </div>
  );
};

const loginContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f9',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  margin: '0.5rem 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#282c34',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Login;
