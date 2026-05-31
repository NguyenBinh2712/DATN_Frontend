import { useEffect, useState } from 'react'
import { teacherApi } from '../../api/teacher.api'
import { Button } from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

export default function AdminTeachersPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewNote, setReviewNote] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await teacherApi.getPendingApplications()
      setApplications(data.result || [])
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const review = async (id, status) => {
    try {
      await teacherApi.reviewApplication(id, {
        status,
        reviewNote: reviewNote[id] || '',
      })
      await load()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Đơn đăng ký giáo viên</h1>
      <div className="mt-6 space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm"
          >
            <p className="font-medium text-slate-800">
              #{app.id} — {app.applicantEmail}
            </p>
            <p className="mt-2 text-sm">{app.reason}</p>
            <p className="mt-1 text-xs text-slate-500">{formatDateTime(app.appliedAt)}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {app.idCardFrontUrl && (
                <a href={app.idCardFrontUrl} target="_blank" rel="noreferrer" className="text-primary">
                  CMND trước
                </a>
              )}
              {app.idCardBackUrl && (
                <a href={app.idCardBackUrl} target="_blank" rel="noreferrer" className="text-primary">
                  CMND sau
                </a>
              )}
              {app.cvUrl && (
                <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-primary">
                  CV
                </a>
              )}
            </div>
            <textarea
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Ghi chú duyệt..."
              value={reviewNote[app.id] || ''}
              onChange={(e) =>
                setReviewNote((prev) => ({ ...prev, [app.id]: e.target.value }))
              }
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={() => review(app.id, 'APPROVED')}>Duyệt</Button>
              <Button variant="danger" onClick={() => review(app.id, 'REJECTED')}>
                Từ chối
              </Button>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="text-slate-500">Không có đơn chờ duyệt</p>
        )}
      </div>
    </div>
  )
}
