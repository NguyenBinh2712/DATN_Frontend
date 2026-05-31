import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage, unwrapList } from '../../utils/helpers'

export default function TeacherQuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    quizApi
      .getMyQuizzes()
      .then(({ data }) => setQuizzes(unwrapList(data)))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const activate = async (quizId) => {
    try {
      await quizApi.activate(quizId)
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quiz của tôi</h1>
        <Link to="/teacher/quizzes/create">
          <Button>Tạo quiz</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4"
          >
            <div>
              <p className="font-semibold">{q.title}</p>
              <p className="text-sm text-muted">
                {q.status} · {q.time} phút · {q.maxAttempts} lần
              </p>
            </div>
            <div className="flex gap-2">
              {q.status === 'GROUP' && (
                <Button className="!py-1 !text-xs" onClick={() => activate(q.id)}>
                  Kích hoạt
                </Button>
              )}
              <Link to={`/teacher/quizzes/${q.id}/submissions`}>
                <Button variant="secondary" className="!py-1 !text-xs">
                  Bài nộp
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="text-center text-muted">Chưa có quiz</p>
        )}
      </div>
    </div>
  )
}
