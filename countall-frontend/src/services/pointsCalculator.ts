// Dificultad de tarea puede ser baja, media o alta
export type Difficulty = 'baja' | 'media' | 'alta';
// Estado de la entrega de una tarea puede ser a tiempo o retrasada
export type TimeStatus = 'a_tiempo' | 'retrasada';

export interface Task {
  difficulty: Difficulty;
  time_status: TimeStatus;
  penalties: number; // penalización directa, valor negativo
}

export interface Session {
  session_duration: number; // duración de la sesión en minutos
}

// Función para calcular los puntos de una tarea
export function calculateTaskPoints(task: Task): number {
  let basePoints = 0;

  // Asignación de puntos según la dificultad
  switch (task.difficulty) {
    case 'baja':
      basePoints = 10;
      break;
    case 'media':
      basePoints = 20;
      break;
    case 'alta':
      basePoints = 30;
      break;
  }

  // Bonificación según el tiempo de entrega
  if (task.time_status === 'a_tiempo') {
    basePoints += 5; // Bonus por entregar a tiempo
  } else if (task.time_status === 'retrasada') {
    basePoints -= 5; // Penalización por entregar tarde
  }

  // Aplicar penalizaciones si existen
  basePoints += task.penalties;

  return basePoints;
}

// Función para calcular los puntos de una sesión de trabajo
// Se asignan 5 puntos por cada 30 minutos que dure la sesión
export function calculateSessionPoints(session: Session): number {
  const pointsPer30Min = 5;
  const sessionPoints = (session.session_duration / 30) * pointsPer30Min;

  return sessionPoints;
}

// Función para calcular los puntos totales de una tarea y una sesión
export function calculateTotalPoints(task: Task, session: Session): number {
  const taskPoints = calculateTaskPoints(task);  // Puntos de la tarea
  const sessionPoints = calculateSessionPoints(session);  // Puntos de la sesión

  const totalPoints = taskPoints + sessionPoints;  // Sumar puntos de tarea y sesión
  return totalPoints;
}