import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            DATN Social
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
