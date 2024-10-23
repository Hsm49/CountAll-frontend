import React from 'react';
import './css/Leaderboard.css';

const Leaderboard: React.FC = () => {
  return (
    <>
        <div className="ranking-container">
            {/* Sección de puntajes del usuario */}
            <div className="user-scores">
                <div className="score-card">
                <h3>Puntos totales</h3>
                <p>1250</p>
                <small>Aumento del 5% desde el último mes</small>
                </div>
                <div className="score-card">
                <h3>Tareas completadas</h3>
                <p>10 / 15</p>
                </div>
            </div>

            {/* Sección del podio */}
            <div className="podium-and-table">
                <div className="podium">
                <div className="podium-member first">
                    <h4>1° Miembro A</h4>
                    <p>Puntaje: 1500</p>
                </div>
                <div className="podium-member second">
                    <h4>2° Miembro B</h4>
                    <p>Puntaje: 1400</p>
                </div>
                <div className="podium-member third">
                    <h4>3° Miembro C</h4>
                    <p>Puntaje: 1300</p>
                </div>
                </div>

                {/* Tabla de clasificatorias */}
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
                        <td><div className="user-photo-circle"></div></td>
                        <td>Miembro A</td>
                        <td>Líder</td>
                        <td>1500</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><div className="user-photo-circle"></div></td>
                        <td>Miembro B</td>
                        <td>Miembro</td>
                        <td>1400</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><div className="user-photo-circle"></div></td>
                        <td>Miembro C</td>
                        <td>Miembro</td>
                        <td>1300</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </>
  );
};

export default Leaderboard;
