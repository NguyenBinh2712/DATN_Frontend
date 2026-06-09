import { Link } from 'react-router-dom'
import { Clock, RotateCcw, User } from 'lucide-react'
import { formatDateTime } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'
import { QuizStatusBadge } from './QuizStatusBadge'

export default function QuizCard({
  quiz,
  showCreator = false,
  showStatus = false,
  takeLink,
  attemptsLink,
  actions,
}) {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-indigo-200"
      style={{ boxShadow: CARD_SHADOW }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-800">{quiz.title}</h3>
            {showStatus && quiz.status && <QuizStatusBadge status={quiz.status} />}
          </div>
          {quiz.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{quiz.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> {quiz.time} phút
            </span>
            <span className="inline-flex items-center gap-1">
              <RotateCcw size={14} /> {quiz.maxAttempts ?? quiz.maxAttempt} lần
            </span>
            {showCreator && quiz.creatorName && (
              <span className="inline-flex items-center gap-1">
                <User size={14} /> {quiz.creatorName}
              </span>
            )}
          </div>
          {(quiz.startAt || quiz.endAt) && (
            <p className="mt-2 text-xs text-slate-400">
              {quiz.startAt && `Mở: ${formatDateTime(quiz.startAt)}`}
              {quiz.endAt && ` · Đóng: ${formatDateTime(quiz.endAt)}`}
            </p>
          )}
          {quiz.note && quiz.status === 'REJECTED' && (
            <p className="mt-2 text-xs text-red-600">Ghi chú: {quiz.note}</p>
          )}
        </div>
        {actions}
      </div>

      {(takeLink || attemptsLink) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {takeLink && (
            <Link to={takeLink}>
              <span className="inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
                Làm bài
              </span>
            </Link>
          )}
          {attemptsLink && (
            <Link
              to={attemptsLink}
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50"
            >
              Lịch sử
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
