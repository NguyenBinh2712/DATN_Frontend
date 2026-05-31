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

const schema = z
  .object({
    email: z.string().email("Email không hợp lệ"),

    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch("password");

  const onSubmit = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      await userApi.register({
        email,
        password,
      });

      navigate("/register/verify", {
        state: { email },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    password?.length >= 10 ? "Mạnh" : password?.length >= 6 ? "Trung bình" : "";

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình học tập cùng cộng đồng"
    >
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            error={errors.password?.message}
            {...register("password")}
          />

          {passwordStrength && (
            <p
              className={`
                mt-2
                text-xs
                font-medium

                ${
                  passwordStrength === "Mạnh"
                    ? "text-green-600"
                    : "text-amber-600"
                }
              `}
            >
              Độ mạnh mật khẩu: {passwordStrength}
            </p>
          )}
        </div>

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <label
          className="
            flex
            items-start
            gap-3

            text-sm
            text-slate-600
          "
        >
          <input
            type="checkbox"
            required
            className="
              mt-1
              h-4
              w-4
            "
          />

          <span>
            Tôi đồng ý với{" "}
            <button
              type="button"
              className="
                font-medium
                text-indigo-600
              "
            >
              Điều khoản sử dụng
            </button>{" "}
            và{" "}
            <button
              type="button"
              className="
                font-medium
                text-indigo-600
              "
            >
              Chính sách bảo mật
            </button>
          </span>
        </label>

        <Button type="submit" className="h-12 w-full" loading={loading}>
          Tạo tài khoản
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span
              className="
                bg-white
                px-3
                text-sm
                text-slate-400
              "
            >
              hoặc
            </span>
          </div>
        </div>

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
          🌐 Đăng ký với Google
        </button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-500">Đã có tài khoản?</p>

          <Link
            to="/login"
            className="
              mt-1
              inline-block

              font-semibold

              text-indigo-600

              hover:text-indigo-700
            "
          >
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
