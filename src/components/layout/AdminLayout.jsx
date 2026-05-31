import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  GraduationCap,
  LogOut,
  ArrowLeft,
  ClipboardList,
  Shield,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";
import NotificationBell from "../notification/NotificationBell";

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/posts", icon: FileText, label: "Bài viết" },
  { to: "/admin/reports", icon: Flag, label: "Báo cáo" },
  { to: "/admin/teachers", icon: GraduationCap, label: "Đơn giáo viên" },
  { to: "/admin/quizzes", icon: ClipboardList, label: "Duyệt Quiz" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg,#f0f4ff 0%,#faf5ff 60%,#fdf4ff 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className="
            hidden
            lg:flex
            w-72
            flex-col
            p-5
            backdrop-blur-xl
          "
          style={{
            background: "rgba(255,255,255,0.82)",
            borderRight: "1px solid rgba(99,102,241,0.10)",
            boxShadow:
              "4px 0 24px rgba(99,102,241,0.07), inset -1px 0 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  text-white
                "
                style={{
                  background: "linear-gradient(135deg,#667eea,#c84b9e)",
                }}
              >
                <Shield size={22} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Dashboard
                </p>

                <h1
                  className="text-xl font-black"
                  style={{
                    background: "linear-gradient(135deg,#667eea,#c84b9e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  DATN Admin
                </h1>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex-1 space-y-2">
            {adminLinks.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
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
                        isActive
                          ? ""
                          : "group-hover:text-indigo-600 group-hover:scale-110"
                      }`}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="mt-6 space-y-2 border-t border-slate-200 pt-5">
            <Button
              variant="secondary"
              className="w-full !justify-start"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
              Về trang chủ
            </Button>

            <Button
              variant="danger"
              className="w-full !justify-start"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col">
          {/* HEADER */}
          <header
            className="
              sticky
              top-0
              z-40
              flex
              items-center
              justify-between
              px-8
              py-4
              backdrop-blur-xl
            "
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(99,102,241,0.10)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.06)",
            }}
          >
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Admin Dashboard
              </h2>

              <p className="text-sm text-slate-500">
                Quản trị hệ thống DATN Social
              </p>
            </div>

            <NotificationBell />
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-8">
            <div
              className="
                min-h-[calc(100vh-120px)]
                rounded-[32px]
                p-6
                backdrop-blur-xl
              "
              style={{
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow:
                  "0 8px 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
