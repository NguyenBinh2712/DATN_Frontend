import api from './axios'

export const conversationApi = {
  getMyConversations: (page = 0, size = 20) =>
    api.get('/conversations/myConversation', { params: { page, size } }),
  createOneToOne: (targetUserId) =>
    api.post(`/conversations/one-to-one/${targetUserId}`),
  createGroup: (data) => api.post('/conversations/group', data),
  addMembers: (convId, memberIds) =>
    api.post(`/conversations/${convId}/members`, memberIds),
  removeMembers: (convId, memberIds) =>
    api.delete(`/conversations/${convId}/members`, { data: memberIds }),
  leaveGroup: (convId) => api.delete(`/conversations/${convId}/leave`),
  promoteOwner: (convId, targetUserId) =>
    api.put(`/conversations/${convId}/owner/${targetUserId}`),
  accept: (convId) => api.put(`/conversations/${convId}/accept`),
  reject: (convId) => api.put(`/conversations/${convId}/reject`),
  delete: (convId) => api.delete(`/conversations/${convId}`),
  archive: (convId) => api.put(`/conversations/${convId}/archive`),
  unarchive: (convId) => api.put(`/conversations/${convId}/unarchive`),
  getArchived: () => api.get('/conversations/archived'),
  report: (data) => api.post('/conversations/report', data),
}
