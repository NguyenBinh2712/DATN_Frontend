import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  User,
  Users,
  UsersRound,
  Search,
  Ban,
  GraduationCap,
  Shield,
  PlusCircle,
  BookOpen,
  MessageCircle,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";
import NotificationBell from "../notification/NotificationBell";

function NavItem({ to, icon: Icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}

export default function AppShell({ badge }) {
  const { user, logout, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold text-primary">
            DATN Social
          </Link>
          <div className="flex items-center gap-3">
            {badge}
            <NotificationBell />
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-slate-600 hover:text-primary"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile/me"
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              {user?.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User size={16} />
                </div>
              )}
              <span className="hidden sm:inline">
                {user?.profile?.fullName || user?.email}
              </span>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="!px-2">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1 rounded-xl border border-border bg-white p-3">
            <NavItem to="/" icon={Home} end>
              Trang chủ
            </NavItem>
            <NavItem to="/profile/me" icon={User}>
              Hồ sơ
            </NavItem>
            <NavItem to="/friends" icon={Users}>
              Bạn bè
            </NavItem>
            <NavItem to="/chat" icon={MessageCircle}>
              Tin nhắn
            </NavItem>
            <NavItem to="/groups" icon={UsersRound}>
              Nhóm
            </NavItem>
            {isStudent && (
              <NavItem to="/quizzes" icon={ClipboardList}>
                Quiz
              </NavItem>
            )}
            <NavItem to="/search" icon={Search}>
              Tìm kiếm
            </NavItem>

            {isTeacher && (
              <>
                <div className="my-2 border-t border-border" />
                <NavItem to="/groups/create" icon={PlusCircle}>
                  Tạo nhóm
                </NavItem>
                <NavItem to="/teacher/dashboard" icon={BookOpen}>
                  Teacher
                </NavItem>
                <NavItem to="/teacher/quizzes" icon={ClipboardList}>
                  Quiz của tôi
                </NavItem>
              </>
            )}

            {!isTeacher && (
              <NavItem to="/teacher/apply" icon={GraduationCap}>
                Đăng ký giáo viên
              </NavItem>
            )}

            <div className="my-2 border-t border-border" />
            <NavItem to="/settings/blocked" icon={Ban}>
              Đã chặn
            </NavItem>

            {isAdmin && (
              <>
                <div className="my-2 border-t border-border" />
                <NavItem to="/admin" icon={Shield}>
                  Quản trị
                </NavItem>
              </>
            )}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
