import api from './axios'

export const blockApi = {
  block: (blockedId) => api.post(`/block/${blockedId}`),
  unblock: (blockedId) => api.delete(`/block/${blockedId}`),
  getMyBlocked: () => api.get('/block'),
  checkBlocked: (targetId) => api.get(`/block/check/${targetId}`),
}
