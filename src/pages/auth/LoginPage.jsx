import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../../components/auth/AuthLayout";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/helpers";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      const result = await login(values);
      const from = location.state?.from?.pathname;
      if (result.roles.includes("ADMIN")) {
        navigate(from?.startsWith("/admin") ? from : "/admin", {
          replace: true,
        });
      } else {
        navigate(from && !from.startsWith("/admin") ? from : "/", {
          replace: true,
        });
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.includes("not Active") || msg.includes("Account not Active")) {
        setError("Tài khoản chưa được kích hoạt. Vui lòng xác thực OTP.");
        navigate("/register/verify", { state: { email: values.email } });
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn quay trở lại">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Đăng nhập
        </Button>
        <p className="text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
