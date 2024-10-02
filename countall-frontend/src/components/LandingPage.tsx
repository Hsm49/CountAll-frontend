import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LandingPage.css';
import Header from './HeaderLg';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="landing-page">
        {/* Sección 1: Introductoria */}
        <section className="section intro">
          <div className="content">
            <img src="src/assets/CA2.png" alt="CountAll Logo" className="logo mx-auto" />
            <h1>Gestión de Proyectos de Software con Gamificación</h1>
            <p>Gestiona tus proyectos de software de manera divertida y eficaz.</p>
            <button className="btn-azul" onClick={() => navigate('/sign-up')}>
              Comenzar
            </button>
          </div>
        </section>

        {/* Sección 2: Beneficios */}
        <section className="section beneficios">
            <h1>¿Por qué CountAll es la mejor opción para tu equipo?</h1>
          <div className="benefits-grid">
            <div className="benefit">
              <img src="src/assets/svg/l_manage.svg" alt="Gestión eficiente" />
              <h3>Gestión eficiente</h3>
              <p>Controla todas las etapas de tus proyectos de software de manera organizada y eficaz.</p>
            </div>
            <div className="benefit">
              <img src="src/assets/svg/l_motivation.svg" alt="Motivación constante" />
              <h3>Motivación constante</h3>
              <p>La gamificación te mantendrá motivado y comprometido con tus objetivos de desarrollo.</p>
            </div>
            <div className="benefit">
              <img src="src/assets/svg/l_collaboration.svg" className="mt-4" alt="Colaboración Simplificada" />
              <h3>Colaboración Simplificada</h3>
              <p>Asigna tareas, administra equipos y sigue el progreso de manera colaborativa.</p>
            </div>
          </div>
        </section>

        {/* Sección 3: Función 1 */}
        <section className="section funcion1">
            <div className="titulo">
              <h2 className="funcion1-title mt-5">Descubre lo que CountAll tiene para ofrecerte</h2>
            </div>
            <div className="content">
              <div className="text">
                <h3>Gestión de proyectos</h3>
                <p>Crea, organiza y realiza un seguimiento de tus proyectos de software de manera intuitiva.</p>
              </div>
              <div className="image">
                <img src="src/assets/img/stats.jpg" alt="Función 1" />
              </div>
            </div>
          </section>

          {/* Sección 4: Función 2 */}
          <section className="section funcion2">
            <div className="content">
              <div className="image">
                <img src="src/assets/img/team.jpg" alt="Función 2" />
              </div>
              <div className="text">
                <h3>Clasificaciones y Puntajes</h3>
                <p>Compite con tus compañeros y obtén reconocimiento por tus logros mediante clasificaciones y puntajes.</p>
              </div>
            </div>
          </section>

          {/* Sección 5: Función 3 */}
          <section className="section funcion3">
            <div className="content">
              <div className="text">
                <h3>Bloqueo de Distracciones</h3>
                <p>Aumenta tu productividad al bloquear sitios web distractivos durante tus sesiones de trabajo.</p>
              </div>
              <div className="image">
                <img src="src/assets/img/focus.jpg" alt="Función 3" />
              </div>
            </div>
          </section>


        {/* Sección 6: Call to Action */}
        <section className="section cta">
          <div className="content">
            <h2 className="mb-5">¡Únete a CountAll hoy mismo y transforma tu forma de trabajar!</h2>
            <button className="btn-naranja mt-5" onClick={() => navigate('/sign-up')}>
              Comenzar ahora
            </button>
          </div>
        </section>

        {/* Footer */}
      </div>
    </>
  );
};

export default LandingPage;
