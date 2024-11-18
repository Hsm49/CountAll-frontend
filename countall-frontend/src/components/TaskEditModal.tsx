import React, { useState, useEffect } from 'react';
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
import { FaPen, FaTrash, FaSave, FaTimes, FaFlag, FaCheck, FaCircle, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './css/TaskEditModal.css';

interface TaskEditModalProps {
  open: boolean;
  task: {
    id: number;
    title: string;
    description: string;
    priority: string;
    difficulty: string; // Nueva propiedad para la dificultad
    assignees: string[];
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
    difficulty: string; // Nueva propiedad para la dificultad
    assignees: string[];
    comments: number;
    status: string;
    isLocked: boolean;
  }) => Promise<void>;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  difficulty: string; // Nueva propiedad para la dificultad
  assignees: string[];
  comments: number;
  status: string;
  isLocked: boolean;
}

// Configuración base para Swal que asegura que siempre esté por encima del Dialog
const swalConfig = {
  customClass: {
    popup: 'swal-over-dialog',
    container: 'swal-over-dialog-container'
  }
};

const TaskEditModal: React.FC<TaskEditModalProps> = ({ open, task, onClose, onSave }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const availableUsers = ['user1.jpg', 'user2.jpg', 'user3.jpg', 'user4.jpg']; // Lista de usuarios disponibles

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: '',
      description: '',
      priority: 'low',
      difficulty: 'fácil',
      assignees: [],
      comments: 0,
      status: 'todo',
      isLocked: false
    },
    validationSchema: Yup.object({
      title: Yup.string().required('El título es requerido'),
      description: Yup.string().required('La descripción es requerida'),
      priority: Yup.string().required('La prioridad es requerida'),
      difficulty: Yup.string().required('La dificultad es requerida'),
      assignees: Yup.array().min(1, 'Debe asignar al menos un usuario')
    }),
    onSubmit: async (values) => {
      try {
        const result = await Swal.fire({
          ...swalConfig,
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
          await onSave(values);
          await Swal.fire({
            ...swalConfig,
            icon: 'success',
            title: 'Cambios guardados',
            text: 'Los cambios han sido guardados exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          onClose();
        }
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        await Swal.fire({
          ...swalConfig,
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
        priority: task.priority,
        difficulty: task.difficulty,
        assignees: task.assignees,
        comments: task.comments,
        status: task.status,
        isLocked: task.isLocked
      });
    }
  }, [task]);

  const handleAddAssignee = (assigneeToAdd: string) => {
    formik.setFieldValue('assignees', [...formik.values.assignees, assigneeToAdd]);
    setAnchorEl(null);
  };

  const handleAddAssigneeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
                <TextField
                  fullWidth
                  label="Título"
                  {...formik.getFieldProps('title')}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Box>
            </Box>

            {/* Prioridad */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1">Prioridad:</Typography>
                <FormControl size="small" fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                  <Select
                    {...formik.getFieldProps('priority')}
                  >
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="review" disabled={formik.values.status !== 'completed'}>En revisión</MenuItem>
                    <MenuItem value="complete" disabled={formik.values.status !== 'completed'}>Completada</MenuItem>
                  </Select>
                  {formik.touched.priority && formik.errors.priority && (
                    <Typography variant="caption" color="error">{formik.errors.priority}</Typography>
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Dificultad */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1">Dificultad:</Typography>
                <FormControl size="small" fullWidth error={formik.touched.difficulty && Boolean(formik.errors.difficulty)}>
                  <Select
                    {...formik.getFieldProps('difficulty')}
                  >
                    <MenuItem value="fácil">Fácil</MenuItem>
                    <MenuItem value="media">Media</MenuItem>
                    <MenuItem value="difícil">Difícil</MenuItem>
                  </Select>
                  {formik.touched.difficulty && formik.errors.difficulty && (
                    <Typography variant="caption" color="error">{formik.errors.difficulty}</Typography>
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Descripción */}
            <Box className="edit-section" mb={3}>
              <Box display="flex" alignItems="start" gap={1}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción"
                  {...formik.getFieldProps('description')}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Box>
            </Box>

            {/* Asignados */}
            <Box className="edit-section" mb={3}>
              <Typography variant="subtitle1">Asignados:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {formik.values.assignees.map((assignee, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar src={`/path/to/${assignee}`} />}
                    label={`Usuario ${index + 1}`}
                    onDelete={() => formik.setFieldValue('assignees', formik.values.assignees.filter(a => a !== assignee))}
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
                  {availableUsers.map((user, index) => (
                    <MuiMenuItem key={index} onClick={() => handleAddAssignee(user)}>
                      <Avatar src={`/path/to/${user}`} />
                      Usuario {index + 1}
                    </MuiMenuItem>
                  ))}
                </Menu>
              </Box>
              {formik.touched.assignees && formik.errors.assignees && (
                <Typography variant="caption" color="error">{formik.errors.assignees}</Typography>
              )}
            </Box>

            {/* Comentarios */}
            <Box className="comments-section">
              <Typography variant="subtitle1" mb={2}>Comentarios ({formik.values.comments})</Typography>
              {/* Aquí irían los comentarios cuando los implementes */}
            </Box>
          </Box>

          <DialogActions>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onClose}
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;