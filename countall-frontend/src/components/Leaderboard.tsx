import React from 'react';
import HeaderLoggedIn from './HeaderLoggedIn';
import { FaTrophy, FaCheck, FaArrowUp } from 'react-icons/fa';
import './css/Leaderboard.css';

const Leaderboard: React.FC = () => {
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h1>Clasificatorias</h1>
        <p className="breadcrumb">Inicio / Clasificatorias</p>
      </div>
        
        <div className="ranking-container">
          {/* User Scores Section */}
          <div className="user-scores">
            <div className="score-card">
              <div className="score-icon">
                <FaTrophy />
              </div>
              <div className="score-content">
                <h3>Puntos totales</h3>
                <p className="score">1250</p>
                <div className="score-trend positive">
                  <FaArrowUp />
                  <small>Aumento del 5% desde el último mes</small>
                </div>
              </div>
            </div>
            
            <div className="score-card">
              <div className="score-icon">
                <FaCheck />
              </div>
              <div className="score-content">
                <h3>Tareas completadas</h3>
                <p className="score">10 / 15</p>
                <div className="completion-bar">
                  <div className="completion-progress" style={{ width: '66.67%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Podium and Table Section */}
          <div className="podium-and-table">
            <div className="podium">
              <div className="podium-member second">
                <div className="avatar">
                  <img src="/api/placeholder/50/50" alt="Second Place" />
                </div>
                <h4>2° Miembro B</h4>
                <p>1400 pts</p>
              </div>
              <div className="podium-member first">
                <div className="avatar">
                  <img src="/api/placeholder/50/50" alt="First Place" />
                </div>
                <h4>1° Miembro A</h4>
                <p>1500 pts</p>
              </div>
              <div className="podium-member third">
                <div className="avatar">
                  <img src="/api/placeholder/50/50" alt="Third Place" />
                </div>
                <h4>3° Miembro C</h4>
                <p>1300 pts</p>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Puntaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="user-photo-circle">
                        <img src="/api/placeholder/40/40" alt="User" />
                      </div>
                    </td>
                    <td>Miembro A</td>
                    <td>Líder</td>
                    <td>1500</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <div className="user-photo-circle">
                        <img src="/api/placeholder/40/40" alt="User" />
                      </div>
                    </td>
                    <td>Miembro B</td>
                    <td>Miembro</td>
                    <td>1400</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <div className="user-photo-circle">
                        <img src="/api/placeholder/40/40" alt="User" />
                      </div>
                    </td>
                    <td>Miembro C</td>
                    <td>Miembro</td>
                    <td>1300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Leaderboard;