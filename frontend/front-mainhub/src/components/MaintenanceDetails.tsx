import { useState } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import type { MaintenanceRequest, MaintenanceStatus } from '../services/maintenanceService';
import { useAuth } from '../context/AuthContext';

interface MaintenanceDetailsProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onUpdate: () => void;
}

export const MaintenanceDetails = ({ request, onClose, onUpdate }: MaintenanceDetailsProps) => {
  const { hasRole } = useAuth();
  const [technicianId, setTechnicianId] = useState('');
  const [newStatus, setNewStatus] = useState<MaintenanceStatus>(request.status || 'PENDIENTE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return '#FF9800';
      case 'EN_PROGRESO': return '#2196F3';
      case 'COMPLETADO': return '#4CAF50';
      default: return '#999';
    }
  };

  const handleAssignTechnician = async () => {
    if (!technicianId.trim()) {
      setError('Debes ingresar un ID de técnico');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await maintenanceService.assignTechnician(request.id!, technicianId);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar técnico');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError('');
    try {
      await maintenanceService.updateStatus(request.id!, newStatus);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #444'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#2a2a2a',
          zIndex: 1
        }}>
          <h3 style={{ margin: 0, color: '#fff' }}>🔧 Detalles de Solicitud #{request.id}</h3>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ❌ Cerrar
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', color: '#fff' }}>
          {error && (
            <div style={{
              color: 'red',
              padding: '10px',
              backgroundColor: '#fee',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #fcc'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Información Principal */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginTop: 0, color: '#fff' }}>📋 Información General</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div><strong>Título:</strong> {request.title}</div>
              <div><strong>Descripción:</strong> {request.description}</div>
              <div><strong>Propiedad:</strong> 🏢 {request.propertyId}</div>
              <div>
                <strong>Tipo:</strong>{' '}
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: request.type === 'PREVENTIVO' ? '#9C27B0' : '#f44336',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {request.type}
                </span>
              </div>
              <div>
                <strong>Estado:</strong>{' '}
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(request.status || 'PENDIENTE'),
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {request.status || 'PENDIENTE'}
                </span>
              </div>
              <div><strong>Técnico Asignado:</strong> {request.assignedTechnicianId || 'Sin asignar'}</div>
              {request.photoUrl && (
                <div>
                  <strong>Foto:</strong>{' '}
                  <a href={request.photoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#64B5F6' }}>
                    Ver imagen 🖼️
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginTop: 0, color: '#fff' }}>📅 Fechas</h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div><strong>Creado:</strong> {request.createdAt ? new Date(request.createdAt).toLocaleString('es-ES') : '-'}</div>
              <div><strong>Actualizado:</strong> {request.updatedAt ? new Date(request.updatedAt).toLocaleString('es-ES') : '-'}</div>
              {request.completedAt && (
                <div><strong>Completado:</strong> {new Date(request.completedAt).toLocaleString('es-ES')}</div>
              )}
            </div>
          </div>

          {/* Historial de Estados */}
          {request.history && request.history.length > 0 && (
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginTop: 0, color: '#fff' }}>📜 Historial de Cambios</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {request.history.map((item, index) => (
                  <div key={index} style={{
                    padding: '10px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '4px',
                    fontSize: '14px',
                    borderLeft: '3px solid #2196F3'
                  }}>
                    <div>
                      <strong>{item.fromStatus || 'INICIAL'}</strong> → <strong>{item.toStatus}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#bbb', marginTop: '5px' }}>
                      Por: {item.changedBy} | {new Date(item.changedAt).toLocaleString('es-ES')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Asignar Técnico (solo ADMIN) */}
          {hasRole('ADMIN') && (
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginTop: 0, color: '#fff' }}>👤 Asignar Técnico</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                  placeholder="ID del técnico"
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#fff',
                    color: '#000'
                  }}
                />
                <button
                  onClick={handleAssignTechnician}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? '⏳' : '✅ Asignar'}
                </button>
              </div>
            </div>
          )}

          {/* Actualizar Estado (ADMIN o TECNICO) */}
          {(hasRole('ADMIN') || hasRole('TECNICO')) && (
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '6px'
            }}>
              <h4 style={{ marginTop: 0, color: '#fff' }}>🔄 Actualizar Estado</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as MaintenanceStatus)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#fff',
                    color: '#000'
                  }}
                >
                  <option value="PENDIENTE">⏳ PENDIENTE</option>
                  <option value="EN_PROGRESO">🔄 EN PROGRESO</option>
                  <option value="COMPLETADO">✅ COMPLETADO</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? '⏳' : '💾 Guardar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
