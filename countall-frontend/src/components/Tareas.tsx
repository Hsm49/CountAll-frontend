import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaComment, FaEllipsisH, FaCheck, FaEdit, FaFlag, FaCircle, FaTrash } from 'react-icons/fa';
import { Avatar, Button, Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import './css/Tareas.css';
import TaskEditModal from './TaskEditModal';
import TaskAddModal from './TaskAddModal';
import ReviewTaskModal from './ReviewTaskModal';
import axios from 'axios';
import { ProjectTeamContext } from '../context/ProjectTeamContext';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  difficulty: string;
  assignees: { nombre_usuario: string, url_avatar: string }[];
  comments: number;
  status: string;
  isLocked: boolean;
  fecha_inicio_tarea: string;
  fecha_fin_tarea: string;
}

const Tarea: React.FC = () => {
  const projectTeamContext = useContext(ProjectTeamContext);
  const selectedTeam = projectTeamContext?.selectedTeam;
  const userRole = projectTeamContext?.userRole;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<'all' | 'assigned'>('all');
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<null | HTMLElement>(null);
  const [priorityFilter, setPriorityFilter] = useState<'baja' | 'media' | 'alta' | 'all'>('all');
  const [currentUser, setCurrentUser] = useState<{ nombre_usuario: string } | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [reviewModifiers, setReviewModifiers] = useState({
    nox_creatividad: false,
    nox_calidad: false,
    nox_colaboración: false,
    nox_eficiencia: false,
    nox_doc_completa: false,
    nox_mala_implem: false,
    nox_doc_incompleta: false,
    nox_baja_calidad: false,
    nox_no_comunicacion: false,
    nox_no_especificacion: false
  });

  const handleReviewChange = (modifier: keyof typeof reviewModifiers) => {
    setReviewModifiers(prevState => ({
      ...prevState,
      [modifier]: !prevState[modifier]
    }));
  };

  const statusOptions = [
    { value: 'por-hacer', label: 'Por hacer' },
    { value: 'en-progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' }
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedTeam) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4444/api/tarea/verTareas/${selectedTeam.id_equipo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const fetchedTasks = response.data.tareas_equipo.map((taskData: any) => ({
          id: taskData.datos_tarea.tarea.id_tarea,
          title: taskData.datos_tarea.tarea.nombre_tarea,
          description: taskData.datos_tarea.tarea.descr_tarea,
          priority: taskData.datos_tarea.tarea.prioridad_tarea.toLowerCase(),
          difficulty: taskData.datos_tarea.tarea.dificultad_tarea.toLowerCase(),
          assignees: taskData.asignados,
          comments: taskData.datos_tarea.tarea.comentarios_tarea,
          status: taskData.datos_tarea.tarea.estado_tarea.toLowerCase().replace(' ', '-'),
          isLocked: taskData.datos_tarea.tarea.is_locked
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [selectedTeam]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:4444/api/usuario/actual', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterChange = (filterOption: 'all' | 'assigned') => {
    setFilter(filterOption);
    handleFilterMenuClose();
  };

  const handlePriorityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPriorityAnchorEl(event.currentTarget);
  };
  
  const handlePriorityMenuClose = () => {
    setPriorityAnchorEl(null);
  };
  
  const handlePriorityChange = (priority: 'baja' | 'media' | 'alta' | 'all') => {
    setPriorityFilter(priority);
    handlePriorityMenuClose();
  };

  const handleEditTask = (taskId: number) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setSelectedTaskForEdit(taskToEdit || null);
    setEditModalOpen(true);
    handleClose(); // Cierra el menú de opciones
  };

  const handleReviewTask = (taskId: number) => {
    const taskToReview = tasks.find(task => task.id === taskId);
    setSelectedTaskForReview(taskToReview || null);
    setReviewModalOpen(true);
    handleClose(); // Cierra el menú de opciones
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const response = await axios.put(`http://localhost:4444/api/tarea/editarTarea/${updatedTask.id}`, {
        nombre_tarea: updatedTask.title,
        descr_tarea: updatedTask.description,
        prioridad_tarea: updatedTask.priority,
        dificultad_tarea: updatedTask.difficulty,
        fecha_inicio_tarea: updatedTask.fecha_inicio_tarea,
        fecha_fin_tarea: updatedTask.fecha_fin_tarea,
        nombre_equipo: selectedTeam?.nombre_equipo,
        asignados_tarea: updatedTask.assignees.map(assignee => assignee.nombre_usuario)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        // Actualiza el estado local
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      } else {
        console.error('Error updating task:', response.data);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error; // El modal manejará el error
    }
  };

  const handleTaskAdd = async (newTask: Omit<Task, 'id' | 'isLocked'> & { isLocked?: boolean }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const response = await axios.post(`http://localhost:4444/api/tarea/asignarTarea/${selectedTeam?.id_equipo}`, {
        nombre_tarea: newTask.title,
        descr_tarea: newTask.description,
        prioridad_tarea: newTask.priority,
        dificultad_tarea: newTask.difficulty,
        fecha_inicio_tarea: newTask.fecha_inicio_tarea,
        fecha_fin_tarea: newTask.fecha_fin_tarea,
        amonestacion: false,
        asignados_tarea: newTask.assignees.map(assignee => assignee.nombre_usuario)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200 && response.data && response.data.tarea && response.data.tarea.id_tarea) {
        const addedTask = response.data.tarea;
        const newTaskWithId = {
          ...newTask,
          id: addedTask.id_tarea,
          isLocked: newTask.isLocked ?? false
        };
        setTasks(prevTasks => [...prevTasks, newTaskWithId]);
      } else {
        console.error('Error adding task: Invalid response structure', response.data);
      }
    } catch (error) {
      console.error('Error adding task:', error);
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
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.delete(`http://localhost:4444/api/tarea/eliminarTarea/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Actualiza el estado local
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

          await Swal.fire({
            icon: 'success',
            title: 'Tarea eliminada',
            text: 'La tarea ha sido eliminada exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          console.error('Error deleting task:', response.data);
        }
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
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      // Ensure the status is exactly what the backend expects
      const statusMap: { [key: string]: string } = {
        'por-hacer': 'Por hacer',
        'en-progreso': 'En progreso',
        'completado': 'Completado'
      };
  
      const backendStatus = statusMap[newStatus];
  
      if (!backendStatus) {
        console.error('Invalid status:', newStatus);
        return;
      }
  
      const response = await axios.put(`http://localhost:4444/api/tarea/cambiarEstado/${taskId}`, 
        {
          estado_tarea: backendStatus
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus, isLocked: newStatus === 'completado' } : task
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
      } else {
        console.error('Error updating task status:', response.data);
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }
  
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
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.put(`http://localhost:4444/api/tarea/desbloquearTarea/${taskId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
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
      } else {
        console.error('Error unlocking task:', response.data);
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

  const handleReviewSubmit = async () => {
    if (!selectedTaskForReview) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.put(`http://localhost:4444/api/tarea/revisarTarea/${selectedTaskForReview.id}`, reviewModifiers, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Revisión exitosa',
          text: 'La tarea ha sido revisada exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
        setReviewModalOpen(false);
        setSelectedTaskForReview(null);
      } else {
        console.error('Error reviewing task:', response.data);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo revisar la tarea'
        });
      }
    } catch (error) {
      console.error('Error reviewing task:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo revisar la tarea'
      });
    }
  };

  const getFilteredTasksCount = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .filter(task => filter === 'all' || task.assignees.some(assignee => assignee.nombre_usuario === currentUser?.nombre_usuario))
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
      .length;
  };

  const renderTasksList = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .filter(task => filter === 'all' || task.assignees.some(assignee => assignee.nombre_usuario === currentUser?.nombre_usuario))
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
      .map(task => (
        <Card key={task.id} className="task-card">
          <CardContent>
            <Box className="priority-label-container">
              <Box className="priority-label">
                {task.priority === 'baja' && <FaFlag className="urgency-icon green" />}
                {task.priority === 'media' && <FaFlag className="urgency-icon yellow" />}
                {task.priority === 'alta' && <FaFlag className="urgency-icon red" />}
                {task.priority === 'completada' && <FaCheck className="urgency-icon green" />}
                {task.priority === 'revisión' && <FaCircle className="urgency-icon yellow" />}
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
                  <ListItemText>Ver tarea</ListItemText>
                </MenuItem>
                {task.status !== 'completado' && (
                  <MenuItem
                    onClick={handleStatusMenuOpen}
                    disabled={task.isLocked || !task.assignees.some(assignee => assignee.nombre_usuario === currentUser?.nombre_usuario) && userRole !== 'Líder'}
                  >
                    <ListItemIcon>
                      <FaCheck />
                    </ListItemIcon>
                    <ListItemText>Cambiar estado</ListItemText>
                  </MenuItem>
                )}
                {userRole === 'Líder' && task.isLocked && (
                  <MenuItem onClick={() => handleUnlockTask(task.id)}>
                    <ListItemIcon>
                      <FaCheck />
                    </ListItemIcon>
                    <ListItemText>Devolver tarea</ListItemText>
                  </MenuItem>
                )}
                {userRole === 'Líder' && task.status === 'completado' && (
                  <MenuItem onClick={() => handleReviewTask(task.id)}>
                    <ListItemIcon>
                      <FaCheck />
                    </ListItemIcon>
                    <ListItemText>Revisar tarea</ListItemText>
                  </MenuItem>
                )}
                {userRole === 'Líder' && (
                  <MenuItem onClick={() => handleTaskDelete(task.id)}>
                    <ListItemIcon>
                      <FaTrash />
                    </ListItemIcon>
                    <ListItemText>Eliminar tarea</ListItemText>
                  </MenuItem>
                )}
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
              {task.assignees.slice(0, 2).map((assignee, index) => (
                <Avatar key={index} alt={assignee.nombre_usuario} src={assignee.url_avatar} />
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
            isViewOnly={userRole !== 'Líder' && selectedTaskForEdit?.status === 'completado'}
          />
          <ReviewTaskModal
            open={reviewModalOpen}
            onClose={() => {
              setReviewModalOpen(false);
              setSelectedTaskForReview(null);
            }}
            onSubmit={handleReviewSubmit}
            reviewModifiers={reviewModifiers}
            handleReviewChange={handleReviewChange}
            selectedTaskForReview={selectedTaskForReview}
          />
        </Card>
      ));
  };

  return (
    <Box className="task-board">
      <Box className="filters">
        <Button variant="outlined" onClick={handleFilterMenuOpen}>Filtrar</Button>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={() => handleFilterChange('all')}>Todas las tareas</MenuItem>
          <MenuItem onClick={() => handleFilterChange('assigned')}>Mis tareas</MenuItem>
        </Menu>
        <Button variant="outlined" onClick={handlePriorityMenuOpen}>Prioridad</Button>
        <Menu
          anchorEl={priorityAnchorEl}
          open={Boolean(priorityAnchorEl)}
          onClose={handlePriorityMenuClose}
        >
          <MenuItem onClick={() => handlePriorityChange('all')}>Todas</MenuItem>
          <MenuItem onClick={() => handlePriorityChange('baja')}>Baja</MenuItem>
          <MenuItem onClick={() => handlePriorityChange('media')}>Media</MenuItem>
          <MenuItem onClick={() => handlePriorityChange('alta')}>Alta</MenuItem>
        </Menu>
      </Box>

      <Box className="columns mt-3">
        <Box className="column">
          <Box className="column-header to-do">
            <Typography variant="h6">Por hacer</Typography>
            <Typography variant="subtitle1">
              {getFilteredTasksCount('por-hacer')}
            </Typography>
            {userRole === 'Líder' && (
              <IconButton onClick={() => setAddModalOpen(true)}>
                <FaPlus />
              </IconButton>
            )}
          </Box>
          {renderTasksList('por-hacer')}
        </Box>

        <Box className="column">
          <Box className="column-header in-progress">
            <Typography variant="h6">En progreso</Typography>
            <Typography variant="subtitle1">
              {getFilteredTasksCount('en-progreso')}
            </Typography>
          </Box>
          {renderTasksList('en-progreso')}
        </Box>

        <Box className="column">
          <Box className="column-header completed">
            <Typography variant="h6">Completados</Typography>
            <Typography variant="subtitle1">
              {getFilteredTasksCount('completado')}
            </Typography>
          </Box>
          {renderTasksList('completado')}
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
