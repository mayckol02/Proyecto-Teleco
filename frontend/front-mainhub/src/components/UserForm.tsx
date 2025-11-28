import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { userService } from '../services/userService';
import type { Usuario } from '../services/userService';

interface UserFormProps {
  usuario?: Usuario | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserForm = ({ usuario, onSuccess, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<Usuario>({
    nombre: '',
    correo: '',
    clave: '',
    rol: 'RESIDENTE',
    propiedadId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormData({
        ...usuario,
        clave: '' // No mostrar la clave al editar
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'propiedadId' ? (value ? parseInt(value) : null) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (usuario?.id) {
        // Actualizar usuario existente
        const dataToUpdate = { ...formData, id: usuario.id };
        // Si no se ingresó una nueva clave, no enviarla
        if (!formData.clave) {
          delete dataToUpdate.clave;
        }
        await userService.updateUser(dataToUpdate);
      } else {
        // Crear nuevo usuario
        if (!formData.clave) {
          setError('La contraseña es obligatoria para crear un usuario');
          setLoading(false);
          return;
        }
        await userService.createUser(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.mensaje || 
        err.response?.data?.message ||
        'Error al guardar el usuario'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>{usuario?.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Nombre completo"
          />
        </div>

        <div>
          <label htmlFor="correo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="clave" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña: {usuario?.id && <small>(dejar vacío para no cambiar)</small>}
          </label>
          <input
            type="password"
            id="clave"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required={!usuario?.id}
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="********"
          />
        </div>

        <div>
          <label htmlFor="rol" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Rol:
          </label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="TECNICO">TECNICO</option>
            <option value="RESIDENTE">RESIDENTE</option>
          </select>
        </div>

        <div>
          <label htmlFor="propiedadId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ID Propiedad: <small>(opcional)</small>
          </label>
          <input
            type="number"
            id="propiedadId"
            name="propiedadId"
            value={formData.propiedadId || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="ID de la propiedad"
          />
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            padding: '10px', 
            backgroundColor: '#fee', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Guardando...' : (usuario?.id ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};
