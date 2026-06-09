import { formatDateTime } from '../../utils/helpers'

export default function AiReviewPanel({ review }) {
  if (!review) return null

  const weaknesses = Array.isArray(review.weaknessAreas)
    ? review.weaknessAreas
    : review.weaknessAreas
      ? [review.weaknessAreas]
      : []

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
      <h2 className="font-semibold text-indigo-700">AI Review</h2>

      {review.overallAnalysis && (
        <div>
          <p className="text-sm font-semibold text-slate-700">Tổng quan</p>
          <p className="mt-1 text-sm text-slate-600">{review.overallAnalysis}</p>
        </div>
      )}

      {weaknesses.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700">Điểm yếu</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
            {weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {review.studyRoadmap && (
        <div>
          <p className="text-sm font-semibold text-slate-700">Lộ trình học</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{review.studyRoadmap}</p>
        </div>
      )}

      {review.perQuestion?.map((q) => (
        <div key={q.questionIndex} className="rounded-xl border border-white bg-white p-4 text-sm">
          <p className="font-medium text-slate-800">
            Câu {(q.questionIndex ?? 0) + 1}: {q.questionText}
          </p>
          {q.analysis && <p className="mt-2 text-slate-600">{q.analysis}</p>}
          {q.correctApproach && (
            <p className="mt-2 text-slate-500">Hướng làm đúng: {q.correctApproach}</p>
          )}
        </div>
      ))}

      {review.generatedAt && (
        <p className="text-xs text-slate-400">Tạo lúc: {formatDateTime(review.generatedAt)}</p>
      )}
    </div>
  )
}
