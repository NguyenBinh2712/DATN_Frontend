import { ATTEMPT_STATUS, QUIZ_STATUS } from '../../utils/quizHelpers'

export function QuizStatusBadge({ status }) {
  const meta = QUIZ_STATUS[status] || { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  )
}

export function AttemptStatusBadge({ status }) {
  const meta = ATTEMPT_STATUS[status] || { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  )
}
