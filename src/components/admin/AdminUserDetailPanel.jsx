import { User, X, Mail, Calendar, BadgeInfo, CircleDot } from "lucide-react";

const GENDER_LABEL = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export default function AdminUserDetailPanel({ user, loading, onClose }) {
  if (!user && !loading) {
    return (
      <aside
        className="
flex
h-full
min-h-[500px]
flex-col
items-center
justify-center


      rounded-[32px]

      border
      border-dashed
      border-slate-300

      bg-white/70
      backdrop-blur-xl

      p-8
      text-center
    "
      >
        <User size={52} className="mb-4 text-slate-400" />

        <h3 className="text-lg font-semibold text-slate-800">
          Chưa chọn người dùng
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Chọn người dùng từ danh sách bên trái để xem thông tin chi tiết.
        </p>
      </aside>
    );
  }

  if (loading) {
    return (
      <aside
        className="
rounded-[32px]
border
border-slate-200


      bg-white/80
      backdrop-blur-xl

      p-6
    "
      >
        <div className="animate-pulse">
          <div className="mx-auto h-24 w-24 rounded-full bg-slate-200" />

          <div className="mt-5 h-5 rounded bg-slate-200" />

          <div className="mt-3 h-4 rounded bg-slate-200" />

          <div className="mt-8 space-y-3">
            <div className="h-12 rounded-xl bg-slate-200" />
            <div className="h-12 rounded-xl bg-slate-200" />
            <div className="h-12 rounded-xl bg-slate-200" />
          </div>
        </div>
      </aside>
    );
  }

  const profile = user.profile;

  return (
    <aside
      className="
sticky
top-6


    overflow-hidden

    rounded-[32px]

    border
    border-slate-200

    bg-white/80
    backdrop-blur-xl
  "
      style={{
        boxShadow: "0 12px 40px rgba(102,126,234,.08)",
      }}
    >
      <div
        className="
      flex
      items-center
      justify-between

      border-b
      border-slate-200

      bg-white/80

      px-5
      py-4
    "
      >
        <h2 className="font-semibold text-slate-800">Thông tin người dùng</h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="
          rounded-xl
          p-2

          text-slate-500

          transition

          hover:bg-slate-100
          hover:text-slate-800

          lg:hidden
        "
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="text-center">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="
            mx-auto
            h-24
            w-24
            rounded-full
            object-cover

            ring-4
            ring-purple-300
          "
            />
          ) : (
            <div
              className="
            mx-auto

            flex
            h-24
            w-24
            items-center
            justify-center

            rounded-full

            text-3xl
            font-bold
            text-white
          "
              style={{
                background: "linear-gradient(135deg,#667eea,#c84b9e)",
              }}
            >
              {(profile?.fullName || user.email)?.[0]?.toUpperCase()}
            </div>
          )}

          <h3 className="mt-4 text-xl font-bold text-slate-800">
            {profile?.fullName || "Chưa cập nhật tên"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{user.email}</p>

          <div className="mt-4">
            <span
              className={`
            inline-flex
            items-center
            gap-2

            rounded-full

            px-3
            py-1

            text-xs
            font-semibold

            ${
              user.status
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }
          `}
            >
              <CircleDot size={12} />
              {user.status ? "Đang hoạt động" : "Ngoại tuyến"}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <InfoRow
            icon={<BadgeInfo size={16} />}
            label="ID"
            value={`#${user.id}`}
          />

          <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />

          <InfoRow
            icon={<Calendar size={16} />}
            label="Ngày tạo"
            value={user.createAt || "—"}
          />

          {profile?.gender && (
            <InfoRow
              icon={<User size={16} />}
              label="Giới tính"
              value={GENDER_LABEL[profile.gender] || profile.gender}
            />
          )}

          {profile?.birth && (
            <InfoRow
              icon={<Calendar size={16} />}
              label="Ngày sinh"
              value={profile.birth}
            />
          )}
        </div>

        {profile?.bio && (
          <div
            className="
          mt-6

          rounded-2xl

          border
          border-slate-200

          bg-white

          p-4
        "
          >
            <p
              className="
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
            >
              Giới thiệu
            </p>

            <p
              className="
            mt-3
            text-sm
            leading-6
            text-slate-700
          "
            >
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div
      className="
flex
items-center
justify-between


    rounded-2xl

    border
    border-slate-200

    bg-white

    px-4
    py-3

    shadow-sm
  "
    >
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
