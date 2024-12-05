import React, { useState, useEffect, useContext } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem as MuiMenuItem
} from '@mui/material';
import { FaPen, FaTimes, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/TaskEditModal.css';

interface TaskEditModalProps {
  open: boolean;
  task: {
    id: number;
    title: string;
    description: string;
    priority: string;
    difficulty: string;
    assignees: { nombre_usuario: string, url_avatar: string }[];
    comments: number;
    status: string;
    isLocked: boolean;
  } | null;
  onClose: () => void;
  onSave: (updatedTask: {
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
  }) => Promise<void>;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ open, task, onClose, onSave }) => {
  const context = useContext(ProjectTeamContext);
  const teamMembers = context?.teamMembers || [];
  const [editingField, setEditingField] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [taskDates, setTaskDates] = useState<{ fecha_inicio_tarea: string, fecha_fin_tarea: string } | null>(null);

  const formatDateForBackend = (dateString: string): string => {
    return `${dateString} 00:00:00-06`;
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: '',
      description: '',
      priority: 'Baja',
      difficulty: 'Fácil',
      assignees: [] as { nombre_usuario: string, url_avatar: string }[],
      comments: 0,
      status: 'todo',
      isLocked: false,
      fecha_inicio_tarea: '',
      fecha_fin_tarea: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('El título es requerido'),
      description: Yup.string().required('La descripción es requerida'),
      priority: Yup.string().required('La prioridad es requerida'),
      difficulty: Yup.string().required('La dificultad es requerida'),
      assignees: Yup.array().min(1, 'Debe asignar al menos un usuario'),
      fecha_inicio_tarea: Yup.date().required('La fecha de inicio es requerida').nullable(),
      fecha_fin_tarea: Yup.date().required('La fecha de fin es requerida').nullable().min(
        Yup.ref('fecha_inicio_tarea'),
        'La fecha de fin debe ser posterior a la fecha de inicio'
      )
    }),
    onSubmit: async (values) => {
      try {
        const result = await Swal.fire({
          title: '¿Guardar cambios?',
          text: 'Los cambios realizados se guardarán permanentemente',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          const formattedValues = {
            ...values,
            fecha_inicio_tarea: formatDateForBackend(values.fecha_inicio_tarea),
            fecha_fin_tarea: formatDateForBackend(values.fecha_fin_tarea)
          };
          await onSave(formattedValues);
          await Swal.fire({
            icon: 'success',
            title: 'Cambios guardados',
            text: 'Los cambios han sido guardados exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          onClose();
          window.location.reload(); // Recargar la página después de guardar exitosamente
        }
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron guardar los cambios'
        });
      }
    }
  });

  useEffect(() => {
    if (task) {
      formik.setValues({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
        difficulty: task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1),
        assignees: task.assignees,
        comments: task.comments,
        status: task.status,
        isLocked: task.isLocked,
        fecha_inicio_tarea: '',
        fecha_fin_tarea: ''
      });

      // Fetch task dates
      const fetchTaskDates = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
  
        try {
          const response = await axios.get(`http://localhost:4444/api/tarea/verTarea/${task.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          // Procesar la fecha de inicio
          const startDate = new Date(response.data.tarea.fecha_inicio_tarea);
          const formattedStartDate = startDate.toISOString().split('T')[0];
  
          // Procesar la fecha de fin
          const endDate = new Date(response.data.tarea.fecha_fin_tarea);
          const formattedEndDate = endDate.toISOString().split('T')[0];
  
          setTaskDates({
            fecha_inicio_tarea: formattedStartDate,
            fecha_fin_tarea: formattedEndDate
          });
  
          formik.setFieldValue('fecha_inicio_tarea', formattedStartDate);
          formik.setFieldValue('fecha_fin_tarea', formattedEndDate);
        } catch (error) {
          console.error('Error fetching task dates:', error);
        }
      };
  
      fetchTaskDates();
    }
  }, [task]);

  const handleAddAssignee = (assigneeToAdd: { nombre_usuario: string, url_avatar: string }) => {
    formik.setFieldValue('assignees', [...formik.values.assignees, assigneeToAdd]);
    setAnchorEl(null);
    setEditingField('assignees');
  };

  const handleRemoveAssignee = (index: number) => {
    const updatedAssignees = formik.values.assignees.filter((_, i) => i !== index);
    formik.setFieldValue('assignees', updatedAssignees);
    setEditingField('assignees');
  };

  const handleAddAssigneeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  // Filtrar miembros del equipo que ya están asignados
  const availableTeamMembers = teamMembers.filter(member => {
    return !formik.values.assignees.some(assignee => assignee.nombre_usuario === member.nombre_usuario);
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '16px'
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          zIndex: 1000
        },
        zIndex: 1000
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Detalles de la tarea</Typography>
          <IconButton onClick={onClose}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box className="task-edit-content">
            {/* Título */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                {editingField === 'title' ? (
                  <TextField
                    fullWidth
                    label="Título"
                    {...formik.getFieldProps('title')}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                ) : (
                  <>
                    <Typography variant="subtitle1">Título:</Typography>
                    <Typography>{formik.values.title}</Typography>
                    <IconButton onClick={() => handleEditClick('title')}>
                      <FaPen />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Prioridad */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                {editingField === 'priority' ? (
                  <FormControl size="small" fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      {...formik.getFieldProps('priority')}
                      label="Prioridad"
                    >
                      <MenuItem value="Baja">Baja</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Alta">Alta</MenuItem>
                      <MenuItem value="Revisión" disabled={formik.values.status !== 'completed'}>En revisión</MenuItem>
                      <MenuItem value="Completada" disabled={formik.values.status !== 'completed'}>Completada</MenuItem>
                    </Select>
                    {formik.touched.priority && formik.errors.priority && (
                      <Typography variant="caption" color="error">{formik.errors.priority}</Typography>
                    )}
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle1">Prioridad:</Typography>
                    <Typography>{formik.values.priority}</Typography>
                    <IconButton onClick={() => handleEditClick('priority')}>
                      <FaPen />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Dificultad */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                {editingField === 'difficulty' ? (
                  <FormControl size="small" fullWidth error={formik.touched.difficulty && Boolean(formik.errors.difficulty)}>
                    <InputLabel>Dificultad</InputLabel>
                    <Select
                      {...formik.getFieldProps('difficulty')}
                      label="Dificultad"
                    >
                      <MenuItem value="Fácil">Fácil</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Difícil">Difícil</MenuItem>
                    </Select>
                    {formik.touched.difficulty && formik.errors.difficulty && (
                      <Typography variant="caption" color="error">{formik.errors.difficulty}</Typography>
                    )}
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle1">Dificultad:</Typography>
                    <Typography>{formik.values.difficulty}</Typography>
                    <IconButton onClick={() => handleEditClick('difficulty')}>
                      <FaPen />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Descripción */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="start" gap={1}>
                {editingField === 'description' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descripción"
                    {...formik.getFieldProps('description')}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                ) : (
                  <>
                    <Typography variant="subtitle1">Descripción:</Typography>
                    <Typography>{formik.values.description}</Typography>
                    <IconButton onClick={() => handleEditClick('description')}>
                      <FaPen />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Fechas */}
            {taskDates && (
              <Box className="edit-section" mb={3}>
                <Typography variant="subtitle1">Fecha de inicio:</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    type="date"
                    className="date-input"
                    placeholder="Fecha de Inicio"
                    value={formik.values.fecha_inicio_tarea}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      formik.setFieldValue('fecha_inicio_tarea', e.target.value);
                      setEditingField('fecha_inicio_tarea');
                    }}
                    required
                  />
                </Box>
                <Typography variant="subtitle1">Fecha de fin:</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    type="date"
                    className="date-input"
                    placeholder="Fecha de Fin"
                    value={formik.values.fecha_fin_tarea}
                    min={formik.values.fecha_inicio_tarea || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      formik.setFieldValue('fecha_fin_tarea', e.target.value);
                      setEditingField('fecha_fin_tarea');
                    }}
                    required
                  />
                </Box>
              </Box>
            )}

            {/* Asignados */}
            <Box className="edit-section" mb={3}>
              <Typography variant="subtitle1">Asignados:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {formik.values.assignees.map((assignee, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar src={assignee.url_avatar} />}
                    label={assignee.nombre_usuario}
                    onDelete={() => handleRemoveAssignee(index)}
                    deleteIcon={<FaTrash />}
                  />
                ))}
                <IconButton size="small" onClick={handleAddAssigneeClick}>
                  <FaPlus />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  {availableTeamMembers.length > 0 ? (
                    availableTeamMembers.map((member: { id_usuario: number, nombre_usuario: string, url_avatar: string }) => (
                      <MuiMenuItem key={member.id_usuario} onClick={() => handleAddAssignee(member)}>
                        <Avatar src={member.url_avatar} />
                        {member.nombre_usuario}
                      </MuiMenuItem>
                    ))
                  ) : (
                    <MuiMenuItem disabled>No hay miembros del equipo</MuiMenuItem>
                  )}
                </Menu>
              </Box>
              {formik.touched.assignees && formik.errors.assignees && (
                <Typography variant="caption" color="error">{typeof formik.errors.assignees === 'string' ? formik.errors.assignees : ''}</Typography>
              )}
            </Box>

            {/* Comentarios */}
            <Box className="comments-section">
              <Typography variant="subtitle1" mb={2}>Comentarios ({formik.values.comments})</Typography>
              {/* Aquí irían los comentarios cuando los implementes */}
            </Box>
          </Box>

          {editingField && (
            <DialogActions>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleCancelEdit}
                startIcon={<FaTimes />}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                startIcon={<FaSave />}
              >
                Guardar cambios
              </Button>
            </DialogActions>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;