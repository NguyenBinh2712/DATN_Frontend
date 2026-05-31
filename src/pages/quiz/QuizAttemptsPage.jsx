import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

const STATUS_LABEL = {
  IN_PROGRESS: 'Đang làm',
  SUBMITTED: 'Đã nộp',
  AUTO_SUBMITTED: 'Tự động nộp',
}

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
    <div className="fade-in-up space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/quizzes" className="text-sm text-primary hover:underline">
          ← Danh sách quiz
        </Link>
        <h1 className="text-2xl font-bold">Lịch sử làm bài</h1>
      </div>

      <div className="space-y-3">
        {attempts.map((a) => (
          <div
            key={a.attemptId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4"
          >
            <div>
              <p className="font-medium">Lần {a.attemptNumber}</p>
              <p className="text-sm text-muted">
                {STATUS_LABEL[a.status] || a.status}
                {a.submittedAt && ` · ${formatDateTime(a.submittedAt)}`}
              </p>
              {a.status !== 'IN_PROGRESS' && (
                <p className="mt-1 text-sm">
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
            </div>
          </div>
        ))}
        {attempts.length === 0 && (
          <p className="text-center text-muted">Chưa có lần làm nào</p>
        )}
      </div>
    </div>
  )
}
