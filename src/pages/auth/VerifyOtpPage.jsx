import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '../../components/auth/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { userApi } from '../../api/user.api'
import { getErrorMessage } from '../../utils/helpers'

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP phải có 6 số'),
})

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: location.state?.email || '' },
  })

  const email = watch('email')

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (location.state?.email) setValue('email', location.state.email)
  }, [location.state, setValue])

  const onSubmit = async (values) => {
    setError('')
    setLoading(true)
    try {
      await userApi.verifyOtp(values)
      navigate('/login', { state: { message: 'Xác thực thành công! Hãy đăng nhập.' } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || countdown > 0) return
    setResending(true)
    setError('')
    try {
      await userApi.resendOtp({ email, type: 'REGISTER' })
      setCountdown(60)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      title="Xác thực OTP"
      subtitle="Nhập mã 6 số đã gửi đến email của bạn (hiệu lực 60 giây)"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Mã OTP"
          placeholder="123456"
          maxLength={6}
          error={errors.otp?.message}
          {...register('otp')}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Xác thực
        </Button>
        <div className="text-center text-sm text-muted">
          {countdown > 0 ? (
            <span>Gửi lại OTP sau {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-primary hover:underline disabled:opacity-50"
            >
              {resending ? 'Đang gửi...' : 'Gửi lại OTP'}
            </button>
          )}
        </div>
        <p className="text-center text-sm text-muted">
          <Link to="/login" className="text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
