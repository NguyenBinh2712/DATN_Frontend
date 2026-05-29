import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

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

  const startLockRef = useRef(null)

  const applyStartPayload = (payload) => {
    setAttemptId(payload.attemptId)
    setQuiz(payload.quiz)
    setAllowAiReview(!!payload.quiz?.allowAiReview)
    setDeadline(new Date(payload.serverDeadline))
    sessionStorage.setItem(`quiz-active-${id}`, JSON.stringify(payload))
  }

  const tryStartQuiz = useCallback(async () => {
    const { data } = await quizApi.start(id)
    applyStartPayload(data.result)
  }, [id])

  useEffect(() => {
    let cancelled = false
    const cacheKey = `quiz-active-${id}`

    async function init() {
      setLoading(true)
      setLoadError('')

      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        try {
          applyStartPayload(JSON.parse(cached))
          setLoading(false)
          return
        } catch {
          sessionStorage.removeItem(cacheKey)
        }
      }

      try {
        const { data: attData } = await quizApi.getMyAttempts(id)
        if (cancelled) return

        const inProgress = (attData.result || []).find((a) => a.status === 'IN_PROGRESS')
        if (inProgress) {
          try {
            await tryStartQuiz()
            return
          } catch {
            const submitEmpty = window.confirm(
              'Bạn có bài làm đang dở (chưa nộp). Nộp bài trống để bắt đầu lần mới?',
            )
            if (!submitEmpty) {
              navigate(`/quizzes/${id}/attempts`)
              return
            }
            await quizApi.submit(inProgress.attemptId, [])
            if (cancelled) return
          }
        }

        await tryStartQuiz()
      } catch (err) {
        if (!cancelled) {
          const msg = getErrorMessage(err)
          setLoadError(msg)
          alert(msg)
          navigate('/quizzes')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (startLockRef.current !== id) {
      startLockRef.current = id
      init()
    }

    return () => {
      cancelled = true
    }
  }, [id, navigate, tryStartQuiz])

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittingRef.current || !attemptId) return
      submittingRef.current = true
      setSubmitting(true)
      try {
        const payload = Object.values(answers)
        const { data } = await quizApi.submit(attemptId, payload)
        setResult(data.result)
        sessionStorage.removeItem(`quiz-active-${id}`)
      } catch (err) {
        if (!auto) alert(getErrorMessage(err))
      } finally {
        submittingRef.current = false
        setSubmitting(false)
      }
    },
    [attemptId, answers, id],
  )

  useEffect(() => {
    if (!deadline || result) return
    const tick = () => {
      const left = Math.max(0, deadline.getTime() - Date.now())
      setTimeLeft(Math.ceil(left / 1000))
      if (left <= 0) handleSubmit(true)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [deadline, handleSubmit, result])

  const requestAiReview = async () => {
    if (!result?.attemptId && !attemptId) return
    const aid = result?.attemptId || attemptId
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
  if (loadError) return <p className="text-red-600">{loadError}</p>
  if (!quiz) return null

  if (result) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-border bg-white p-6">
        <h1 className="text-xl font-bold">Kết quả</h1>
        <p>
          Điểm: <strong>{result.score}</strong> / {result.totalPoints} ({result.scorePercent}%)
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to={`/quizzes/${id}/attempts`}>
            <Button variant="secondary">Lịch sử làm bài</Button>
          </Link>
          <Link to="/quizzes">
            <Button variant="secondary">Danh sách quiz</Button>
          </Link>
        </div>

        {(allowAiReview || result.aiReview) && !aiReview && (
          <Button loading={aiLoading} onClick={requestAiReview} className="w-full">
            Yêu cầu AI Review
          </Button>
        )}

        {aiReview && (
          <AiReviewBlock review={aiReview} />
        )}
      </div>
    )
  }

  const mins = timeLeft != null ? Math.floor(timeLeft / 60) : '--'
  const secs = timeLeft != null ? String(timeLeft % 60).padStart(2, '0') : '--'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-lg font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted">{quiz.description}</p>
        </div>
        <div
          className={`text-lg font-mono font-bold ${timeLeft != null && timeLeft < 60 ? 'text-red-500' : 'text-primary'}`}
        >
          {mins}:{secs}
        </div>
      </div>

      {quiz.questions?.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-border bg-white p-4">
          <p className="font-medium">
            {qi + 1}. {q.questionText}{' '}
            <span className="text-xs text-muted">({q.points} điểm)</span>
          </p>
          <div className="mt-3 space-y-2">
            {q.options?.map((opt, oi) => (
              <label
                key={oi}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-slate-50"
              >
                <input
                  type={q.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                  name={q.id}
                  checked={answers[q.id]?.selectedOptionIndexes?.includes(oi)}
                  onChange={() => toggleOption(q.id, oi, q.type === 'MULTIPLE_CHOICE')}
                />
                {opt.text}
              </label>
            ))}
          </div>
          {q.type === 'SHORT_TEXT' && (
            <input
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Nhập câu trả lời..."
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

function AiReviewBlock({ review }) {
  const weaknesses = Array.isArray(review.weaknessAreas)
    ? review.weaknessAreas
    : review.weaknessAreas
      ? [review.weaknessAreas]
      : []

  return (
    <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
      <h2 className="font-semibold text-primary">AI Review</h2>
      {review.overallAnalysis && <p>{review.overallAnalysis}</p>}
      {weaknesses.length > 0 && (
        <ul className="list-inside list-disc">
          {weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
      {review.studyRoadmap && (
        <p className="whitespace-pre-wrap text-muted">{review.studyRoadmap}</p>
      )}
      {review.perQuestion?.map((q) => (
        <div key={q.questionIndex} className="rounded-lg bg-white p-3">
          <p className="font-medium">
            Câu {q.questionIndex + 1}: {q.questionText}
          </p>
          <p className="mt-1">{q.analysis}</p>
        </div>
      ))}
    </div>
  )
}
