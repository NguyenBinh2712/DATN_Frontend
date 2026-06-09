import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, PlusCircle } from 'lucide-react'
import { quizApi } from '../../api/quiz.api'
import QuizCard from '../../components/quiz/QuizCard'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage, unwrapList } from '../../utils/helpers'

export default function TeacherQuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
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
    if (!window.confirm('Kích hoạt quiz này cho nhóm?')) return
    try {
      await quizApi.activate(quizId)
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
            <ClipboardList className="text-violet-600" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quiz của tôi</h1>
            <p className="text-sm text-slate-500">Quản lý, kích hoạt và xem bài nộp</p>
          </div>
        </div>
        <Link to="/teacher/quizzes/create">
          <Button>
            <PlusCircle size={16} /> Tạo quiz
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {quizzes.map((q) => (
          <QuizCard
            key={q.id}
            quiz={q}
            showStatus
            actions={
              <div className="flex flex-wrap gap-2">
                {q.status === 'GROUP' && (
                  <Button className="!py-1 !text-xs" onClick={() => activate(q.id)}>
                    Kích hoạt
                  </Button>
                )}
                {q.status === 'ACTIVE' && (
                  <Link to={`/teacher/quizzes/${q.id}/submissions`}>
                    <Button variant="secondary" className="!py-1 !text-xs">
                      Bài nộp
                    </Button>
                  </Link>
                )}
                {q.status === 'PENDING' && (
                  <span className="text-xs text-amber-600">Đang chờ admin duyệt</span>
                )}
              </div>
            }
          />
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
          <p className="font-medium text-slate-500">Chưa có quiz nào</p>
          <Link to="/teacher/quizzes/create" className="mt-3 inline-block text-indigo-600 hover:underline">
            Tạo quiz đầu tiên
          </Link>
        </div>
      )}
    </div>
  )
}
