import { authApi } from '../utils/axiosConfig';

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  rol: string;
  id: number;
  correo: string;
}

export const authService = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>('/auth/login/', credentials);
    
    // Guardar token y datos del usuario en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        correo: response.data.correo,
        rol: response.data.rol
      }));
    }
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obtener el token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.rol === role;
  }
};
