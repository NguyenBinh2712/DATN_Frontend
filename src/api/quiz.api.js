import api from './axios'

export const quizApi = {
  create: (data) => api.post('/test', data),
  update: (quizId, data) => api.put(`/test/${quizId}`, data),
  activate: (quizId) => api.post(`/test/${quizId}/activate`),

  getMyQuizzes: () => api.get('/test/my-quizzes'),
  getPublic: (page = 0, size = 10) => api.get('/test/public', { params: { page, size } }),
  getByGroup: (groupId) => api.get(`/test/group/${groupId}`),

  start: (quizId) => api.post(`/test/${quizId}/start`),
  submit: (attemptId, answers) => api.post(`/test/attempts/${attemptId}/submit`, answers),
  aiReview: (attemptId) => api.post(`/test/attempts/${attemptId}/ai-review`),
  getMyAttempts: (quizId) => api.get(`/test/${quizId}/my-attempts`),

  getSubmissions: (quizId, page = 0, size = 10) =>
    api.get(`/test/${quizId}/submissions`, { params: { page, size } }),
  getSubmissionDetail: (attemptId) => api.get(`/test/submissions/${attemptId}`),
  addFeedback: (attemptId, { questionId, content }) =>
    api.post(`/test/submissions/${attemptId}/feedback`, {
      attemptId: Number(attemptId),
      questionId: questionId ?? null,
      content,
    }),

  getPending: (page = 0, size = 10) => api.get('/test/pending', { params: { page, size } }),
  review: (quizId, data) => api.post(`/test/${quizId}/review`, data),
}
