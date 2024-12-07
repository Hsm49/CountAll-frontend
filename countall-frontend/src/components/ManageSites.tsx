import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSave,
  FaLock,
  FaLockOpen 
} from 'react-icons/fa';

interface Site {
  nombre_pagina: string;
  descr_pagina: string;
  url_pagina: string;
  blocked?: boolean;
  teamBlocked?: boolean;
}

const ManageSites = () => {
  const [teamSites, setTeamSites] = useState<Site[]>([
    { nombre_pagina: 'YouTube', descr_pagina: 'Sitio de visualización de videos', url_pagina: 'www.youtube.com', blocked: false, teamBlocked: false }
  ]);
  const [personalSites, setPersonalSites] = useState<Site[]>([
    { nombre_pagina: 'Facebook', descr_pagina: 'Red social', url_pagina: 'www.facebook.com', blocked: true, teamBlocked: false }
  ]);
  
  const [newSite, setNewSite] = useState<Site>({
    nombre_pagina: '',
    descr_pagina: '',
    url_pagina: ''
  });
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSite, setEditingSite] = useState<{site: Site, isTeamSite: boolean} | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchBlockedSites();
  }, []);

  // Handlers para las llamadas a la API
  const fetchBlockedSites = async () => {
    try {
      // TODO: Implementar llamada al endpoint
      console.log('Fetching blocked sites...');
    } catch (error) {
      handleError('Error al cargar las páginas bloqueadas');
    }
  };

  const handleBlockSite = async (site: Site, isTeamSite: boolean) => {
    try {
      // TODO: Implementar llamada al endpoint
      console.log(`Blocking site: ${site.url_pagina}`);
      updateSiteState(site, isTeamSite, { blocked: true });
      showSnackbarMessage('Sitio bloqueado exitosamente');
    } catch (error) {
      handleError('Error al bloquear el sitio');
    }
  };

  const handleUnblockSite = async (site: Site, isTeamSite: boolean) => {
    try {
      // TODO: Implementar llamada al endpoint
      console.log(`Unblocking site: ${site.url_pagina}`);
      updateSiteState(site, isTeamSite, { blocked: false });
      showSnackbarMessage('Sitio desbloqueado exitosamente');
    } catch (error) {
      handleError('Error al desbloquear el sitio');
    }
  };

  const handleTeamBlock = async (site: Site, isTeamSite: boolean) => {
    try {
      // TODO: Implementar llamada al endpoint
      console.log(`Team blocking site: ${site.url_pagina}`);
      updateSiteState(site, isTeamSite, { teamBlocked: true });
      showSnackbarMessage('Sitio bloqueado para el equipo');
    } catch (error) {
      handleError('Error al bloquear el sitio para el equipo');
    }
  };

  const handleTeamUnblock = async (site: Site, isTeamSite: boolean) => {
    try {
      // TODO: Implementar llamada al endpoint
      console.log(`Team unblocking site: ${site.url_pagina}`);
      updateSiteState(site, isTeamSite, { teamBlocked: false });
      showSnackbarMessage('Sitio desbloqueado para el equipo');
    } catch (error) {
      handleError('Error al desbloquear el sitio para el equipo');
    }
  };

  // Helpers
  const updateSiteState = (site: Site, isTeamSite: boolean, updates: Partial<Site>) => {
    const siteList = isTeamSite ? teamSites : personalSites;
    const setSiteList = isTeamSite ? setTeamSites : setPersonalSites;
    
    const updatedList = siteList.map(s => 
      s.url_pagina === site.url_pagina ? { ...s, ...updates } : s
    );
    setSiteList(updatedList);
  };

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleError = (errorMessage: string) => {
    setSnackbarMessage(errorMessage);
    setOpenSnackbar(true);
  };

  // Handlers para la UI
  const handleAddSite = (isTeamSite: boolean) => {
    if (newSite.nombre_pagina && newSite.url_pagina) {
      const siteList = isTeamSite ? teamSites : personalSites;
      const setSiteList = isTeamSite ? setTeamSites : setPersonalSites;
      
      if (!siteList.some(site => site.url_pagina === newSite.url_pagina)) {
        setSiteList([...siteList, { ...newSite, blocked: false, teamBlocked: false }]);
        setNewSite({ nombre_pagina: '', descr_pagina: '', url_pagina: '' });
        showSnackbarMessage('Sitio añadido exitosamente');
      } else {
        showSnackbarMessage('Esta URL ya existe en la lista');
      }
    }
  };

  const handleRemoveSite = (site: Site, isTeamSite: boolean) => {
    const siteList = isTeamSite ? teamSites : personalSites;
    const setSiteList = isTeamSite ? setTeamSites : setPersonalSites;
    setSiteList(siteList.filter(s => s.url_pagina !== site.url_pagina));
    showSnackbarMessage('Sitio eliminado exitosamente');
  };

  const handleEditClick = (site: Site, isTeamSite: boolean) => {
    setEditingSite({ site, isTeamSite });
    setOpenDialog(true);
  };

  const handleEditSave = () => {
    if (editingSite) {
      const { site, isTeamSite } = editingSite;
      const siteList = isTeamSite ? teamSites : personalSites;
      const setSiteList = isTeamSite ? setTeamSites : setPersonalSites;
      
      const updatedList = siteList.map(s => 
        s.url_pagina === site.url_pagina ? site : s
      );
      setSiteList(updatedList);
      
      setOpenDialog(false);
      showSnackbarMessage('Sitio actualizado exitosamente');
    }
  };

  const handleSaveChanges = () => {
    // TODO: Implementar guardado global
    showSnackbarMessage('Todos los cambios han sido guardados');
  };

  const SiteList = ({ 
    title, 
    sites, 
    isTeamSite
  }: { 
    title: string;
    sites: Site[];
    isTeamSite: boolean;
  }) => (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField
            size="small"
            value={newSite.nombre_pagina}
            onChange={(e) => setNewSite({...newSite, nombre_pagina: e.target.value})}
            placeholder="Nombre de la página"
            variant="outlined"
          />
          <TextField
            size="small"
            value={newSite.descr_pagina}
            onChange={(e) => setNewSite({...newSite, descr_pagina: e.target.value})}
            placeholder="Descripción"
            variant="outlined"
          />
          <TextField
            size="small"
            value={newSite.url_pagina}
            onChange={(e) => setNewSite({...newSite, url_pagina: e.target.value})}
            placeholder="URL"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={() => handleAddSite(isTeamSite)}
            startIcon={<FaPlus />}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Añadir Sitio
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sites.map(site => (
            <Paper 
              key={site.url_pagina}
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'grey.50',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{site.nombre_pagina}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {site.url_pagina}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {site.descr_pagina}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton
                  size="small"
                  onClick={() => site.blocked ? handleUnblockSite(site, isTeamSite) : handleBlockSite(site, isTeamSite)}
                  sx={{ color: site.blocked ? 'error.main' : 'success.main' }}
                >
                  {site.blocked ? <FaLock /> : <FaLockOpen />}
                </IconButton>
                {isTeamSite && (
                  <IconButton
                    size="small"
                    onClick={() => site.teamBlocked ? handleTeamUnblock(site, isTeamSite) : handleTeamBlock(site, isTeamSite)}
                    sx={{ color: site.teamBlocked ? 'error.main' : 'success.main' }}
                  >
                    {site.teamBlocked ? <FaLock /> : <FaLockOpen />}
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(site, isTeamSite)}
                  sx={{ color: 'primary.main' }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveSite(site, isTeamSite)}
                  sx={{ color: 'error.main' }}
                >
                  <FaTrash />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SiteList 
        title="Sitios bloqueados para el equipo" 
        sites={teamSites}
        isTeamSite={true}
      />
      
      <SiteList 
        title="Sitios bloqueados de forma personal" 
        sites={personalSites}
        isTeamSite={false}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSaveChanges}
        startIcon={<FaSave />}
        sx={{ 
          mt: 2,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' }
        }}
      >
        Guardar Cambios
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Sitio</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre de la página"
              value={editingSite?.site.nombre_pagina || ''}
              onChange={(e) => setEditingSite(prev => 
                prev ? { ...prev, site: { ...prev.site, nombre_pagina: e.target.value }} : null
              )}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={editingSite?.site.descr_pagina || ''}
              onChange={(e) => setEditingSite(prev => 
                prev ? { ...prev, site: { ...prev.site, descr_pagina: e.target.value }} : null
              )}
            />
            <TextField
              fullWidth
              label="URL"
              value={editingSite?.site.url_pagina || ''}
              onChange={(e) => setEditingSite(prev => 
                prev ? { ...prev, site: { ...prev.site, url_pagina: e.target.value }} : null
              )}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editingSite?.site.blocked || false}
                  onChange={(e) => setEditingSite(prev => 
                    prev ? { ...prev, site: { ...prev.site, blocked: e.target.checked }} : null
                  )}
                />
              }
              label="Bloqueado"
            />
            {editingSite?.isTeamSite && (
              <FormControlLabel
                control={
                  <Switch
                    checked={editingSite?.site.teamBlocked || false}
                    onChange={(e) => setEditingSite(prev => 
                      prev ? { ...prev, site: { ...prev.site, teamBlocked: e.target.checked }} : null
                    )}
                  />
                }
                label="Bloqueado para el equipo"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default ManageSites;