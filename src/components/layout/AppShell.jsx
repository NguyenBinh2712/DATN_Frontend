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
        `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
              background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
              boxShadow:
                "0 4px 16px rgba(102,126,234,0.4), 0 2px 6px rgba(102,126,234,0.2)",
            }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`transition-all duration-200 ${
              isActive ? "" : "group-hover:text-indigo-600 group-hover:scale-110"
            }`}
          />
          {children}
        </>
      )}
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
        background: "linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0fdf9 100%)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99,102,241,0.10)",
          boxShadow:
            "0 4px 24px rgba(99,102,241,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="shine flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl text-white"
              style={{
                background: "linear-gradient(135deg,#667eea 0%,#c84b9e 100%)",
                boxShadow:
                  "0 8px 24px rgba(102,126,234,0.45), 0 2px 8px rgba(102,126,234,0.2)",
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
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-400 ring-offset-2 shadow-lg"
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
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow:
                "0 8px 32px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
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
                <div
                  className="my-3 mx-2 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
                  }}
                />

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

            <div
              className="my-3 mx-2 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
              }}
            />

            <NavItem to="/settings/blocked" icon={Ban}>
              Đã chặn
            </NavItem>

            {isAdmin && (
              <>
                <div
                  className="my-3 mx-2 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
                  }}
                />

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
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow:
              "0 8px 40px rgba(99,102,241,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
