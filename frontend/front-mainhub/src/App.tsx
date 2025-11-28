import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/login';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import type { Usuario } from './services/userService';
import './App.css';

function AppContent() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleFormSuccess = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setRefreshKey(prev => prev + 1); // Forzar recarga de la lista
  };

  const handleFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
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
      </nav>

      <div style={{ padding: '0 30px' }}>
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
              marginBottom: '20px'
            }}
          >
            ➕ Nuevo Usuario
          </button>
        )}

        {showUserForm ? (
          <UserForm
            usuario={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        ) : (
          <UserList key={refreshKey} onEdit={handleEditUser} />
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
