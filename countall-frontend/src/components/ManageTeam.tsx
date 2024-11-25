import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProjectTeamContext } from '../context/ProjectTeamContext';
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { AccountCircle, Send, Add, MoreVert } from '@mui/icons-material';
import './css/ManageTeam.css';
import Swal from 'sweetalert2';
import axios from 'axios';

type TeamMember = {
  nombre_usuario: string;
  id_usuario: number;
  email_usuario: string;
  tareas_asignadas: number;
  tareas_completadas: number;
  rol: string;
};

const ManageTeam: React.FC = () => {
  const { selectedTeam } = useContext(ProjectTeamContext)!;
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [emailList, setEmailList] = useState<{ email: string; role: 'Lider' | 'Miembro' | 'Invitado' }[]>([]);
  const [newEmails, setNewEmails] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState('');
  const [roleDialogOpen, setRoleDialogOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('Miembro');

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (selectedTeam) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setTeamMembers(response.data.equipo.integrantes_equipo);
        } catch (error) {
          console.error('Error fetching team details:', error);
        }
      }
    };

    fetchTeamDetails();
  }, [selectedTeam]);

  const validateEmails = (emailString: string) => {
    const emailArray = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emailArray) {
      if (!emailRegex.test(email)) {
        return false;
      }
    }
    return true;
  };

  const handleEmailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailString = event.target.value;
    setNewEmails(emailString);
    if (validateEmails(emailString)) {
      setEmailError('');
    } else {
      setEmailError('Por favor agrega direcciones de correo válidas separadas por comas.');
    }
  };

  const handleAddEmails = () => {
    if (!validateEmails(newEmails)) {
      setEmailError('Por favor agrega direcciones de correo válidas separadas por comas.');
      return;
    }

    const emails = newEmails.split(',').map(email => email.trim()).filter(email => email);
    const newEmailList = emails.map(email => ({ email, role: 'Miembro' as 'Lider' | 'Miembro' | 'Invitado' }));
    setEmailList(newEmailList);
    setDialogOpen(true);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmailList = emailList.filter(({ email }) => email !== emailToRemove);
    setEmailList(updatedEmailList);
    if (updatedEmailList.length === 0) {
      setDialogOpen(false);
    }
  };

  const handleSendInvitations = async () => {
    if (!validateEmails(newEmails)) {
      setEmailError('Por favor agrega direcciones de correo válidas separadas por comas.');
      return;
    }

    const emailArray = newEmails.split(',').map(email => email.trim());

    Swal.fire({
      title: 'Enviando invitaciones',
      text: 'Por favor espera...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (!selectedTeam) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha seleccionado un equipo.',
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom'
        }
      });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      for (const email of emailArray) {
        await axios.put(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}/agregarMiembro`, {
          email_usuario: email,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      Swal.close();
      Swal.fire({
        title: 'Invitaciones enviadas',
        text: 'Las invitaciones se han enviado correctamente.',
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom'
        }
      }).then(() => {
        setDialogOpen(false);
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al enviar las invitaciones.',
        icon: 'error',
        customClass: {
          popup: 'swal2-popup-custom'
        }
      });
    }
  };

  const handleDelete = async () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    if (selectedRows.length === 0 || !selectedTeam) return;

    const result = await Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Estás seguro de que deseas eliminar ${selectedRows.length > 1 ? 'estos usuarios' : 'este usuario'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Eliminando usuarios',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = localStorage.getItem('token');
      for (const row of selectedRows) {
        try {
          await axios.delete(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}/eliminarMiembro`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            data: { nombre_usuario: row.getValue('nombre_usuario') },
          });
          setTeamMembers(prevMembers => prevMembers.filter(member => member.nombre_usuario !== row.getValue('nombre_usuario')));
        } catch (error) {
          console.error('Error deleting team member:', error);
          Swal.fire({
            title: 'Error',
            text: `Error al eliminar el usuario ${row.getValue('nombre_usuario')}.`,
            icon: 'error',
            customClass: {
              popup: 'swal2-popup-custom'
            }
          });
        }
      }
      Swal.fire({
        title: 'Eliminado',
        text: 'Usuario(s) eliminado(s) correctamente.',
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom'
        }
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const handleChangeRole = async () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    if (selectedRows.length === 0 || !selectedTeam) return;

    const result = await Swal.fire({
      title: 'Confirmar cambio de rol',
      text: `¿Estás seguro de que deseas cambiar el rol de ${selectedRows.length > 1 ? 'estos usuarios' : 'este usuario'} a ${selectedRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Cambiando roles',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = localStorage.getItem('token');
      for (const row of selectedRows) {
        try {
          await axios.put(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}/asignarRoles`, {
            nombre_usuario: row.getValue('nombre_usuario'),
            rol: selectedRole,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setTeamMembers(prevMembers => prevMembers.map(member => 
            member.nombre_usuario === row.getValue('nombre_usuario') ? { ...member, rol: selectedRole } : member
          ));
        } catch (error) {
          console.error('Error changing role:', error);
          Swal.fire({
            title: 'Error',
            text: `Error al cambiar el rol del usuario ${row.getValue('nombre_usuario')}.`,
            icon: 'error',
            customClass: {
              popup: 'swal2-popup-custom'
            }
          });
        }
      }
      Swal.close();
      Swal.fire({
        title: 'Rol cambiado',
        text: 'Rol de usuario(s) cambiado correctamente.',
        icon: 'success',
        customClass: {
          popup: 'swal2-popup-custom'
        }
      }).then(() => {
        setRoleDialogOpen(false);
      });
    }
  };

  const columns = useMemo<MRT_ColumnDef<TeamMember>[]>(
    () => [
      {
        accessorKey: 'nombre_usuario',
        header: 'Nombre',
        size: 150,
      },
      {
        accessorKey: 'id_usuario',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'email_usuario',
        header: 'Correo',
        size: 200,
      },
      {
        accessorKey: 'tareas_asignadas',
        header: 'Tareas Asignadas',
        size: 150,
      },
      {
        accessorKey: 'tareas_completadas',
        header: 'Tareas Completadas',
        size: 150,
      },
      {
        accessorKey: 'rol',
        header: 'Rol',
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: teamMembers,
    enableRowSelection: true,
    enableGlobalFilter: true,
    renderTopToolbar: ({ table }) => {
      const isSomeRowsSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: '8px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color="error"
              disabled={!isSomeRowsSelected}
              onClick={handleDelete}
              variant="contained"
            >
              Eliminar
            </Button>
            <Button
              color="warning"
              disabled={!isSomeRowsSelected}
              onClick={() => setRoleDialogOpen(true)}
              variant="contained"
            >
              Cambiar Rol
            </Button>
          </Box>
        </Box>
      );
    },
  });

  return (
    <div className="manage-team-container">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Agregar por correo (válido múltiples correos)"
          value={newEmails}
          onChange={handleEmailsChange}
          error={!!emailError}
          helperText={emailError}
          variant="outlined"
          size="small"
          className="text-field"
          sx={{ mr: 3, width: '400px' }}
        />
        <Button
          variant="contained"
          className="btn-azul"
          startIcon={<Add />}
          onClick={handleAddEmails}
          sx={{ mr: 3, width: '200px' }}
          disabled={!!emailError}
        >
          Invitar miembros
        </Button>
      </Box>
      <div className="table-card">
        <MaterialReactTable table={table} />
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} sx={{ zIndex: 1000 }}>
        <DialogTitle>Invitar miembros</DialogTitle>
        <DialogContent>
          {emailList.map(({ email }) => (
            <Box key={email} className="email-item">
              <Typography sx={{ mr: 3 }}>{email}</Typography>
              <Button
                color="error"
                onClick={() => handleRemoveEmail(email)}
              >
                Eliminar
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'gray' }}>Cancelar</Button>
          <Button onClick={handleSendInvitations} color="primary" variant="contained">
            Enviar invitación
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} sx={{ zIndex: 1000, minHeight: 100 }}>
        <DialogTitle>Selecciona el rol a otorgar:</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as string)}
            >
              <SelectMenuItem value="Líder">Líder</SelectMenuItem>
              <SelectMenuItem value="Miembro">Miembro</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)} sx={{ color: 'gray' }}>Cancelar</Button>
          <Button onClick={handleChangeRole} color="primary" variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageTeam;