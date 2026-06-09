import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import AiReviewPanel from '../../components/quiz/AiReviewPanel'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'
import { parseDateTime, sessionKey } from '../../utils/quizHelpers'

function answersToPayload(answersMap) {
  return Object.values(answersMap).filter((a) => a?.questionId)
}

export default function QuizTakePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [attemptId, setAttemptId] = useState(null)
  const [deadline, setDeadline] = useState(null)
  const [allowAiReview, setAllowAiReview] = useState(false)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [result, setResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReview, setAiReview] = useState(null)


  const clearSession = useCallback(() => {
    sessionStorage.removeItem(sessionKey(id, 'active'))
    if (attemptId) sessionStorage.removeItem(sessionKey(id, `answers-${attemptId}`))
  }, [id, attemptId])

  const applyStartPayload = useCallback((payload) => {
    setAttemptId(payload.attemptId)
    setQuiz(payload.quiz)
    setAllowAiReview(!!payload.quiz?.allowAiReview)
    setDeadline(parseDateTime(payload.serverDeadline))

    const saved = sessionStorage.getItem(sessionKey(id, `answers-${payload.attemptId}`))
    if (saved) {
      try {
        setAnswers(JSON.parse(saved))
      } catch {
        setAnswers({})
      }
    } else {
      setAnswers({})
    }

    sessionStorage.setItem(sessionKey(id, 'active'), JSON.stringify(payload))
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      setLoadError('')
      setResult(null)
      setAiReview(null)

      const cached = sessionStorage.getItem(sessionKey(id, 'active'))
      if (cached) {
        try {
          const payload = JSON.parse(cached)
          if (payload.attemptId && payload.quiz) {
            applyStartPayload(payload)
            setLoading(false)
            return
          }
        } catch {
          sessionStorage.removeItem(sessionKey(id, 'active'))
        }
      }

      try {
        const { data: attData } = await quizApi.getMyAttempts(id)
        if (cancelled) return

        const attempts = attData.result || []
        const inProgress = attempts.find((a) => a.status === 'IN_PROGRESS')

        if (inProgress) {
          const resume = window.confirm(
            'Bạn có bài đang làm dở nhưng không còn dữ liệu phiên. Nộp bài hiện tại (có thể trống) để bắt đầu lại?',
          )
          if (!resume) {
            navigate(`/quizzes/${id}/attempts`)
            return
          }
          await quizApi.submit(inProgress.attemptId, [])
        }

        const { data } = await quizApi.start(id)
        if (cancelled) return
        applyStartPayload(data.result)
      } catch (err) {
        if (!cancelled) {
          const msg = getErrorMessage(err)
          setLoadError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [id, navigate, applyStartPayload])

  useEffect(() => {
    if (!attemptId || result) return
    sessionStorage.setItem(sessionKey(id, `answers-${attemptId}`), JSON.stringify(answers))
  }, [answers, attemptId, id, result])

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittingRef.current || !attemptId) return
      submittingRef.current = true
      setSubmitting(true)
      try {
        const { data } = await quizApi.submit(attemptId, answersToPayload(answers))
        setResult(data.result)
        clearSession()
      } catch (err) {
        if (!auto) alert(getErrorMessage(err))
      } finally {
        submittingRef.current = false
        setSubmitting(false)
      }
    },
    [attemptId, answers, clearSession],
  )

  useEffect(() => {
    if (!deadline || result) return
    const tick = () => {
      const left = Math.max(0, deadline.getTime() - Date.now())
      setTimeLeft(Math.ceil(left / 1000))
      if (left <= 0) handleSubmit(true)
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [deadline, handleSubmit, result])

  const requestAiReview = async () => {
    const aid = result?.attemptId || attemptId
    if (!aid) return
    setAiLoading(true)
    try {
      const { data } = await quizApi.aiReview(aid)
      setAiReview(data.result)
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setAiLoading(false)
    }
  }

  const toggleOption = (questionId, index, multi) => {
    setAnswers((prev) => {
      const cur = prev[questionId]?.selectedOptionIndexes || []
      let next
      if (multi) {
        next = cur.includes(index) ? cur.filter((i) => i !== index) : [...cur, index]
      } else {
        next = [index]
      }
      return {
        ...prev,
        [questionId]: { ...prev[questionId], questionId, selectedOptionIndexes: next },
      }
    })
  }

  if (loading) return <LoadingSpinner />

  if (loadError) {
    return (
      <div className="fade-in-up mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{loadError}</p>
        <Link to="/quizzes" className="mt-4 inline-block text-primary hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  if (!quiz) return null

  if (result) {
    return (
      <div className="fade-in-up mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6" style={{ boxShadow: '0 4px 24px rgba(99,102,241,0.07)' }}>
          <h1 className="text-xl font-bold text-slate-800">Kết quả bài làm</h1>
          <p className="mt-3 text-lg">
            Điểm:{' '}
            <strong className="text-indigo-600">
              {result.score} / {result.totalPoints}
            </strong>{' '}
            ({result.scorePercent}%)
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={`/quizzes/${id}/attempts/${result.attemptId}`}>
              <Button variant="secondary">Xem chi tiết</Button>
            </Link>
            <Link to={`/quizzes/${id}/attempts`}>
              <Button variant="secondary">Lịch sử</Button>
            </Link>
            <Link to="/quizzes">
              <Button variant="ghost">Danh sách quiz</Button>
            </Link>
          </div>
        </div>

        {(allowAiReview || result.aiReview) && !aiReview && (
          <Button loading={aiLoading} onClick={requestAiReview} className="w-full">
            Yêu cầu AI Review
          </Button>
        )}

        {aiReview && <AiReviewPanel review={aiReview} />}
      </div>
    )
  }

  const mins = timeLeft != null ? Math.floor(timeLeft / 60) : '--'
  const secs = timeLeft != null ? String(timeLeft % 60).padStart(2, '0') : '--'

  return (
    <div className="fade-in-up mx-auto max-w-2xl space-y-4 pb-8">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-md backdrop-blur">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-800">{quiz.title}</h1>
          <p className="truncate text-sm text-slate-500">{quiz.description}</p>
        </div>
        <div
          className={`shrink-0 rounded-xl px-3 py-2 font-mono text-lg font-bold ${
            timeLeft != null && timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {mins}:{secs}
        </div>
      </div>

      {quiz.questions?.map((q, qi) => (
        <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5" style={{ boxShadow: '0 2px 12px rgba(99,102,241,0.05)' }}>
          <p className="font-medium text-slate-800">
            {qi + 1}. {q.questionText}{' '}
            <span className="text-xs text-slate-400">({q.points ?? q.point} điểm)</span>
          </p>

          {(q.type === 'SINGLE_CHOICE' ||
            q.type === 'MULTIPLE_CHOICE' ||
            q.type === 'TRUE_FALSE') && (
            <div className="mt-3 space-y-2">
              {q.options?.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    answers[q.id]?.selectedOptionIndexes?.includes(oi)
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type={q.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                    name={q.id}
                    checked={answers[q.id]?.selectedOptionIndexes?.includes(oi)}
                    onChange={() => toggleOption(q.id, oi, q.type === 'MULTIPLE_CHOICE')}
                  />
                  <span className="text-sm text-slate-700">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'SHORT_TEXT' && (
            <textarea
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              rows={3}
              placeholder="Nhập câu trả lời..."
              value={answers[q.id]?.textAnswer || ''}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [q.id]: { questionId: q.id, textAnswer: e.target.value },
                }))
              }
            />
          )}
        </div>
      ))}

      <Button className="w-full" loading={submitting} onClick={() => handleSubmit(false)}>
        Nộp bài
      </Button>
    </div>
  )
}
