import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupCard({ group, actions }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div
        className="h-24 bg-gradient-to-r from-primary/20 to-blue-100 bg-cover bg-center"
        style={
          group.coverImageUrl
            ? { backgroundImage: `url(${group.coverImageUrl})` }
            : undefined
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
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {group.privacy}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">Owner: {group.ownerName}</p>
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
