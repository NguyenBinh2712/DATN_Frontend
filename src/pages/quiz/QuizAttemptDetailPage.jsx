import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

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
      <p className="text-muted">
        Không tìm thấy bài làm.{' '}
        <Link to={`/quizzes/${quizId}/attempts`} className="text-primary">
          Quay lại
        </Link>
      </p>
    )
  }

  const canRequestAi = attempt.status !== 'IN_PROGRESS' && !aiReview

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link to={`/quizzes/${quizId}/attempts`} className="text-sm text-primary hover:underline">
          ← Lịch sử
        </Link>
        <h1 className="text-xl font-bold">Chi tiết lần {attempt.attemptNumber}</h1>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p>
          Điểm: <strong>{attempt.score}</strong> / {attempt.totalPoints} ({attempt.scorePercent}
          %)
        </p>
        <p className="text-sm text-muted">Nộp lúc: {formatDateTime(attempt.submittedAt)}</p>
        {attempt.canRetake && (
          <Link to={`/quizzes/${quizId}/take`} className="mt-2 inline-block">
            <Button className="!py-1 !text-xs">Làm lại</Button>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Câu trả lời</h2>
        {attempt.answers?.map((ans, i) => (
          <div
            key={ans.questionId}
            className={`rounded-xl border p-4 ${
              ans.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-white'
            }`}
          >
            <p className="font-medium">
              {i + 1}. {ans.questionText}
            </p>
            <p className="mt-2 text-sm">
              {ans.textAnswer ||
                (ans.selectedOptionIndexes?.length
                  ? `Lựa chọn: ${ans.selectedOptionIndexes.map((x) => x + 1).join(', ')}`
                  : 'Không trả lời')}
            </p>
            <p className="mt-1 text-sm text-muted">
              {ans.isCorrect ? '✓ Đúng' : '✗ Sai'} · {ans.pointsEarned}/{ans.maxPoints} điểm
            </p>
            {ans.explanation && (
              <p className="mt-2 text-sm text-slate-600">Giải thích: {ans.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {canRequestAi && (
        <Button loading={aiLoading} onClick={requestAiReview}>
          {attempt.aiReview ? 'Tải lại AI Review' : 'Yêu cầu AI Review'}
        </Button>
      )}

      {aiError && <p className="text-sm text-red-600">{aiError}</p>}

      {aiReview && <AiReviewPanel review={aiReview} />}
    </div>
  )
}

function AiReviewPanel({ review }) {
  const weaknesses = Array.isArray(review.weaknessAreas)
    ? review.weaknessAreas
    : review.weaknessAreas
      ? [review.weaknessAreas]
      : []

  return (
    <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <h2 className="font-semibold text-primary">AI Review</h2>
      {review.overallAnalysis && (
        <div>
          <p className="text-sm font-medium">Tổng quan</p>
          <p className="mt-1 text-sm">{review.overallAnalysis}</p>
        </div>
      )}
      {weaknesses.length > 0 && (
        <div>
          <p className="text-sm font-medium">Điểm yếu</p>
          <ul className="mt-1 list-inside list-disc text-sm">
            {weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {review.studyRoadmap && (
        <div>
          <p className="text-sm font-medium">Lộ trình học</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{review.studyRoadmap}</p>
        </div>
      )}
      {review.perQuestion?.map((q) => (
        <div key={q.questionIndex} className="rounded-lg bg-white p-3 text-sm">
          <p className="font-medium">
            Câu {q.questionIndex + 1}: {q.questionText}
          </p>
          <p className="mt-1">{q.analysis}</p>
          {q.correctApproach && (
            <p className="mt-1 text-muted">Hướng làm đúng: {q.correctApproach}</p>
          )}
        </div>
      ))}
      {review.generatedAt && (
        <p className="text-xs text-muted">Tạo lúc: {formatDateTime(review.generatedAt)}</p>
      )}
    </div>
  )
}
