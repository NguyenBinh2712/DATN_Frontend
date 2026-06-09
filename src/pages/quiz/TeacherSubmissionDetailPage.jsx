import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { AttemptStatusBadge } from '../../components/quiz/QuizStatusBadge'
import { Button } from '../../components/common/Button'
import { Textarea } from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW } from '../../utils/quizHelpers'

const OVERALL_KEY = '__overall__'

export default function TeacherSubmissionDetailPage() {
  const { id: quizId, attemptId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedbackDraft, setFeedbackDraft] = useState({})
  const [submitting, setSubmitting] = useState(null)

  const load = () => {
    setLoading(true)
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
    const key = questionId ?? OVERALL_KEY
    const content = feedbackDraft[key]?.trim()
    if (!content) return
    setSubmitting(key)
    try {
      await quizApi.addFeedback(attemptId, { questionId, content })
      setFeedbackDraft((d) => ({ ...d, [key]: '' }))
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
    const key = f.questionId ?? OVERALL_KEY
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
    return acc
  }, {})

  return (
    <div className="fade-in-up mx-auto max-w-2xl space-y-4">
      <div>
        <Link
          to={`/teacher/quizzes/${quizId}/submissions`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Bài nộp
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">{detail.studentName}</h1>
          <AttemptStatusBadge status={detail.status} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
        <p className="text-lg">
          Điểm: <strong className="text-indigo-600">{detail.scorePercent}%</strong>
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Lần {detail.attemptNumber} · {formatDateTime(detail.submittedAt)}
        </p>
        {detail.aiReview && (
          <span className="mt-2 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
            Đã dùng AI Review
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="font-semibold text-slate-800">Nhận xét tổng thể</h2>
        {(feedbackByQuestion[OVERALL_KEY] || []).map((f) => (
          <div key={f.id} className="mt-3 rounded-xl bg-white p-3 text-sm">
            <p className="font-medium text-indigo-600">{f.teacherName}</p>
            <p className="mt-1 text-slate-600">{f.content}</p>
            <p className="mt-1 text-xs text-slate-400">{formatDateTime(f.createdAt)}</p>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          <Textarea
            placeholder="Góp ý chung cho bài làm..."
            value={feedbackDraft[OVERALL_KEY] || ''}
            onChange={(e) => setFeedbackDraft((d) => ({ ...d, [OVERALL_KEY]: e.target.value }))}
            className="min-h-[80px]"
          />
          <Button
            className="!py-1 !text-xs"
            loading={submitting === OVERALL_KEY}
            onClick={() => sendFeedback(null)}
          >
            Gửi nhận xét tổng
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-slate-800">Chi tiết từng câu</h2>
        {detail.answers?.map((ans, i) => (
          <div
            key={ans.questionId}
            className="rounded-2xl border border-slate-100 bg-white p-5"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <p className="font-medium text-slate-800">
              {i + 1}. {ans.questionText}
            </p>
            <p className="mt-2 text-sm text-slate-600">
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
              <div key={f.id} className="mt-3 rounded-xl bg-indigo-50/60 p-3 text-sm">
                <p className="font-medium text-indigo-600">{f.teacherName}</p>
                <p className="mt-1 text-slate-600">{f.content}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(f.createdAt)}</p>
              </div>
            ))}

            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Nhận xét câu này..."
                value={feedbackDraft[ans.questionId] || ''}
                onChange={(e) =>
                  setFeedbackDraft((d) => ({ ...d, [ans.questionId]: e.target.value }))
                }
                className="min-h-[72px]"
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
      </div>
    </div>
  )
}
