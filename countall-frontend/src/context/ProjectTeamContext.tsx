import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Project {
  id_proyecto: number;
  nombre_proyecto: string;
  descr_proyecto: string;
}

interface Team {
  id_equipo: number;
  nombre_equipo: string;
  descr_equipo: string;
}

interface TeamMember {
  id_usuario: number;
  nombre_usuario: string;
  rol_usuario: string;
  url_avatar: string;
}

interface ProjectTeamContextProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  teamMembers: TeamMember[] | null;
  setTeamMembers: (members: TeamMember[] | null) => void;
}

export const ProjectTeamContext = createContext<ProjectTeamContextProps | undefined>(undefined);

export const ProjectTeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    const savedProject = localStorage.getItem('selectedProject');
    return savedProject ? JSON.parse(savedProject) : null;
  });

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(() => {
    const savedTeam = localStorage.getItem('selectedTeam');
    return savedTeam ? JSON.parse(savedTeam) : null;
  });

  const [userRole, setUserRole] = useState<string | null>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole ? savedRole : null;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(() => {
    const savedMembers = localStorage.getItem('teamMembers');
    return savedMembers ? JSON.parse(savedMembers) : null;
  });

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    } else {
      localStorage.removeItem('selectedProject');
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('selectedTeam', JSON.stringify(selectedTeam));
    } else {
      localStorage.removeItem('selectedTeam');
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  useEffect(() => {
    if (teamMembers) {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    } else {
      localStorage.removeItem('teamMembers');
    }
  }, [teamMembers]);

  useEffect(() => {
    const fetchUserRoleAndMembers = async () => {
      if (selectedTeam) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:4444/api/equipo/misEquipos/${selectedTeam.id_equipo}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUserRole(response.data.rol_sesion);
          setTeamMembers(response.data.integrantes);
        } catch (error) {
          console.error('Error fetching user role and team members:', error);
        }
      }
    };

    fetchUserRoleAndMembers();
  }, [selectedTeam]);

  return (
    <ProjectTeamContext.Provider value={{ selectedProject, setSelectedProject, selectedTeam, setSelectedTeam, userRole, setUserRole, teamMembers, setTeamMembers }}>
      {children}
    </ProjectTeamContext.Provider>
  );
};