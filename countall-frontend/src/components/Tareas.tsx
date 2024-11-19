import React, { useState } from 'react';
import { FaPlus, FaComment, FaEllipsisH, FaCheck, FaEdit, FaFlag, FaCircle, FaTrash } from 'react-icons/fa';
import { Avatar, Button, Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import './css/Tareas.css';
import TaskEditModal from './TaskEditModal';
import TaskAddModal from './TaskAddModal';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  difficulty: string; // Nueva propiedad para la dificultad
  assignees: string[];
  comments: number;
  status: string;
  isLocked: boolean; // Nueva propiedad para indicar si la tarea está bloqueada
}

const Tarea: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Lluvia de ideas',
      description: 'Hacer lluvia de ideas',
      priority: 'low',
      difficulty: 'fácil',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg'],
      comments: 12,
      status: 'todo',
      isLocked: false
    },
    {
      id: 2,
      title: 'Investigación',
      description: 'Investigar sobre el proyecto',
      priority: 'medium',
      difficulty: 'media',
      assignees: ['avatar1.jpg', 'avatar2.jpg'],
      comments: 10,
      status: 'todo',
      isLocked: false
    },
    {
      id: 3,
      title: 'Estimaciones',
      description: 'Realizar estimaciones',
      priority: 'high',
      difficulty: 'difícil',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 9,
      status: 'todo',
      isLocked: false
    },
    {
      id: 4,
      title: 'Recolectar imágenes',
      description: 'Descargar imágenes de stock',
      priority: 'low',
      difficulty: 'fácil',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 14,
      status: 'in-progress',
      isLocked: false
    },
    {
      id: 5,
      title: 'Página de inicio',
      description: 'Programar la página de inicio',
      priority: 'low',
      difficulty: 'media',
      assignees: ['avatar1.jpg'],
      comments: 9,
      status: 'in-progress',
      isLocked: false
    },
    {
      id: 6,
      title: 'Diseño móvil del sistema',
      description: 'Diseñar la versión móvil del sistema',
      priority: 'complete',
      difficulty: 'difícil',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'completed',
      isLocked: true // Simulamos que esta tarea está bloqueada
    },
    {
      id: 7,
      title: 'Diseñar el sistema',
      description: 'Diseñar el sistema em react',
      priority: 'review',
      difficulty: 'media',
      assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'],
      comments: 12,
      status: 'completed',
      isLocked: true
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

  const handleTaskAdd = async (newTask: Omit<Task, 'id' | 'isLocked'> & { isLocked?: boolean }) => {
    try {
      // Aquí irá la llamada al backend
      // const response = await addTask(newTask);
      
      // Simula la adición de una nueva tarea con un ID único
      const newTaskWithId = { ...newTask, id: tasks.length + 1, isLocked: newTask.isLocked ?? false };
      setTasks(prevTasks => [...prevTasks, newTaskWithId]);
    } catch (error) {
      throw error; // El modal manejará el error
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar tarea?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Aquí irá la llamada al backend
        // const response = await deleteTask(taskId);
        
        // Actualiza el estado local
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        await Swal.fire({
          icon: 'success',
          title: 'Tarea eliminada',
          text: 'La tarea ha sido eliminada exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la tarea'
      });
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
            task.id === taskId ? { ...task, status: newStatus, isLocked: newStatus === 'completed' } : task
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

    if (currentTask.isLocked && newStatus !== 'completed') {
      await Swal.fire({
        title: 'Tarea bloqueada',
        text: 'No puedes cambiar el estado de esta tarea hasta que el líder la desbloquee.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'swal2-popup-custom'
        }
      });
      return;
    }

    let confirmationResult;

    if (newStatus === 'completed') {
      confirmationResult = await Swal.fire({
        title: '¿Marcar como completada?',
        text: 'Se enviará un correo al líder para su revisión y no podrás cambiar su estado hasta que la revise.',
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

  const handleUnlockTask = async (taskId: number) => {
    try {
      // Simula la llamada al backend para desbloquear la tarea
      const success = true;

      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, isLocked: false } : task
          )
        );

        await Swal.fire({
          icon: 'success',
          title: 'Tarea desbloqueada',
          text: 'La tarea ha sido desbloqueada para cambiar su estado',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
              popup: 'swal2-popup-custom'
          }
        });
      }
    } catch (error) {
      console.error('Error al desbloquear la tarea:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo desbloquear la tarea',
        customClass: {
            popup: 'swal2-popup-custom'
        }
      });
    }
  };

  const renderTasksList = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <Card key={task.id} className="task-card">
          <CardContent>
              <Box className="priority-label-container">
                <Box className="priority-label">
                  {task.priority === 'low' && <FaFlag className="urgency-icon green" />}
                  {task.priority === 'medium' && <FaFlag className="urgency-icon yellow" />}
                  {task.priority === 'high' && <FaFlag className="urgency-icon red" />}
                  {task.priority === 'complete' && <FaCheck className="urgency-icon green" />}
                  {task.priority === 'review' && <FaCircle className="urgency-icon yellow" />}
                </Box>
                <Box className={`difficulty-label difficulty-${task.difficulty}`}>
                  {task.difficulty === 'fácil' ? 'Fácil' : task.difficulty === 'media' ? 'Media' : 'Difícil'}
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
                <MenuItem onClick={handleStatusMenuOpen} disabled={task.isLocked}>
                  <ListItemIcon>
                    <FaCheck />
                  </ListItemIcon>
                  <ListItemText>Cambiar estado</ListItemText>
                </MenuItem>
                { /* Botón que solo debe mostrarse para el líder */}
                {task.isLocked && (
                  <MenuItem onClick={() => handleUnlockTask(task.id)}>
                    <ListItemIcon>
                      <FaCheck />
                    </ListItemIcon>
                    <ListItemText>Desbloquear tarea</ListItemText>
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleTaskDelete(task.id)}>
                  <ListItemIcon>
                    <FaTrash />
                  </ListItemIcon>
                  <ListItemText>Eliminar tarea</ListItemText>
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
              {task.assignees.slice(0, 2).map((avatar, index) => (
                <Avatar key={index} alt={`Miembro ${index + 1}`} src={`/path/to/${avatar}`} />
              ))}
              {task.assignees.length > 2 && (
                <Avatar className="more-avatars">...</Avatar>
              )}
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
            <IconButton onClick={() => setAddModalOpen(true)}>
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
            <IconButton onClick={() => setAddModalOpen(true)}>
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
            <IconButton onClick={() => setAddModalOpen(true)}>
              <FaPlus />
            </IconButton>
          </Box>
          {renderTasksList('completed')}
        </Box>
      </Box>
      <TaskAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleTaskAdd}
      />
    </Box>
  );
};

export default Tarea;