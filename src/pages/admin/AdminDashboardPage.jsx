import { Link } from 'react-router-dom'
import { Users, FileText, Flag, GraduationCap } from 'lucide-react'

const cards = [
  { to: '/admin/users', icon: Users, label: 'Quản lý người dùng', color: 'bg-blue-500' },
  { to: '/admin/posts', icon: FileText, label: 'Quản lý bài viết', color: 'bg-violet-500' },
  { to: '/admin/reports', icon: Flag, label: 'Xử lý báo cáo', color: 'bg-amber-500' },
  { to: '/admin/teachers', icon: GraduationCap, label: 'Duyệt giáo viên', color: 'bg-emerald-500' },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
      <p className="mt-1 text-slate-400">Quản trị hệ thống DATN Social</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800"
          >
            <div className={`mb-3 inline-flex rounded-lg ${color} p-2`}>
              <Icon size={20} className="text-white" />
            </div>
            <p className="font-medium text-white">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
