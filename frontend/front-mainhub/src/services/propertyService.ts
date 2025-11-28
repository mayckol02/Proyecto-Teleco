import axios from 'axios';

// Crear instancia específica para el servicio de propiedades
const PROPERTY_SERVICE_URL = 'http://localhost:8084';

export const propertyApi = axios.create({
  baseURL: PROPERTY_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT
propertyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de errores
propertyApi.interceptors.response.use(
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

export interface Conjunto {
  id?: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  administradorId: number;
}

export const propertyService = {
  // Crear un nuevo conjunto
  createConjunto: async (conjunto: Conjunto): Promise<Conjunto> => {
    const response = await propertyApi.post<Conjunto>('/conjuntos/', conjunto);
    return response.data;
  },

  // Obtener todos los conjuntos
  getAllConjuntos: async (): Promise<Conjunto[]> => {
    const response = await propertyApi.get<Conjunto[]>('/conjuntos/');
    return response.data;
  },

  // Obtener un conjunto por ID
  getConjuntoById: async (id: number): Promise<Conjunto> => {
    const response = await propertyApi.get<Conjunto>(`/conjuntos/${id}`);
    return response.data;
  },

  // Actualizar un conjunto
  updateConjunto: async (conjunto: Conjunto): Promise<Conjunto> => {
    const response = await propertyApi.put<Conjunto>('/conjuntos/', conjunto);
    return response.data;
  },

  // Eliminar un conjunto
  deleteConjunto: async (id: number): Promise<void> => {
    await propertyApi.delete(`/conjuntos/${id}`);
  }
};
