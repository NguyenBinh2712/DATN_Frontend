import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage, unwrapList } from '../../utils/helpers'

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizApi
      .getPublic(0, 20)
      .then(({ data }) => setQuizzes(data.result?.content || unwrapList(data)))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-4">
      <h1 className="text-2xl font-bold">Quiz công khai</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-border bg-white p-4 transition hover:border-primary"
          >
            <Link to={`/quizzes/${q.id}/take`}>
              <h3 className="font-semibold">{q.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{q.description}</p>
              <p className="mt-2 text-xs text-muted">
                {q.time} phút · {q.maxAttempts} lần · {formatDateTime(q.endAt)}
              </p>
            </Link>
            <Link
              to={`/quizzes/${q.id}/attempts`}
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Lịch sử làm bài
            </Link>
          </div>
        ))}
      </div>
      {quizzes.length === 0 && (
        <p className="text-center text-muted">Chưa có quiz công khai</p>
      )}
    </div>
  )
}
