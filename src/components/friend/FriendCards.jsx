import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { formatRelativeTime } from "../../utils/helpers";

export function FriendListItem({ friend, actions, subtitle }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
      <Link
        to={`/profile/${friend.userId}`}
        className="flex min-w-0 items-center gap-3"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
          {(friend.fullName || "U")[0]}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">
            {friend.fullName}
          </p>
          {subtitle && <p className="text-xs text-primary">{subtitle}</p>}
          {friend.since && !subtitle && (
            <p className="text-xs text-muted">
              Từ {formatRelativeTime(friend.since)}
            </p>
          )}
        </div>
      </Link>
      {actions}
    </div>
  );
}

const RECOMMEND_BTN = {
  none: {
    label: "Kết bạn",
    className: "bg-primary text-white hover:bg-primary-dark",
  },
  sent: {
    label: "Đã mời",
    className: "bg-slate-100 text-slate-500 cursor-default",
  },
  friend: {
    label: "Bạn bè",
    className: "bg-emerald-100 text-emerald-700 cursor-default",
  },
  received: {
    label: "Chấp nhận lời mời",
    className: "bg-primary text-white hover:bg-primary-dark",
  },
};

export function RecommendCard({ user, onAdd, onAccept, status = "none" }) {
  const btn = RECOMMEND_BTN[status] || RECOMMEND_BTN.none;
  const handleClick = status === "received" ? onAccept : onAdd;
  const disabled = status === "sent" || status === "friend";

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
          {(user.email || "U")[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{user.email}</p>
          <p className="mt-0.5 text-xs text-muted">{user.reason}</p>
          {user.mutualFriendsCount > 0 && (
            <p className="mt-1 flex items-center gap-1 text-xs text-primary">
              <Users size={12} /> {user.mutualFriendsCount} bạn chung
            </p>
          )}
          {user.isTeacher && (
            <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              Giáo viên
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !handleClick}
        className={`mt-3 w-full rounded-lg py-2 text-sm font-medium ${btn.className} disabled:opacity-80`}
      >
        {btn.label}
      </button>
    </div>
  );
}
