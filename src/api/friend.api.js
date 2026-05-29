import api from './axios'

export const friendApi = {
  sendRequest: (targetUserId) => api.post('/friend/request', { targetUserId }),
  cancelRequest: (friendshipId) => api.post(`/friend/cancel/${friendshipId}`),
  acceptRequest: (friendshipId) => api.post(`/friend/accept/${friendshipId}`),
  rejectRequest: (friendshipId) => api.post(`/friend/reject/${friendshipId}`),
  unfriend: (targetUserId) => api.post('/friend/unfriend', { targetUserId }),
  getFriends: () => api.get('/friend/list'),
  getReceived: () => api.get('/friend/received'),
  getSent: () => api.get('/friend/sent'),
  getRecommend: (limit = 10) => api.get('/friend/recommend', { params: { limit } }),
}
