import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, GraduationCap, ImagePlus, Upload, X } from 'lucide-react'
import { teacherApi } from '../../api/teacher.api'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Textarea } from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'

const schema = z.object({
  reason: z.string().min(10, 'Lý do tối thiểu 10 ký tự'),
})

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'

function ImagePicker({ label, file, onChange, required = false }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleSelect = (selected) => {
    const next = selected?.[0]
    if (next) onChange(next)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && ' *'}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files)}
      />
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <img src={preview} alt={label} className="h-44 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/50 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-white"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-white"
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-600"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100">
            <ImagePlus size={22} className="text-indigo-500" />
          </div>
          <span className="text-sm font-medium">Chọn ảnh</span>
          <span className="text-xs text-slate-400">JPG, PNG — tối đa 10MB</span>
        </button>
      )}
      {file && <p className="mt-2 truncate text-xs text-slate-500">{file.name}</p>}
    </div>
  )
}

function FileDropZone({
  label,
  file,
  files,
  onChange,
  accept,
  hint,
  multiple = false,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const selectedFiles = multiple ? files || [] : file ? [file] : []

  const applyFiles = (list) => {
    const arr = Array.from(list || [])
    if (multiple) {
      onChange(arr)
    } else if (arr[0]) {
      onChange(arr[0])
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const clearFile = (index) => {
    if (multiple) {
      onChange(selectedFiles.filter((_, i) => i !== index))
    } else {
      onChange(null)
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => applyFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          applyFiles(e.dataTransfer.files)
        }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50/80'
            : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <Upload size={22} className="text-indigo-500" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Kéo thả file vào đây hoặc <span className="text-indigo-600">bấm để chọn</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="mt-3 space-y-2">
          {selectedFiles.map((f, index) => (
            <li
              key={`${f.name}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                <FileText size={16} className="text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{f.name}</p>
                <p className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile(index)
                }}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Xóa file"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatusCard({ children, className = '' }) {
  return (
    <div
      className={`fade-in-up rounded-2xl border border-slate-100 bg-white p-6 ${className}`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {children}
    </div>
  )
}

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
      <StatusCard>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
            <GraduationCap size={24} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-700">Bạn đã là giáo viên</h1>
            <p className="mt-2 text-sm text-slate-500">
              Tài khoản của bạn đã được xác minh giáo viên.
            </p>
          </div>
        </div>
      </StatusCard>
    )
  }

  if (application) {
    return (
      <StatusCard>
        <h1 className="text-xl font-bold text-slate-800">Đơn đăng ký giáo viên</h1>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-700">Trạng thái:</span>{' '}
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {application.status}
            </span>
          </p>
          <p>
            <span className="font-semibold text-slate-700">Ngày nộp:</span>{' '}
            {formatDateTime(application.appliedAt)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Lý do:</span> {application.reason}
          </p>
          {application.reviewNote && (
            <p>
              <span className="font-semibold text-slate-700">Ghi chú:</span> {application.reviewNote}
            </p>
          )}
        </div>
      </StatusCard>
    )
  }

  return (
    <div className="fade-in-up">
      <div
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div
          className="px-6 py-5"
          style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(168,85,247,0.06) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg,#667eea,#c84b9e)' }}
            >
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Đăng ký làm giáo viên</h1>
              <p className="text-sm text-slate-500">Điền thông tin và tải tài liệu xác minh</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {error && (
            <div className="fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <Textarea
            label="Lý do đăng ký *"
            error={errors.reason?.message}
            {...register('reason')}
          />

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">Ảnh CMND / CCCD</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImagePicker
                label="Mặt trước"
                file={files.idCardFront}
                onChange={(file) => setFiles((f) => ({ ...f, idCardFront: file }))}
              />
              <ImagePicker
                label="Mặt sau"
                file={files.idCardBack}
                onChange={(file) => setFiles((f) => ({ ...f, idCardBack: file }))}
              />
            </div>
          </div>

          <FileDropZone
            label="CV *"
            file={files.cv}
            onChange={(file) => setFiles((f) => ({ ...f, cv: file }))}
            accept=".pdf,.doc,.docx,image/*"
            hint="PDF, DOC, DOCX hoặc ảnh — kéo thả hoặc bấm để chọn"
          />

          <FileDropZone
            label="Bằng cấp (nhiều file)"
            files={files.degrees}
            onChange={(list) => setFiles((f) => ({ ...f, degrees: list }))}
            accept="image/*,.pdf"
            hint="PDF hoặc ảnh — có thể chọn nhiều file"
            multiple
          />

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button type="submit" loading={submitting} className="min-w-[140px]">
              Nộp đơn
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
