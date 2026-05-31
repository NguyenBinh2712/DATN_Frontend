import { Link } from 'react-router-dom'
import { Users, FileText, Flag, GraduationCap } from 'lucide-react'

const cards = [
  { to: '/admin/users', icon: Users, label: 'Quản lý người dùng', color: 'bg-blue-500' },
  { to: '/admin/posts', icon: FileText, label: 'Quản lý bài viết', color: 'bg-violet-500' },
  { to: '/admin/reports', icon: Flag, label: 'Xử lý báo cáo', color: 'bg-amber-500' },
  { to: '/admin/teachers', icon: GraduationCap, label: 'Duyệt giáo viên', color: 'bg-emerald-500' },
]

const iconShadow = (color) =>
  color.includes('blue')
    ? 'rgba(59,130,246,0.3)'
    : color.includes('violet')
      ? 'rgba(124,58,237,0.3)'
      : color.includes('amber')
        ? 'rgba(245,158,11,0.3)'
        : 'rgba(16,185,129,0.3)'

const CARD_SHADOW = '0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)'
const CARD_SHADOW_HOVER = '0 12px 40px rgba(99,102,241,0.14), 0 4px 12px rgba(0,0,0,0.06)'

export default function AdminDashboardPage() {
  return (
    <div className="fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan</h1>
        <p className="mt-1 text-slate-500">Quản trị hệ thống DATN Social</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, icon: Icon, label, color }, i) => (
          <Link
            key={to}
            to={to}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 shine"
            style={{
              boxShadow: CARD_SHADOW,
              animationDelay: `${i * 60}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = CARD_SHADOW
            }}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(135deg,rgba(99,102,241,0.03) 0%,transparent 100%)',
              }}
            />

            <div
              className={`relative mb-4 inline-flex rounded-2xl ${color} p-3 shadow-lg`}
              style={{ boxShadow: `0 8px 20px ${iconShadow(color)}` }}
            >
              <Icon size={22} className="text-white" />
            </div>

            <p className="relative font-semibold text-slate-800 transition-colors duration-200 group-hover:text-indigo-700">
              {label}
            </p>
            <p className="relative mt-1 text-xs text-slate-400 transition-colors duration-200 group-hover:text-slate-500">
              Quản lý →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
