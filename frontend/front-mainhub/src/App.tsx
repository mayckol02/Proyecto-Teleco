import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/login';
import { Dashboard } from './components/Dashboard';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { ConjuntoList } from './components/ConjuntoList';
import { ConjuntoForm } from './components/ConjuntoForm';
import { MaintenanceList } from './components/MaintenanceList';
import { MaintenanceForm } from './components/MaintenanceForm';
import { MaintenanceDetails } from './components/MaintenanceDetails';
import { NotificationPanel } from './components/NotificationPanel';
import type { Usuario } from './services/userService';
import type { Conjunto } from './services/propertyService';
import type { MaintenanceRequest } from './services/maintenanceService';
import './App.css';

type TabType = 'dashboard' | 'usuarios' | 'conjuntos' | 'mantenimientos';

function AppContent() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showConjuntoForm, setShowConjuntoForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showMaintenanceDetails, setShowMaintenanceDetails] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [editingConjunto, setEditingConjunto] = useState<Conjunto | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRequest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleUserFormSuccess = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleUserFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleEditConjunto = (conjunto: Conjunto) => {
    setEditingConjunto(conjunto);
    setShowConjuntoForm(true);
  };

  const handleConjuntoFormSuccess = () => {
    setShowConjuntoForm(false);
    setEditingConjunto(null);
  };

  const handleConjuntoFormCancel = () => {
    setShowConjuntoForm(false);
    setEditingConjunto(null);
  };

  const handleViewMaintenanceDetails = (maintenance: MaintenanceRequest) => {
    setSelectedMaintenance(maintenance);
    setShowMaintenanceDetails(true);
  };

  const handleMaintenanceFormSuccess = () => {
    setShowMaintenanceForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleMaintenanceFormCancel = () => {
    setShowMaintenanceForm(false);
  };

  const handleMaintenanceDetailsClose = () => {
    setShowMaintenanceDetails(false);
    setSelectedMaintenance(null);
  };

  const handleMaintenanceUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setShowMaintenanceDetails(false);
    setSelectedMaintenance(null);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <nav style={{
        padding: '15px 30px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Sistema de Gestión</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            Bienvenido, {user?.correo} ({user?.rol})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowNotificationPanel(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📧 Enviar Notificación
          </button>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ padding: '0 30px' }}>
        {/* Tabs de Navegación */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #ddd'
        }}>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setShowUserForm(false);
              setShowConjuntoForm(false);
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: activeTab === 'dashboard' ? '#646cff' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#646cff',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? '3px solid #646cff' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('usuarios');
              setShowUserForm(false);
              setShowConjuntoForm(false);
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: activeTab === 'usuarios' ? '#646cff' : 'transparent',
              color: activeTab === 'usuarios' ? 'white' : '#646cff',
              border: 'none',
              borderBottom: activeTab === 'usuarios' ? '3px solid #646cff' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => {
              setActiveTab('conjuntos');
              setShowUserForm(false);
              setShowConjuntoForm(false);
              setShowMaintenanceForm(false);
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: activeTab === 'conjuntos' ? '#646cff' : 'transparent',
              color: activeTab === 'conjuntos' ? 'white' : '#646cff',
              border: 'none',
              borderBottom: activeTab === 'conjuntos' ? '3px solid #646cff' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🏢 Conjuntos
          </button>
          <button
            onClick={() => {
              setActiveTab('mantenimientos');
              setShowUserForm(false);
              setShowConjuntoForm(false);
              setShowMaintenanceForm(false);
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: activeTab === 'mantenimientos' ? '#646cff' : 'transparent',
              color: activeTab === 'mantenimientos' ? 'white' : '#646cff',
              border: 'none',
              borderBottom: activeTab === 'mantenimientos' ? '3px solid #646cff' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🔧 Mantenimientos
          </button>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'usuarios' && (
          <>
            {hasRole('ADMIN') && !showUserForm && (
              <button
                onClick={() => setShowUserForm(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}
              >
                ➕ Nuevo Usuario
              </button>
            )}

            {showUserForm ? (
              <UserForm
                usuario={editingUser}
                onSuccess={handleUserFormSuccess}
                onCancel={handleUserFormCancel}
              />
            ) : (
              <UserList key={refreshKey} onEdit={handleEditUser} />
            )}
          </>
        )}

        {activeTab === 'conjuntos' && (
          <>
            {hasRole('ADMIN') && !showConjuntoForm && (
              <button
                onClick={() => setShowConjuntoForm(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}
              >
                ➕ Nuevo Conjunto
              </button>
            )}

            {showConjuntoForm ? (
              <ConjuntoForm
                conjunto={editingConjunto}
                onSuccess={handleConjuntoFormSuccess}
                onCancel={handleConjuntoFormCancel}
              />
            ) : (
              <ConjuntoList key={refreshKey} onEdit={handleEditConjunto} />
            )}
          </>
        )}

        {activeTab === 'mantenimientos' && (
          <>
            {hasRole('RESIDENTE') && !showMaintenanceForm && (
              <button
                onClick={() => setShowMaintenanceForm(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}
              >
                ➕ Nueva Solicitud
              </button>
            )}

            {showMaintenanceForm ? (
              <MaintenanceForm
                onSuccess={handleMaintenanceFormSuccess}
                onCancel={handleMaintenanceFormCancel}
              />
            ) : (
              <MaintenanceList 
                key={refreshKey} 
                onEdit={handleViewMaintenanceDetails}
                onViewDetails={handleViewMaintenanceDetails}
              />
            )}

            {showMaintenanceDetails && selectedMaintenance && (
              <MaintenanceDetails
                request={selectedMaintenance}
                onClose={handleMaintenanceDetailsClose}
                onUpdate={handleMaintenanceUpdate}
              />
            )}
          </>
        )}

        {/* Panel de Notificaciones */}
        {showNotificationPanel && (
          <NotificationPanel onClose={() => setShowNotificationPanel(false)} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
