import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizApi } from '../../api/quiz.api'
import { Button } from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/Input'
import { getErrorMessage } from '../../utils/helpers'

export default function CreateQuizPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    time: 30,
    maxAttempt: 3,
    allowAiReview: false,
    questions: [
      {
        questionText: '',
        type: 'SINGLE_CHOICE',
        point: 1,
        order: 1,
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ],
      },
    ],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await quizApi.create(form)
      navigate('/teacher/quizzes', { replace: true })
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="fade-in-up mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Tạo Quiz</h1>
      <Input
        label="Tiêu đề"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
      />
      <Textarea
        label="Mô tả"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Thời gian (phút)"
          type="number"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: Number(e.target.value) }))}
        />
        <Input
          label="Số lần làm"
          type="number"
          value={form.maxAttempt}
          onChange={(e) => setForm((f) => ({ ...f, maxAttempt: Number(e.target.value) }))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.allowAiReview}
          onChange={(e) => setForm((f) => ({ ...f, allowAiReview: e.target.checked }))}
        />
        Cho phép AI Review
      </label>

      <div className="rounded-xl border border-border p-4">
        <h3 className="font-semibold">Câu hỏi 1</h3>
        <Input
          className="mt-2"
          placeholder="Nội dung câu hỏi"
          value={form.questions[0].questionText}
          onChange={(e) => {
            const qs = [...form.questions]
            qs[0] = { ...qs[0], questionText: e.target.value }
            setForm((f) => ({ ...f, questions: qs }))
          }}
        />
        {form.questions[0].options.map((opt, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <input
              type="radio"
              name="correct"
              checked={opt.isCorrect}
              onChange={() => {
                const qs = [...form.questions]
                qs[0].options = qs[0].options.map((o, j) => ({
                  ...o,
                  isCorrect: j === i,
                }))
                setForm((f) => ({ ...f, questions: qs }))
              }}
            />
            <input
              className="flex-1 rounded border border-border px-2 py-1 text-sm"
              placeholder={`Đáp án ${i + 1}`}
              value={opt.text}
              onChange={(e) => {
                const qs = [...form.questions]
                qs[0].options[i].text = e.target.value
                setForm((f) => ({ ...f, questions: qs }))
              }}
            />
          </div>
        ))}
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Tạo quiz
      </Button>
    </form>
  )
}
