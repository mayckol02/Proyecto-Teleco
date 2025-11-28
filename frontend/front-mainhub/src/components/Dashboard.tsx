import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { propertyService } from '../services/propertyService';
import { maintenanceService } from '../services/maintenanceService';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalConjuntos: 0,
    misConjuntos: 0,
    totalMantenimientos: 0,
    mantenimientosPendientes: 0,
    mantenimientosEnProgreso: 0,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usuarios, conjuntos, mantenimientos] = await Promise.all([
          userService.getAllUsers(),
          propertyService.getAllConjuntos(),
          maintenanceService.getAllRequests()
        ]);

        const misConjuntos = conjuntos.filter(c => c.administradorId === user?.id).length;
        const pendientes = mantenimientos.filter(m => m.status === 'PENDIENTE').length;
        const enProgreso = mantenimientos.filter(m => m.status === 'EN_PROGRESO').length;

        setStats({
          totalUsuarios: usuarios.length,
          totalConjuntos: conjuntos.length,
          misConjuntos,
          totalMantenimientos: mantenimientos.length,
          mantenimientosPendientes: pendientes,
          mantenimientosEnProgreso: enProgreso,
          loading: false
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, [user]);

  if (stats.loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando estadísticas...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Dashboard - Resumen General</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Card Total Usuarios */}
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #2196F3'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>Usuarios</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#1565C0' }}>
            {stats.totalUsuarios}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Total de usuarios registrados
          </p>
        </div>

        {/* Card Total Conjuntos */}
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #4CAF50'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏢</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#388E3C' }}>Conjuntos</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#2E7D32' }}>
            {stats.totalConjuntos}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Total de conjuntos residenciales
          </p>
        </div>

        {/* Card Mis Conjuntos */}
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #FF9800'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⭐</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#F57C00' }}>Mis Conjuntos</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#E65100' }}>
            {stats.misConjuntos}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Conjuntos que administras
          </p>
        </div>

        {/* Card Total Mantenimientos */}
        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #9C27B0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔧</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#7B1FA2' }}>Mantenimientos</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#6A1B9A' }}>
            {stats.totalMantenimientos}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Total de solicitudes
          </p>
        </div>

        {/* Card Pendientes */}
        <div style={{
          backgroundColor: '#fff8e1',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #FFC107'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#F57F17' }}>Pendientes</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#F57F17' }}>
            {stats.mantenimientosPendientes}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Mantenimientos por asignar
          </p>
        </div>

        {/* Card En Progreso */}
        <div style={{
          backgroundColor: '#e0f2f1',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #009688'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚧</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#00796B' }}>En Progreso</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#00695C' }}>
            {stats.mantenimientosEnProgreso}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Mantenimientos en ejecución
          </p>
        </div>

        {/* Card Completados */}
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #4CAF50'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#388E3C' }}>Completados</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#2E7D32' }}>
            {stats.totalMantenimientos - stats.mantenimientosPendientes - stats.mantenimientosEnProgreso}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Mantenimientos finalizados
          </p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginTop: 0 }}>⚡ Acciones Rápidas</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Usa las pestañas superiores para gestionar usuarios, conjuntos y mantenimientos.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '10px 15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            ℹ️ Gestiona <strong>Usuarios</strong> del sistema
          </div>
          <div style={{
            padding: '10px 15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            ℹ️ Administra <strong>Conjuntos</strong> residenciales
          </div>
          <div style={{
            padding: '10px 15px',
            backgroundColor: '#f3e5f5',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            ℹ️ Registra y da seguimiento a <strong>Mantenimientos</strong>
          </div>
        </div>
      </div>

      {/* Información del Usuario */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e1f5fe',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '2px solid #03A9F4'
      }}>
        <h3 style={{ marginTop: 0 }}>👤 Información de tu Sesión</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>📧 Correo:</strong> {user?.correo}
          </div>
          <div>
            <strong>🔑 ID:</strong> {user?.id}
          </div>
          <div>
            <strong>👔 Rol:</strong>{' '}
            <span style={{
              padding: '4px 12px',
              borderRadius: '4px',
              backgroundColor: 
                user?.rol === 'ADMIN' ? '#4CAF50' : 
                user?.rol === 'TECNICO' ? '#2196F3' : '#FF9800',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {user?.rol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
