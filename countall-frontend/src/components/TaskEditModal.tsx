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
  MenuItem as MuiMenuItem,
  CircularProgress
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
  isViewOnly?: boolean; // Nueva propiedad
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ open, task, onClose, onSave, isViewOnly = false }) => {
  const context = useContext(ProjectTeamContext);
  const teamMembers = context?.teamMembers || [];
  const userRole = context?.userRole;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [taskDates, setTaskDates] = useState<{ fecha_inicio_tarea: string, fecha_fin_tarea: string } | null>(null);
  const [comments, setComments] = useState<{ id_comentario: number, contenido_comentario: string, url_avatar: string, username: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<{ nombre_usuario: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Mexico_City',
  }).split('/').reverse().join('-');

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
      setLoading(true); // Inicia el estado de carga
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
      } finally {
        setLoading(false); // Finaliza el estado de carga
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

      // Fetch comments
      const fetchComments = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            return;
          }

          const response = await axios.get(`http://localhost:4444/api/comentario/verComentarios/${task.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setComments(response.data.comentarios_tarea);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
  
      fetchComments();

      // Fetch current user
      const fetchCurrentUser = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            return;
          }
  
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

  const handleAddComment = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (!task) {
        console.error('No task found');
        return;
      }
  
      await axios.post(`http://localhost:4444/api/comentario/escribirComentario/${task.id}`, {
        contenido_comentario: newComment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Fetch comments again to update the list
      const response = await axios.get(`http://localhost:4444/api/comentario/verComentarios/${task.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments(response.data.comentarios_tarea);
      setNewComment('');

      // Show confirmation
      await Swal.fire({
        icon: 'success',
        title: 'Comentario agregado',
        text: 'El comentario ha sido agregado exitosamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el comentario'
      });
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleEditComment = async (id_comentario: number, contenido_comentario: string) => {
    setLoading(true); // Inicia el estado de carga
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (!task) {
        console.error('No task found');
        return;
      }
  
      await axios.put(`http://localhost:4444/api/comentario/modificarComentario/${id_comentario}`, {
        contenido_comentario
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Fetch comments again to update the list
      const response = await axios.get(`http://localhost:4444/api/comentario/verComentarios/${task.id}`);
      setComments(response.data.comentarios_tarea);
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };
  
  const handleDeleteComment = async (id_comentario: number) => {
    setLoading(true); // Inicia el estado de carga
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (!task) {
        console.error('No task found');
        return;
      }
  
      await axios.delete(`http://localhost:4444/api/comentario/borrarComentario/${id_comentario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Fetch comments again to update the list
      const response = await axios.get(`http://localhost:4444/api/comentario/verComentarios/${task.id}`);
      setComments(response.data.comentarios_tarea);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
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
          <IconButton onClick={onClose} disabled={loading}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Box className="task-edit-content">
              {/* Título */}
              <Box className="edit-section" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  {editingField === 'title' && userRole === 'Líder' ? (
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
                      {userRole === 'Líder' && (
                        <IconButton onClick={() => handleEditClick('title')}>
                          <FaPen />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Prioridad */}
              <Box className="edit-section" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  {editingField === 'priority' && userRole === 'Líder' ? (
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
                  ) : (
                    <>
                      <Typography variant="subtitle1">Prioridad:</Typography>
                      <Typography>{formik.values.priority}</Typography>
                      {userRole === 'Líder' && (
                        <IconButton onClick={() => handleEditClick('priority')}>
                          <FaPen />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Dificultad */}
              <Box className="edit-section" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  {editingField === 'difficulty' && userRole === 'Líder' ? (
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
                      {userRole === 'Líder' && (
                        <IconButton onClick={() => handleEditClick('difficulty')}>
                          <FaPen />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Descripción */}
              <Box className="edit-section" mb={3}>
                <Box display="flex" alignItems="start" gap={1}>
                  {editingField === 'description' && userRole === 'Líder' ? (
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
                      {userRole === 'Líder' && (
                        <IconButton onClick={() => handleEditClick('description')}>
                          <FaPen />
                        </IconButton>
                      )}
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
                      min={today}
                      onChange={(e) => {
                        formik.setFieldValue('fecha_inicio_tarea', e.target.value);
                        setEditingField('fecha_inicio_tarea');
                      }}
                      required
                      disabled={userRole !== 'Líder'}
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
                      disabled={userRole !== 'Líder'}
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
                      onDelete={userRole === 'Líder' ? () => handleRemoveAssignee(index) : undefined}
                      deleteIcon={<FaTrash />}
                    />
                  ))}
                  {userRole === 'Líder' && (
                    <IconButton size="small" onClick={handleAddAssigneeClick}>
                      <FaPlus />
                    </IconButton>
                  )}
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
                <Typography variant="subtitle1" mb={2}>Comentarios ({comments.length})</Typography>
                {comments.map((comment, index) => (
                  <Box key={index} className="comment-box">
                    <Box className="comment-header">
                      <Avatar src={comment.url_avatar} />
                      <Typography variant="body1" className="comment-username">{comment.username}</Typography>
                    </Box>
                    <Typography variant="body2" className="comment-content">{comment.contenido_comentario}</Typography>
                    {currentUser && comment.username === currentUser.nombre_usuario && (
                          <Box className="comment-actions">
                            <IconButton onClick={() => {
                              const newComment = prompt('Edita tu comentario', comment.contenido_comentario);
                              if (newComment !== null) {
                                handleEditComment(comment.id_comentario, newComment);
                              }
                            }}>
                              <FaPen />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteComment(comment.id_comentario)}>
                              <FaTrash />
                            </IconButton>
                          </Box>
                    )}
                  </Box>
                ))}
                <Box className="add-comment-section">
                  <TextField
                    fullWidth
                    label="Escribe un comentario"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    multiline
                    rows={2}
                    className="add-comment-textfield"
                  />
                  <Button onClick={handleAddComment} variant="contained" color="primary" startIcon={<FaPlus />}>
                    Añadir comentario
                  </Button>
                </Box>
              </Box>
            </Box>

            {editingField && userRole === 'Líder' && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;