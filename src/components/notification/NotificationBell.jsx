import { useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "../../context/NotificationProvider";
import { formatRelativeTime } from "../../utils/helpers";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    open,
    setOpen,
    loading,
    loadNotifications,
    markAllRead,
    handleClick,
  } = useNotifications();
  const ref = useRef(null);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open, loadNotifications]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [setOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
        aria-label="Thông báo"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-red-500/40">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fade-in scale-in absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:w-96"
          style={{
            boxShadow:
              "0 20px 60px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-slate-900">Thông báo</h3>
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck size={14} /> Đánh dấu đã đọc
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="p-4 text-center text-sm text-muted">Đang tải...</p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="p-6 text-center text-sm text-muted">
                Không có thông báo
              </p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                className={`block w-full border-b border-slate-50 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50 ${
                  !n.isRead ? "bg-primary/5" : ""
                }`}
              >
                <p className="text-sm text-slate-800">{n.content}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatRelativeTime(n.createAt)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
