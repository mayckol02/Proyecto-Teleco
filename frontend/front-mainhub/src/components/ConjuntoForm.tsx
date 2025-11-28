import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { propertyService } from '../services/propertyService';
import type { Conjunto } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

interface ConjuntoFormProps {
  conjunto?: Conjunto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ConjuntoForm = ({ conjunto, onSuccess, onCancel }: ConjuntoFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Conjunto>({
    nombre: '',
    ubicacion: '',
    telefono: '',
    administradorId: user?.id || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (conjunto) {
      setFormData(conjunto);
    } else if (user?.id) {
      setFormData(prev => ({ ...prev, administradorId: user.id }));
    }
  }, [conjunto, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'administradorId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (conjunto?.id) {
        await propertyService.updateConjunto({ ...formData, id: conjunto.id });
      } else {
        await propertyService.createConjunto(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.mensaje || 
        err.response?.data?.message ||
        'Error al guardar el conjunto'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '20px auto', 
      padding: '25px', 
      border: '1px solid #444', 
      borderRadius: '8px',
      backgroundColor: '#2a2a2a'
    }}>
      <h3 style={{ color: '#fff' }}>🏢 {conjunto?.id ? 'Editar Conjunto' : 'Nuevo Conjunto'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📝 Nombre del Conjunto:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000' 
            }}
            placeholder="Ej: Conjunto Residencial Los Pinos"
          />
        </div>

        <div>
          <label htmlFor="ubicacion" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📍 Ubicación:
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000' 
            }}
            placeholder="Ej: Calle 123 #45-67, Ciudad"
          />
        </div>

        <div>
          <label htmlFor="telefono" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📞 Teléfono:
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000' 
            }}
            placeholder="Ej: +57 300 123 4567"
          />
        </div>

        <div>
          <label htmlFor="administradorId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            👤 ID del Administrador:
          </label>
          <input
            type="number"
            id="administradorId"
            name="administradorId"
            value={formData.administradorId}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000'
            }}
            placeholder="ID del usuario administrador"
          />
          <small style={{ color: '#bbb', fontSize: '12px' }}>
            Usuario actual: {user?.correo} (ID: {user?.id})
          </small>
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            padding: '12px', 
            backgroundColor: '#fee', 
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #fcc'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ❌ Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳ Guardando...' : (conjunto?.id ? '💾 Actualizar' : '➕ Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};
