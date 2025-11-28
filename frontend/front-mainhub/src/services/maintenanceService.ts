import axios from 'axios';

const MAINTENANCE_SERVICE_URL = 'http://localhost:8083';

export const maintenanceApi = axios.create({
  baseURL: MAINTENANCE_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT y headers de usuario
maintenanceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userStr) {
      const user = JSON.parse(userStr);
      config.headers['X-User-Id'] = user.id.toString();
      config.headers['X-User-Role'] = user.rol;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de errores
maintenanceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export type MaintenanceType = 'PREVENTIVO' | 'CORRECTIVO';
export type MaintenanceStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO';

export interface StatusHistoryItem {
  fromStatus: MaintenanceStatus | null;
  toStatus: MaintenanceStatus;
  changedAt: string;
  changedBy: string;
}

export interface MaintenanceRequest {
  id?: number;
  title: string;
  description: string;
  propertyId: string;
  type: MaintenanceType;
  photoUrl?: string;
  status?: MaintenanceStatus;
  assignedTechnicianId?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  history?: StatusHistoryItem[];
}

export interface CreateMaintenanceDTO {
  title: string;
  description: string;
  propertyId: string;
  type: MaintenanceType;
  photoUrl?: string;
}

export interface AssignTechnicianDTO {
  technicianId: string;
}

export interface UpdateStatusDTO {
  status: MaintenanceStatus;
}

export const maintenanceService = {
  // Crear solicitud de mantenimiento (solo RESIDENTE)
  createRequest: async (dto: CreateMaintenanceDTO): Promise<MaintenanceRequest> => {
    const response = await maintenanceApi.post<MaintenanceRequest>('/api/requests', dto);
    return response.data;
  },

  // Obtener todas las solicitudes
  getAllRequests: async (): Promise<MaintenanceRequest[]> => {
    const response = await maintenanceApi.get<MaintenanceRequest[]>('/api/requests');
    return response.data;
  },

  // Obtener una solicitud por ID
  getRequestById: async (id: number): Promise<MaintenanceRequest> => {
    const response = await maintenanceApi.get<MaintenanceRequest>(`/api/requests/${id}`);
    return response.data;
  },

  // Asignar técnico (solo ADMIN)
  assignTechnician: async (id: number, technicianId: string): Promise<MaintenanceRequest> => {
    const response = await maintenanceApi.put<MaintenanceRequest>(
      `/api/requests/${id}/assign`,
      { technicianId }
    );
    return response.data;
  },

  // Actualizar estado (ADMIN o TECNICO)
  updateStatus: async (id: number, status: MaintenanceStatus): Promise<MaintenanceRequest> => {
    const response = await maintenanceApi.put<MaintenanceRequest>(
      `/api/requests/${id}/status`,
      { status }
    );
    return response.data;
  }
};
