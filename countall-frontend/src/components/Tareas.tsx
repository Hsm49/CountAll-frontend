import React from 'react';
import { FaPlus, FaComment, FaFileAlt } from 'react-icons/fa';
import { Avatar, Button, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import './css/Tareas.css';

const Tarea: React.FC = () => {
  return (
    <Box className="task-board">
      <Box className="header">
        <Typography variant="h4">Tablero de Tareas</Typography>
        <Box className="filters">
          <Button variant="outlined">Filtrar</Button>
          <Button variant="outlined">Hoy</Button>
        </Box>
      </Box>

      <Box className="columns mt-3">
        {/* Columna "Por hacer" */}
        <Box className="column">
          <Box className="column-header to-do">
            <Typography variant="h6">Por hacer</Typography>
            <Typography variant="subtitle1">4</Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-low">Baja</Box>
              <Typography variant="h6">Lluvia de ideas</Typography>
              <Typography variant="body2">Prioridad: Baja</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Avatar alt="Miembro 3" src="/path/to/avatar3.jpg" />
                <Box className="task-info">
                  <FaComment /> 12
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-high">Alta</Box>
              <Typography variant="h6">Investigación</Typography>
              <Typography variant="body2">Prioridad: Alta</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Box className="task-info">
                  <FaComment /> 10
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-high">Alta</Box>
              <Typography variant="h6">Estimaciones</Typography>
              <Typography variant="body2">Prioridad: Alta</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Avatar alt="Miembro 3" src="/path/to/avatar3.jpg" />
                <Box className="task-info">
                  <FaComment /> 9
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Columna "En progreso" */}
        <Box className="column">
          <Box className="column-header in-progress">
            <Typography variant="h6">En progreso</Typography>
            <Typography variant="subtitle1">3</Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-low">Baja</Box>
              <Typography variant="h6">Recolectar imágenes</Typography>
              <Typography variant="body2">Prioridad: Baja</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Avatar alt="Miembro 3" src="/path/to/avatar3.jpg" />
                <Box className="task-info">
                  <FaComment /> 14
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-low">Baja</Box>
              <Typography variant="h6">Página de inicio</Typography>
              <Typography variant="body2">Prioridad: Baja</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Box className="task-info">
                  <FaComment /> 9
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Columna "Completados" */}
        <Box className="column">
          <Box className="column-header completed">
            <Typography variant="h6">Completados</Typography>
            <Typography variant="subtitle1">2</Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-low">Completada</Box>
              <Typography variant="h6">Diseño móvil del sistema</Typography>
              <Typography variant="body2">Completada</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Avatar alt="Miembro 3" src="/path/to/avatar3.jpg" />
                <Box className="task-info">
                  <FaComment /> 12
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card className="task-card">
            <CardContent>
              <Box className="priority-label priority-medium">En revisión</Box>
              <Typography variant="h6">Diseñar el sistema</Typography>
              <Typography variant="body2">Completada</Typography>
              <Box className="avatars">
                <Avatar alt="Miembro 1" src="/path/to/avatar1.jpg" />
                <Avatar alt="Miembro 2" src="/path/to/avatar2.jpg" />
                <Avatar alt="Miembro 3" src="/path/to/avatar3.jpg" />
                <Box className="task-info">
                  <FaComment /> 12
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Tarea;