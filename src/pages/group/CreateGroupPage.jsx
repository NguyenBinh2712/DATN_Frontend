import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { groupApi } from '../../api/group.api'
import { Button } from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/Input'
import { getErrorMessage } from '../../utils/helpers'

const schema = z.object({
  name: z.string().min(3, 'Tên nhóm tối thiểu 3 ký tự'),
  description: z.string().optional(),
  coverImageUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  privacy: z.enum(['PUBLIC', 'PRIVATE', 'CLOSED']),
})

export default function CreateGroupPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { privacy: 'PRIVATE' },
  })

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        coverImageUrl: values.coverImageUrl || undefined,
      }
      const { data } = await groupApi.create(payload)
      navigate(`/groups/${data.result.id}`)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Tạo nhóm mới</h1>
      <p className="text-sm text-muted">Chỉ giáo viên được tạo nhóm học tập</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-border bg-white p-6">
        <Input label="Tên nhóm *" error={errors.name?.message} {...register('name')} />
        <Textarea label="Mô tả" error={errors.description?.message} {...register('description')} />
        <Input
          label="Ảnh bìa (URL)"
          placeholder="https://..."
          error={errors.coverImageUrl?.message}
          {...register('coverImageUrl')}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quyền riêng tư</label>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            {...register('privacy')}
          >
            <option value="PUBLIC">Công khai</option>
            <option value="PRIVATE">Riêng tư</option>
            <option value="CLOSED">Đóng</option>
          </select>
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Tạo nhóm
        </Button>
      </form>
    </div>
  )
}
