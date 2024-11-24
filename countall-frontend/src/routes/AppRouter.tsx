import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import HeaderLg from '../components/HeaderLg';
import SignUp from '../components/SignUp';
import ConfirmSignUp from '../components/ConfirmSignUp';
import AccountVerified from '../components/AccountVerified';
import RecoverPassword from '../components/RecoverPassword';
import RecoverSent from '../components/RecoverSent';
import NewPassword from '../components/NewPassword';
import PasswordSaved from '../components/PasswordSaved';
import LandingPage from '../components/LandingPage';
import Leaderboard from '../components/Leaderboard';
import Tracking from '../components/Tracking';
import PrivateRoute from '../components/PrivateRoute';
import Estadisticas from '../components/Statistics'
import ManageSites from '../components/ManageSites';
import Notifications from '../components/Notifications';
import ManageTeam from '../components/ManageTeam';
import Avatar from '../components/Avatar';
import Tarea from '../components/Tareas';
import Profile from '../components/Profile';
import MyProjects from '../components/MyProjects';
import MyTeams from '../components/MyTeams';
import Estimaciones from '../components/Estimaciones';
import MisEstimaciones from '../components/MisEstimaciones';
import ProjectDetails from '../components/ProjectDetails';
import TeamDetails from '../components/TeamDetails';
import SelectProject from '../components/SelectProject';
import SelectTeam from '../components/SelectTeam';
import SetProjectDetails from '../components/SetProjectDetails';
import SelectTeamUser from '../components/SelectTeamUser';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/header" element={<HeaderLg />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/confirm-sign-up" element={<ConfirmSignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/password-saved" element={<PasswordSaved />} />
      <Route path="/account-verified" element={<AccountVerified />} />
      <Route path="/recover-sent" element={<RecoverSent />} />
      <Route path="/" element={<LandingPage />} />

      {/* Project and Team Selection */}
      <Route
        path="/select-project"
        element={
          <PrivateRoute>
            <SelectProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/select-team/:nombre_proyecto"
        element={
          <PrivateRoute>
            <SelectTeam />
          </PrivateRoute>
        }
      />

      <Route
        path="/select-team-user"
        element={
          <PrivateRoute>
            <SelectTeamUser />
          </PrivateRoute>
        }
      />

      <Route
        path="/set-project-details/:projectId"
        element={
          <PrivateRoute>
            <SetProjectDetails />
          </PrivateRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/tracking"
        element={
          <PrivateRoute>
            <Tracking />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        }
      />
      
      <Route path="/estadisticas" element={
        <PrivateRoute>
          <Estadisticas />
        </PrivateRoute>
        } 
        />

      <Route
        path="/configurar-sitios"
        element={
          <PrivateRoute>
            <ManageSites />
          </PrivateRoute>
        }
      />

      <Route
        path="/notificaciones"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />

      <Route
        path="/gestionar-equipo"
        element={
          <PrivateRoute>
            <ManageTeam />
          </PrivateRoute>
        }
      />

      <Route
        path="/avatar"
        element={
          <PrivateRoute>
            <Avatar />
          </PrivateRoute>
        }
      />

      <Route
        path="/tareas"
        element={
          <PrivateRoute>
            <Tarea />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-projects"
        element={
          <PrivateRoute>
            <MyProjects />
          </PrivateRoute>
        }
      />

    <Route
        path="/my-teams"
        element={
          <PrivateRoute>
            <MyTeams />
          </PrivateRoute>
        }
      />

      <Route
        path="/estimaciones"
        element={
          <PrivateRoute>
            <Estimaciones />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/mis-estimaciones"
        element={
          <PrivateRoute>
            <MisEstimaciones />
          </PrivateRoute>
        }
      />

      <Route
        path="/proyecto/:nombre_proyecto"
        element={
          <PrivateRoute>
            <ProjectDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/equipo/:id_equipo"
        element={
          <PrivateRoute>
            <TeamDetails />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;