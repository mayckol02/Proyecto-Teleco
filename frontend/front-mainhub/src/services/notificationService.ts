import axios from 'axios';

const NOTIFICATION_SERVICE_URL = 'http://localhost:8090';

export const notificationApi = axios.create({
  baseURL: NOTIFICATION_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface NotificationRequest {
  recipient: string;
  message: string;
  channel: string; // 'email', 'sms', 'push'
}

export const notificationService = {
  // Enviar notificación
  sendNotification: async (notification: NotificationRequest): Promise<string> => {
    const response = await notificationApi.post<string>('/notify', notification);
    return response.data;
  },
};
