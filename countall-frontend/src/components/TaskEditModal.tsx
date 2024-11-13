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
  InputLabel
} from '@mui/material';
import { FaEdit, FaPen, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface TaskEditModalProps {
  open: boolean;
  task: {
    id: number;
    title: string;
    description: string;
    priority: string;
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
  const [editMode, setEditMode] = useState({
    title: false,
    description: false,
    priority: false,
    assignees: false
  });

  const [editedTask, setEditedTask] = useState<Task | null>(null);

  React.useEffect(() => {
    setEditedTask(task);
    setEditMode({
      title: false,
      description: false,
      priority: false,
      assignees: false
    });
  }, [task]);

  if (!editedTask) return null;

  const handleFieldEdit = (field: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleFieldSave = (field: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
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

      if (result.isConfirmed && editedTask) {
        await onSave(editedTask);
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
  };

  const handleCancel = async () => {
    const hasChanges = JSON.stringify(task) !== JSON.stringify(editedTask);
    
    if (hasChanges) {
      const result = await Swal.fire({
        ...swalConfig,
        title: '¿Descartar cambios?',
        text: 'Los cambios realizados se perderán',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Descartar',
        cancelButtonText: 'Continuar editando'
      });

      if (result.isConfirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleRemoveAssignee = (assigneeToRemove: string) => {
    setEditedTask(prev => prev ? {
      ...prev,
      assignees: prev.assignees.filter(assignee => assignee !== assigneeToRemove)
    } : null);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
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
          <IconButton onClick={handleCancel}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className="task-edit-content">
          {/* Título */}
          <Box className="edit-section" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              {editMode.title ? (
                <TextField
                  fullWidth
                  value={editedTask.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  autoFocus
                  onBlur={() => handleFieldSave('title')}
                />
              ) : (
                <>
                  <Typography variant="h6">{editedTask.title}</Typography>
                  <IconButton size="small" onClick={() => handleFieldEdit('title')}>
                    <FaPen />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Prioridad */}
          <Box className="edit-section" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1">Prioridad:</Typography>
              {editMode.priority ? (
                <FormControl size="small">
                  <Select
                    value={editedTask.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    onBlur={() => handleFieldSave('priority')}
                    autoFocus
                  >
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <>
                  <Box className={`priority-label priority-${editedTask.priority}`}>
                    {editedTask.priority === 'low' ? 'Baja' : 
                     editedTask.priority === 'medium' ? 'Media' : 'Alta'}
                  </Box>
                  <IconButton size="small" onClick={() => handleFieldEdit('priority')}>
                    <FaPen />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Descripción */}
          <Box className="edit-section" mb={3}>
            <Typography variant="subtitle1">Descripción:</Typography>
            <Box display="flex" alignItems="start" gap={1}>
              {editMode.description ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editedTask.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  autoFocus
                  onBlur={() => handleFieldSave('description')}
                />
              ) : (
                <>
                  <Typography>{editedTask.description}</Typography>
                  <IconButton size="small" onClick={() => handleFieldEdit('description')}>
                    <FaPen />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Asignados */}
          <Box className="edit-section" mb={3}>
            <Typography variant="subtitle1">Asignados:</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {editedTask.assignees.map((assignee, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar src={`/path/to/${assignee}`} />}
                  label={`Usuario ${index + 1}`}
                  onDelete={() => handleRemoveAssignee(assignee)}
                />
              ))}
              <IconButton size="small" onClick={() => handleFieldEdit('assignees')}>
                <FaEdit />
              </IconButton>
            </Box>
          </Box>

          {/* Comentarios */}
          <Box className="comments-section">
            <Typography variant="subtitle1" mb={2}>Comentarios ({editedTask.comments})</Typography>
            {/* Aquí irían los comentarios cuando los implementes */}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleCancel}
          startIcon={<FaTimes />}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          startIcon={<FaSave />}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditModal;