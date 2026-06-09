import { useEffect, useState } from 'react'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'

export default function AdminQuizPendingPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})
  const [reviewing, setReviewing] = useState(null)

  const load = () => {
    setLoading(true)
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
    setReviewing(quizId)
    try {
      await quizApi.review(quizId, {
        approved,
        note: notes[quizId]?.trim() || (approved ? 'Đã duyệt' : 'Từ chối'),
      })
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setReviewing(null)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Duyệt Quiz</h1>
        <p className="mt-1 text-sm text-slate-500">Phê duyệt quiz công khai trước khi học sinh làm bài</p>
      </div>

      <div className="space-y-4">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-100 bg-white p-5"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800">{q.title}</p>
                <p className="mt-1 text-sm text-slate-500">{q.description}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {q.time} phút · {q.maxAttempts} lần · GV: {q.creatorName}
                </p>
              </div>
            </div>

            <textarea
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Ghi chú duyệt (tuỳ chọn)..."
              value={notes[q.id] || ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [q.id]: e.target.value }))}
            />

            <div className="mt-3 flex gap-2">
              <Button loading={reviewing === q.id} onClick={() => review(q.id, true)}>
                Duyệt
              </Button>
              <Button
                variant="danger"
                loading={reviewing === q.id}
                onClick={() => review(q.id, false)}
              >
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
