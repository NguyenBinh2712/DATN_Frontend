import api from './axios'

export const groupApi = {
  getAll: () => api.get('/groups'),
  getMyGroups: () => api.get('/groups/my-groups'),
  getDetail: (groupId) => api.get(`/groups/${groupId}`),
  create: (data) => api.post('/groups', data),
  update: (groupId, data) => api.put(`/groups/${groupId}`, data),
  delete: (groupId) => api.delete(`/groups/${groupId}`),
  search: (keyword, limit = 10) => api.get('/groups/search', { params: { keyword, limit } }),
  suggest: () => api.get('/groups/suggest'),
  getFeed: (groupId, page = 0, size = 10) =>
    api.get(`/groups/${groupId}/feed`, { params: { page, size } }),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  requestJoin: (groupId) => api.post(`/groups/${groupId}/join-request`),
  cancelJoinRequest: (groupId) => api.delete(`/groups/${groupId}/join-request`),
  getPendingRequests: (groupId) => api.get(`/groups/${groupId}/pending-requests`),
  approveRequest: (requestId) => api.post(`/groups/requests/${requestId}/approve`),
  rejectRequest: (requestId) => api.post(`/groups/requests/${requestId}/reject`),
  inviteFriend: (groupId, friendId) => api.post(`/groups/${groupId}/invite/${friendId}`),
  acceptInvitation: (requestId) => api.post(`/groups/invitations/${requestId}/accept`),
  rejectInvitation: (requestId) => api.post(`/groups/invitations/${requestId}/reject`),
  leave: (groupId) => api.delete(`/groups/${groupId}/leave`),
  removeMember: (groupId, memberId) => api.delete(`/groups/${groupId}/members/${memberId}`),
  changeRole: (groupId, targetUserId, newRole) =>
    api.put(`/groups/${groupId}/members/${targetUserId}/role`, { newRole }),
  transferOwnership: (groupId, newOwnerId) =>
    api.put(`/groups/${groupId}/transfer-ownership/${newOwnerId}`),
  pinPost: (groupId, postId) => api.post(`/groups/${groupId}/posts/${postId}/pin`),
  unpinPost: (groupId, postId) => api.delete(`/groups/${groupId}/posts/${postId}/pin`),
}
