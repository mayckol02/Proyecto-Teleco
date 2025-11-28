import { userApi } from '../utils/axiosConfig';

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  clave?: string;
  rol: string;
  propiedadId?: number | null;
}

export const userService = {
  // Crear un nuevo usuario
  createUser: async (usuario: Usuario): Promise<Usuario> => {
    const response = await userApi.post<Usuario>('/usuario/', usuario);
    return response.data;
  },

  // Obtener todos los usuarios
  getAllUsers: async (): Promise<Usuario[]> => {
    const response = await userApi.get<Usuario[]>('/usuario/');
    return response.data;
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<Usuario> => {
    const response = await userApi.get<Usuario>(`/usuario/${id}`);
    return response.data;
  },

  // Obtener un usuario por correo
  getUserByEmail: async (correo: string): Promise<Usuario> => {
    const response = await userApi.get<Usuario>(`/usuario/correo/${correo}`);
    return response.data;
  },

  // Actualizar un usuario
  updateUser: async (usuario: Usuario): Promise<Usuario> => {
    const response = await userApi.put<Usuario>('/usuario/', usuario);
    return response.data;
  },

  // Eliminar un usuario
  deleteUser: async (id: number): Promise<void> => {
    await userApi.delete(`/usuario/${id}`);
  }
};
