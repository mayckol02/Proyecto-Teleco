import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      padding: '15px 30px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '24px' }}>📋 Sistema de Gestión de Usuarios</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          👤 {user?.correo} • 
          <span style={{
            marginLeft: '8px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 
              user?.rol === 'ADMIN' ? '#4CAF50' : 
              user?.rol === 'TECNICO' ? '#2196F3' : '#FF9800',
            fontSize: '12px'
          }}>
            {user?.rol}
          </span>
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
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
      >
        🚪 Cerrar Sesión
      </button>
    </nav>
  );
};
