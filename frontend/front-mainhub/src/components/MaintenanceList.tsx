import { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import type { MaintenanceRequest } from '../services/maintenanceService';
import { useAuth } from '../context/AuthContext';

interface MaintenanceListProps {
  onEdit: (request: MaintenanceRequest) => void;
  onViewDetails: (request: MaintenanceRequest) => void;
}

export const MaintenanceList = ({ onEdit, onViewDetails }: MaintenanceListProps) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasRole } = useAuth();

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAllRequests();
      setRequests(data);
      setError('');
    } catch (err: any) {
      setError('Error al cargar solicitudes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return '#FF9800';
      case 'EN_PROGRESO': return '#2196F3';
      case 'COMPLETADO': return '#4CAF50';
      default: return '#999';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'PREVENTIVO' ? '#9C27B0' : '#f44336';
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando solicitudes...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔧 Solicitudes de Mantenimiento</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          backgroundColor: '#fee', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}

      <button 
        onClick={cargarSolicitudes}
        style={{ 
          marginBottom: '15px', 
          padding: '8px 16px', 
          cursor: 'pointer',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        🔄 Actualizar
      </button>

      {requests.length === 0 ? (
        <p>No hay solicitudes de mantenimiento registradas.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Título</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Propiedad</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Tipo</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Estado</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Técnico</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Creado</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {request.id}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>
                    {request.title}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    🏢 {request.propertyId}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getTypeColor(request.type),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {request.type}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(request.status || 'PENDIENTE'),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {request.status || 'PENDIENTE'}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {request.assignedTechnicianId ? (
                      <span>👤 {request.assignedTechnicianId}</span>
                    ) : (
                      <span style={{ color: '#999' }}>Sin asignar</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontSize: '12px' }}>
                    {request.createdAt ? new Date(request.createdAt).toLocaleString('es-ES') : '-'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => onViewDetails(request)}
                      style={{
                        marginRight: '5px',
                        padding: '6px 12px',
                        backgroundColor: '#9C27B0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      👁️ Ver
                    </button>
                    {hasRole('ADMIN') && (
                      <button
                        onClick={() => onEdit(request)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ⚙️ Gestionar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>📊 Total de solicitudes:</strong> {requests.length}
        {' | '}
        <strong style={{ color: '#FF9800' }}>⏳ Pendientes:</strong> {requests.filter(r => r.status === 'PENDIENTE').length}
        {' | '}
        <strong style={{ color: '#2196F3' }}>🔄 En progreso:</strong> {requests.filter(r => r.status === 'EN_PROGRESO').length}
        {' | '}
        <strong style={{ color: '#4CAF50' }}>✅ Completadas:</strong> {requests.filter(r => r.status === 'COMPLETADO').length}
      </div>
    </div>
  );
};
