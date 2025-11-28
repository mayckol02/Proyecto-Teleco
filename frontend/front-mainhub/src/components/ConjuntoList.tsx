import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import type { Conjunto } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

interface ConjuntoListProps {
  onEdit: (conjunto: Conjunto) => void;
}

export const ConjuntoList = ({ onEdit }: ConjuntoListProps) => {
  const [conjuntos, setConjuntos] = useState<Conjunto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasRole, user } = useAuth();

  const cargarConjuntos = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllConjuntos();
      setConjuntos(data);
      setError('');
    } catch (err: any) {
      setError('Error al cargar conjuntos: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConjuntos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este conjunto?')) {
      return;
    }

    try {
      await propertyService.deleteConjunto(id);
      setConjuntos(conjuntos.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Error al eliminar conjunto: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando conjuntos...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏢 Conjuntos Residenciales</h2>
      
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
        onClick={cargarConjuntos}
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

      {conjuntos.length === 0 ? (
        <p>No hay conjuntos registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Nombre</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Ubicación</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Teléfono</th>
                <th style={{ border: '1px solid #ddd', padding: '12px' }}>Admin ID</th>
                {hasRole('ADMIN') && (
                  <th style={{ border: '1px solid #ddd', padding: '12px' }}>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {conjuntos.map((conjunto) => (
                <tr key={conjunto.id} style={{ 
                  backgroundColor: conjunto.administradorId === user?.id ? '#e8f5e9' : 'white' 
                }}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {conjunto.id}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>
                    🏢 {conjunto.nombre}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    📍 {conjunto.ubicacion}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    📞 {conjunto.telefono}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {conjunto.administradorId}
                    {conjunto.administradorId === user?.id && (
                      <span style={{ 
                        marginLeft: '8px',
                        fontSize: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        TÚ
                      </span>
                    )}
                  </td>
                  {hasRole('ADMIN') && (
                    <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => onEdit(conjunto)}
                        style={{
                          marginRight: '5px',
                          padding: '6px 12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => conjunto.id && handleDelete(conjunto.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
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
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>📊 Total de conjuntos:</strong> {conjuntos.length}
      </div>
    </div>
  );
};
