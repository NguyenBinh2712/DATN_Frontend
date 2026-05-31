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
        `
        group
        flex
        items-center
        gap-3
        rounded-2xl
        px-4
        py-3
        text-sm
        font-semibold
        transition-all
        duration-300
        ${
          isActive
            ? "text-white shadow-lg scale-[1.02]"
            : "text-slate-600 hover:bg-white/80 hover:translate-x-1 hover:shadow-md"
        }
      `
      }
      style={({ isActive }) =>
        isActive
          ? {
              background: "linear-gradient(135deg,#667eea 0%,#c84b9e 100%)",
            }
          : {}
      }
    >
      <Icon
        size={18}
        className="transition-transform duration-300 group-hover:scale-110"
      />
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
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg,#f8faff 0%,#eef2ff 45%,#fdf4ff 100%)",
      }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b border-white/30 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,.75)",
          boxShadow: "0 8px 32px rgba(102,126,234,.08)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-white"
              style={{
                background: "linear-gradient(135deg,#667eea 0%,#c84b9e 100%)",
                boxShadow: "0 10px 25px rgba(102,126,234,.35)",
              }}
            >
              🎓
            </div>

            <div>
              <h1
                className="text-xl font-black"
                style={{
                  background: "linear-gradient(135deg,#667eea 0%,#c84b9e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                DATN Social
              </h1>

              <p className="text-xs text-slate-400">Learning Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {badge}

            <NotificationBell />

            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-xl bg-white/80 px-3 py-2 text-sm font-semibold text-purple-600 shadow-sm"
              >
                Admin
              </Link>
            )}

            <Link to="/profile/me" className="flex items-center gap-3">
              {user?.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-300 shadow-lg"
                />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                  style={{
                    background:
                      "linear-gradient(135deg,#667eea 0%,#c84b9e 100%)",
                  }}
                >
                  <User size={18} />
                </div>
              )}

              <div className="hidden sm:block">
                <p className="font-semibold text-slate-700">
                  {user?.profile?.fullName || user?.email}
                </p>

                <p className="text-xs text-slate-400">Thành viên</p>
              </div>
            </Link>

            <Button
              variant="danger"
              onClick={handleLogout}
              className="!h-11 !w-11 !rounded-xl !px-0"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <nav
            className="sticky top-24 space-y-2 rounded-[30px] p-4 backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,.7)",
              border: "1px solid rgba(255,255,255,.9)",
              boxShadow: "0 12px 40px rgba(102,126,234,.12)",
            }}
          >
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
              Nhóm học tập
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
                <div className="my-3 border-t border-slate-200" />

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

            <div className="my-3 border-t border-slate-200" />

            <NavItem to="/settings/blocked" icon={Ban}>
              Đã chặn
            </NavItem>

            {isAdmin && (
              <>
                <div className="my-3 border-t border-slate-200" />

                <NavItem to="/admin" icon={Shield}>
                  Quản trị
                </NavItem>
              </>
            )}
          </nav>
        </aside>

        {/* CONTENT */}
        <main
          className="min-w-0 rounded-[32px] p-6 backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,.55)",
            border: "1px solid rgba(255,255,255,.8)",
            boxShadow: "0 12px 40px rgba(102,126,234,.08)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
