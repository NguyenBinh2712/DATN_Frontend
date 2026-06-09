import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { AttemptStatusBadge } from '../../components/quiz/QuizStatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'

export default function TeacherQuizSubmissionsPage() {
  const { id } = useParams()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizApi
      .getSubmissions(id, 0, 50)
      .then(({ data }) => setSubmissions(data.result?.content || []))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-6">
      <div>
        <Link to="/teacher/quizzes" className="text-sm text-indigo-600 hover:underline">
          ← Quiz của tôi
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Bài nộp</h1>
        <p className="text-sm text-slate-500">Xem chi tiết và gửi nhận xét cho học sinh</p>
      </div>

      <div className="space-y-3">
        {submissions.map((s) => (
          <Link
            key={s.attemptId}
            to={`/teacher/quizzes/${id}/submissions/${s.attemptId}`}
            className="block rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-indigo-200"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{s.studentName || `Học sinh #${s.studentId}`}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Lần {s.attemptNumber} · {formatDateTime(s.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-indigo-600">{s.scorePercent}%</p>
                <AttemptStatusBadge status={s.status} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <p className="font-medium text-slate-500">Chưa có bài nộp</p>
        </div>
      )}
    </div>
  )
}
