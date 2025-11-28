import { useState } from 'react';
import type { FormEvent } from 'react';
import { notificationService } from '../services/notificationService';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    channel: 'email'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await notificationService.sendNotification(formData);
      setSuccess('Notificación enviada correctamente');
      setFormData({ recipient: '', message: '', channel: 'email' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Error al enviar la notificación'
      );
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '2px solid #444'
      }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>📧 Enviar Notificación</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="recipient" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
              📧 Destinatario (Email):
            </label>
            <input
              type="email"
              id="recipient"
              name="recipient"
              value={formData.recipient}
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
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="channel" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
              📡 Canal:
            </label>
            <select
              id="channel"
              name="channel"
              value={formData.channel}
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
            >
              <option value="email">Email</option>
              <option value="sms">SMS (Simulado)</option>
              <option value="push">Push (Simulado)</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
              💬 Mensaje:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
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
              placeholder="Escribe el mensaje de la notificación..."
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

          {success && (
            <div style={{
              color: 'green',
              padding: '12px',
              backgroundColor: '#efe',
              borderRadius: '4px',
              fontSize: '14px',
              border: '1px solid #cfc'
            }}>
              ✅ {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
                backgroundColor: loading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? '⏳ Enviando...' : '📧 Enviar Notificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
