import api from './axios'

export const postApi = {
  getFeed: (page = 0, size = 10) =>
    api.get('/post/feed', { params: { page, size } }),

  getDetail: (postId) => api.get(`/post/${postId}`),

  getComments: (postId) => api.get(`/post/${postId}/comments`),

  getUserPosts: (userId, page = 0, size = 10) =>
    api.get(`/post/user/${userId}`, { params: { page, size } }),

  create: (request, files = []) => {
    const form = new FormData()
    form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    files.forEach((file) => form.append('files', file))
    return api.post('/post', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update: (postId, request) => api.put(`/post/${postId}`, request),

  delete: (postId) => api.delete(`/post/${postId}`),

  share: (originalPostId) => api.post(`/post/share/${originalPostId}`),

  react: (postId, type) => api.post(`/post/${postId}/react`, { type }),

  getMyReaction: (postId) => api.get(`/post/${postId}/my-reaction`),

  createComment: (postId, data) => api.post(`/post/${postId}/comments`, data),

  deleteComment: (postId, commentId) =>
    api.delete(`/post/${postId}/comments/${commentId}`),

  report: (postId, data) => api.post(`/post/${postId}/report`, data),

  getPendingReports: () => api.get('/post/reports/pending'),

  handleReport: (reportId, status) =>
    api.put(`/post/reports/${reportId}/handle`, null, { params: { status } }),

  getAdminPosts: (page = 0, size = 20) =>
    api.get('/post/admin/all', { params: { page, size } }),
}
