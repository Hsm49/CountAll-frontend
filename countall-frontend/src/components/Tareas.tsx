import React, { useState } from 'react';
import { FaPlus, FaComment, FaEllipsisH, FaCheck, FaEdit } from 'react-icons/fa';
import { Avatar, Button, Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import './css/Tareas.css';

const Tarea: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Lluvia de ideas',
      description: 'Prioridad: Baja',
      priority: 'low',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'todo'
    },
    {
      id: 2,
      title: 'Investigación',
      description: 'Prioridad: Alta',
      priority: 'high',
      assignees: ['avatar1.jpg', 'avatar2.jpg'],
      comments: 10,
      status: 'todo'
    },
    {
      id: 3,
      title: 'Estimaciones',
      description: 'Prioridad: Alta',
      priority: 'high',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 9,
      status: 'todo'
    },
    {
      id: 4,
      title: 'Recolectar imágenes',
      description: 'Prioridad: Baja',
      priority: 'low',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 14,
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Página de inicio',
      description: 'Prioridad: Baja',
      priority: 'low',
      assignees: ['avatar1.jpg'],
      comments: 9,
      status: 'in-progress'
    },
    {
      id: 6,
      title: 'Diseño móvil del sistema',
      description: 'Completada',
      priority: 'complete',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'completed'
    },
    {
      id: 7,
      title: 'Diseñar el sistema',
      description: 'Completada',
      priority: 'review',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'completed'
    }
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const statusOptions = [
    { value: 'todo', label: 'Por hacer' },
    { value: 'in-progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' }
  ];

  const handleEditTask = (taskId: number) => {
    // Implement the edit task functionality here
    console.log(`Edit task with id: ${taskId}`);
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(taskId);
  };

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setStatusAnchorEl(null);
    setSelectedTask(null);
  };

  const handleTaskStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
      const success = true;

      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );

        await Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: 'La tarea ha sido actualizada exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado de la tarea'
      });
    } finally {
      handleClose();
    }
  };

  const handleStateChange = async (taskId: number, newStatus: string) => {
    const currentTask = tasks.find(task => task.id === taskId);
    if (!currentTask) return;

    let confirmationResult;

    if (newStatus === 'completed') {
      confirmationResult = await Swal.fire({
        title: '¿Marcar como completada?',
        text: 'Se enviará un correo al líder para su revisión',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      });
    } else {
      confirmationResult = await Swal.fire({
        title: '¿Cambiar estado?',
        text: `¿Deseas cambiar esta tarea a "${statusOptions.find(opt => opt.value === newStatus)?.label}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      });
    }

    if (confirmationResult.isConfirmed) {
      await handleTaskStatusUpdate(taskId, newStatus);
    }
  };

  const renderTasksList = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <Card key={task.id} className="task-card">
          <CardContent>
            <Box className={`priority-label priority-${task.priority}`}>
              {task.priority === 'low' ? 'Baja' : task.priority === 'high' ? 'Alta' : task.priority === 'review' ? 'En revisión' : 'Completada'}
            </Box>
            <Box className="options-menu">
              <IconButton onClick={(e) => handleOptionClick(e, task.id)}>
                <FaEllipsisH />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedTask === task.id}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleEditTask(task.id)}>
                  <ListItemIcon>
                    <FaEdit />
                  </ListItemIcon>
                  <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleStatusMenuOpen}>
                  <ListItemIcon>
                    <FaCheck />
                  </ListItemIcon>
                  <ListItemText>Cambiar estado</ListItemText>
                </MenuItem>
              </Menu>
              <Menu
                anchorEl={statusAnchorEl}
                open={Boolean(statusAnchorEl)}
                onClose={handleClose}
              >
                {statusOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleStateChange(selectedTask!, option.value)}
                    disabled={tasks.find(task => task.id === selectedTask)?.status === option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Box className="avatars">
              {task.assignees.map((avatar, index) => (
                <Avatar key={index} alt={`Miembro ${index + 1}`} src={`/path/to/${avatar}`} />
              ))}
              <Box className="task-info">
                <FaComment /> {task.comments}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ));
  };

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
        <Box className="column">
          <Box className="column-header to-do">
            <Typography variant="h6">Por hacer</Typography>
            <Typography variant="subtitle1">
              {tasks.filter(task => task.status === 'todo').length}
            </Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          {renderTasksList('todo')}
        </Box>

        <Box className="column">
          <Box className="column-header in-progress">
            <Typography variant="h6">En progreso</Typography>
            <Typography variant="subtitle1">
              {tasks.filter(task => task.status === 'in-progress').length}
            </Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          {renderTasksList('in-progress')}
        </Box>

        <Box className="column">
          <Box className="column-header completed">
            <Typography variant="h6">Completados</Typography>
            <Typography variant="subtitle1">
              {tasks.filter(task => task.status === 'completed').length}
            </Typography>
            <IconButton>
              <FaPlus />
            </IconButton>
          </Box>
          {renderTasksList('completed')}
        </Box>
      </Box>
    </Box>
  );
};

export default Tarea;