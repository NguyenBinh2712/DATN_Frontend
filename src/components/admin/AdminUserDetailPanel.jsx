import { User, X } from "lucide-react";

const GENDER_LABEL = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export default function AdminUserDetailPanel({ user, loading, onClose }) {
  if (!user && !loading) {
    return (
      <aside className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
        <User size={40} className="mb-3 text-slate-600" />
        <p className="text-sm text-slate-500">
          Chọn người dùng và bấm &quot;Xem chi tiết&quot;
        </p>
      </aside>
    );
  }

  if (loading) {
    return (
      <aside className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex animate-pulse flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-slate-800" />
          <div className="h-4 w-32 rounded bg-slate-800" />
          <div className="h-3 w-48 rounded bg-slate-800" />
        </div>
      </aside>
    );
  }

  const profile = user.profile;

  return (
    <aside className="sticky top-6 rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          Chi tiết người dùng
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center text-center">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-700"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
              {(profile?.fullName || user.email)?.[0]?.toUpperCase()}
            </div>
          )}
          <h3 className="mt-3 text-lg font-semibold text-white">
            {profile?.fullName || "Chưa cập nhật tên"}
          </h3>
          <p className="text-sm text-slate-400">{user.email}</p>
          <span
            className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              user.status
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {user.status ? "Đang online" : "Offline"}
          </span>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-2 border-b border-slate-800 pb-2">
            <dt className="text-slate-500">ID</dt>
            <dd className="font-medium text-slate-200">#{user.id}</dd>
          </div>
          <div className="flex justify-between gap-2 border-b border-slate-800 pb-2">
            <dt className="text-slate-500">Ngày tạo</dt>
            <dd className="text-slate-200">{user.createAt || "—"}</dd>
          </div>
          {profile?.gender && (
            <div className="flex justify-between gap-2 border-b border-slate-800 pb-2">
              <dt className="text-slate-500">Giới tính</dt>
              <dd className="text-slate-200">
                {GENDER_LABEL[profile.gender] || profile.gender}
              </dd>
            </div>
          )}
          {profile?.birth && (
            <div className="flex justify-between gap-2 border-b border-slate-800 pb-2">
              <dt className="text-slate-500">Ngày sinh</dt>
              <dd className="text-slate-200">{profile.birth}</dd>
            </div>
          )}
        </dl>

        {profile?.bio && (
          <div className="mt-4 rounded-lg bg-slate-950 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Bio
            </p>
            <p className="mt-1 text-sm text-slate-300">{profile.bio}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
