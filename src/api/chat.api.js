import api from './axios'

export const chatApi = {
  sendMessage: (request, files = []) => {
    const form = new FormData()
    form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    files.forEach((f) => form.append('files', f))
    return api.post('/chat/messages', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getMessages: (convId, page = 0, size = 30) =>
    api.get(`/chat/messages/${convId}`, { params: { page, size } }),

  markSeen: (convId) => api.put(`/chat/messages/${convId}/seen`),

  react: (messageId, type) =>
    api.post('/chat/messages/reaction', { messageId, type }),

  reply: (parentMessageId, sendRequest) =>
    api.post('/chat/messages/reply', { parentMessageId, sendRequest }),

  edit: (messageId, content) =>
    api.patch(`/chat/messages/${messageId}`, { content }),

  delete: (messageId) => api.delete(`/chat/messages/${messageId}`),

  deleteForMe: (messageId) => api.delete(`/chat/messages/${messageId}/me`),

  report: (messageId, reason) =>
    api.post(`/chat/messages/${messageId}/report`, { reason, type: 'MESSAGES' }),

  typing: (convId) => api.post(`/chat/messages/${convId}/typing`),
}
