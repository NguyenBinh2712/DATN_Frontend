import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

export default function TeacherQuizSubmissionsPage() {
  const { id } = useParams()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizApi
      .getSubmissions(id, 0, 30)
      .then(({ data }) => setSubmissions(data.result?.content || []))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/teacher/quizzes" className="text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <h1 className="text-2xl font-bold">Bài nộp</h1>
      </div>
      <div className="space-y-3">
        {submissions.map((s) => (
          <Link
            key={s.attemptId}
            to={`/teacher/quizzes/${id}/submissions/${s.attemptId}`}
            className="block rounded-xl border border-border bg-white p-4 transition hover:border-primary"
          >
            <p className="font-medium">{s.studentName}</p>
            <p className="text-sm text-muted">
              Lần {s.attemptNumber} · {s.scorePercent}% · {formatDateTime(s.submittedAt)}
            </p>
          </Link>
        ))}
        {submissions.length === 0 && (
          <p className="text-center text-muted">Chưa có bài nộp</p>
        )}
      </div>
    </div>
  )
}
