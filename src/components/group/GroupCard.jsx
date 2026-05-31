import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_SHADOW =
  "0 4px 24px rgba(99,102,241,0.07), 0 1px 3px rgba(0,0,0,0.04)";
const CARD_SHADOW_HOVER =
  "0 12px 40px rgba(99,102,241,0.14), 0 4px 12px rgba(0,0,0,0.06)";

export default function GroupCard({ group, actions }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: CARD_SHADOW }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = CARD_SHADOW;
      }}
    >
      <div
        className="h-28 bg-cover bg-center"
        style={
          group.coverImageUrl
            ? { backgroundImage: `url(${group.coverImageUrl})` }
            : {
                background:
                  "linear-gradient(135deg,#667eea22 0%,#c84b9e22 50%,#38bdf822 100%)",
              }
        }
      />
      <div className="p-4">
        <Link
          to={`/groups/${group.id}`}
          className="font-semibold text-slate-900 hover:text-primary"
        >
          {group.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {group.description || "Không có mô tả"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users size={14} /> {group.memberCount} thành viên
          </span>
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-600">
            {group.privacy}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">Owner: {group.ownerName}</p>
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
