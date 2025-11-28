import axios from 'axios';

// URLs base de los microservicios
const AUTH_SERVICE_URL = 'http://localhost:8082';
const USER_SERVICE_URL = 'http://localhost:8081';

// Instancia de axios para el servicio de autenticación
export const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia de axios para el servicio de usuarios
export const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las peticiones del userApi
userApi.interceptors.request.use(
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

// Interceptor para manejar respuestas de error (opcional pero útil)
const handleErrorResponse = (error: any) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    switch (error.response.status) {
      case 401:
        // Token inválido o expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        console.error('No tienes permisos para realizar esta acción');
        break;
      case 404:
        console.error('Recurso no encontrado');
        break;
      case 500:
        console.error('Error interno del servidor');
        break;
      default:
        console.error('Error en la petición:', error.response.data);
    }
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    console.error('No se recibió respuesta del servidor');
  } else {
    // Algo pasó al configurar la petición
    console.error('Error al configurar la petición:', error.message);
  }
  return Promise.reject(error);
};

// Aplicar interceptor de errores a ambas instancias
authApi.interceptors.response.use(
  (response) => response,
  handleErrorResponse
);

userApi.interceptors.response.use(
  (response) => response,
  handleErrorResponse
);

export default { authApi, userApi };
