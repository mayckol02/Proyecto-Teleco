export const ErrorBoundary = ({ error }: { error: string }) => {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: '#fee',
      border: '2px solid #f44336',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#f44336', marginTop: 0 }}>⚠️ Error de Conexión</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{error}</p>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        textAlign: 'left'
      }}>
        <h3 style={{ marginTop: 0 }}>🔧 Soluciones:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Verifica que Docker esté corriendo</li>
          <li>Ejecuta: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px' }}>docker-compose up -d</code></li>
          <li>Espera unos segundos a que los servicios inicien</li>
          <li>Verifica que los puertos 8081 y 8082 estén libres</li>
          <li>Recarga esta página</li>
        </ol>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        🔄 Reintentar
      </button>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #646cff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
        Cargando...
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
