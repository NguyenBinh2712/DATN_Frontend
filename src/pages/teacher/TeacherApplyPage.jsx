import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { teacherApi } from '../../api/teacher.api'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

const schema = z.object({
  reason: z.string().min(10, 'Lý do tối thiểu 10 ký tự'),
})

export default function TeacherApplyPage() {
  const { isTeacher } = useAuth()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState({
    idCardFront: null,
    idCardBack: null,
    cv: null,
    degrees: [],
  })
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    teacherApi
      .getMyApplication()
      .then(({ data }) => setApplication(data.result))
      .catch(() => setApplication(null))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (values) => {
    setError('')
    setSubmitting(true)
    try {
      const { data } = await teacherApi.apply(values, files)
      setApplication(data.result)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (isTeacher) {
    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h1 className="text-xl font-bold text-emerald-600">Bạn đã là giáo viên</h1>
        <p className="mt-2 text-muted">Tài khoản của bạn đã được xác minh giáo viên.</p>
      </div>
    )
  }

  if (application) {
    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h1 className="text-xl font-bold">Đơn đăng ký giáo viên</h1>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Trạng thái:</span>{' '}
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
              {application.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Ngày nộp:</span> {formatDateTime(application.appliedAt)}
          </p>
          <p>
            <span className="font-medium">Lý do:</span> {application.reason}
          </p>
          {application.reviewNote && (
            <p>
              <span className="font-medium">Ghi chú:</span> {application.reviewNote}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h1 className="text-xl font-bold">Đăng ký làm giáo viên</h1>
      <p className="mt-1 text-sm text-muted">Điền form và upload tài liệu đính kèm</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}
        <Textarea
          label="Lý do đăng ký *"
          error={errors.reason?.message}
          {...register('reason')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">CMND mặt trước</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles((f) => ({ ...f, idCardFront: e.target.files[0] }))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">CMND mặt sau</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles((f) => ({ ...f, idCardBack: e.target.files[0] }))}
              className="text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">CV</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => setFiles((f) => ({ ...f, cv: e.target.files[0] }))}
            className="text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bằng cấp (nhiều file)</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) =>
              setFiles((f) => ({ ...f, degrees: Array.from(e.target.files) }))
            }
            className="text-sm"
          />
        </div>
        <Button type="submit" loading={submitting}>
          Nộp đơn
        </Button>
      </form>
    </div>
  )
}
