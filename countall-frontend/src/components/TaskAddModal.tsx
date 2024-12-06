import React, { useState, useContext } from 'react';
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
import { FaPen, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import './css/TaskEditModal.css';

interface TaskAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newTask: {
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

const TaskAddModal: React.FC<TaskAddModalProps> = ({ open, onClose, onSave }) => {
  const context = useContext(ProjectTeamContext);
  const teamMembers = context?.teamMembers || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const formatDateForBackend = (dateString: string): string => {
    return `${dateString} 00:00:00-06`;
  };

  const formik = useFormik({
    initialValues: {
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
          const formattedValues = {
            ...values,
            fecha_inicio_tarea: formatDateForBackend(values.fecha_inicio_tarea),
            fecha_fin_tarea: formatDateForBackend(values.fecha_fin_tarea)
          };
          await onSave(formattedValues);
          await Swal.fire({
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La nueva tarea ha sido agregada exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          onClose();
          window.location.reload();
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

  const handleAddAssignee = (assigneeToAdd: { nombre_usuario: string, url_avatar: string }) => {
    formik.setFieldValue('assignees', [...formik.values.assignees, assigneeToAdd]);
    setAnchorEl(null);
  };

  const handleRemoveAssignee = (index: number) => {
    const updatedAssignees = formik.values.assignees.filter((_, i) => i !== index);
    formik.setFieldValue('assignees', updatedAssignees);
  };

  const handleAddAssigneeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
                  <InputLabel>Prioridad</InputLabel>
                  <Select
                    {...formik.getFieldProps('priority')}
                    label="Prioridad"
                  >
                    <MenuItem value="Baja">Baja</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                    <MenuItem value="Alta">Alta</MenuItem>
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

            {/* Fechas */}
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
                  }}
                  required
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