import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import { Textarea } from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

export default function TeacherSubmissionDetailPage() {
  const { id: quizId, attemptId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedbackDraft, setFeedbackDraft] = useState({})
  const [submitting, setSubmitting] = useState(null)

  const load = () => {
    quizApi
      .getSubmissionDetail(attemptId)
      .then(({ data }) => setDetail(data.result))
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [attemptId])

  const sendFeedback = async (questionId) => {
    const content = feedbackDraft[questionId]?.trim()
    if (!content) return
    setSubmitting(questionId)
    try {
      await quizApi.addFeedback(attemptId, { questionId, content })
      setFeedbackDraft((d) => ({ ...d, [questionId]: '' }))
      load()
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!detail) return null

  const feedbackByQuestion = (detail.feedbacks || []).reduce((acc, f) => {
    if (!acc[f.questionId]) acc[f.questionId] = []
    acc[f.questionId].push(f)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link
          to={`/teacher/quizzes/${quizId}/submissions`}
          className="text-sm text-primary hover:underline"
        >
          ← Bài nộp
        </Link>
        <h1 className="text-xl font-bold">Chi tiết bài nộp</h1>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="font-semibold">{detail.studentName}</p>
        <p className="text-sm text-muted">
          Lần {detail.attemptNumber} · {detail.scorePercent}% · {formatDateTime(detail.submittedAt)}
        </p>
      </div>

      <div className="space-y-4">
        {detail.answers?.map((ans, i) => (
          <div key={ans.questionId} className="rounded-xl border border-border bg-white p-4">
            <p className="font-medium">
              {i + 1}. {ans.questionText}
            </p>
            <p className="mt-2 text-sm">
              Trả lời:{' '}
              {ans.textAnswer ||
                (ans.selectedOptionIndexes?.length
                  ? ans.selectedOptionIndexes.map((x) => x + 1).join(', ')
                  : '—')}
            </p>
            <p className={`mt-1 text-sm ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
              {ans.isCorrect ? 'Đúng' : 'Sai'} · {ans.pointsEarned}/{ans.maxPoints}
            </p>

            {(feedbackByQuestion[ans.questionId] || []).map((f) => (
              <div key={f.id} className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-medium text-primary">{f.teacherName}</p>
                <p className="mt-1">{f.content}</p>
                <p className="mt-1 text-xs text-muted">{formatDateTime(f.createdAt)}</p>
              </div>
            ))}

            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Nhận xét của giáo viên..."
                value={feedbackDraft[ans.questionId] || ''}
                onChange={(e) =>
                  setFeedbackDraft((d) => ({ ...d, [ans.questionId]: e.target.value }))
                }
                className="min-h-[80px]"
              />
              <Button
                className="!py-1 !text-xs"
                loading={submitting === ans.questionId}
                onClick={() => sendFeedback(ans.questionId)}
              >
                Gửi feedback
              </Button>
            </div>
          </div>
        ))}
        {(!detail.answers || detail.answers.length === 0) && (
          <p className="text-muted">Không có chi tiết câu trả lời</p>
        )}
      </div>
    </div>
  )
}
