import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../common/Button'
import { Input, Textarea } from '../common/Input'
import { QUESTION_TYPES, buildDefaultQuestion } from '../../utils/quizHelpers'

export default function QuestionFormList({ questions, onChange }) {
  const updateQuestion = (index, patch) => {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  const updateOption = (qIndex, oIndex, patch) => {
    onChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q
        return {
          ...q,
          options: q.options.map((o, j) => (j === oIndex ? { ...o, ...patch } : o)),
        }
      }),
    )
  }

  const addQuestion = () => {
    onChange([...questions, buildDefaultQuestion(questions.length + 1)])
  }

  const removeQuestion = (index) => {
    if (questions.length <= 1) return
    onChange(questions.filter((_, i) => i !== index))
  }

  const addOption = (qIndex) => {
    onChange(
      questions.map((q, i) =>
        i === qIndex
          ? { ...q, options: [...(q.options || []), { text: '', isCorrect: false }] }
          : q,
      ),
    )
  }

  const removeOption = (qIndex, oIndex) => {
    onChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q
        const next = q.options.filter((_, j) => j !== oIndex)
        if (!next.some((o) => o.isCorrect) && next[0]) next[0].isCorrect = true
        return { ...q, options: next }
      }),
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div
          key={qi}
          className="rounded-2xl border border-slate-200 bg-white p-5"
          style={{ boxShadow: '0 2px 12px rgba(99,102,241,0.05)' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Câu {qi + 1}</h3>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qi)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <Textarea
            label="Nội dung câu hỏi"
            value={q.questionText}
            onChange={(e) => updateQuestion(qi, { questionText: e.target.value })}
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-700">Loại câu hỏi</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                value={q.type}
                onChange={(e) => {
                  const type = e.target.value
                  if (type === 'TRUE_FALSE') {
                    updateQuestion(qi, {
                      type,
                      options: [{ text: 'Đúng', isCorrect: true }, { text: 'Sai', isCorrect: false }],
                    })
                  } else if (type === 'SHORT_TEXT') {
                    updateQuestion(qi, { type, options: [] })
                  } else {
                    updateQuestion(qi, {
                      type,
                      options: q.options?.length
                        ? q.options
                        : [
                            { text: '', isCorrect: true },
                            { text: '', isCorrect: false },
                          ],
                    })
                  }
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Điểm"
              type="number"
              min={0}
              step={0.5}
              value={q.point}
              onChange={(e) => updateQuestion(qi, { point: Number(e.target.value) })}
            />
          </div>

          <div className="mt-3">
            <Input
              label="Giải thích đáp án (tuỳ chọn)"
              value={q.explanation || ''}
              onChange={(e) => updateQuestion(qi, { explanation: e.target.value })}
            />
          </div>

          {q.type === 'TRUE_FALSE' && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Đáp án đúng</p>
              {['Đúng', 'Sai'].map((label, oi) => (
                <label key={label} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`tf-${qi}`}
                    checked={!!q.options?.[oi]?.isCorrect}
                    onChange={() =>
                      updateQuestion(qi, {
                        options: [
                          { text: 'Đúng', isCorrect: oi === 0 },
                          { text: 'Sai', isCorrect: oi === 1 },
                        ],
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          )}

          {(q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Các lựa chọn</p>
              {q.options?.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type={q.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                    name={q.type === 'SINGLE_CHOICE' ? `correct-${qi}` : undefined}
                    checked={!!opt.isCorrect}
                    onChange={() => {
                      if (q.type === 'MULTIPLE_CHOICE') {
                        updateOption(qi, oi, { isCorrect: !opt.isCorrect })
                      } else {
                        updateQuestion(qi, {
                          options: q.options.map((o, j) => ({ ...o, isCorrect: j === oi })),
                        })
                      }
                    }}
                  />
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder={`Lựa chọn ${oi + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qi, oi, { text: e.target.value })}
                  />
                  {q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qi, oi)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" className="!py-1 !text-xs" onClick={() => addOption(qi)}>
                Thêm lựa chọn
              </Button>
            </div>
          )}

          {q.type === 'SHORT_TEXT' && (
            <p className="mt-3 text-sm text-slate-500">Câu tự luận — giáo viên chấm thủ công.</p>
          )}
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addQuestion}>
        <Plus size={16} /> Thêm câu hỏi
      </Button>
    </div>
  )
}
