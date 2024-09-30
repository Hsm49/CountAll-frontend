import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Sección 1: Introductoria */}
      <section className="section intro">
        <div className="content">
          <img src="src/assets/CA2.png" alt="CountAll Logo" className="logo" />
          <h1>Gestión de Proyectos de Software con Gamificación</h1>
          <p>Gestiona tus proyectos de software de manera divertida y eficaz.</p>
          <button className="btn-azul" onClick={() => navigate('/sign-up')}>
            Comenzar
          </button>
        </div>
      </section>

      {/* Sección 2: Beneficios */}
      <section className="section beneficios">
        <h2>¿Por qué CountAll es la mejor opción para tu equipo?</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <img src="src/assets/img/eficiencia.svg" alt="Gestión eficiente" />
            <h3>Gestión eficiente</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="benefit">
            <img src="src/assets/img/motivacion.svg" alt="Motivación constante" />
            <h3>Motivación constante</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="benefit">
            <img src="src/assets/img/colaboracion.svg" alt="Colaboración Simplificada" />
            <h3>Colaboración Simplificada</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </section>

      {/* Sección 3: Función 1 */}
      <section className="section funcion1">
        <h2>Descubre lo que CountAll tiene para ofrecerte</h2>
        <div className="content">
          <div className="text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit nunc eu urna.</p>
          </div>
          <div className="image">
            <img src="src/assets/img/funcion1.svg" alt="Función 1" />
          </div>
        </div>
      </section>

      {/* Sección 4: Función 2 */}
      <section className="section funcion2">
        <div className="content">
          <div className="image">
            <img src="src/assets/img/funcion2.svg" alt="Función 2" />
          </div>
          <div className="text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit nunc eu urna.</p>
          </div>
        </div>
      </section>

      {/* Sección 5: Función 3 */}
      <section className="section funcion3">
        <div className="content">
          <div className="text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit nunc eu urna.</p>
          </div>
          <div className="image">
            <img src="src/assets/img/funcion3.svg" alt="Función 3" />
          </div>
        </div>
      </section>

      {/* Sección 6: Call to Action */}
      <section className="section cta">
        <div className="content">
          <h2>¡Únete a CountAll hoy mismo y Transforma tu Forma de Trabajar!</h2>
          <button className="btn-azul" onClick={() => navigate('/sign-up')}>
            Comenzar ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <img src="src/assets/img/logo.svg" alt="CountAll Logo" className="footer-logo" />
      </footer>
    </div>
  );
};

export default LandingPage;
