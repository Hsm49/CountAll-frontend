// CountAll-frontend/countall-frontend/src/config/api.config.ts

const API_BASE_URL = 'http://localhost:4444/api';

const ENDPOINTS = {
  EQUIPO: {
    VER_EQUIPOS: `${API_BASE_URL}/equipo/misEquipos`,
    VER_EQUIPO: (id_equipo: string) => `${API_BASE_URL}/equipo/misEquipos/${id_equipo}`,
    CREAR_EQUIPO: `${API_BASE_URL}/equipo/crearEquipo`,
    ACEPTAR_INVITACION: (token_UE: string) => `${API_BASE_URL}/equipo/aceptarInvitacion/${token_UE}`,
    ASIGNAR_ROLES: (id_equipo: string) => `${API_BASE_URL}/equipo/misEquipos/${id_equipo}/asignarRoles`,
    AGREGAR_MIEMBRO: (id_equipo: string) => `${API_BASE_URL}/equipo/misEquipos/${id_equipo}/agregarMiembro`,
    ELIMINAR_MIEMBRO: (id_equipo: string) => `${API_BASE_URL}/equipo/misEquipos/${id_equipo}/eliminarMiembro`,
  },
  // Agrega más endpoints según sea necesario
};

export { API_BASE_URL, ENDPOINTS };