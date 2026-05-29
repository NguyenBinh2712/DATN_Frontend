import api from './axios'

export const teacherApi = {
  apply: (request, files) => {
    const form = new FormData()
    form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
    if (files.idCardFront) form.append('idCardFront', files.idCardFront)
    if (files.idCardBack) form.append('idCardBack', files.idCardBack)
    if (files.cv) form.append('cv', files.cv)
    files.degrees?.forEach((f) => form.append('degrees', f))
    return api.post('/teacher', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getMyApplication: () => api.get('/teacher/my-application'),

  getPendingApplications: () => api.get('/teacher/applications/pending'),

  reviewApplication: (id, data) => api.patch(`/teacher/${id}/review`, data),
}
