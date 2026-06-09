import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import QuestionFormList from '../../components/quiz/QuestionFormList'
import { Button } from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/Input'
import { getErrorMessage } from '../../utils/helpers'
import { CARD_SHADOW, buildDefaultQuestion, fromDatetimeLocalValue, normalizeQuestionForSubmit } from '../../utils/quizHelpers'

export default function CreateQuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const groupId = searchParams.get('groupId')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    groupId: groupId ? Number(groupId) : null,
    title: '',
    description: '',
    time: 30,
    maxAttempt: 3,
    allowAiReview: false,
    startAt: '',
    endAt: '',
    questions: [buildDefaultQuestion(1)],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      groupId: form.groupId || undefined,
      title: form.title.trim(),
      description: form.description.trim(),
      time: Number(form.time),
      maxAttempt: Number(form.maxAttempt),
      allowAiReview: form.allowAiReview,
      startAt: fromDatetimeLocalValue(form.startAt),
      endAt: fromDatetimeLocalValue(form.endAt),
      questions: form.questions.map(normalizeQuestionForSubmit),
    }

    try {
      await quizApi.create(payload)
      navigate(groupId ? `/groups/${groupId}` : '/teacher/quizzes', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fade-in-up mx-auto max-w-3xl space-y-6"
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-6" style={{ boxShadow: CARD_SHADOW }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tạo Quiz</h1>
            <p className="mt-1 text-sm text-slate-500">
              {groupId
                ? 'Quiz nhóm — kích hoạt ngay sau khi tạo (không cần admin duyệt)'
                : 'Quiz công khai — cần admin duyệt trước khi mở'}
            </p>
          </div>
          <Link to={groupId ? `/groups/${groupId}` : '/teacher/quizzes'} className="text-sm text-indigo-600 hover:underline">
            Hủy
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <Input
            label="Tiêu đề *"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Textarea
            label="Mô tả"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Thời gian làm bài (phút) *"
              type="number"
              min={1}
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: Number(e.target.value) }))}
              required
            />
            <Input
              label="Số lần làm tối đa"
              type="number"
              min={1}
              value={form.maxAttempt}
              onChange={(e) => setForm((f) => ({ ...f, maxAttempt: Number(e.target.value) }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Thời gian mở (tuỳ chọn)"
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
            />
            <Input
              label="Thời gian đóng (tuỳ chọn)"
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.allowAiReview}
              onChange={(e) => setForm((f) => ({ ...f, allowAiReview: e.target.checked }))}
              className="rounded border-slate-300"
            />
            Cho phép học sinh dùng AI Review sau khi nộp
          </label>
        </div>
      </div>

      <QuestionFormList
        questions={form.questions}
        onChange={(questions) => setForm((f) => ({ ...f, questions }))}
      />

      <Button type="submit" loading={loading} className="w-full">
        {groupId ? 'Tạo quiz nhóm' : 'Gửi duyệt quiz công khai'}
      </Button>
    </form>
  )
}
