import api from './axios'

export const notificationApi = {
  getAll: (page = 0, size = 20) =>
    api.get('/notifications', { params: { page, size } }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllRead: () => api.put('/notifications/mark-all-read'),
}
