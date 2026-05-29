import api from './axios'

export const searchApi = {
  searchAll: (keyword) => api.get('/search', { params: { keyword } }),
  searchUsers: (keyword, page = 0, size = 10) =>
    api.get('/search/users', { params: { keyword, page, size } }),
  searchPosts: (keyword, page = 0, size = 10) =>
    api.get('/search/posts', { params: { keyword, page, size } }),
  searchGroups: (keyword, limit = 10) =>
    api.get('/search/groups', { params: { keyword, limit } }),
}
