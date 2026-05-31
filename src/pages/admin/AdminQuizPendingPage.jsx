import { useEffect, useState } from 'react'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

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
    <div className="fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Duyệt Quiz</h1>
        <p className="mt-1 text-sm text-slate-500">Phê duyệt quiz trước khi công khai</p>
      </div>

      <div className="space-y-3">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:border-indigo-200"
            style={{ boxShadow: CARD_SHADOW }}
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
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
            <div className="mb-3 text-4xl">📭</div>
            <p className="font-medium text-slate-500">Không có quiz chờ duyệt</p>
          </div>
        )}
      </div>
    </div>
  )
}
