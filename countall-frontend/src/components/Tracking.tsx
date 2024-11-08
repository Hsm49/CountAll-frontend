// Tracking.tsx
import React, { useState } from 'react';
import { FaTrophy, FaCheck, FaClock, FaGlobe, FaFlag, FaArrowUp } from 'react-icons/fa';
import './css/Tracking.css';
import LeaderboardTable from './LeaderboardTable';

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
                <div className="project-summary">
                <h4>Resumen del Proyecto</h4>
                <select 
                    className="filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="fecha">Por Fecha</option>
                    <option value="estado">Por Estado</option>
                    <option value="urgencia">Por Urgencia</option>
                </select>
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Encargado</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Urgencia</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Tarea 1</td>
                        <td>Miembro A</td>
                        <td>01/10/2024</td>
                        <td>Completada</td>
                        <td><FaFlag className="urgency-icon red" /></td>
                    </tr>
                    <tr>
                        <td>Tarea 2</td>
                        <td>Miembro B</td>
                        <td>02/10/2024</td>
                        <td>En progreso</td>
                        <td><FaFlag className="urgency-icon yellow" /></td>
                    </tr>
                    <tr>
                        <td>Tarea 3</td>
                        <td>Miembro C</td>
                        <td>03/10/2024</td>
                        <td>Por hacer</td>
                        <td><FaFlag className="urgency-icon green" /></td>
                    </tr>
                    </tbody>
                </table>

                {/* Tabla Tareas para Hoy */}
                <h4 className="mt-4">Tareas para Hoy</h4>
                <div className="task-filter">
                    <button onClick={() => setFilter('todas')}>Todas</button>
                    <button onClick={() => setFilter('importantes')}>Importantes</button>
                    <button onClick={() => setFilter('notas')}>Notas</button>
                    <button onClick={() => setFilter('links')}>Links</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Urgencia</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Tarea A</td>
                        <td><FaFlag className="urgency-icon red" /></td>
                    </tr>
                    <tr>
                        <td>Tarea B</td>
                        <td><FaFlag className="urgency-icon yellow" /></td>
                    </tr>
                    <tr>
                        <td>Tarea C</td>
                        <td><FaFlag className="urgency-icon green" /></td>
                    </tr>
                    </tbody>
                </table>
                </div>

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