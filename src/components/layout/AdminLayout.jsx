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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 p-4 lg:flex">
          <div className="mb-8 px-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Admin Panel
            </p>
            <h1 className="text-xl font-bold text-white">DATN Admin</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {adminLinks.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-800 pt-4">
            <Button
              variant="ghost"
              className="w-full !justify-start text-slate-400 hover:!text-white"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} /> Về trang chủ
            </Button>
            <Button
              variant="ghost"
              className="w-full !justify-start text-slate-400 hover:!text-white"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Đăng xuất
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
            <h1 className="font-semibold lg:hidden">Admin Dashboard</h1>
            <div className="ml-auto">
              <NotificationBell dark />
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
