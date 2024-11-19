import React, { useState } from 'react';
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

interface TaskAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newTask: {
    title: string;
    description: string;
    priority: string;
    difficulty: string;
    assignees: string[];
    comments: number;
    status: string;
    isLocked: boolean;
  }) => Promise<void>;
}

const TaskAddModal: React.FC<TaskAddModalProps> = ({ open, onClose, onSave }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const availableUsers = ['user1.jpg', 'user2.jpg', 'user3.jpg', 'user4.jpg']; // Lista de usuarios disponibles

  const formik = useFormik({
    initialValues: {
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
          title: '¿Guardar nueva tarea?',
          text: 'La nueva tarea se agregará al tablero',
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
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La nueva tarea ha sido agregada exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          onClose();
        }
      } catch (error) {
        console.error('Error al agregar la tarea:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar la tarea'
        });
      }
    }
  });

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
          <Typography variant="h5">Agregar nueva tarea</Typography>
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
                  autoFocus
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
              Guardar tarea
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddModal;