import { calculateTotalPoints, Task, Session } from '../services/pointsCalculator';

describe('Pruebas de cálculo de puntos', () => {
    it('debe calcular correctamente los puntos para una tarea con dificultad media y sesión de 2 horas', () => {
        const task: Task = {
            difficulty: 'media',
            time_status: 'a_tiempo',
            penalties: 0  // Sin penalizaciones
        };
        
        const session: Session = {
            session_duration: 120  // 2 horas
        };
        
        const result = calculateTotalPoints(task, session);
        expect(result).toBe(45);  // 20 (dificultad media) + 5 (a tiempo) + 20 (2 horas de sesión)
        });      

  it('debe aplicar penalizaciones correctamente', () => {
    const task: Task = {
      difficulty: 'alta',
      time_status: 'retrasada',
      penalties: -10
    };

    const session: Session = {
      session_duration: 60 // 1 hora
    };

    const result = calculateTotalPoints(task, session);
    expect(result).toBe(25); // 30 (alta) - 5 (retrasada) + 10 (1 hora) - 10 (penalización)
  });
});
