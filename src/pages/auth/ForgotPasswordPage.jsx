import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../../components/auth/AuthLayout";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { userApi } from "../../api/user.api";
import { getErrorMessage } from "../../utils/helpers";

const requestSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

const resetSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP phải có 6 số"),
    newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const requestForm = useForm({ resolver: zodResolver(requestSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetSchema) });

  const requestOtp = async ({ email: em }) => {
    setError("");
    setLoading(true);
    try {
      await userApi.requestForgotPasswordOtp(em);
      setEmail(em);
      resetForm.setValue("email", em);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (values) => {
    setError("");
    setLoading(true);
    try {
      await userApi.forgotPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      navigate("/login", {
        state: { message: "Đặt lại mật khẩu thành công!" },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle={
        step === 1 ? "Nhập email để nhận mã OTP" : "Nhập OTP và mật khẩu mới"
      }
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form
          onSubmit={requestForm.handleSubmit(requestOtp)}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            error={requestForm.formState.errors.email?.message}
            {...requestForm.register("email")}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Gửi OTP
          </Button>
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(resetPassword)}
          className="space-y-4"
        >
          <Input
            label="Email"
            value={email}
            disabled
            {...resetForm.register("email")}
          />
          <Input
            label="Mã OTP"
            maxLength={6}
            error={resetForm.formState.errors.otp?.message}
            {...resetForm.register("otp")}
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            error={resetForm.formState.errors.newPassword?.message}
            {...resetForm.register("newPassword")}
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            error={resetForm.formState.errors.confirmPassword?.message}
            {...resetForm.register("confirmPassword")}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Đặt lại mật khẩu
          </Button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-muted hover:text-primary"
          >
            Quay lại bước 1
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        <Link to="/login" className="text-primary hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
