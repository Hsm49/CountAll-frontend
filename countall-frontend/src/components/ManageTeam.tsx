import React, { useState, useMemo } from 'react';
import { ENDPOINTS, API_BASE_URL } from '../config/api.config';
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

type TeamMember = {
  id: string;
  name: string;
  email: string;
  lastActivity: string;
  role: 'Lider' | 'Miembro' | 'Invitado';
};

const ManageTeam: React.FC = () => {
  const [emailList, setEmailList] = useState<{ email: string; role: 'Lider' | 'Miembro' | 'Invitado' }[]>([]);
  const [newEmails, setNewEmails] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    // Mock data
    { id: '1', name: 'John Doe', email: 'john@example.com', lastActivity: '2023-10-01', role: 'Lider' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', lastActivity: '2023-10-02', role: 'Miembro' },
  ]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState('');

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

    try {
      const response = await fetch('/api/equipos/agregarMiembro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: emailArray }),
      });

      if (response.ok) {
        Swal.fire({
            title: 'Success',
            text: 'Invitations sent successfully!',
            icon: 'success',
            customClass: {
                popup: 'swal2-popup-custom'
            }
        });
      } else {
          Swal.fire({
              title: 'Error',
              text: 'Failed to send invitations.',
              icon: 'error',
              customClass: {
                  popup: 'swal2-popup-custom'
              }
          });
      }
  } catch (error) {
      Swal.fire({
          title: 'Error',
          text: 'An error occurred while sending invitations.',
          icon: 'error',
          customClass: {
              popup: 'swal2-popup-custom'
          }
      });
  }
};

  const columns = useMemo<MRT_ColumnDef<TeamMember>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 150,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        size: 200,
      },
      {
        accessorKey: 'lastActivity',
        header: 'Última actividad',
        size: 150,
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        size: 100,
      },
      {
        id: 'actions',
        header: 'Acciones',
        size: 100,
        Cell: ({ row }) => {
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <>
              <IconButton onClick={handleClick}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  Ver perfil
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Send />
                  </ListItemIcon>
                  Enviar correo
                </MenuItem>
              </Menu>
            </>
          );
        },
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
      const handleDelete = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('Eliminando ' + row.getValue('name'));
        });
      };

      const handleChangeRole = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('Cambiando rol de ' + row.getValue('name'));
        });
      };

      const handleEdit = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('Editando ' + row.getValue('name'));
        });
      };

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
              onClick={handleChangeRole}
              variant="contained"
            >
              Cambiar Rol
            </Button>
            <Button
              color="info"
              disabled={!isSomeRowsSelected}
              onClick={handleEdit}
              variant="contained"
            >
              Editar
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
          {emailList.map(({ email}) => (
            <Box key={email} className="email-item">
              <Typography sx={{ mr: 3}}>{email}</Typography>
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
    </div>
  );
};

export default ManageTeam;