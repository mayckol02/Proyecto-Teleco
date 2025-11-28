import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ correo, clave });
      // El login exitoso será manejado por el AuthContext
    } catch (err: any) {
      setError(
        err.response?.data?.mensaje || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="correo" style={{ display: 'block', marginBottom: '5px' }}>
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="clave" style={{ display: 'block', marginBottom: '5px' }}>
            Contraseña:
          </label>
          <input
            type="password"
            id="clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            placeholder="********"
          />
        </div>

        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};
