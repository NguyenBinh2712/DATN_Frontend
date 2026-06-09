export const QUIZ_STATUS = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  ACTIVE: { label: 'Đang mở', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-100 text-red-700' },
  GROUP: { label: 'Chờ kích hoạt', className: 'bg-indigo-100 text-indigo-700' },
}

export const ATTEMPT_STATUS = {
  IN_PROGRESS: { label: 'Đang làm', className: 'bg-blue-100 text-blue-700' },
  SUBMITTED: { label: 'Đã nộp', className: 'bg-emerald-100 text-emerald-700' },
  AUTO_SUBMITTED: { label: 'Tự động nộp', className: 'bg-orange-100 text-orange-700' },
}

export const QUESTION_TYPES = [
  { value: 'SINGLE_CHOICE', label: 'Một đáp án' },
  { value: 'MULTIPLE_CHOICE', label: 'Nhiều đáp án' },
  { value: 'TRUE_FALSE', label: 'Đúng / Sai' },
  { value: 'SHORT_TEXT', label: 'Tự luận ngắn' },
]

export const CARD_SHADOW =
  '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

export function parseDateTime(value) {
  if (!value) return null
  if (Array.isArray(value)) {
    const [y, mo, d, h = 0, mi = 0, s = 0, ns = 0] = value
    return new Date(y, mo - 1, d, h, mi, s, Math.floor(ns / 1e6))
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function toDatetimeLocalValue(value) {
  const date = parseDateTime(value)
  if (!date) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value) {
  if (!value) return null
  return new Date(value).toISOString()
}

export function buildDefaultQuestion(order = 1) {
  return {
    questionText: '',
    type: 'SINGLE_CHOICE',
    point: 1,
    order,
    explanation: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ],
  }
}

export function normalizeQuestionForSubmit(question, index) {
  const base = {
    ...question,
    order: index + 1,
    point: Number(question.point) || 1,
  }

  if (question.type === 'TRUE_FALSE') {
    base.options = [
      { text: 'Đúng', isCorrect: !!question.options?.[0]?.isCorrect },
      { text: 'Sai', isCorrect: !question.options?.[0]?.isCorrect },
    ]
  } else if (question.type === 'SHORT_TEXT') {
    base.options = []
  }

  return base
}

export function sessionKey(quizId, suffix) {
  return `quiz-${suffix}-${quizId}`
}
