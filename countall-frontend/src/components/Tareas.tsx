import React, { useState } from 'react';
import { FaPlus, FaComment, FaEllipsisH, FaCheck, FaEdit } from 'react-icons/fa';
import { Avatar, Button, Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import './css/Tareas.css';
import TaskEditModal from './TaskEditModal';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  assignees: string[];
  comments: number;
  status: string;
}

const Tarea: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Lluvia de ideas',
      description: 'Hacer lluvia de ideas',
      priority: 'low',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'todo'
    },
    {
      id: 2,
      title: 'Investigación',
      description: 'Investigar sobre el proyecto',
      priority: 'medium',
      assignees: ['avatar1.jpg', 'avatar2.jpg'],
      comments: 10,
      status: 'todo'
    },
    {
      id: 3,
      title: 'Estimaciones',
      description: 'Realizar estimaciones',
      priority: 'high',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 9,
      status: 'todo'
    },
    {
      id: 4,
      title: 'Recolectar imágenes',
      description: 'Descargar imágenes de stock',
      priority: 'low',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 14,
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Página de inicio',
      description: 'Programar la página de inicio',
      priority: 'low',
      assignees: ['avatar1.jpg'],
      comments: 9,
      status: 'in-progress'
    },
    {
      id: 6,
      title: 'Diseño móvil del sistema',
      description: 'Diseñar la versión móvil del sistema',
      priority: 'complete',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'completed'
    },
    {
      id: 7,
      title: 'Diseñar el sistema',
      description: 'Diseñar el sistema em react',
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
    const taskToEdit = tasks.find(task => task.id === taskId);
    setSelectedTaskForEdit(taskToEdit || null);
    setEditModalOpen(true);
    handleClose(); // Cierra el menú de opciones
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      // Aquí irá la llamada al backend
      // const response = await updateTask(updatedTask);
      
      // Actualiza el estado local
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      throw error; // El modal manejará el error
    }
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
          showConfirmButton: false,
          customClass: {
              popup: 'swal2-popup-custom'
          }
        });
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado de la tarea',
        customClass: {
            popup: 'swal2-popup-custom'
        }
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
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup-custom'
        }
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
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup-custom'
        }
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
              <Box className="priority-label-container">
                <Box className={`priority-label priority-${task.priority}`}>
                  {task.priority === 'low' ? 'Baja' : task.priority === 'medium' ? 'Media' : task.priority === 'high' ? 'Alta' : task.priority === 'review' ? 'En revisión' : task.priority === 'complete' ? 'Completada' : ''}
                </Box>
                <Box className="options-menu">
                  <IconButton onClick={(e) => handleOptionClick(e, task.id)}>
                    <FaEllipsisH />
                  </IconButton>
              </Box>
              <Menu sx={{ zIndex: 0 }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedTask === task.id}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleEditTask(task.id)}>
                  <ListItemIcon>
                    <FaEdit />
                  </ListItemIcon>
                  <ListItemText>Ver y editar tarea</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleStatusMenuOpen}>
                  <ListItemIcon>
                    <FaCheck />
                  </ListItemIcon>
                  <ListItemText>Cambiar estado</ListItemText>
                </MenuItem>
              </Menu>
              <Menu sx={{ zIndex: 0 }}
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
          <TaskEditModal
            open={editModalOpen}
            task={selectedTaskForEdit}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedTaskForEdit(null);
            }}
            onSave={handleTaskUpdate}
          />
        </Card>
      ));
  };

  return (
    <Box className="task-board">
      <Box className="filters">
        <Button variant="outlined">Filtrar</Button>
        <Button variant="outlined">Hoy</Button>
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