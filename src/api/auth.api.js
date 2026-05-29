import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: (token) => api.post('/auth/logout', { token }),
  refresh: (token) => api.post('/auth/refresh', { token }),
  introspect: (token) => api.post('/auth/introspect', { token }),
}
