// Tracking.tsx
import React, { useState } from 'react';
import { FaTrophy, FaCheck, FaClock, FaGlobe } from 'react-icons/fa';
import './css/Tracking.css';
import LeaderboardTable from './LeaderboardTable';
import TaskTable from './TaskTable';

const Tracking: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('semana');
  const [filter, setFilter] = useState('todas');

  return (
    <>    
        <div className="tracking-container">
            {/* Recuadros de información */}
            <div>
                <div className="info-cards">
                    <div className="score-card">
                        <div className="score-icon">
                            <FaTrophy />
                        </div>
                        <div className="score-content">
                            <h3>Puntos Totales</h3>
                            <p className="score">1250</p>
                        </div>
                    </div>
                    <div className="score-card">
                        <div className="score-icon">
                            <FaCheck />
                        </div>
                        <div className="score-content">
                            <h3>Tareas Completadas</h3>
                            <p className="score">10 / 15</p>
                            <div className="completion-bar">
                                <div className="completion-progress" style={{ width: '66.67%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablas */}
            <div className="tables-container">
                {/* Tabla Resumen del Proyecto */}
                <TaskTable />

                {/* Tabla de Clasificatorias (del lado derecho) */}
                <div className="leaderboard">
                <h4>Clasificatorias</h4>
                <LeaderboardTable />
                </div>
            </div>
        </div>
    </>
  );
};

export default Tracking;