import React, { useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, Divider } from '@mui/material';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks,
  FaChevronDown,
  FaChevronRight,
  FaVideo,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaExchangeAlt,
  FaUndo
} from 'react-icons/fa';

const iconColor = '#1B70A6';

const sections = {
  'modificar-equipo': {
    icon: <FaUsers size={20} color={iconColor} />,
    title: 'Modificar Equipo',
    videos: {
      'agregar-miembros': {
        title: 'Agregar Miembros',
        icon: <FaPlus size={16} color={iconColor} />,
        description: 'Aprende cómo agregar nuevos miembros al equipo'
      },
      'gestionar-equipo': {
        title: 'Gestionar Equipo',
        icon: <FaEdit size={16} color={iconColor} />,
        description: 'Gestiona los roles y elimina miembros del equipo'
      }
    }
  },
  'proyectos-equipos': {
    icon: <FaProjectDiagram size={20} color={iconColor} />,
    title: 'Proyectos y Equipos',
    videos: {
      'crear-proyecto': {
        title: 'Crear Proyecto',
        icon: <FaPlus size={16} color={iconColor} />,
        description: 'Crea un nuevo proyecto desde cero'
      },
      'crear-equipo': {
        title: 'Crear Equipo',
        icon: <FaPlus size={16} color={iconColor} />,
        description: 'Forma un nuevo equipo de trabajo'
      },
      'seleccionar-equipo': {
        title: 'Seleccionar Equipo',
        icon: <FaUsers size={16} color={iconColor} />,
        description: 'Cómo entrar a un equipo existente'
      }
    }
  },
  'tareas': {
    icon: <FaTasks size={20} color={iconColor} />,
    title: 'Tareas',
    videos: {
      'agregar-tarea': {
        title: 'Agregar Tarea',
        icon: <FaPlus size={16} color={iconColor} />,
        description: 'Crea nuevas tareas en el proyecto'
      },
      'cambiar-estado': {
        title: 'Cambiar Estado',
        icon: <FaExchangeAlt size={16} color={iconColor} />,
        description: 'Actualiza el estado de las tareas'
      },
      'devolver-tarea': {
        title: 'Devolver Tarea',
        icon: <FaUndo size={16} color={iconColor} />,
        description: 'Devuelve una tarea para que se le hagan cambios'
      },
      'editar-tarea': {
        title: 'Editar Tarea',
        icon: <FaEdit size={16} color={iconColor} />,
        description: 'Modifica los detalles de una tarea'
      },
      'eliminar-tarea': {
        title: 'Eliminar Tarea',
        icon: <FaTrash size={16} color={iconColor} />,
        description: 'Elimina tareas del proyecto'
      },
      'ver-tarea': {
        title: 'Ver Tarea',
        icon: <FaEye size={16} color={iconColor} />,
        description: 'Visualiza los detalles de una tarea'
      }
    }
  }
};

const UserManual = () => {
  const [selectedSection, setSelectedSection] = useState('modificar-equipo');
  const [selectedVideo, setSelectedVideo] = useState('agregar-miembros');
  const [expandedSection, setExpandedSection] = useState('modificar-equipo');

  const handleSectionClick = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
    setSelectedSection(section);
    setSelectedVideo(Object.keys(sections[section].videos)[0]);
  };

  const renderVideo = () => {
    const section = sections[selectedSection];
    const video = section.videos[selectedVideo];

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaVideo color={iconColor} />
          {video.title}
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <video
            src={`src/assets/videos/${selectedVideo}.mkv`}
            controls
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Paper>
        <Typography variant="body1" color="text.secondary">
          {video.description}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
      <Paper
        elevation={3}
        sx={{
          width: 280,
          flexShrink: 0,
          borderRadius: 0,
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto'
        }}
      >
        <List component="nav" sx={{ py: 0 }}>
          {Object.entries(sections).map(([sectionKey, section]) => (
            <React.Fragment key={sectionKey}>
              <ListItem
                button
                onClick={() => handleSectionClick(sectionKey)}
                sx={{
                  bgcolor: selectedSection === sectionKey ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText primary={section.title} />
                {expandedSection === sectionKey ? <FaChevronDown color={iconColor} /> : <FaChevronRight color={iconColor} />}
              </ListItem>
              <Collapse in={expandedSection === sectionKey}>
                <List component="div" disablePadding>
                  {Object.entries(section.videos).map(([videoKey, video]) => (
                    <ListItem
                      key={videoKey}
                      button
                      onClick={() => setSelectedVideo(videoKey)}
                      sx={{
                        pl: 4,
                        bgcolor: selectedVideo === videoKey ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {video.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={video.title}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {renderVideo()}
      </Box>
    </Box>
  );
};

export default UserManual;