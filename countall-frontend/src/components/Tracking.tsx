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
                {/* Selector para el periodo de tiempo */}
                <select 
                    className="time-frame-select mb-3"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    >
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                    <option value="dia">Día</option>
                </select>

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
                        </div>
                    </div>
                    <div className="score-card">
                        <div className="score-icon">
                            <FaClock />
                        </div>
                        <div className="score-content">
                            <h3>Tiempo Trabajado</h3>
                            <p className="score">5 horas</p>
                        </div>
                    </div>
                    <div className="score-card">
                        <div className="score-icon">
                            <FaGlobe />
                        </div>
                        <div className="score-content">
                            <h3>Tiempo en la Web</h3>
                            <p className="score">3 horas</p>
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