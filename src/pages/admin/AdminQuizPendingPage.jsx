import { useEffect, useState } from 'react'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

export default function AdminQuizPendingPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    quizApi
      .getPending(0, 20)
      .then(({ data }) => setQuizzes(data.result?.content || []))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const review = async (quizId, approved) => {
    try {
      await quizApi.review(quizId, { approved, note: approved ? 'OK' : 'Từ chối' })
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Duyệt Quiz</h1>
      <div className="mt-6 space-y-3">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-800">{q.title}</p>
              <p className="text-sm text-slate-500">{q.description}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => review(q.id, true)}>Duyệt</Button>
              <Button variant="danger" onClick={() => review(q.id, false)}>
                Từ chối
              </Button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="text-slate-500">Không có quiz chờ duyệt</p>
        )}
      </div>
    </div>
  )
}
