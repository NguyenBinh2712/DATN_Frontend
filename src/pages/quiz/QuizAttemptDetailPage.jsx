import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import AiReviewPanel from '../../components/quiz/AiReviewPanel'
import { AttemptStatusBadge } from '../../components/quiz/QuizStatusBadge'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'

export default function QuizAttemptDetailPage() {
  const { id: quizId, attemptId } = useParams()
  const [attempt, setAttempt] = useState(null)
  const [aiReview, setAiReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const loadAttempt = useCallback(async () => {
    const { data } = await quizApi.getMyAttempts(quizId)
    return (data.result || []).find((a) => String(a.attemptId) === String(attemptId)) || null
  }, [quizId, attemptId])

  useEffect(() => {
    loadAttempt()
      .then(async (found) => {
        setAttempt(found)
        if (found?.aiReview && found.status !== 'IN_PROGRESS') {
          try {
            const { data: aiData } = await quizApi.aiReview(attemptId)
            setAiReview(aiData.result)
          } catch (err) {
            setAiError(getErrorMessage(err))
          }
        }
      })
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [loadAttempt, attemptId])

  const requestAiReview = async () => {
    if (attempt?.status === 'IN_PROGRESS') {
      alert('Cần nộp bài trước khi dùng AI Review')
      return
    }
    setAiLoading(true)
    setAiError('')
    try {
      const { data } = await quizApi.aiReview(attemptId)
      setAiReview(data.result)
      setAttempt((a) => (a ? { ...a, aiReview: true } : a))
    } catch (err) {
      const msg = getErrorMessage(err)
      setAiError(msg)
      alert(msg)
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!attempt) {
    return (
      <p className="text-slate-500">
        Không tìm thấy bài làm.{' '}
        <Link to={`/quizzes/${quizId}/attempts`} className="text-indigo-600 hover:underline">
          Quay lại
        </Link>
      </p>
    )
  }

  const canRequestAi = attempt.status !== 'IN_PROGRESS' && !aiReview

  return (
    <div className="fade-in-up mx-auto max-w-2xl space-y-4">
      <div>
        <Link to={`/quizzes/${quizId}/attempts`} className="text-sm text-indigo-600 hover:underline">
          ← Lịch sử
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">Lần {attempt.attemptNumber}</h1>
          <AttemptStatusBadge status={attempt.status} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
        <p className="text-lg text-slate-800">
          Điểm:{' '}
          <strong className="text-indigo-600">
            {attempt.score} / {attempt.totalPoints}
          </strong>{' '}
          ({attempt.scorePercent}%)
        </p>
        <p className="mt-1 text-sm text-slate-500">Nộp lúc: {formatDateTime(attempt.submittedAt)}</p>
        {attempt.canRetake && (
          <Link to={`/quizzes/${quizId}/take`} className="mt-3 inline-block">
            <Button className="!py-1 !text-xs">Làm lại</Button>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-slate-800">Câu trả lời</h2>
        {attempt.answers?.map((ans, i) => (
          <div
            key={ans.questionId}
            className={`rounded-2xl border p-4 ${
              ans.isCorrect ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'
            }`}
          >
            <p className="font-medium text-slate-800">
              {i + 1}. {ans.questionText}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {ans.textAnswer ||
                (ans.selectedOptionIndexes?.length
                  ? `Lựa chọn: ${ans.selectedOptionIndexes.map((x) => x + 1).join(', ')}`
                  : 'Không trả lời')}
            </p>
            <p className={`mt-1 text-sm ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
              {ans.isCorrect ? '✓ Đúng' : '✗ Sai'} · {ans.pointsEarned}/{ans.maxPoints} điểm
            </p>
            {ans.explanation && (
              <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm text-slate-600">
                Giải thích: {ans.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {canRequestAi && (
        <Button loading={aiLoading} onClick={requestAiReview}>
          Yêu cầu AI Review
        </Button>
      )}

      {aiError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{aiError}</p>
      )}

      {aiReview && <AiReviewPanel review={aiReview} />}
    </div>
  )
}
