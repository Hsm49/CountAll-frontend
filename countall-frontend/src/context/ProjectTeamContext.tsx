import React, { createContext, useState, ReactNode, useEffect } from 'react';

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

interface ProjectTeamContextProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
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

  return (
    <ProjectTeamContext.Provider value={{ selectedProject, setSelectedProject, selectedTeam, setSelectedTeam }}>
      {children}
    </ProjectTeamContext.Provider>
  );
};