import { useState } from 'react';
import type { FormEvent } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import type { CreateMaintenanceDTO } from '../services/maintenanceService';

interface MaintenanceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MaintenanceForm = ({ onSuccess, onCancel }: MaintenanceFormProps) => {
  const [formData, setFormData] = useState<CreateMaintenanceDTO>({
    title: '',
    description: '',
    propertyId: '',
    type: 'CORRECTIVO',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await maintenanceService.createRequest(formData);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Error al crear la solicitud de mantenimiento'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '20px auto', 
      padding: '25px', 
      border: '1px solid #444', 
      borderRadius: '8px',
      backgroundColor: '#2a2a2a'
    }}>
      <h3 style={{ color: '#fff' }}>🔧 Nueva Solicitud de Mantenimiento</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📝 Título:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
            placeholder="Ej: Reparación de tubería en cocina"
          />
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📄 Descripción:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000',
              resize: 'vertical'
            }}
            placeholder="Describe detalladamente el problema..."
          />
        </div>

        <div>
          <label htmlFor="propertyId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            🏢 ID de Propiedad:
          </label>
          <input
            type="text"
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
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
            placeholder="ID de tu propiedad/apartamento"
          />
        </div>

        <div>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            🔖 Tipo de Mantenimiento:
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
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
          >
            <option value="CORRECTIVO">🔴 CORRECTIVO (Reparación/Problema)</option>
            <option value="PREVENTIVO">🟣 PREVENTIVO (Mantenimiento programado)</option>
          </select>
        </div>

        <div>
          <label htmlFor="photoUrl" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
            📷 URL de Foto: <small style={{ color: '#bbb' }}>(opcional)</small>
          </label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '14px', 
              borderRadius: '4px', 
              border: '1px solid #555',
              backgroundColor: '#fff',
              color: '#000'
            }}
            placeholder="https://ejemplo.com/foto.jpg"
          />
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
            {loading ? '⏳ Creando...' : '📝 Crear Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};
