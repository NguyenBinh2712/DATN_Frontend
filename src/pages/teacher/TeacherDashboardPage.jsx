import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ClipboardList,
  PlusCircle,
  UsersRound,
  Users,
  FileCheck,
} from 'lucide-react'
import { groupApi } from '../../api/group.api'
import { quizApi } from '../../api/quiz.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getErrorMessage, unwrapList } from '../../utils/helpers'

const cards = [
  {
    to: '/teacher/quizzes',
    icon: ClipboardList,
    label: 'Quản lý Quiz',
    desc: 'Tạo, kích hoạt, xem bài nộp',
    color: 'bg-violet-500',
  },
  {
    to: '/teacher/quizzes/create',
    icon: PlusCircle,
    label: 'Tạo Quiz mới',
    desc: 'Soạn câu hỏi và giao bài',
    color: 'bg-emerald-500',
  },
  {
    to: '/groups/my',
    icon: UsersRound,
    label: 'Nhóm của tôi',
    desc: 'Quản lý nhóm học tập',
    color: 'bg-blue-500',
  },
  {
    to: '/groups/create',
    icon: Users,
    label: 'Tạo nhóm mới',
    desc: 'Tạo nhóm và mời thành viên',
    color: 'bg-amber-500',
  },
]

export default function TeacherDashboardPage() {
  const [stats, setStats] = useState({ groups: 0, quizzes: 0, activeQuizzes: 0, pendingGroup: 0 })
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([groupApi.getMyGroups(), quizApi.getMyQuizzes()])
      .then(([groupsRes, quizzesRes]) => {
        const groups = unwrapList(groupsRes.data)
        const quizzes = unwrapList(quizzesRes.data)
        setStats({
          groups: groups.length,
          quizzes: quizzes.length,
          activeQuizzes: quizzes.filter((q) => q.status === 'ACTIVE').length,
          pendingGroup: quizzes.filter((q) => q.status === 'GROUP').length,
        })
        setRecentQuizzes(quizzes.slice(0, 5))
      })
      .catch((err) => alert(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3">
          <BookOpen className="text-emerald-700" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
          <p className="text-sm text-muted">Quản lý nhóm học tập và bài kiểm tra</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nhóm của tôi" value={stats.groups} />
        <StatCard label="Tổng Quiz" value={stats.quizzes} />
        <StatCard label="Quiz đang mở" value={stats.activeQuizzes} />
        <StatCard label="Quiz chờ kích hoạt" value={stats.pendingGroup} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ to, icon: Icon, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-sm"
          >
            <div className={`mb-3 inline-flex rounded-lg ${color} p-2`}>
              <Icon size={20} className="text-white" />
            </div>
            <p className="font-semibold">{label}</p>
            <p className="mt-1 text-sm text-muted">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Quiz gần đây</h2>
          <Link to="/teacher/quizzes" className="text-sm text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {recentQuizzes.map((q) => (
            <div
              key={q.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="font-medium">{q.title}</p>
                <p className="text-xs text-muted">
                  {q.status} · {q.time} phút
                </p>
              </div>
              <div className="flex gap-2">
                {q.status === 'GROUP' && (
                  <Link to="/teacher/quizzes">
                    <span className="text-xs text-amber-600">Cần kích hoạt</span>
                  </Link>
                )}
                <Link
                  to={`/teacher/quizzes/${q.id}/submissions`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <FileCheck size={14} /> Bài nộp
                </Link>
              </div>
            </div>
          ))}
          {recentQuizzes.length === 0 && (
            <p className="text-center text-sm text-muted">Chưa có quiz — tạo quiz đầu tiên</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
