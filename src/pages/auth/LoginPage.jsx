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
  } = useForm({
    resolver: zodResolver(schema),
  });

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
        navigate("/register/verify", {
          state: {
            email: values.email,
          },
        });

        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại DATN Social"
    >
      {/* Error */}

      {error && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* Form */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Remember + Forgot */}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="
                h-4
                w-4
                rounded
                border-slate-300
                text-indigo-600
              "
            />
            Ghi nhớ đăng nhập
          </label>

          <Link
            to="/forgot-password"
            className="
              text-sm
              font-medium
              text-indigo-600
              transition
              hover:text-indigo-700
            "
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login */}

        <Button type="submit" className="h-12 w-full" loading={loading}>
          Đăng nhập
        </Button>

        {/* Divider */}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-slate-400">hoặc</span>
          </div>
        </div>

        {/* Google */}

        <button
          type="button"
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-3

            rounded-2xl

            border
            border-slate-200

            bg-white

            text-sm
            font-medium

            transition

            hover:bg-slate-50
          "
        >
          <span>🌐</span>
          Đăng nhập với Google
        </button>

        {/* Register */}

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-500">Chưa có tài khoản?</p>

          <Link
            to="/register"
            className="
              mt-1
              inline-block

              font-semibold

              text-indigo-600

              hover:text-indigo-700
            "
          >
            Tạo tài khoản mới
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
