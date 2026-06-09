import { useEffect, useState } from 'react'
import { quizApi } from '../../api/quiz.api'
import QuizCard from '../../components/quiz/QuizCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage, unwrapList } from '../../utils/helpers'

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizApi
      .getPublic(0, 20)
      .then(({ data }) => setQuizzes(unwrapList(data)))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quiz công khai</h1>
        <p className="mt-1 text-sm text-slate-500">Các bài kiểm tra đã được duyệt và đang mở</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {quizzes.map((q) => (
          <QuizCard
            key={q.id}
            quiz={q}
            showCreator
            takeLink={`/quizzes/${q.id}/take`}
            attemptsLink={`/quizzes/${q.id}/attempts`}
          />
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <div className="mb-3 text-4xl">📝</div>
          <p className="font-medium text-slate-500">Chưa có quiz công khai</p>
        </div>
      )}
    </div>
  )
}
