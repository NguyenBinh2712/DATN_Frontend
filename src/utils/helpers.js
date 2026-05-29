export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Đã xảy ra lỗi, vui lòng thử lại'
  )
}

/** Chuẩn hóa id từ API / URL để so sánh nhất quán */
export function normalizeId(id) {
  if (id == null) return null
  const n = Number(id)
  return Number.isNaN(n) ? null : n
}

/** Lấy mảng từ ApiResponse, hỗ trợ cả Slice */
export function unwrapList(responseData) {
  const r = responseData?.result ?? responseData
  if (Array.isArray(r)) return r
  if (r?.content && Array.isArray(r.content)) return r.content
  return []
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

export function formatRelativeTime(value) {
  if (!value) return ''
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

export const REACTION_EMOJI = {
  LIKE: '👍',
  LOVE: '❤️',
  HAHA: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😡',
}

export const REACTIONS = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY']

export const REPORT_REASONS = [
  'SPAM',
  'SENSITIVE_CONTENT',
  'VIOLENCE',
  'HARASSMENT',
  'FALSE_INFORMATION',
  'HATE_SPEECH',
  'SCAM',
  'OTHER',
]
