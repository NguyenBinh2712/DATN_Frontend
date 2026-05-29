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
      <h1 className="text-2xl font-bold text-white">Duyệt Quiz</h1>
      <div className="mt-6 space-y-3">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"
          >
            <div>
              <p className="font-medium text-white">{q.title}</p>
              <p className="text-sm text-slate-400">{q.description}</p>
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
          <p className="text-slate-400">Không có quiz chờ duyệt</p>
        )}
      </div>
    </div>
  )
}
