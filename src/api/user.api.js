import api from './axios'

export const userApi = {
  register: (data) => api.post('/user/register', data),
  verifyOtp: (data) => api.post('/user/register/verify', data),
  resendOtp: (data) => api.post('/user/register/resend-otp', data),
  requestForgotPasswordOtp: (email) =>
    api.post('/user/forgot-password/request-otp', null, { params: { email } }),
  forgotPassword: (data) => api.put('/user/forgot-password', data),
  getMe: () => api.get('/user/me'),
  getById: (id) => api.get(`/user/${id}`),
  getAll: (page = 0, size = 20) => api.get('/user', { params: { page, size } }),
  deleteUser: (id) => api.delete(`/user/${id}`),
  updateProfile: (data) => api.put('/user/me/profile', data),
  changePassword: (data) => api.put('/user/me/change-password', data),
  changeAvatar: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.put('/user/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
