import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Box, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Button,
  IconButton
} from '@mui/material';
import { FaTimes, FaSave } from 'react-icons/fa';
import './css/TaskEditModal.css';

// Define or import the Task type
interface Task {
  id: number;
  // Add other properties of Task as needed
}
import axios from 'axios';
import Swal from 'sweetalert2';

interface ReviewTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    reviewModifiers: {
      nox_creatividad: boolean;
      nox_calidad: boolean;
      nox_colaboración: boolean;
      nox_eficiencia: boolean;
      nox_doc_completa: boolean;
      nox_mala_implem: boolean;
      nox_doc_incompleta: boolean;
      nox_baja_calidad: boolean;
      nox_no_comunicacion: boolean;
      nox_no_especificacion: boolean;
    };
    handleReviewChange: (modifier: keyof ReviewTaskModalProps['reviewModifiers']) => void;
    selectedTaskForReview: Task | null;
  }

const ReviewTaskModal: React.FC<ReviewTaskModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  reviewModifiers, 
  handleReviewChange,
  selectedTaskForReview 
}) => {

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
        onClose();
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
          <Typography variant="h5">Revisar Tarea</Typography>
          <IconButton onClick={onClose}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className="task-edit-content">
          <Box className="edit-section" mb={3}>
            <Typography variant="subtitle1" mb={2}>Selecciona los modificadores de puntuación:</Typography>
            <FormGroup>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" gap={4}>
                  {/* Positive Modifiers Column */}
                  <Box flex={1}>
                    <Typography variant="h6" mb={2} color="primary">Modificadores Positivos</Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_creatividad} 
                            onChange={() => handleReviewChange('nox_creatividad')} 
                            color="primary"
                          />
                        }
                        label="Creatividad (+500 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_calidad} 
                            onChange={() => handleReviewChange('nox_calidad')} 
                            color="primary"
                          />
                        }
                        label="Calidad del Trabajo (+700 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_colaboración} 
                            onChange={() => handleReviewChange('nox_colaboración')} 
                            color="primary"
                          />
                        }
                        label="Colaboración (+400 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_eficiencia} 
                            onChange={() => handleReviewChange('nox_eficiencia')} 
                            color="primary"
                          />
                        }
                        label="Eficiencia (+600 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_doc_completa} 
                            onChange={() => handleReviewChange('nox_doc_completa')} 
                            color="primary"
                          />
                        }
                        label="Documentación Completa (+200 puntos)"
                      />
                    </Box>
                  </Box>

                  {/* Negative Modifiers Column */}
                  <Box flex={1}>
                    <Typography variant="h6" mb={2} color="error">Modificadores Negativos</Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_mala_implem} 
                            onChange={() => handleReviewChange('nox_mala_implem')} 
                            color="error"
                          />
                        }
                        label="Mala Implementación (-800 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_doc_incompleta} 
                            onChange={() => handleReviewChange('nox_doc_incompleta')} 
                            color="error"
                          />
                        }
                        label="Falta de Documentación (-500 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_baja_calidad} 
                            onChange={() => handleReviewChange('nox_baja_calidad')} 
                            color="error"
                          />
                        }
                        label="Baja Calidad (-700 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_no_comunicacion} 
                            onChange={() => handleReviewChange('nox_no_comunicacion')} 
                            color="error"
                          />
                        }
                        label="Falta de Comunicación (-300 puntos)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewModifiers.nox_no_especificacion} 
                            onChange={() => handleReviewChange('nox_no_especificacion')} 
                            color="error"
                          />
                        }
                        label="Incumplimiento de Especificaciones (-600 puntos)"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>

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
          onClick={handleReviewSubmit}
          startIcon={<FaSave />}>
          Guardar Revisión
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewTaskModal;