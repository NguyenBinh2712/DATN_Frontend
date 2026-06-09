import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { AttemptStatusBadge } from '../../components/quiz/QuizStatusBadge'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'

export default function QuizAttemptsPage() {
  const { id } = useParams()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizApi
      .getMyAttempts(id)
      .then(({ data }) => setAttempts(data.result || []))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-6">
      <div>
        <Link to="/quizzes" className="text-sm text-indigo-600 hover:underline">
          ← Danh sách quiz
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Lịch sử làm bài</h1>
      </div>

      <div className="space-y-3">
        {attempts.map((a) => (
          <div
            key={a.attemptId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-800">Lần {a.attemptNumber}</p>
                <AttemptStatusBadge status={a.status} />
                {a.aiReview && (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                    AI Review
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {a.submittedAt ? formatDateTime(a.submittedAt) : 'Chưa nộp'}
              </p>
              {a.status !== 'IN_PROGRESS' && (
                <p className="mt-2 text-sm text-slate-700">
                  Điểm: <strong>{a.scorePercent}%</strong>
                  {a.bestScore != null && ` · Cao nhất: ${a.bestScore}%`}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {a.status !== 'IN_PROGRESS' && (
                <Link to={`/quizzes/${id}/attempts/${a.attemptId}`}>
                  <Button variant="secondary" className="!py-1 !text-xs">
                    Chi tiết
                  </Button>
                </Link>
              )}
              {a.canRetake && (
                <Link to={`/quizzes/${id}/take`}>
                  <Button className="!py-1 !text-xs">Làm lại</Button>
                </Link>
              )}
              {a.status === 'IN_PROGRESS' && (
                <Link to={`/quizzes/${id}/take`}>
                  <Button className="!py-1 !text-xs">Tiếp tục</Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {attempts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <p className="font-medium text-slate-500">Chưa có lần làm nào</p>
          <Link to={`/quizzes/${id}/take`} className="mt-3 inline-block text-indigo-600 hover:underline">
            Bắt đầu làm bài
          </Link>
        </div>
      )}
    </div>
  )
}
