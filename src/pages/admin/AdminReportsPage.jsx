import { useEffect, useState } from 'react'
import { postApi } from '../../api/post.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

export default function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await postApi.getPendingReports()
      setReports(data.result || [])
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handle = async (reportId, status) => {
    try {
      await postApi.handleReport(reportId, status)
      await load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Báo cáo bài viết</h1>
        <p className="mt-1 text-sm text-slate-500">Xử lý các báo cáo vi phạm nội dung</p>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 text-slate-600 transition-all duration-200 hover:border-indigo-200"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <p className="font-medium text-slate-800">
              Report #{r.id} — Post #{r.postId}
            </p>
            <p className="mt-1 text-sm">
              Lý do: <span className="text-amber-600">{r.reason}</span>
            </p>
            {r.description && <p className="mt-1 text-sm">{r.description}</p>}
            <p className="mt-2 text-xs text-slate-500">{formatDateTime(r.reportedAt)}</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => handle(r.id, 'APPROVED')}>Duyệt (gỡ bài)</Button>
              <Button variant="secondary" onClick={() => handle(r.id, 'REJECTED')}>
                Từ chối
              </Button>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 text-center">
            <div className="mb-3 text-4xl">📭</div>
            <p className="font-medium text-slate-500">Không có báo cáo đang chờ</p>
          </div>
        )}
      </div>
    </div>
  )
}
