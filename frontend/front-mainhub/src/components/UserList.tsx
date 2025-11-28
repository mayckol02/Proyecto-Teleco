import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { Usuario } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface UserListProps {
  onEdit: (usuario: Usuario) => void;
}

export const UserList = ({ onEdit }: UserListProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasRole } = useAuth();

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsuarios(data);
      setError('');
    } catch (err: any) {
      setError('Error al cargar usuarios: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err: any) {
      alert('Error al eliminar usuario: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando usuarios...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista de Usuarios</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <button 
        onClick={cargarUsuarios}
        style={{ marginBottom: '15px', padding: '8px 16px', cursor: 'pointer' }}
      >
        🔄 Actualizar
      </button>

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Correo</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Rol</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Propiedad ID</th>
              {hasRole('ADMIN') && (
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {usuario.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{usuario.nombre}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{usuario.correo}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      usuario.rol === 'ADMIN' ? '#4CAF50' : 
                      usuario.rol === 'TECNICO' ? '#2196F3' : '#FF9800',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {usuario.rol}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {usuario.propiedadId || '-'}
                </td>
                {hasRole('ADMIN') && (
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => onEdit(usuario)}
                      style={{
                        marginRight: '5px',
                        padding: '5px 10px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => usuario.id && handleDelete(usuario.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
